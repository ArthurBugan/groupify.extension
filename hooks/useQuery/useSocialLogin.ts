import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient, type ApiResponse } from '@/hooks/api/api-client';

export interface SocialLoginSessionStatus {
  connected: boolean;
  provider: string;
  expired: boolean;
  expiresAt: string | null;
}

export const useCheckDiscordSession = () => {
  return useQuery({
    queryKey: ['discord-session'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<SocialLoginSessionStatus>>('/auth/check-discord-session');
      return data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useCheckGoogleSession = () => {
  return useQuery({
    queryKey: ['google-session'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<SocialLoginSessionStatus>>('/auth/check-google-session');
      return data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useDisconnectGoogleSession = () => {
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.delete<ApiResponse<string>>('/auth/disconnect-google');
      return data;
    },
  });
};

export const useDisconnectDiscordSession = () => {
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.delete<ApiResponse<string>>('/auth/disconnect-discord');
      return data;
    },
  });
};