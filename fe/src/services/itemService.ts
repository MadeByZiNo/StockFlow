
import api from "./api"; 
import { 
    ItemSummaryResponse, 
    ItemRegistrationRequest, 
    ItemSearchCondition,
    ItemResponse
} from '../types/item'; 
import { PageResponse } from '../types/page';
import { Category } from '../types/category'; 

export const itemService = {

    // 1. 품목 목록 검색 및 조회 (ItemSearchCondition 사용)
    async searchItems(
        condition: ItemSearchCondition, 
        page: number = 0, 
        size: number = 10
    ): Promise<PageResponse<ItemSummaryResponse>> {
        console.log("ㅎㅇ");
        const response = await api.get<PageResponse<ItemSummaryResponse>>(`/api/items/search`, {
            params: { ...condition, page, size, sort: 'itemName,asc' }
        });
        return response.data;
    },
    
    // 2. 품목 등록
    async registerItem(data: ItemRegistrationRequest): Promise<ItemResponse> {
        const response = await api.post<ItemResponse>('/api/items', data);
        return response.data;
    },

    // 3. 품목 수정
    async updateItem(id: number, data: ItemRegistrationRequest): Promise<ItemResponse> {
        const response = await api.put<ItemResponse>(`/api/items/${id}`, data);
        return response.data;
    },

    // 4. 품목 삭제
    async deleteItem(id: number): Promise<void> {
        await api.delete(`/api/items/${id}`);
    },

    async getItem(id: number): Promise<ItemResponse> {
        const response = await api.get<ItemResponse>(`/api/items/${id}`);
        return response.data;
    },
};