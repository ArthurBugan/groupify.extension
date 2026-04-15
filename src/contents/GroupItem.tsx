import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useEffect, useState, useCallback } from "react"
import { ChevronRight, Pencil, Loader2, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { getGroup, type Channel } from "@/hooks/useQuery/useGroups"
import { getChannelUrl } from "@/lib/utils"

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => null

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

  useEffect(() => {
    setHasFetched(false)
    setChannels([])
  }, [id])

  const fetchChannels = useCallback(async () => {
    if (!id) return
    try {
      setLoading(true)
      const response = await getGroup(String(id))
      setChannels(response.channels || [])
      setHasFetched(true)
    } catch (err) {
      setChannels([])
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (isOpen && !hasFetched) fetchChannels()
  }, [isOpen, hasFetched, fetchChannels])

  useEffect(() => {
    if (expandTrigger > 0) {
      setIsOpen(forceExpand)
      if (forceExpand && !hasFetched) fetchChannels()
    }
  }, [expandTrigger, forceExpand, hasFetched, fetchChannels])

  const getIconUrl = (iconName: string) => {
    if (iconName.startsWith("http")) return iconName
    const normalizedIcon = iconName.replace(":", "/")
    return `https://api.iconify.design/${normalizedIcon}.svg`
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/item">
      <div className="flex items-center gap-1 px-2 py-1.5 hover:bg-accent/50 dark:hover:bg-white/5 rounded-md transition-colors">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="flex-1 justify-start h-8 px-2 gap-2 font-normal hover:bg-transparent dark:text-white/90 dark:hover:text-white">
            <ChevronRight
              className={`h-3.5 w-3.5 text-muted-foreground/70 dark:text-white/50 transition-transform duration-200 shrink-0 ${
                isOpen ? "rotate-90" : ""
              }`}
            />
            <img
              className="w-4 h-4 shrink-0 opacity-70"
              src={getIconUrl(icon)}
              alt=""
              onError={(e) => {
                ;(e.target as HTMLImageElement).src =
                  "https://api.iconify.design/lucide/folder-kanban.svg"
              }}
            />
            <span className="text-sm truncate dark:text-white/90">{name}</span>
            {channelCount > 0 && (
              <Badge
                variant="secondary"
                className="text-[10px] h-5 px-1.5 shrink-0 font-medium dark:bg-white/10 dark:text-white/80">
                {channelCount}
              </Badge>
            )}
          </Button>
        </CollapsibleTrigger>

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity dark:text-white/70 dark:hover:text-white"
          onClick={() => window.open("https://groupify.dev/dashboard/groups")}>
          <Pencil className="h-3 w-3" />
        </Button>
      </div>

      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <div className="pl-7 pr-2 py-1 space-y-0.5">
          {loading && (
            <div className="flex items-center justify-center py-3">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground/50 dark:text-white/30" />
            </div>
          )}

          {!loading && channels.length === 0 && (
            <div className="flex items-center gap-2 px-2 py-2 text-xs text-muted-foreground/60 dark:text-white/40">
              <Users className="h-3 w-3" />
              No channels
            </div>
          )}

          {!loading &&
            channels.map((c) => (
              <a
                key={c.id}
                href={getChannelUrl(c.contentType, c.url)}
                target="_blank"
                rel="noopener noreferrer"
                data-external-id={c.id}
                className="flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-accent/50 dark:hover:bg-white/5 transition-colors group/channel">
                <img
                  className="rounded-full w-4 h-4 shrink-0"
                  src={c.thumbnail}
                  alt=""
                />
                <span className="truncate text-muted-foreground/80 dark:text-white/60 group-hover/channel:text-foreground dark:group-hover/channel:text-white/90 transition-colors text-xs">
                  {c.name}
                </span>
              </a>
            ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default GroupItem
