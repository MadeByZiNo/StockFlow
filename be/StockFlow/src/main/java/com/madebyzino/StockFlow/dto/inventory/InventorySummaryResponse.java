package com.madebyzino.StockFlow.dto.inventory;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventorySummaryResponse {
    private Long itemId;
    private String itemName;
    private String sku;
    private int price;
    private String categoryName;

    private Long inventoryId;
    private int quantity;
    private String centerName;
    private String zoneCode;
    private String binCode;
}