package com.lee.campusmarket.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record WantedRequest(
        @NotNull Long userId,
        @NotBlank String title,
        @NotNull @DecimalMin("0") BigDecimal minPrice,
        @NotNull @DecimalMin("0") BigDecimal maxPrice,
        @NotBlank String conditionLevel,
        @NotBlank String description
) {
}
