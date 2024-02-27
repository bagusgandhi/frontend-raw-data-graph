import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const fetchData = async (endpoint: string, params: Record<string, string | undefined>) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${endpoint}`, {
            params
        });
        return response.data;

    } catch (error) {
        throw error;
    }
};

export const postData = async (endpoint: string, data: FormData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/${endpoint}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;

    } catch (error) {
        throw error;

    }
};
