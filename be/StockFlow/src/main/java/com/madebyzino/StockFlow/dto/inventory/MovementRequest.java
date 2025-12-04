package com.madebyzino.StockFlow.dto.inventory;

import lombok.Data;

@Data
public class MovementRequest {
    private Long itemId;
    private String fromBinCode;
    private String toBinCode;
    private int quantity;
    private String notes;
}