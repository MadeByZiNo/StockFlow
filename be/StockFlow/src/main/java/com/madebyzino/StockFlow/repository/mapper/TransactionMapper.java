package com.madebyzino.StockFlow.repository.mapper;

import com.madebyzino.StockFlow.dto.transaction.TransactionHistoryResponse;
import com.madebyzino.StockFlow.dto.transaction.TransactionSearchCondition;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TransactionMapper {

    List<TransactionHistoryResponse> searchTransactions(
            @Param("cond") TransactionSearchCondition condition,
            @Param("limit") int limit,
            @Param("offset") long offset
    );

    long countTransactions(@Param("cond") TransactionSearchCondition condition);
}