import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';

declare const AXIOS_BASE: string;
declare const AXIOS_HEADERS: string;

/**
 * Subset of AxiosRequestConfig
 */
export type RequestConfig<TData = unknown> = {
    url?: string;
    method: 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE';
    params?: unknown;
    data?: TData;
    responseType?:
        | 'arraybuffer'
        | 'blob'
        | 'document'
        | 'json'
        | 'text'
        | 'stream';
    signal?: AbortSignal;
    headers?: AxiosRequestConfig['headers'];
};
/**
 * Subset of AxiosResponse
 */
export type ResponseConfig<TData = unknown> = {
    data: TData;
    status: number;
    statusText: string;
    headers?: AxiosResponse['headers'];
};

/**
 * Error response configuration
 */
export type ResponseErrorConfig<TError = unknown> = {
    error: TError;
    status?: number;
    statusText?: string;
};

export const axiosInstance = (baseURL: string) => {
    return axios.create({
        baseURL,
        withCredentials: true,
    });
};

/* export const client = async <TData, TError = unknown, TVariables = unknown>(
	config: RequestConfig<TVariables>,
): Promise<ResponseConfig<TData>> => {
	const axios = axiosInstance(config.url as string);

	const response = await axios.request<TVariables, ResponseConfig<TData>>({
		...config,
	});

	return response;
}; */

interface ErrorResponse {
    message: string;

}

export const client = async <TData, TVariables = unknown>(
    config: RequestConfig<TVariables>
): Promise<[ResponseConfig<TData> | null, ErrorResponse | null]> => {
    const axios = axiosInstance(config.url as string);

    try {
        const response = await axios.request<TVariables, ResponseConfig<TData>>(
            {
                ...config,
            }
        );
        return [response, null];
    } catch (e) {
        const error = e as AxiosError<ErrorResponse>;
		return [null, error.response?.data ?? { message: 'Unknown error' }];
    }
};

export default client;
