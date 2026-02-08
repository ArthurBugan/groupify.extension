import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useEffect, useState } from "react"
import {
  ChevronRight,
  Pencil,
  Loader2,
  Users,
  FolderKanban
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
import { useGroupifyStorage } from "@/lib/hooks"

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
}

const getChannelUrl = (c: any) => {
  const isIOS = /iPad|iPhone/.test(navigator.platform)

  if (c.content_type === "anime") {
    const animeId = c.url || c.channelId?.split("/")[1] || c.channelId || ""
    const baseUrl = isIOS ? "crunchyroll://" : "https://www.crunchyroll.com"
    return `${baseUrl}/series/${animeId}`
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
  channelCount = 0
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [localData, setLocalData] = useState<any[]>([])
  const { data, loading } = useGroupifyStorage("channels", id, isOpen)

  useEffect(() => {
    if (!loading && localData.length === 0) {
      setLocalData(data)
    }
  }, [loading, data])

  useEffect(() => {
    if (!isOpen) {
      setLocalData([])
    }
  }, [isOpen])

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
        onOpenChange={setIsOpen}
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
                <span className="text-sm truncate dark:text-white">{name}</span>
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

            {!loading && !data.length && (
              <div className="flex items-center gap-2 px-2 py-2 text-muted-foreground dark:text-white/60">
                <Users className="h-3.5 w-3.5" />
                <span className="text-xs dark:text-white/60">
                  {chrome.i18n.getMessage("group_item_not_found")}
                </span>
              </div>
            )}

            {!loading &&
              localData.map((c) => (
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
