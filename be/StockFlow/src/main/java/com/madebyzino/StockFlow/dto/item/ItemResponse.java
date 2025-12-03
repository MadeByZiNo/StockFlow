package com.madebyzino.StockFlow.dto.item;

import com.madebyzino.StockFlow.entity.Item;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ItemResponse {
    private Long id;
    private String name;
    private String sku;
    private int safetyStock;
    private int price;
    private String categoryName;

    public static ItemResponse from(Item item) {
        return new ItemResponse(
                item.getId(),
                item.getName(),
                item.getSku(),
                item.getSafetyStock(),
                item.getPrice(),
                item.getCategory().getName()
        );
    }
}
