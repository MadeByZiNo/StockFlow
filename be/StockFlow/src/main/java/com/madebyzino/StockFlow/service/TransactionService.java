package com.madebyzino.StockFlow.service;

import com.madebyzino.StockFlow.dto.transaction.TransactionHistoryResponse;
import com.madebyzino.StockFlow.dto.transaction.TransactionSearchCondition;
import com.madebyzino.StockFlow.repository.TransactionQueryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionQueryRepository transactionQueryRepository;

    public Page<TransactionHistoryResponse> searchTransactionHistory(TransactionSearchCondition condition, Pageable pageable) {
        return transactionQueryRepository.searchTransactions(condition, pageable);
    }
}