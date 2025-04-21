import axios, { AxiosInstance, AxiosRequestHeaders } from "axios"

export const axiosInit = (baseUrl: string, headers: AxiosRequestHeaders): AxiosInstance => {
    return axios.create({
        baseURL: baseUrl,
        headers
    })
}