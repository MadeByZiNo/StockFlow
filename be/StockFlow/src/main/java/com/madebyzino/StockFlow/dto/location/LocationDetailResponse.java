package com.madebyzino.StockFlow.dto.location;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class LocationDetailResponse {
    private final Long id;
    private final String centerName;
    private final String zone;
    private final String binCode;
    private final boolean isActive;

    private final List<ItemInLocationResponse> inventoryList;
}