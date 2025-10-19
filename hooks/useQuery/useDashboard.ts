import { useQuery } from "@tanstack/react-query";
import { type ApiResponse, apiClient } from "@/hooks/api/api-client";

export type DashboardTotalResponse = {
	groups: number;
	channels: number;
	youtubeChannels: number;
	sharedGroups: number;
	animeChannels: number;
};

const getTotals = async (): Promise<DashboardTotalResponse> => {
	const response = await apiClient.get<ApiResponse<DashboardTotalResponse>>(
		"/api/v2/dashboard/total",
	);
	return response.data;
};

export function useDashboardTotal() {
	return useQuery({
		queryKey: ["dashboard-total"],
		queryFn: getTotals,
	});
}
