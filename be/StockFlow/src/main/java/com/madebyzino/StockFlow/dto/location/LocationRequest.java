package com.madebyzino.StockFlow.dto.location;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class LocationRequest {

    @NotBlank(message = "센터 이름은 필수입니다.")
    @Size(max = 50)
    private String centerName;

    @NotBlank(message = "구역 정보는 필수입니다.")
    @Size(max = 30)
    private String zone;

    @NotBlank(message = "선반 코드는 필수입니다.")
    @Size(max = 30)
    private String binCode;

    @NotNull(message = "활성화 상태는 필수입니다.")
    private Boolean isActive;
}