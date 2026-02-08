import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type ApiResponse, apiClient } from "@/hooks/api/api-client";
import { queryKeys } from "@/hooks/utils/queryKeys";
import type { Pagination } from "./types";

// Types for groups
export interface Group {
	id: string;
	name: string;
	description?: string;
	icon?: string;
	channels?: Channel[];
	category?: string;
	nestingLevel?: number;
	displayOrder?: number;
	parentId?: string | null;
	createdAt: string;
	channelCount: number;
	updatedAt: string;
}

export interface Channel {
	id: string;
	name: string;
	channelId: string;
	thumbnail?: string;
	subscriberCount?: number;
	groupIcon?: string;
	groupName?: string;
	category?: string;
	url?: string;
	contentType?: string;
	createdAt: string | number | Date;
	updatedAt: string | number | Date;
}

export interface GroupsResponse {
	data: Group[];
	pagination: Pagination;
}

export interface CreateGroupRequest {
	name: string;
	description?: string;
	icon?: string;
	category?: string;
	parentId?: string | null;
}

export interface UpdateGroupRequest {
	name?: string;
	description?: string;
	icon?: string;
	category?: string;
	parentId?: string | null;
}

// Query function to fetch all groups
const getGroups = async (params?: {
	page?: number;
	limit?: number;
	search?: string;
}): Promise<GroupsResponse> => {
	const response = await apiClient.get<GroupsResponse>("api/v3/groups", params);
	return response;
};

// Query function to fetch a single group by ID
const getGroup = async (id: string): Promise<Group> => {
	const response = await apiClient.get<ApiResponse<Group>>(
		`/api/v2/groups/${id}`,
	);
	return response.data;
};

// React Query hooks
export function useGroups(params?: {
	page?: number;
	limit?: number;
	search?: string;
}) {
	return useQuery({
		queryKey: ["groups"],
		queryFn: () => getGroups(params),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
}

export function useGroup(id: string) {
	return useQuery({
		queryKey: queryKeys.group(id),
		queryFn: () => getGroup(id),
		enabled: !!id,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
}

// Update display order for a group
const updateGroupDisplayOrder = async (
	groupId: string,
	displayOrder: number,
): Promise<void> => {
	await apiClient.put(`/api/v2/groups/${groupId}/display-order`, {
		display_order: displayOrder,
	});
};

// Create a new group
const createGroup = async (data: CreateGroupRequest): Promise<Group> => {
	const response = await apiClient.post<ApiResponse<Group>>(
		"api/v2/groups",
		data,
	);
	return response.data;
};

// Update an existing group
const updateGroup = async (
	id: string,
	data: UpdateGroupRequest,
): Promise<Group> => {
	const response = await apiClient.put<ApiResponse<Group>>(
		`/api/v2/groups/${id}`,
		data,
	);
	return response.data;
};

// Delete a group
const deleteGroup = async (id: string): Promise<void> => {
	await apiClient.delete(`/api/v2/groups/${id}`);
};

export function useUpdateGroupDisplayOrder() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			groupId,
			displayOrder,
		}: {
			groupId: string;
			displayOrder: number;
		}) => updateGroupDisplayOrder(groupId, displayOrder),
		onSuccess: () => {
			// Invalidate and refetch the groups query to update the UI
			queryClient.invalidateQueries({ queryKey: queryKeys.groups() });
		},
	});
}

// React Query mutation hook for creating a new group
export function useCreateGroup() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateGroupRequest) => createGroup(data),
		onSuccess: () => {
			// Invalidate and refetch the groups query to update the UI
			queryClient.invalidateQueries({ queryKey: queryKeys.groups() });
		},
	});
}

// React Query mutation hook for updating an existing group
export function useUpdateGroup() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateGroupRequest }) =>
			updateGroup(id, data),
		onSuccess: (updatedGroup) => {
			// Invalidate and refetch the groups query to update the UI
			queryClient.invalidateQueries({ queryKey: queryKeys.groups() });
			// Invalidate the specific group query
			queryClient.invalidateQueries({
				queryKey: queryKeys.group(updatedGroup.id),
			});
		},
	});
}

// React Query mutation hook for deleting a group
export function useDeleteGroup() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteGroup(id),
		onSuccess: () => {
			// Invalidate and refetch the groups query to update the UI
			queryClient.invalidateQueries({ queryKey: queryKeys.groups() });
		},
	});
}

export { getGroups, getGroup, updateGroup, deleteGroup };
