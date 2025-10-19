import { toast } from "sonner";

type ApiResponse<T> = {
	data: T;
	message?: string;
};

type ApiError = {
	message: string;
	status: number;
	errors?: Record<string, string[]>;
};

class ApiClient {
	private baseURL: string;
	private defaultHeaders: Record<string, string>;

	constructor(baseURL: string = "/api") {
		this.baseURL = baseURL;
		this.defaultHeaders = {
			"Content-Type": "application/json",
		};
	}

	private async request<T>(
		endpoint: string,
		options: RequestInit = {},
	): Promise<T> {
		const url = `${this.baseURL}${endpoint}`;

		const config: RequestInit = {
			...options,
			credentials: "include",
			headers: {
				...this.defaultHeaders,
				...options.headers,
			},
		};

		try {
				const response = await fetch(url, config);

				if (!response.ok) {
					if (response.status === 401) {
						toast.error("Session expired. Please log in again.");
						setTimeout(() => {
							throw new Error("Unauthorized"); // Stop further processing
						}, 3000)
					}
					const errorData = await response.json().catch(() => ({
						message: "An error occurred",
					}));

					const apiError: ApiError = {
						message: errorData.message || `HTTP ${response.status}`,
						status: response.status,
						errors: errorData.errors,
					};

					throw apiError;
				}

				const data = await response.json();
				return data;
			} catch (error) {
				if (error instanceof TypeError) {
					// Network error
					throw {
						message: "Network error. Please check your connection.",
						status: 0,
					} as ApiError;
				}
				throw error;
			}
		}

		// GET request
		async get<T>(
			endpoint: string,
			params?: Record<string, string | number | boolean | undefined>,
		): Promise<T> {
		const url = new URL(endpoint, this.baseURL);
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined) {
					url.searchParams.append(key, value.toString());
				}
			});
		}

		return this.request<T>(url.pathname + url.search);
	}

	// POST request
	async post<T>(endpoint: string, data?: unknown): Promise<T> {
		return this.request<T>(endpoint, {
			method: "POST",
			body: data ? JSON.stringify(data) : undefined,
		});
	}

	async postFormData<T>(endpoint: string, data?: FormData): Promise<T> {
		return this.request<T>(endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "multipart/form-data",
			},
			body: data,
		});
	}

	// PUT request
	async put<T>(endpoint: string, data?: unknown): Promise<T> {
		return this.request<T>(endpoint, {
			method: "PUT",
			body: data ? JSON.stringify(data) : undefined,
		});
	}

	// PATCH request
	async patch<T>(endpoint: string, data?: unknown): Promise<T> {
		return this.request<T>(endpoint, {
			method: "PATCH",
			body: data ? JSON.stringify(data) : undefined,
		});
	}

	// DELETE request
	async delete<T>(endpoint: string): Promise<T> {
		return this.request<T>(endpoint, {
			method: "DELETE",
		});
	}

	// Set authorization token
	setAuthToken(token: string) {
		this.defaultHeaders.Authorization = `Bearer ${token}`;
	}

	// Remove authorization token
	removeAuthToken() {
		delete this.defaultHeaders.Authorization;
	}

	// Set custom header
	setHeader(key: string, value: string) {
		this.defaultHeaders[key] = value;
	}

	// Remove custom header
	removeHeader(key: string) {
		delete this.defaultHeaders[key];
	}
}

export const apiClient = new ApiClient(process.env.PLASMO_PUBLIC_GROUPIFY_URL);
export { ApiClient, type ApiResponse, type ApiError };
