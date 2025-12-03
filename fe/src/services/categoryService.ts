import api from "./api";
import { Category, CategoryRequest } from '../types/category';
import { PageResponse } from '../types/page';

export const categoryService = {

    async fetchAllCategories(page: number = 0, size: number = 100): Promise<PageResponse<Category>> {
        const response = await api.get<PageResponse<Category>>(`/api/categories`, {
            params: { page, size, sort: 'name,asc' }
        });
        return response.data;
    },

    async createCategory(data: CategoryRequest): Promise<Category> {
        const response = await api.post<Category>('/api/categories', data);
        return response.data;
    },

    async updateCategory(id: number, data: CategoryRequest): Promise<Category> {
        const response = await api.put<Category>(`/api/categories/${id}`, data);
        return response.data;
    }
};