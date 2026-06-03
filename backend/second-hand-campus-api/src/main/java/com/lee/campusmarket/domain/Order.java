package com.lee.campusmarket.domain;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record Order(
        Long id,
        String orderNo,
        Long buyerId,
        Long sellerId,
        Long productId,
        int quantity,
        BigDecimal totalAmount,
        String status,
        String paymentStatus,
        String receiverName,
        String receiverPhone,
        String receiverAddress,
        String shipType,
        String logisticsNo,
        String pickupRemark,
        LocalDateTime createdAt
) {
    public Order withStatus(String nextStatus, String nextPaymentStatus) {
        return new Order(id, orderNo, buyerId, sellerId, productId, quantity, totalAmount, nextStatus,
                nextPaymentStatus, receiverName, receiverPhone, receiverAddress, shipType,
                logisticsNo, pickupRemark, createdAt);
    }

    public Order withShipping(String nextStatus, String method, String tracking, String note) {
        return new Order(id, orderNo, buyerId, sellerId, productId, quantity, totalAmount, nextStatus,
                paymentStatus, receiverName, receiverPhone, receiverAddress, method, tracking, note, createdAt);
    }
}
