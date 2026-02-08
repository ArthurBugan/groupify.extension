import { useMutation } from "@tanstack/react-query";
import { type ApiResponse, apiClient } from "@/hooks/api/api-client";
import { Storage } from "@plasmohq/storage"

const storage = new Storage()

// Types
export type LoginCredentials = {
	email: string;
	password: string;
};

export type RegisterCredentials = {
	name: string;
	email: string;
	password: string;
	encryptedPassword: string;
};

export type LoginResponse = {
	user: {
		id: string;
		email: string;
		name: string;
	};
	data?: string;
};

export type RegisterResponse = {
	user: {
		id: string;
		email: string;
		name: string;
	};
	data?: string;
	message: string;
};

export type ForgotPasswordRequest = {
	email: string;
	encrypted_password: string;
};

export type ForgotPasswordResponse = {
	message: string;
	success: boolean;
};

// API Functions
const loginUser = async (
	credentials: LoginCredentials,
): Promise<String> => {
	const response = await apiClient.post<LoginResponse>(
		"/authorize",
		credentials,
	);

	if (response?.data) {
		localStorage.setItem("authToken", response.data);
		apiClient.setAuthToken(response.data);
	}

	return response.data;
};

const registerUser = async (
	credentials: RegisterCredentials,
): Promise<RegisterResponse> => {
	const response = await apiClient.post<ApiResponse<RegisterResponse>>(
		"/registration",
		credentials,
	);

	if (response?.data?.data) {
		localStorage.setItem("authToken", response.data.data);
		await storage.set("authorization", response.data.data);
		apiClient.setAuthToken(response.data.data);
	}

	return response.data;
};

const forgotPassword = async (
	data: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> => {
	const response = await apiClient.post<ApiResponse<ForgotPasswordResponse>>(
		"/forget-password",
		data,
	);

	return response.data;
};

// Mutation Hooks
export const useLoginMutation = () => {
	return useMutation({
		mutationFn: (credentials: LoginCredentials) => loginUser(credentials),
		onError: (error) => {
			console.error("Login failed:", error);
			throw error; // Re-throw to let component handle the error
		},
	});
};

export const useRegisterMutation = () => {
	return useMutation({
		mutationFn: (credentials: RegisterCredentials) => registerUser(credentials),
		onSuccess: (data) => {
			// Handle successful registration
			console.log("Registration successful:", data);
		},
		onError: (error) => {
			console.error("Registration failed:", error);
			throw error; // Re-throw to let component handle the error
		},
	});
};

export const useForgotPasswordMutation = () => {
	return useMutation({
		mutationFn: (data: ForgotPasswordRequest) => forgotPassword(data),
		onSuccess: (data, variables) => {
			// Handle successful forgot password request
			console.log("Forgot password request successful:", data);
		},
		onError: (error) => {
			console.error("Forgot password request failed:", error);
			throw error; // Re-throw to let component handle the error
		},
	});
};

export type SubscriptionConfirmRequest = {
	token: string;
};

export type SubscriptionConfirmResponse = {
	success: boolean;
	message: string;
};

const confirmSubscription = async (
	data: SubscriptionConfirmRequest,
): Promise<SubscriptionConfirmResponse> => {
	const response = await apiClient.post<
		ApiResponse<SubscriptionConfirmResponse>
	>(`/subscription/confirm/${data.token}`, {});

	return response.data;
};

export const useConfirmSubscriptionMutation = () => {
	return useMutation({
		mutationFn: (data: SubscriptionConfirmRequest) => confirmSubscription(data),
		onSuccess: (data) => {
			console.log("Subscription confirmed successfully:", data);
		},
		onError: (error) => {
			console.error("Subscription confirmation failed:", error);
			throw error; // Re-throw to let component handle the error
		},
	});
};

// Export API functions for direct use if needed
export { loginUser, registerUser, forgotPassword, confirmSubscription };
