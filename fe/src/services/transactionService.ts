import api from "./api"; 
import { PageResponse } from '../types/page';
import { TransactionSearchCondition, TransactionHistoryResponse } from '../types/transaction';

export const transactionService = {
    searchTransactionHistory: async (
        condition: TransactionSearchCondition,
        page: number,
        size: number
    ): Promise<PageResponse<TransactionHistoryResponse>> => {
        const response = await api.get(`/api/transactions/history`, {
            params: {
                ...condition, 
                page, 
                size,
            },
        });
        return response.data;
    },
};