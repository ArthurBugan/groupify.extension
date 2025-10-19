import { useMutation } from "@tanstack/react-query";
import { type ApiResponse, apiClient } from "@/hooks/api/api-client";

// Types for future user mutations
export type UpdateProfileRequest = {
	name?: string;
	email?: string;
	// Add other profile fields as needed
};

export type UpdateProfileResponse = {
	user: {
		id: string;
		email: string;
		name: string;
	};
	message: string;
};

// API Functions (placeholder - implement when needed)
const updateProfile = async (
	data: UpdateProfileRequest,
): Promise<UpdateProfileResponse> => {
	const response = await apiClient.put<ApiResponse<UpdateProfileResponse>>(
		"/user/profile",
		data,
	);

	return response.data;
};

const deleteAccount = async (): Promise<{ message: string }> => {
	const response =
		await apiClient.delete<ApiResponse<{ message: string }>>("/user/account");

	return response.data;
};

// Mutation Hooks (implement when needed)
export const useUpdateProfileMutation = () => {
	return useMutation({
		mutationFn: (data: UpdateProfileRequest) => updateProfile(data),
		onSuccess: (data) => {
			console.log("Profile updated successfully:", data);
			// Handle success (e.g., show toast, update cache, etc.)
		},
		onError: (error) => {
			console.error("Profile update failed:", error);
			throw error;
		},
	});
};

export const useDeleteAccountMutation = () => {
	return useMutation({
		mutationFn: () => deleteAccount(),
		onSuccess: (data) => {
			console.log("Account deleted successfully:", data);
			// Handle success (e.g., logout, redirect, etc.)
		},
		onError: (error) => {
			console.error("Account deletion failed:", error);
			throw error;
		},
	});
};

const logout = async (): Promise<{ message: string }> => {
	const response = await apiClient.post<ApiResponse<{ message: string }>>("/logout");
	return response.data;
};

export const useLogoutMutation = () => {
	const navigate = useNavigate();
	return useMutation({
		mutationFn: () => logout(),
		onSuccess: () => {
			navigate({ to: "/" });
		},
		onError: (error) => {
			console.error("Logout failed:", error);
			throw error;
		},
	});
};

// Export API functions for direct use if needed
export { updateProfile, deleteAccount };
