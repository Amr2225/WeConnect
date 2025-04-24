import { AuthResponse, LoginCredentials, RegisterCredentials, UpdateProfileData, Post } from '../types';
import { refreshToken } from './authService';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

export const api = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                console.log("Getting new access token")
                const { accessToken } = await refreshToken();
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (error) {
                // If refresh token fails, redirect to login
                console.log("Refresh Token Expired")
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export const authService = {
    register: (data: RegisterCredentials) => axios.post<AuthResponse>(`${baseURL}/auth/register`, data),
    login: (data: LoginCredentials) => axios.post<AuthResponse>(`${baseURL}/auth/login`, data),
    getProfile: () => api.get('/users/me'),
    updateProfile: (data: UpdateProfileData) => api.patch('/users/me', data),
};

interface CreatePostData {
    content: string;
    author: {
        name: string;
        avatar: string;
    };
}

export const postService = {
    getPosts: () => api.get<Post[]>('/posts'),
    createPost: (data: CreatePostData) => api.post<Post>('/posts', data),
    likePost: (postId: string) => api.post<Post>(`/posts/${postId}/like`),
    deletePost: (postId: string) => api.delete(`/posts/${postId}`),
};

export default api; 