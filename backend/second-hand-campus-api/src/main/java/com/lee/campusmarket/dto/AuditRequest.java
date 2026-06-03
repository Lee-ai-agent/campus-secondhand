package com.lee.campusmarket.dto;

import jakarta.validation.constraints.NotBlank;

public record AuditRequest(@NotBlank String action, String reason) {
}
