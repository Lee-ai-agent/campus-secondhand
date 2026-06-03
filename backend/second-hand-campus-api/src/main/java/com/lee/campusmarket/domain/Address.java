package com.lee.campusmarket.domain;

public record Address(
        Long id,
        Long userId,
        String receiverName,
        String phone,
        String detail,
        boolean defaultAddress
) {
}

