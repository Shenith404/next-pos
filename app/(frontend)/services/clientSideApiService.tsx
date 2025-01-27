
import axios from "axios";
import { getCookie } from 'cookies-next';
import { toast } from "react-toastify";

const apiService = axios.create({
    baseURL: 'https://pos.eminenceapps.com/api',
    headers: {
        "Content-Type": "application/json",
    },
});

const getErrorMessage = (error: {
    response: { data: { message: unknown } };
    request: unknown;
}) => {
    if (error.response) {
        return error.response.data.message || "Server error";
    } else if (error.request) {
        return "No response from server";
    } else {
        return "Request failed";
    }
};

const simulateNetworkDelay = () => {
    const delay = 500;
    return new Promise((resolve) => setTimeout(resolve, delay));
};

apiService.interceptors.request.use(async (config) => {
    try {
        //const user = userService.getCurrentUser();
        const token = getCookie('accessToken');
        console.log('Bearer', token);


        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Check if files are being uploaded and set appropriate headers
        if (config.data instanceof FormData) {
            config.headers["Content-Type"] = "multipart/form-data";
        }

        await simulateNetworkDelay();

        return config;
    } catch (error) {
        console.error("Error while setting Authorization header:", error);
        throw new Error("Failed to set Authorization header");
    }
});

apiService.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const errorMessage = getErrorMessage(error);
        if (error.response && error.response.status === 403) {
            toast.error("Your not Authorized for this section");
            return Promise.reject("Your not Authorized for this section");
        }

        if (error.response && error.response.status === 401) {
            console.log("Your session has expired. Please login again.");
            localStorage.removeItem("accessToken");
            window.location.href = "/signin";

        }




        console.log("API request failed:", errorMessage);
        return Promise.reject(errorMessage);
    }
);

export default apiService;
