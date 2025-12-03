package com.madebyzino.StockFlow.dto.location;

import com.madebyzino.StockFlow.entity.Location;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LocationResponse {
    private final Long id;
    private final String centerName;
    private final String zone;
    private final String binCode;
    private final boolean isActive;

    public static LocationResponse of(Location location) {
        return LocationResponse.builder()
                .id(location.getId())
                .centerName(location.getCenterName())
                .zone(location.getZone())
                .binCode(location.getBinCode())
                .isActive(location.isActive())
                .build();
    }
}