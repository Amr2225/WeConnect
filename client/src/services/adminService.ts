import { api } from "./api";

interface UserStats {
    id: string;
    name: string;
    email: string;
    postCount: number;
}
export const getUsers = async (): Promise<UserStats[]> => {
    const response = await api.get('/admin/users');
    return response.data;
};



