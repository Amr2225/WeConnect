export interface User {
    _id: string;
    name: string;
    email: string;
    role: "user" | "admin";
}

export interface Post {
    _id: string;
    content: string;
    author: {
        id: string;
        name: string;
        email: string;
    };
    createdAt: string;
    likes: { name: string, _id: string }[];
    likeCount: number;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    name: string;
}

export interface UpdateProfileData {
    [key: string]: unknown;
    name?: string;
    email?: string;
}

export interface CreatePostData {
    [key: string]: unknown;
    content: string;
    author: {
        id: string;
        name: string;
        email: string;
    };
} 