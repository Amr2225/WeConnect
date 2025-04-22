import { api } from './api';
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '../types';
import axios from 'axios';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        const { accessToken, refreshToken } = response.data;

        // Store tokens
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
        throw error;
    }
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
        const formData = new FormData();
        formData.append('name', credentials.name);
        formData.append('email', credentials.email);
        formData.append('password', credentials.password);

        if (credentials.profilePicture) {
            formData.append('profilePicture', credentials.profilePicture);
        }

        const response = await api.post<AuthResponse>('/auth/register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const { accessToken, refreshToken } = response.data;

        // Store tokens
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
        throw error;
    }
};

export const updateProfile = async (formData: FormData): Promise<User> => {
    try {
        const response = await api.patch('/api/users/me', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to update profile';
            throw new Error(errorMessage);
        }
        throw error;
    }
};

export const refreshToken = async (): Promise<{ accessToken: string }> => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error('No refresh token found');
        }

        const response = await api.post<{ accessToken: string }>('/auth/refresh', { refreshToken });
        const { accessToken } = response.data;

        localStorage.setItem('token', accessToken);
        return { accessToken };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Token refresh failed');
        }
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
}; 