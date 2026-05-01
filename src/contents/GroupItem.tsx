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
import { getChannelUrl, cn } from "@/lib/utils"

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
  children?: React.ReactNode
}

const GroupItem: React.FC<GroupItemProps> = ({
  id,
  name,
  icon = "lucide:folder-kanban",
  channelCount = 0,
  forceExpand = false,
  expandTrigger = 0,
  children
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
      <div className="flex items-center gap-1.5 px-1 py-1 rounded-lg hover:bg-accent/50 dark:hover:bg-white/[0.04] transition-colors duration-150">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="flex-1 justify-start h-9 px-2.5 gap-2 font-normal hover:bg-transparent dark:text-white/80 dark:hover:text-white rounded-lg">
            <ChevronRight
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground/50 dark:text-white/30 transition-transform duration-200 shrink-0",
                isOpen && "rotate-90 text-muted-foreground/70 dark:text-white/50"
              )}
            />
            <img
              className="w-4 h-4 shrink-0 opacity-70 dark:opacity-80"
              src={getIconUrl(icon)}
              alt=""
              onError={(e) => {
                ;(e.target as HTMLImageElement).src =
                  "https://api.iconify.design/lucide/folder-kanban.svg"
              }}
            />
            <span className="text-sm truncate dark:text-white/80">{name}</span>
            {channelCount > 0 && (
              <Badge
                variant="secondary"
                className="text-[11px] h-5 px-1.5 shrink-0 font-medium rounded-md dark:bg-white/8 dark:text-white/50">
                {channelCount}
              </Badge>
            )}
          </Button>
        </CollapsibleTrigger>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 opacity-0 group-hover/item:opacity-100 transition-all duration-150 rounded-md dark:text-white/40 dark:hover:text-white dark:hover:bg-white/[0.06]"
          onClick={() => window.open("https://groupify.dev/dashboard/groups")}>
          <Pencil className="h-3 w-3" />
        </Button>
      </div>

      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        {/* Subgroups */}
        {children}

        {/* Channels */}
        <div className="pl-9 pr-2 py-1 space-y-0.5">
          {loading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground/40 dark:text-white/20" />
            </div>
          )}

          {!loading && channels.length === 0 && (
            <div className="flex items-center gap-2 px-3 py-2.5 text-xs text-muted-foreground/50 dark:text-white/30">
              <Users className="h-3.5 w-3.5" />
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
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm hover:bg-accent/40 dark:hover:bg-white/[0.04] transition-colors duration-150 group/channel">
                <img
                  className="rounded-full w-5 h-5 shrink-0 ring-1 ring-border/50 dark:ring-white/5"
                  src={c.thumbnail}
                  alt=""
                />
                <span className="truncate text-muted-foreground/70 dark:text-white/50 group-hover/channel:text-foreground/90 dark:group-hover/channel:text-white/80 transition-colors duration-150 text-xs font-medium">
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
