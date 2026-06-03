package com.lee.campusmarket.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AddressRequest(
        @NotNull Long userId,
        @NotBlank String receiverName,
        @NotBlank String phone,
        @NotBlank String detail,
        boolean defaultAddress
) {
}

