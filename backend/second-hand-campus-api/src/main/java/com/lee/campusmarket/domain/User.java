package com.lee.campusmarket.domain;

public record User(
        Long id,
        String username,
        String password,
        String nickname,
        String phone,
        String role,
        String status
) {
}

