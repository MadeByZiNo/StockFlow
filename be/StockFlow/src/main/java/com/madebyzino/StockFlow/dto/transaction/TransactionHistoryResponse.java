package com.madebyzino.StockFlow.dto.transaction;

import com.madebyzino.StockFlow.entity.Transaction.TransactionType;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionHistoryResponse {
    private Long transactionId;

    // Item 정보
    private Long itemId;
    private String itemName;
    private String itemSku;

    // Location 정보
    private String fromBinCode;
    private String fromCenterName;
    private String toBinCode;
    private String toCenterName;

    // Transaction Details
    private TransactionType type;
    private int quantity;
    private LocalDateTime transactionDate;

    // 작업자 정보
    private Long userId;
    private String username;

    private String notes;
}