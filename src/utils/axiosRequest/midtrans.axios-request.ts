import { AxiosInstance } from "axios";

export class MidtransAxiosRequest<T> {
    constructor(
        private readonly axiosClient: AxiosInstance
    ) {}
    
    async fetchData(path: string) {
        const response = await this.axiosClient.get<T>(path);
        return response.data;
    }

    async postData(path: string, payload: T) {
        const response = await this.axiosClient.post<T>(path, payload)
        return response.data;
    }
}