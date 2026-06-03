package com.lee.campusmarket.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public record ProductRequest(
        @NotNull Long sellerId,
        @NotNull Long categoryId,
        @NotBlank String title,
        @NotBlank String description,
        @NotNull @DecimalMin("0.01") BigDecimal price,
        @NotBlank String conditionLevel,
        @NotBlank String pickupLocation,
        List<String> images
) {
}
