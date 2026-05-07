import axios from "axios";
import { getAuthToken } from "../utils/auth";

const apiClient = axios.create({
    baseURL: "https://localhost:7071",
});

apiClient.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
