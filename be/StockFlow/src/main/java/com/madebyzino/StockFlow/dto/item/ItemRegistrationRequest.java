package com.madebyzino.StockFlow.dto.item;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class ItemRegistrationRequest {

    @NotBlank(message = "상품 이름은 필수입니다.")
    @Size(max = 50, message = "이름은 50자 이내여야 합니다.")
    String name;

    int safetyStock;

    @NotBlank(message = "카테고리는 필수입니다.")
    Long categoryId;

    @NotBlank(message = "가격은 필수입니다.")
    @Min(0)
    int price;
}
