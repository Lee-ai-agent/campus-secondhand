package com.lee.campusmarket.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MessageRequest(
        Long conversationId,
        @NotNull Long senderId,
        @NotNull Long receiverId,
        String relatedType,
        Long productId,
        Long wantedId,
        Long orderId,
        String messageType,
        @NotBlank String content
) {
}
