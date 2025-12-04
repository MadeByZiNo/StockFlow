package com.madebyzino.StockFlow.web;

import com.madebyzino.StockFlow.dto.transaction.TransactionHistoryResponse;
import com.madebyzino.StockFlow.dto.transaction.TransactionSearchCondition;
import com.madebyzino.StockFlow.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping("/history")
    public ResponseEntity<Page<TransactionHistoryResponse>> getTransactionHistory(
            TransactionSearchCondition condition,
            @PageableDefault(size = 20, sort = "transactionDate", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable)
    {
        Page<TransactionHistoryResponse> result = transactionService.searchTransactionHistory(condition, pageable);
        return ResponseEntity.ok(result);
    }
}