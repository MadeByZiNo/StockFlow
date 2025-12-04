// types/item.ts

export interface ItemSearchCondition {
    name?: string;        // 품목 이름 (부분 일치)
    minPrice?: number;    // 최소 가격
    maxPrice?: number;    // 최대 가격
    sku?: string;         // SKU (정확 또는 부분 일치)
    categoryId?: number;  // 특정 카테고리 ID (Long -> number)
    minQuantity?: number; // 최소 재고 수량
}

export interface ItemSummaryResponse {
    itemId: number;
    itemName: string;
    sku: string;
    price: number;
    categoryName: string;
    quantity: number;
}

// 💡 나머지 DTO는 유지합니다.
export interface ItemRegistrationRequest {
    name: string;
    sku: string;
    price: number;
    safetyStock: number;
    categoryId: number;
}


export interface ItemResponse {
    id: number;
    name: string;
    sku: string;
    safetyStock: number;
    price: number;
    categoryName: string; 
    categoryId: number; 
}