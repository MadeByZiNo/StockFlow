export type TransactionType = 'INBOUND' | 'OUTBOUND' | 'MOVEMENT' | 'ADJUSTMENT';


export interface TransactionSearchCondition {
    type?: TransactionType;
    itemId?: number;
    itemSku?: string;
    startDate?: string;
    endDate?: string;  
    username?: string;  // 작업자 이름 검색
    fromLocationBinCode?: string;
    toLocationBinCode?: string;
}


export interface TransactionHistoryResponse {
    transactionId: number;
    
    itemId: number;
    itemName: string;
    itemSku: string;

    fromBinCode: string | null;
    fromCenterName: string | null;
    toBinCode: string | null;
    toCenterName: string | null;
    
    type: TransactionType;
    quantity: number;
    transactionDate: string; 
    userId: number; 
    username: string;
    notes: string | null;
}