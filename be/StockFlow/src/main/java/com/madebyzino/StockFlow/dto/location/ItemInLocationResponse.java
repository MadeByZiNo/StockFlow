package com.madebyzino.StockFlow.dto.location;

import com.madebyzino.StockFlow.entity.Inventory;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ItemInLocationResponse {
    private final Long itemId;
    private final String itemName;
    private final String itemSku;
    private final int quantity;

    public static ItemInLocationResponse of(Inventory inventory) {
        return ItemInLocationResponse.builder()
                .itemId(inventory.getItem().getId())
                .itemName(inventory.getItem().getName())
                .itemSku(inventory.getItem().getSku())
                .quantity(inventory.getQuantity())
                .build();
    }
}