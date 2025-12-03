package com.madebyzino.StockFlow.dto.item;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemSummaryResponse {

    // Item 정보
    private Long itemId;
    private String itemName;
    private String sku;
    private int price;
    private String categoryName;

    // 재고 위치 정보
    private Long inventoryId;
    private int quantity;
    private String centerName;
    private String zoneCode;
    private String binCode;
}