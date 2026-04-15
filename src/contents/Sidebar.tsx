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
  <div className="flex flex-col mt-2 w-full animate-in fade-in duration-300">
    <div className="px-2 py-1.5 space-y-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="space-y-1 pl-4">
        <Skeleton className="h-7 w-full" />
        <Skeleton className="h-7 w-[85%]" />
      </div>
    </div>
  </div>
)

const EmptyState = ({ onCreate }: { onCreate: () => void }) => (
  <div className="flex flex-col items-center justify-center px-3 py-4 text-center">
    <FolderOpen className="h-5 w-5 text-muted-foreground/50 dark:text-white/30 mb-2" />
    <p className="text-xs text-muted-foreground dark:text-white/50 mb-2">
      No groups yet
    </p>
    <Button
      variant="ghost"
      size="sm"
      onClick={onCreate}
      className="text-xs gap-1.5 h-7 dark:text-white/70 dark:hover:bg-white/10">
      <Plus className="h-3 w-3" />
      Create
    </Button>
  </div>
)

const UnauthorizedState = () => (
  <div className="flex flex-col w-full animate-in fade-in duration-300 p-3">
    <div className="rounded-md border border-destructive/20 dark:border-red-500/20 bg-destructive/5 dark:bg-red-500/10 p-3">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="h-4 w-4 text-destructive dark:text-red-400 shrink-0" />
        <p className="text-xs font-medium text-destructive dark:text-red-400">
          Sign in required
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="w-full text-xs h-7 dark:text-red-300/70 dark:hover:bg-red-500/20"
        onClick={() => window.open("https://groupify.dev/dashboard/groups")}>
        <ExternalLink className="h-3 w-3 mr-1.5" />
        Sign in
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
        style={{ paddingLeft: `${group.nestingLevel * 12}px` }}
        className="animate-in fade-in slide-in-from-left-2 duration-200">
        <GroupItem
          id={group.id}
          name={group.name}
          icon={group.icon}
          channelCount={group.channelCount}
          forceExpand={allExpanded}
          expandTrigger={expandTrigger}
        />
        {children.map((child) => renderGroup(child))}
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
          <div className="flex items-center justify-between px-2 py-1.5">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex-1 justify-between h-8 px-1.5 hover:bg-accent/50 dark:hover:bg-white/5 group/trigger dark:text-white/90">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded bg-primary/10 dark:bg-white/10">
                    <Layers className="h-3.5 w-3.5 dark:text-white/80" />
                  </div>
                  <span className="text-sm font-medium dark:text-white/90">
                    {chrome.i18n.getMessage("sidebar_groups")}
                  </span>
                  {groups.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] h-4 px-1 font-medium dark:bg-white/10 dark:text-white/70">
                      {groups.length}
                    </Badge>
                  )}
                </div>
                <ChevronRight
                  className={`h-3.5 w-3.5 text-muted-foreground/70 dark:text-white/50 transition-transform duration-200 ${
                    isOpen ? "rotate-90" : ""
                  }`}
                />
              </Button>
            </CollapsibleTrigger>

            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10"
                onClick={() => {
                  setAllExpanded(!allExpanded)
                  setExpandTrigger((prev) => prev + 1)
                }}>
                {allExpanded ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10"
                onClick={() =>
                  window.open("https://groupify.dev/dashboard/groups")
                }>
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            <div className="border-t border-border/50 dark:border-white/5 mx-2 mb-1" />
            <div className="overflow-y-auto max-h-[50vh] px-1 py-1">
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
