export interface ItemSearchCondition {
    name?: string;        // 품목 이름 (부분 일치)
    minPrice?: number;    // 최소 가격
    maxPrice?: number;    // 최대 가격
    sku?: string;         // SKU (정확 또는 부분 일치)
    categoryId?: number;  // 특정 카테고리 ID (Long -> number)
    centerName?: string;  // 물류 센터 이름
    zoneCode?: string;    // 구역 코드
    binCode?: string;     // 선반 코드
    minQuantity?: number; // 최소 재고 수량
}

export interface ItemSummaryResponse {
    itemId: number;
    itemName: string;
    sku: string;
    price: number;
    categoryName: string;

    inventoryId: number | null;
    quantity: number; 
    centerName: string;
    zoneCode: string;
    binCode: string;
}

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
