import axios from "axios";
import { TokenService } from './TokenService';

const API_BASE = "http://localhost:8888/api/v1";

// Add this interface to define the response type
interface IRandomMiniature {
    miniatureCollectionId: string;
    collectionName: string;
    collectionDesc: string;
}

export class StatsService {
    private axiosInstance = axios.create({
        baseURL: API_BASE,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });

    constructor() {
        // Add request interceptor for authentication
        this.axiosInstance.interceptors.request.use(
            (config) => {
                const token = TokenService.getJwt();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    async getMiniatureStats(userId: string) {
        try {
            const response = await this.axiosInstance.get(`MiniatureCollectionStats/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching miniature stats:", error);
            throw error;
        }
    }

    async getPaintStats(userId: string) {
        try {
            const response = await this.axiosInstance.get(`PersonPaintsStats/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching paint stats:", error);
            throw error;
        }
    }

    async getRandomMiniature(userId: string): Promise<IRandomMiniature> {
        try {
            const response = await this.axiosInstance.get(`RandomMiniaturePicker/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching random miniature:", error);
            throw error;
        }
    }
}
