package com.madebyzino.StockFlow.dto.inventory;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventorySearchCondition {
    private String name;
    private Integer minPrice;
    private Integer maxPrice;
    private String sku;

    private Long categoryId;    // 특정 카테고리 ID

    private String centerName;
    private String zoneCode;
    private String binCode;

    private Integer minQuantity;
}