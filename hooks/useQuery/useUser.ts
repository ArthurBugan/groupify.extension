import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/hooks/api/api-client"

export interface User {
  id: string
  email: string
  name: string
}

export const useUser = () => {
  const {
    data: userData,
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return await apiClient.get<User>("/me")
    },
    retry: false,
    staleTime: Infinity
  })

  return { userData, loading, error, refetch }
}
