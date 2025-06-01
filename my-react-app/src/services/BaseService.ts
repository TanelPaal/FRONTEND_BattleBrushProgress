import axios, { AxiosInstance } from "axios";
import { TokenService } from './TokenService';

export abstract class BaseService {
	private static axiosInstance: AxiosInstance;

	protected get axiosInstance(): AxiosInstance {
		if (!BaseService.axiosInstance) {
			BaseService.axiosInstance = axios.create({
				baseURL: "http://localhost:8888/api/v1/",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});

			BaseService.axiosInstance.interceptors.request.use(
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

			BaseService.axiosInstance.interceptors.response.use(
				(response) => response,
				(error) => {
					if (error.response?.status === 401) {
						TokenService.clearTokens();
					}
					return Promise.reject(error);
				}
			);
		}
		return BaseService.axiosInstance;
	}
}

