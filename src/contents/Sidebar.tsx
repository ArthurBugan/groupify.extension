import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { useGroups } from "@/hooks/useQuery/useGroups"
import { useUser } from "@/hooks/useQuery/useUser"
import { queryClient } from "@/hooks/utils/queryClient"
import { cn, sleep } from "@/lib/utils"
import { QueryClientProvider } from "@tanstack/react-query"
import cssText from "data-text:../style.css"
import {
  AlertCircle,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  FolderOpen,
  Layers,
  Plus
} from "lucide-react"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useEffect, useState } from "react"

import GroupItem from "./GroupItem"

interface ApiGroup {
  id: string
  name: string
  channelCount: number
  category: string
  createdAt: string
  icon: string
  parentId: string | null
  nestingLevel: number
  displayOrder: number
}

interface TableGroup extends ApiGroup {
  order: number
}

const transformApiGroups = (apiGroups?: ApiGroup[]): TableGroup[] => {
  if (!apiGroups) return []

  return apiGroups?.map((group, index) => ({
    ...group,
    channelCount: group.channelCount || 0,
    category: group.category || "General",
    createdAt: new Date(group.createdAt).toLocaleDateString(),
    icon: group.icon || "lucide:folder-kanban",
    parentId: group.parentId || null,
    nestingLevel: group.nestingLevel || 0,
    order: group.displayOrder ?? index,
    displayOrder: group.displayOrder ?? index
  }))
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const config: PlasmoCSConfig = {
  matches: ["https://youtube.com/*", "https://www.youtube.com/*"],
  all_frames: true
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => {
  await sleep(2000)
  return document.querySelector("ytd-guide-entry-renderer:nth-child(2)")
}

const SidebarSkeleton = () => (
  <div className="flex flex-col w-full animate-in fade-in duration-300">
    <div className="px-2 py-2 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-5 w-5 rounded-md" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="space-y-2 pl-4">
        <Skeleton className="h-9 w-full rounded-md" />
        <Skeleton className="h-9 w-[85%] rounded-md" />
      </div>
    </div>
  </div>
)

const EmptyState = ({ onCreate }: { onCreate: () => void }) => (
  <div className="flex flex-col items-center justify-center px-4 py-6 text-center">
    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted/50 mb-3">
      <FolderOpen className="h-5 w-5 text-muted-foreground/60 dark:text-white/30" />
    </div>
    <p className="text-sm font-medium text-foreground/80 dark:text-white/70 mb-1">
      No groups yet
    </p>
    <p className="text-xs text-muted-foreground dark:text-white/40 mb-4">
      Create a group to organize your channels
    </p>
    <Button
      variant="outline"
      size="sm"
      onClick={onCreate}
      className="gap-2 h-8 px-4 text-sm font-medium rounded-lg dark:bg-white/5 dark:text-white/70 dark:border-white/10 dark:hover:bg-white/10 dark:hover:text-white">
      <Plus className="h-3.5 w-3.5" />
      Create Group
    </Button>
  </div>
)

const UnauthorizedState = () => (
  <div className="flex flex-col w-full animate-in fade-in duration-300 p-3">
    <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 dark:border-red-500/20 dark:bg-red-500/10">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 dark:bg-red-500/20">
          <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
        </div>
        <p className="text-sm font-medium text-red-600 dark:text-red-400">
          Sign in required
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="w-full h-8 text-sm font-medium rounded-lg gap-2 dark:bg-white/5 dark:text-red-300/80 dark:border-white/10 dark:hover:bg-white/10 dark:hover:text-red-300"
        onClick={() => window.open("https://groupify.dev/dashboard/groups")}>
        <ExternalLink className="h-3.5 w-3.5" />
        Sign in to Groupify
      </Button>
    </div>
  </div>
)

const Sidebar = () => {
  const { userData, loading: isLoadingUser } = useUser()
  const { data: groupsData, isLoading: isLoadingGroups } = useGroups({
    limit: 100
  })
  const [groups, setGroups] = useState<TableGroup[]>([])
  const [isOpen, setIsOpen] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [allExpanded, setAllExpanded] = useState(false)
  const [expandTrigger, setExpandTrigger] = useState(0)

  useEffect(() => {
    if (groupsData?.data) {
      setGroups(transformApiGroups(groupsData.data as ApiGroup[]))
    }
  }, [groupsData?.data])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = () => {
      setIsDarkMode(mediaQuery.matches)
    }
    handleChange()
    mediaQuery.addEventListener("change", handleChange)
    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  if (isLoadingGroups || isLoadingUser) {
    return <SidebarSkeleton />
  }

  if (!userData) {
    return <UnauthorizedState />
  }

  const rootGroups = groups.filter(
    (g) => g.parentId === null || !groups.some((x) => x.id === g.parentId)
  )

  const getChildren = (parentId: string): TableGroup[] => {
    return groups.filter((g) => g.parentId === parentId)
  }

  const renderGroup = (group: TableGroup): React.ReactNode => {
    const children = getChildren(group.id)

    return (
      <div
        key={group.id}
        style={{ paddingLeft: `${group.nestingLevel * 16}px` }}
        className="animate-in fade-in slide-in-from-left-2 duration-200">
        <GroupItem
          id={group.id}
          name={group.name}
          icon={group.icon}
          channelCount={group.channelCount}
          forceExpand={allExpanded}
          expandTrigger={expandTrigger}>
          {children.map((child) => renderGroup(child))}
        </GroupItem>
      </div>
    )
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={cn(
          "flex w-full animate-in fade-in slide-in-from-top-2 duration-300",
          isDarkMode && "dark text-white"
        )}>
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
          {/* Header */}
          <div className="px-2 pt-2 pb-1">
            <div className="flex items-center gap-1">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex-1 justify-between h-10 px-3 hover:bg-accent/60 dark:hover:bg-white/[0.06] group/trigger dark:text-white/90 rounded-lg transition-all duration-200">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-red-500/10 to-pink-500/10 dark:from-red-500/20 dark:to-pink-500/20">
                      <Layers className="h-4 w-4 text-red-500 dark:text-red-400/80" />
                    </div>
                    <span className="text-base font-medium dark:text-white/90">
                      {chrome.i18n.getMessage("sidebar_groups")}
                    </span>
                    {groups.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="text-[11px] h-5 px-1.5 font-medium rounded-md dark:bg-white/10 dark:text-white/60">
                        {groups.length}
                      </Badge>
                    )}
                  </div>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 text-muted-foreground/60 dark:text-white/40 transition-transform duration-200",
                      isOpen && "rotate-90"
                    )}
                  />
                </Button>
              </CollapsibleTrigger>

              <div className="flex items-center gap-0.5">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 rounded-md dark:text-white/50 dark:hover:text-white dark:hover:bg-white/[0.06]"
                      onClick={() => {
                        setAllExpanded(!allExpanded)
                        setExpandTrigger((prev) => prev + 1)
                      }}>
                      {allExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{allExpanded ? "Collapse all" : "Expand all"}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 rounded-md dark:text-white/50 dark:hover:text-white dark:hover:bg-white/[0.06]"
                      onClick={() =>
                        window.open("https://groupify.dev/dashboard/groups")
                      }>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Create group</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Content */}
          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            <Separator className="mx-2 mb-2 dark:bg-white/5" />
            <div className="overflow-y-auto max-h-[50vh] px-2 pb-2 space-y-0.5">
              {!groups?.length ? (
                <EmptyState
                  onCreate={() =>
                    window.open("https://groupify.dev/dashboard/groups")
                  }
                />
              ) : (
                rootGroups.map((group) => renderGroup(group))
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </TooltipProvider>
  )
}

function SidebarWithProvider() {
  return (
    <QueryClientProvider client={queryClient}>
      <Sidebar />
    </QueryClientProvider>
  )
}

export default SidebarWithProvider
