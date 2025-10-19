import React from 'react';
import { useGroup } from '@/hooks/useQuery/useGroups'; // Assuming this path
import { Loader2, Youtube } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Define the type for a single channel
interface ChannelType {
    id: string;
    name: string;
    link: string;
    // Add other channel properties as needed
}

// Define the type for the group prop
interface GroupType {
    id: string;
    name: string;
    nestingLevel: number;
    // Add other group properties as needed
}

interface ExpandedGroupProps {
    group: GroupType;
}

export const ExpandedGroup: React.FC<ExpandedGroupProps> = ({ group }) => {
    const { data: groupData, isLoading: isLoadingChannels } = useGroup(group.id);

    if (isLoadingChannels) {
        return (
            <div className="flex justify-center items-center py-2">
                <Loader2 className="animate-spin h-4 w-4 text-gray-500" />
            </div>
        );
    }

    const channels = groupData?.channels || [];

    if (channels.length === 0) {
        return (
            <div className={cn("text-xl text-gray-500 dark:text-gray-200 py-1", `pl-${(group.nestingLevel + 1) * 8}`)}>
                No channels found for this group.
            </div>
        );
    }

    return (
        <div className="space-y-1">
            {channels.map((channel) => (
                <div
                    key={channel.id}
                    onClick={() => window.open(`${channel.contentType === 'anime' ? 'https://crunchyroll.com/series/' : 'https://youtube.com/c/'}${channel.url}`)}
                    className={cn(
                        "flex items-center gap-2 p-2 rounded-md hover:bg-accent",
                        `pl-${(group.nestingLevel + 2) * 16}`, // Indent channels further than their parent group
                    )}
                >
                    <Avatar className="h-9 w-9">
                        <AvatarImage
                            src={channel.thumbnail || "/placeholder.svg"}
                            alt={channel.name}
                        />
                        <AvatarFallback>
                            <Youtube className="h-9 w-9" />
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-lg text-gray-700 dark:text-gray-200">{channel.name}</span>
                </div>
            ))}
        </div>
    );
};