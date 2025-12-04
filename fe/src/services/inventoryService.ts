import api from "./api";
import { PageResponse } from '../types/page';
import { InventorySearchCondition, InventorySummaryResponse
    ,AdjustmentRequest, MovementRequest
 } from '../types/inventory';

export const inventoryService = {
    searchInventoryStatus: async (
        condition: InventorySearchCondition,
        page: number,
        size: number
    ): Promise<PageResponse<InventorySummaryResponse>> => {
        const response = await api.get(`api/inventory/status`, {
            params: { 
                ...condition, 
                page, 
                size 
            },
        });
        return response.data;
    },

  requestAdjustment: async (data: AdjustmentRequest): Promise<void> => {
        try {
            const response = await api.post(`api/inventory/adjust`, data); 
        } catch (error) {
            if (error && (error as any).response) { 
                throw new Error(`재고 조정 실패: ${(error as any).response.data.message || '요청 처리 중 오류 발생'}`);
            }
            throw new Error('네트워크 연결 또는 서버 응답 오류');
        }
    },

    requestMovement: async (data: MovementRequest): Promise<void> => {
        try {
            const response = await api.post(`api/inventory/move`, data);
            
        } catch (error) {
            if ((error as any).response) { 
                const message = (error as any).response.data.message || '요청 처리 중 오류 발생';
                throw new Error(`재고 이동 실패: ${message}`);
            }
            throw new Error('네트워크 연결 또는 서버 응답 오류');
        }
    },
};