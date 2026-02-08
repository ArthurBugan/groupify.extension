import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { type ApiResponse, apiClient } from "@/hooks/api/api-client";
import { queryKeys } from "@/hooks/utils/queryKeys";
import type { Pagination } from "./types";

// Types for channels
export interface Channel {
	id: string;
	name: string;
	channelId: string;
	url: string;
	thumbnail?: string;
	contentType?: string;
	subscriberCount?: number;
	videoCount?: number;
	groupId: string;
	groupName?: string;
	groupIcon?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface ChannelsResponse {
	data: Channel[];
	pagination: Pagination;
}

export interface CreateChannelRequest {
	name: string;
	channelId: string;
	url: string;
	thumbnail?: string;
	subscriberCount?: number;
	videoCount?: number;
	groupId: string;
}

export interface UpdateChannelRequest {
	id: string;
	contentType?: string;
	name?: string;
	channelId?: string;
	url?: string;
	thumbnail?: string;
	subscriberCount?: number;
	videoCount?: number;
	groupId?: string;
}

export interface BatchUpdateChannelRequest {
	channels: UpdateChannelRequest[];
}

// Query function to fetch all channels with pagination
const getChannels = async (params?: {
	page?: number;
	limit?: number;
	search?: string;
	groupId?: string;
}): Promise<ChannelsResponse> => {
	const response = await apiClient.get<ChannelsResponse>(
		"/api/v2/channels",
		params,
	);
	return response;
};

const getChannel = async (id: string): Promise<Channel> => {
	const response = await apiClient.get<ApiResponse<Channel>>(
		`/api/v2/channels/${id}`,
	);
	return response.data;
};

// Query function to fetch channels by group ID
const getChannelsByGroup = async (
	groupId: string,
	params?: {
		page?: number;
		limit?: number;
		search?: string;
	},
): Promise<ChannelsResponse> => {
	const response = await apiClient.get<ChannelsResponse>(
		`/api/v2/channels/group/${groupId}`,
		params,
	);
	return response;
};

// React Query hooks
export function useChannels(params?: {
	page?: number;
	limit?: number;
	search?: string;
	groupId?: string;
}) {
	return useInfiniteQuery({
		queryKey: queryKeys.channels(params),
		queryFn: ({ pageParam }) => getChannels({ ...params, page: pageParam }),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => {
			const { pagination } = lastPage;
			return pagination.page < pagination.totalPages
				? pagination.page + 1
				: undefined;
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
}

export function useAllChannels(params?: {
	page?: number;
	limit?: number;
	search?: string;
	groupId?: string;
}) {
	return useQuery({
		queryKey: queryKeys.channels(params),
		queryFn: () => getChannels(params),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
}

export function useChannel(id: string) {
	return useQuery({
		queryKey: queryKeys.channel(id),
		queryFn: () => getChannel(id),
		enabled: !!id,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
}

export function useChannelsByGroup(
	groupId: string,
	params?: {
		page?: number;
		limit?: number;
		search?: string;
	},
) {
	return useQuery({
		queryKey: queryKeys.channels({ ...params, groupId }),
		queryFn: () => getChannelsByGroup(groupId, params),
		enabled: !!groupId,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
}

// Create a new channel
const createChannel = async (data: CreateChannelRequest): Promise<Channel> => {
	const response = await apiClient.post<ApiResponse<Channel>>(
		"/api/v2/channels",
		data,
	);
	return response.data;
};

// Update an existing channel
const updateChannel = async (
	id: string,
	data: UpdateChannelRequest,
): Promise<Channel> => {
	const response = await apiClient.patch<ApiResponse<Channel>>(
		`/api/v2/channels/${id}`,
		data,
	);
	return response.data;
};

// Batch update channels
const updateChannelsBatch = async (
	data: BatchUpdateChannelRequest,
): Promise<Channel[]> => {
	console.log("updateChannelsBatch", data);
	const groupId = data.channels[0].groupId;
	const response = await apiClient.patch<ApiResponse<Channel[]>>(
		`/api/v3/channels/${groupId}/batch`,
		data,
	);
	return response.data;
};

// Delete a channel
const deleteChannel = async ({
	channelId,
}: {
	channelId: string;
}): Promise<void> => {
	await apiClient.delete(`/api/v2/channels/${channelId}`);
};

// React Query mutation hooks
export function useCreateChannel() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateChannelRequest) => createChannel(data),
		onSuccess: () => {
			// Invalidate and refetch the channels query to update the UI
			queryClient.invalidateQueries({ queryKey: queryKeys.channels() });
		},
	});
}

export function useUpdateChannel() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateChannelRequest }) =>
			updateChannel(id, data),
		onSuccess: (updatedChannel) => {
			// Invalidate and refetch the channels query to update the UI
			queryClient.invalidateQueries({ queryKey: queryKeys.channels() });
			queryClient.invalidateQueries({ queryKey: queryKeys.animes() });

			// Invalidate the specific channel query
			queryClient.invalidateQueries({
				queryKey: queryKeys.channel(updatedChannel.id),
			});
			queryClient.invalidateQueries({
				queryKey: queryKeys.anime(updatedChannel.id),
			});
		},
	});
}

export function useDeleteChannelMutation() {
	const queryClient = useQueryClient();

	return useMutation<void, Error, { channelId: string }>({
		mutationFn: ({ channelId }) => deleteChannel({ channelId }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.channels() });
			queryClient.invalidateQueries({ queryKey: ["groups"] });
			queryClient.invalidateQueries({ queryKey: ["group"] });
		},
	});
}

export function useUpdateChannelsBatch() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: BatchUpdateChannelRequest) => updateChannelsBatch(data),
		onSuccess: (updatedChannels) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.channels() });
			// Invalidate the specific group query to update the UI

			console.log("updatedChannels", updatedChannels);
			if (updatedChannels.length > 0) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.group(updatedChannels[0].groupId),
				});
			}
		},
	});
}

export {
	getChannels,
	getChannel,
	getChannelsByGroup,
	createChannel,
	updateChannel,
	deleteChannel,
	updateChannelsBatch,
};
