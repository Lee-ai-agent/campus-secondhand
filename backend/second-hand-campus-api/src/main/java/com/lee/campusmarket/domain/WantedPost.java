package com.lee.campusmarket.domain;

import java.math.BigDecimal;

public record WantedPost(
        Long id,
        Long userId,
        String title,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        String conditionLevel,
        String description,
        String status
) {
}

