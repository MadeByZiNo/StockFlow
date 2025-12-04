package com.madebyzino.StockFlow.dto.item;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemSummaryResponse {

    private Long itemId;
    private String itemName;
    private String sku;
    private int price;
    private String categoryName;
    private int quantity;

}