package com.lee.campusmarket.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateOrderRequest(
        @NotNull Long buyerId,
        @NotNull Long productId,
        @Min(1) int quantity,
        @NotBlank String receiverName,
        @NotBlank String receiverPhone,
        @NotBlank String receiverAddress
) {
}

