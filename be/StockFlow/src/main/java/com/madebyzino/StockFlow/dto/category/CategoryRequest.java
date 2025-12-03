package com.madebyzino.StockFlow.dto.category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class CategoryRequest {

    @NotBlank(message = "카테고리 이름은 필수입니다.")
    @Size(max = 50, message = "이름은 50자 이내여야 합니다.")
    private String name;

    @Size(max = 255, message = "설명은 255자 이내여야 합니다.")
    private String description;

    @Size(max = 255, message = "코드는은 12자 이내여야 합니다.")
    private String code;
}