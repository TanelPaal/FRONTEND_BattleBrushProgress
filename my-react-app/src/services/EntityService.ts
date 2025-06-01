import { IResultObject } from "@/types/IResultObject";
import { BaseService } from "./BaseService";
import { AxiosError } from "axios";
import { IDomainId } from "@/types/IDomainId";

export abstract class EntityService<TEntity extends IDomainId, TAddEntity> extends BaseService {

	constructor(private basePath: string) {
		super();
	}

	async getAllAsync(): Promise<IResultObject<TEntity[]>> {
		try {

			const response = await this.axiosInstance.get<TEntity[]>(this.basePath)

			console.log('getAll response', response)

			if (response.status <= 300) {
				return {
					statusCode: response.status,
					data: response.data
				}
			}

			return {
				statusCode: response.status,
				errors: [(response.status.toString() + ' ' + response.statusText).trim()],
			}
		} catch (error) {
			console.log('error: ', (error as AxiosError).message)
			return {
				statusCode: (error as AxiosError).status ?? 0,
				errors: [(error as AxiosError).code ?? "???"],
			}
		}
	}

	async getAsync(id: string): Promise<IResultObject<TEntity>> {
		try {

			const response = await this.axiosInstance.get<TEntity>(this.basePath + "/" + id)

			console.log('get response', response)

			if (response.status <= 300) {
				return {
					statusCode: response.status,
					data: response.data
				}
			}

			return {
				statusCode: response.status,
				errors: [(response.status.toString() + ' ' + response.statusText).trim()],
			}
		} catch (error) {
			console.log('error: ', (error as AxiosError).message)
			return {
				statusCode: (error as AxiosError).status ?? 0,
				errors: [(error as AxiosError).code ?? "???"],
			}
		}
	}

	async deleteAsync(id: string): Promise<IResultObject<null>> {
		try {

			const response = await this.axiosInstance.delete<null>(this.basePath + "/" + id)

			console.log('get response', response)

			if (response.status <= 300) {
				return {
					statusCode: response.status,
					data: null
				}
			}

			return {
				statusCode: response.status,
				errors: [(response.status.toString() + ' ' + response.statusText).trim()],
			}
		} catch (error) {
			console.log('error: ', (error as AxiosError).message)
			return {
				statusCode: (error as AxiosError).status ?? 0,
				errors: [(error as AxiosError).code ?? "???"],
			}
		}
	}

	async addAsync(entity: TAddEntity): Promise<IResultObject<TEntity>> {
		try {
			const response = await this.axiosInstance.post<TEntity>(this.basePath, entity)

			console.log('login response', response)

			if (response.status <= 300) {
				return {
					statusCode: response.status,
					data: response.data
				}
			}

			return {
				statusCode: response.status,
				errors: [(response.status.toString() + ' ' + response.statusText).trim()],
			}
		} catch (error) {
			console.log('error: ', (error as AxiosError).message)
			return {
				statusCode: (error as AxiosError).status ?? 0,
				errors: [(error as AxiosError).code ?? "???"],
			}
		}
	}

	async updateAsync(entity: TEntity): Promise<IResultObject<TEntity>> {
		try {
			const response = await this.axiosInstance.put<TEntity>(this.basePath + "/" + entity.id, entity)

			console.log('login response', response)

			if (response.status <= 300) {
				return {
					statusCode: response.status,
					data: response.data
				}
			}

			return {
				statusCode: response.status,
				errors: [(response.status.toString() + ' ' + response.statusText).trim()],
			}
		} catch (error) {
			console.log('error: ', (error as AxiosError).message)
			return {
				statusCode: (error as AxiosError).status ?? 0,
				errors: [(error as AxiosError).code ?? "???"],
			}
		}
	}
}
