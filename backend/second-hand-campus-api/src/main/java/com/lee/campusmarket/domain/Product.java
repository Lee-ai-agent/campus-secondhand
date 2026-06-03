package com.lee.campusmarket.domain;

import java.math.BigDecimal;
import java.util.List;

public record Product(
        Long id,
        Long sellerId,
        Long categoryId,
        String title,
        String description,
        BigDecimal price,
        String conditionLevel,
        String pickupLocation,
        String status,
        String auditReason,
        List<String> images
) {
    public Product withStatus(String nextStatus, String reason) {
        return new Product(id, sellerId, categoryId, title, description, price, conditionLevel,
                pickupLocation, nextStatus, reason, images);
    }
}

