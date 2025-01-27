// lib/serverApiService.ts
import axios, { AxiosInstance } from "axios";
import { cookies } from "next/headers";

export function createServerApiService(): AxiosInstance {
    const apiService = axios.create({
        baseURL: 'https://model.eminenceapps.com/api',
        headers: {
            "Content-Type": "application/json",
        },
    });

    // Add server-side token interceptor
    apiService.interceptors.request.use(async (config) => {
        try {
            // Get token from server-side cookies
            const cookieStore = await cookies();
            const token = cookieStore.get('accessToken')?.value;

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            // Check if files are being uploaded and set appropriate headers
            if (config.data instanceof FormData) {
                config.headers["Content-Type"] = "multipart/form-data";
            }

            return config;
        } catch (error) {
            console.log("Error while setting Authorization header:", error);
            throw new Error("Failed to set Authorization header");
        }
    });

    // Error handling interceptor
    apiService.interceptors.response.use(
        (response) => response.data,
        (error) => {
            const getErrorMessage = (error: any) => {
                if (error.response) {
                    return error.response.data?.message || "Server error";
                } else if (error.request) {
                    return "No response from server";
                } else {
                    return "Request failed";
                }
            };

            const errorMessage = getErrorMessage(error);

            if (error.response?.status === 403) {
                console.log("Not authorized for this section");
                return Promise.reject("Not Authorized");
            }

            if (error.response?.status === 401) {
                console.log("Session expired");
                return Promise.reject("Session Expired");
            }

            console.log("API request failed:", errorMessage);
            return Promise.reject(errorMessage);
        }
    );

    return apiService;
}

// // Usage example in a server component
// export async function fetchUserProfile() {
//     try {
//         const apiService = createServerApiService();
//         const userData = await apiService.get('/users/me');
//         return userData;
//     } catch (error) {
//         console.error('Failed to fetch user profile:', error);
//         return null;
//     }
// }