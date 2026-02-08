import cssText from "data-text:../style.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useEffect, useState } from "react"
import {
  FolderOpen,
  Plus,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Layers,
  AlertCircle
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { sleep, cn } from "@/lib/utils"
import { useUser } from "@/hooks/useQuery/useUser"

import GroupItem from "./GroupItem"
import { useGroups } from "@/hooks/useQuery/useGroups"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/hooks/utils/queryClient"

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
    <Separator className="mb-4 dark:bg-white/10" />
    <div className="px-3 py-2 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-5 w-5 rounded dark:bg-white/10" />
        <Skeleton className="h-5 w-24 dark:bg-white/10" />
      </div>
      <div className="space-y-2 pl-4">
        <Skeleton className="h-9 w-full dark:bg-white/10" />
        <Skeleton className="h-9 w-full dark:bg-white/10" />
        <Skeleton className="h-9 w-[85%] dark:bg-white/10" />
      </div>
    </div>
  </div>
)

const EmptyState = ({ onCreate }: { onCreate: () => void }) => (
  <div className="flex flex-col items-center justify-center px-4 py-6 text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
    <div className="rounded-full bg-muted dark:bg-white/10 p-3 mb-3">
      <FolderOpen className="h-6 w-6 text-muted-foreground dark:text-white/70" />
    </div>
    <p className="text-sm font-medium text-foreground dark:text-white mb-1">
      {chrome.i18n.getMessage("sidebar_groups_not_found")}
    </p>
    <p className="text-xs text-muted-foreground dark:text-white/60 mb-3">
      Create your first group to organize your channels
    </p>
    <Button
      variant="outline"
      size="sm"
      onClick={onCreate}
      className="gap-2 text-xs dark:border-white/20 dark:text-white dark:hover:bg-white/10">
      <Plus className="h-3.5 w-3.5" />
      Create Group
    </Button>
  </div>
)

const UnauthorizedState = () => (
  <div className="flex flex-col w-full animate-in fade-in duration-300">
    <Separator className="mb-4 dark:bg-white/10" />
    <div className="px-4 py-4">
      <div className="rounded-lg border border-destructive/20 dark:border-red-400/30 bg-destructive/5 dark:bg-red-400/10 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive dark:text-red-400 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-destructive dark:text-red-400 mb-1">
              Sign in required
            </p>
            <p className="text-xs text-destructive/80 dark:text-red-400/70 mb-3">
              Please sign in to access your groups
            </p>
            <Button
              variant="destructive"
              size="sm"
              className="w-full text-xs dark:bg-red-500 dark:hover:bg-red-600 dark:text-white"
              onClick={() =>
                window.open("https://groupify.dev/dashboard/groups")
              }>
              <ExternalLink className="h-3.5 w-3.5 mr-2" />
              {chrome.i18n.getMessage("sidebar_unauthorized")}
            </Button>
          </div>
        </div>
      </div>
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

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={cn(
          "flex w-full animate-in fade-in slide-in-from-top-2 duration-300",
          isDarkMode && "dark text-white"
        )}>
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
          <div className="flex items-center justify-between px-2 py-2">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex-1 justify-between h-10 px-2 hover:bg-accent group/trigger dark:text-white">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary dark:text-white">
                    <Layers className="h-4 w-4" />
                  </div>
                  <span className="font-semibold text-sm dark:text-white">
                    {chrome.i18n.getMessage("sidebar_groups")}
                  </span>
                  {groups.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="text-xs font-normal ml-1">
                      {groups.length}
                    </Badge>
                  )}
                </div>
                <ChevronRight
                  className={`h-4 w-4 text-muted-foreground transition-transform duration-200 dark:text-white/70 ${
                    isOpen ? "rotate-90" : ""
                  }`}
                />
              </Button>
            </CollapsibleTrigger>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 ml-1 shrink-0 dark:text-white"
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
              <TooltipContent side="top">
                <p className="dark:text-white">
                  {allExpanded ? "Collapse all groups" : "Expand all groups"}
                </p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 ml-1 shrink-0 dark:text-white"
                  onClick={() =>
                    window.open("https://groupify.dev/dashboard/groups")
                  }>
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="dark:text-white">Create new group</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            <Separator className="mb-2 dark:bg-white/10" />
            <div className="overflow-y-auto max-h-[60vh] px-1 pb-2 space-y-0.5">
              {!groups?.length ? (
                <EmptyState
                  onCreate={() =>
                    window.open("https://groupify.dev/dashboard/groups")
                  }
                />
              ) : (
                rootGroups
                  .sort((a, b) => {
                    // If displayOrder is 0, treat it as Infinity (put at end)
                    const orderA =
                      a.displayOrder === 0 ? Infinity : a.displayOrder
                    const orderB =
                      b.displayOrder === 0 ? Infinity : b.displayOrder
                    return orderA - orderB
                  })
                  .map((group) => (
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
                      {groups
                        .filter((g) => g.parentId === group.id)
                        .sort((a, b) => {
                          const orderA =
                            a.displayOrder === 0 ? Infinity : a.displayOrder
                          const orderB =
                            b.displayOrder === 0 ? Infinity : b.displayOrder
                          return orderA - orderB
                        })
                        .map((childGroup) => (
                          <div
                            key={childGroup.id}
                            style={{
                              paddingLeft: `${childGroup.nestingLevel * 12}px`
                            }}
                            className="animate-in fade-in slide-in-from-left-2 duration-200">
                            <GroupItem
                              id={childGroup.id}
                              name={childGroup.name}
                              icon={childGroup.icon}
                              channelCount={childGroup.channelCount}
                              forceExpand={allExpanded}
                              expandTrigger={expandTrigger}
                            />
                          </div>
                        ))}
                    </div>
                  ))
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
