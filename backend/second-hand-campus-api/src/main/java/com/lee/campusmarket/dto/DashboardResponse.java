package com.lee.campusmarket.dto;

import java.math.BigDecimal;

public record DashboardResponse(
        long userCount,
        long productCount,
        long pendingProductCount,
        long orderCount,
        BigDecimal paidAmount
) {
}

