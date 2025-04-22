export interface User {
    id: string;
    name: string;
    email: string;
    profilePicture?: string;
}

export interface Post {
    id: string;
    content: string;
    encryptedContent?: string;
    images?: string[];
    author: {
        id: string;
        name: string;
        email: string;
    };
    createdAt: string;
    likes: string[];
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
    profilePicture?: File;
}

export interface UpdateProfileData {
    [key: string]: unknown;
    name?: string;
    email?: string;
    profilePicture?: File;
}

export interface CreatePostData {
    [key: string]: unknown;
    content: string;
    images?: File[];
    author: {
        id: string;
        name: string;
        email: string;
    };
} 