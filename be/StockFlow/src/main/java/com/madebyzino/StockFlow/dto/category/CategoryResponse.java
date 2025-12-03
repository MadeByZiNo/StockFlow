package com.madebyzino.StockFlow.dto.category;

import com.madebyzino.StockFlow.entity.Category;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CategoryResponse {
    private final Long id;
    private final String name;
    private final String description;
    private final String code;

    public static CategoryResponse of(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .code(category.getCode())
                .build();
    }
}