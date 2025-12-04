package com.madebyzino.StockFlow.dto.transaction;

import com.madebyzino.StockFlow.entity.Transaction.TransactionType;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Data
public class TransactionSearchCondition {

    private TransactionType type;
    private Long itemId;
    private String itemSku;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime startDate;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime endDate;

    private String username;

    private String fromLocationBinCode;
    private String toLocationBinCode;
}