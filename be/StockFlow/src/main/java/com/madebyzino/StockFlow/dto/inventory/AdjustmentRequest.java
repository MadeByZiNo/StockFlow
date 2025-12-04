package com.madebyzino.StockFlow.dto.inventory;

import lombok.Data;

@Data
public class AdjustmentRequest {
    private Long inventoryId;
    private int adjustmentQuantity;
    private String notes;
}