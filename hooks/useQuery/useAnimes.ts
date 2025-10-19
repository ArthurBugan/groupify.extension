import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { type ApiResponse, apiClient } from "@/hooks/api/api-client";
import { queryKeys } from "@/hooks/utils/queryKeys";
import type { Pagination } from "./types";

export interface Anime {
  id: string;
  userId?: string | null;
  groupId?: string | null;
  name: string;
  channelId: string;
  thumbnail?: string;
  createdAt?: string;
  contentType?: string;
  updatedAt?: string;
  groupName?: string;
  groupIcon?: string;
  url?: string;
}

export interface PaginatedAnimesResponse {
  data: Anime[];
  pagination: Pagination;
}

interface UseAnimesParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Query function to fetch all animes with pagination
export const getAnimes = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PaginatedAnimesResponse> => {
  const response = await apiClient.get<PaginatedAnimesResponse>(
    "/api/v2/animes",
    params,
  );
  return response;
};

export function useAllAnimes(params?: UseAnimesParams) {
  return useQuery({
    queryKey: queryKeys.animes(params),
    queryFn: () => getAnimes(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useInfiniteAnimes(params?: {
	page?: number;
	limit?: number;
	search?: string;
	groupId?: string;
}) {
	return useInfiniteQuery({
		queryKey: queryKeys.animes(params),
		queryFn: ({ pageParam }) => getAnimes({ ...params, page: pageParam }),
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
