import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useEffect, useState, useCallback } from "react"
import { ChevronRight, Pencil, Loader2, Users } from "lucide-react"

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
import { getGroup, type Channel } from "@/hooks/useQuery/useGroups"

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => {
  return null
}

export const config: PlasmoCSConfig = {
  matches: ["https://youtube.com/*", "https://www.youtube.com/*"],
  all_frames: true
}

export interface GroupItemProps {
  id: string | number
  name: string
  icon?: string
  channelCount?: number
  forceExpand?: boolean
  expandTrigger?: number
}

const getChannelUrl = (c: any) => {
  const isIOS = /iPad|iPhone/.test(navigator.platform)

  // If contentType is not 'youtube', send to crunchyroll
  if (c.contentType !== "youtube" && c.content_type !== "youtube") {
    const contentId = c.url || c.channelId?.split("/")[1] || c.channelId || ""
    const baseUrl = isIOS ? "crunchyroll://" : "https://www.crunchyroll.com"
    return `${baseUrl}/series/${contentId}`
  }

  const isHandle = c.channelId?.includes("@")
  const channelIdOrHandle = isHandle
    ? `@${c.channelId.split("@")[1]}`
    : `channel/${c.channelId?.split("/")[1] || c.channelId}`

  const baseUrl = isIOS ? "youtube://" : "https://youtube.com"
  return `${baseUrl}/${channelIdOrHandle}/videos`
}

const GroupItem: React.FC<GroupItemProps> = ({
  id,
  name,
  icon = "lucide:folder-kanban",
  channelCount = 0,
  forceExpand = false,
  expandTrigger = 0
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [channels, setChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState(false)
  const [hasFetched, setHasFetched] = useState(false)

  // Reset hasFetched when id changes (new group)
  useEffect(() => {
    console.log("[Groupify] Group id changed to:", id, "resetting hasFetched")
    setHasFetched(false)
    setChannels([])
  }, [id])

  const fetchChannels = useCallback(async () => {
    if (!id) {
      console.log("[Groupify] No id provided, skipping fetch")
      return
    }

    console.log("[Groupify] Fetching channels for group:", id)

    try {
      setLoading(true)
      console.log("[Groupify] Calling getGroup API for:", id)
      const response = await getGroup(String(id))
      console.log("[Groupify] Got response for group", id, ":", response)
      setChannels(response.channels || [])
      setHasFetched(true)
    } catch (err) {
      console.error("[Groupify] Error fetching channels:", err)
      setChannels([])
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    console.log(
      "[Groupify] isOpen effect - isOpen:",
      isOpen,
      "hasFetched:",
      hasFetched,
      "id:",
      id
    )
    if (isOpen && !hasFetched) {
      fetchChannels()
    }
  }, [isOpen, hasFetched, fetchChannels])

  // Handle expand/collapse all
  useEffect(() => {
    console.log(
      "[Groupify] expandTrigger effect - trigger:",
      expandTrigger,
      "forceExpand:",
      forceExpand,
      "hasFetched:",
      hasFetched,
      "id:",
      id
    )
    if (expandTrigger > 0) {
      setIsOpen(forceExpand)
      if (forceExpand && !hasFetched) {
        fetchChannels()
      }
    }
  }, [expandTrigger, forceExpand, hasFetched, fetchChannels])

  const getIconUrl = (iconName: string) => {
    if (iconName.startsWith("http")) {
      return iconName
    }
    const normalizedIcon = iconName.replace(":", "/")
    return `https://api.iconify.design/${normalizedIcon}.svg`
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Collapsible
        open={isOpen}
        onOpenChange={(open) => {
          console.log("[Groupify] Group", id, "opening:", open)
          setIsOpen(open)
        }}
        className="group/item">
        <div className="flex items-center gap-1 px-2 py-1 hover:bg-accent/50 dark:hover:bg-white/10 rounded-md transition-colors">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="flex-1 justify-start h-9 px-2 gap-2 font-normal hover:bg-transparent dark:text-white">
              <ChevronRight
                className={`h-4 w-4 text-muted-foreground dark:text-white/70 transition-transform duration-200 shrink-0 ${
                  isOpen ? "rotate-90" : ""
                }`}
              />
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <img
                  className="w-5 h-5 shrink-0 opacity-80"
                  src={getIconUrl(icon)}
                  alt=""
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src =
                      "https://api.iconify.design/lucide/folder-kanban.svg"
                  }}
                />
                <span className="text-sm truncate dark:text-white max-w-[120px]">
                  {name}
                </span>
              </div>
              {channelCount > 0 && (
                <Badge
                  variant="secondary"
                  className="text-[10px] h-5 px-1.5 shrink-0 dark:bg-white/20 dark:text-white">
                  {channelCount}
                </Badge>
              )}
            </Button>
          </CollapsibleTrigger>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity dark:text-white"
                onClick={() =>
                  window.open("https://groupify.dev/dashboard/groups")
                }>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="dark:text-white">Edit group</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <div className="pl-9 pr-2 py-1 space-y-0.5">
            {loading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground dark:text-white/70" />
              </div>
            )}

            {!loading && channels.length === 0 && (
              <div className="flex items-center gap-2 px-2 py-2 text-muted-foreground dark:text-white/60">
                <Users className="h-3.5 w-3.5" />
                <span className="text-xs dark:text-white/60">
                  {chrome.i18n.getMessage("group_item_not_found")}
                </span>
              </div>
            )}

            {!loading &&
              channels.map((c) => (
                <a
                  key={c.id}
                  href={getChannelUrl(c)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-external-id={c.id}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-accent dark:hover:bg-white/10 transition-colors group/channel"
                  id={c.id}>
                  <img
                    className="rounded-full w-5 h-5 shrink-0"
                    src={c.thumbnail}
                    alt=""
                  />
                  <span className="truncate text-muted-foreground group-hover/channel:text-foreground dark:text-white/70 dark:group-hover/channel:text-white transition-colors">
                    {c.name}
                  </span>
                </a>
              ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </TooltipProvider>
  )
}

export default GroupItem
