export interface LocationResponse {
    id: number;
    centerName: string;
    zone: string;
    binCode: string;
    active: boolean;
}

export interface LocationRequest {
    centerName: string;
    zone: string;
    binCode: string;
    isActive: boolean;
}

export interface ItemInLocationResponse {
    itemId: number;
    itemName: string;
    itemSku: string;
    quantity: number;
}


export interface LocationDetailResponse extends LocationResponse {
    inventoryList: ItemInLocationResponse[];
}


