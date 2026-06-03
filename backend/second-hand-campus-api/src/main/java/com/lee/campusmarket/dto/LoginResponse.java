package com.lee.campusmarket.dto;

public record LoginResponse(String token, Long userId, String nickname, String role) {
}

