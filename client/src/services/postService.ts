import { api } from './api';
import { Post, CreatePostData } from '../types';
import { decryptContent } from '../utils/crypto';

export const getPosts = async (): Promise<Post[]> => {
    const response = await api.get<Post[]>('/posts');
    return response.data.map(post => ({
        ...post,
        content: post.encryptedContent ? decryptContent(post.encryptedContent) : post.content
    }));
};

export const createPost = async (data: CreatePostData): Promise<Post> => {
    const response = await api.post<Post>('/posts', data);
    return {
        ...response.data,
        content: response.data.encryptedContent ? decryptContent(response.data.encryptedContent) : response.data.content
    };
};

export const likePost = async (postId: string): Promise<Post> => {
    const response = await api.post<Post>(`/posts/${postId}/like`);
    return {
        ...response.data,
        content: response.data.encryptedContent ? decryptContent(response.data.encryptedContent) : response.data.content
    };
};

export const deletePost = async (postId: string): Promise<void> => {
    await api.delete(`/posts/${postId}`);
}; 