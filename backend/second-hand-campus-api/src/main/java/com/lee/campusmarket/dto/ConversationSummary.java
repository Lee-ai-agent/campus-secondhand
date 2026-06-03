package com.lee.campusmarket.dto;

import java.time.LocalDateTime;

public record ConversationSummary(
        Long conversationId,
        Long senderId,
        Long receiverId,
        Long productId,
        Long wantedId,
        Long orderId,
        String relatedType,
        String title,
        String content,
        String readStatus,
        String status,
        LocalDateTime createdAt
) {
}
