import React from "react"
import { useGroup } from "@/hooks/useQuery/useGroups"
import { Loader2, Youtube } from "lucide-react"
import { cn, getChannelUrl } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface GroupType {
  id: string
  name: string
  nestingLevel: number
}

interface ExpandedGroupProps {
  group: GroupType
}

export const ExpandedGroup: React.FC<ExpandedGroupProps> = ({ group }) => {
  const { data: groupData, isLoading: isLoadingChannels } = useGroup(group.id)

  if (isLoadingChannels) {
    return (
      <div className="flex justify-center items-center py-1.5">
        <Loader2 className="animate-spin h-3.5 w-3.5 text-muted-foreground/50 dark:text-white/30" />
      </div>
    )
  }

  const channels = groupData?.channels || []

  if (channels.length === 0) {
    return (
      <div className="text-xs text-muted-foreground/50 dark:text-white/30 px-2 py-1">
        No channels
      </div>
    )
  }

  return (
    <div className="space-y-0.5">
      {channels.map((channel) => (
        <div
          key={channel.id}
          onClick={() =>
            window.open(getChannelUrl(channel.contentType, channel.url))
          }
          className="flex items-center gap-2 px-2 py-1 rounded hover:bg-accent/50 dark:hover:bg-white/5 cursor-pointer">
          <Avatar className="h-5 w-5">
            <AvatarImage
              src={channel.thumbnail || "/placeholder.svg"}
              alt={channel.name}
              className="object-cover"
            />
            <AvatarFallback className="dark:bg-white/10">
              <Youtube className="h-3 w-3 dark:text-white/50" />
            </AvatarFallback>
          </Avatar>
          <span className="text-xs truncate dark:text-white/70">
            {channel.name}
          </span>
        </div>
      ))}
    </div>
  )
}
