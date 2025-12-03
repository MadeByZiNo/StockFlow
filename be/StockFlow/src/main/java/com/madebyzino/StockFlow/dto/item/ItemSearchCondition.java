package com.madebyzino.StockFlow.dto.item;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemSearchCondition {

    private String name;        // 품목 이름 (부분 일치)
    private Integer minPrice;   // 최소 가격
    private Integer maxPrice;   // 최대 가격
    private String sku;         // SKU (정확 또는 부분 일치)

    private Long categoryId;    // 특정 카테고리 ID

    private String centerName;  // 물류 센터 이름 (Location.centerName)
    private String zoneCode;    // 구역 코드 (Location.zoneCode)
    private String binCode;     // 선반 코드 (Location.binCode)
    private Integer minQuantity; // 최소 재고 수량 (Inventory.quantity)
}