package com.lee.campusmarket.domain;

import java.time.LocalDateTime;

public record Message(
        Long id,
        Long conversationId,
        Long senderId,
        Long receiverId,
        String relatedType,
        Long productId,
        Long wantedId,
        Long orderId,
        String messageType,
        String content,
        String readStatus,
        String status,
        LocalDateTime createdAt
) {
}
