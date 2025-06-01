import { AxiosError } from "axios"
import { BaseService } from "./BaseService"
import { IResultObject } from "@/types/IResultObject.ts"
import { ILoginDto } from "@/types/ILoginDto.ts"
import { IRegisterDto } from "@/types/IRegisterDto.ts"
import { TokenService } from "./TokenService.ts"

export class AccountService extends BaseService {

	async loginAsync(email: string, password: string): Promise<IResultObject<ILoginDto>> {
		const url = 'account/login?jwtExpiresInSeconds=300&refreshTokenExpiresInSeconds=86400'
		try {
			const response = await this.axiosInstance.post<ILoginDto>(url, { email, password })

			if (response.status <= 300) {
				return {
					statusCode: response.status,
					data: response.data
				}
			}

			return {
				statusCode: response.status,
				errors: [response.statusText],
			}
		} catch (error) {
			return {
				statusCode: (error as AxiosError)?.status ?? 0,
				errors: [(error as AxiosError).code ?? ""],
			}
		}
	}

	async registerAsync(registerData: IRegisterDto): Promise<IResultObject<ILoginDto>> {
		const url = 'account/register?jwtExpiresInSeconds=300&refreshTokenExpiresInSeconds=86400'
		try {
			const response = await this.axiosInstance.post<ILoginDto>(url, registerData)

			if (response.status <= 300) {
				return {
					statusCode: response.status,
					data: response.data
				}
			}

			return {
				statusCode: response.status,
				errors: [response.statusText],
			}
		} catch (error) {
			return {
				statusCode: (error as AxiosError)?.status ?? 0,
				errors: [(error as AxiosError).code ?? ""],
			}
		}
	}

	async refreshTokenAsync(): Promise<IResultObject<ILoginDto>> {
		const url = 'account/renewRefreshToken?jwtExpiresInSeconds=300&refreshTokenExpiresInSeconds=86400'
		const jwt = TokenService.getJwt()
		const refreshToken = TokenService.getRefreshToken()

		if (!jwt || !refreshToken) {
			return {
				statusCode: 401,
				errors: ['No tokens available for refresh']
			}
		}

		try {
			const response = await this.axiosInstance.post<ILoginDto>(url, { jwt, refreshToken })

			if (response.status <= 300) {
				return {
					statusCode: response.status,
					data: response.data
				}
			}

			return {
				statusCode: response.status,
				errors: [response.statusText],
			}
		} catch (error) {
			return {
				statusCode: (error as AxiosError)?.status ?? 0,
				errors: [(error as AxiosError).code ?? ""],
			}
		}
	}
}
