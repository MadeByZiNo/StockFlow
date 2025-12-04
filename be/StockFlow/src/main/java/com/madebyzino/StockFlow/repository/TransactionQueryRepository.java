package com.madebyzino.StockFlow.repository;

import com.madebyzino.StockFlow.dto.transaction.TransactionHistoryResponse;
import com.madebyzino.StockFlow.dto.transaction.TransactionSearchCondition;
import com.madebyzino.StockFlow.repository.mapper.TransactionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class TransactionQueryRepository {
    private final TransactionMapper transactionMapper;

    public Page<TransactionHistoryResponse> searchTransactions(TransactionSearchCondition condition, Pageable pageable) {

        List<TransactionHistoryResponse> content = transactionMapper.searchTransactions(
                condition,
                pageable.getPageSize(),
                pageable.getOffset()
        );

        long total;

        if (content.size() < pageable.getPageSize() && pageable.getOffset() == 0) {
            total = content.size();
        } else {
            total = transactionMapper.countTransactions(condition);
        }

        return new PageImpl<>(content, pageable, total);
    }
}