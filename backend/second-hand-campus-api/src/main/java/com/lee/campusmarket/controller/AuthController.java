package com.lee.campusmarket.controller;

import com.lee.campusmarket.common.ApiResponse;
import com.lee.campusmarket.dto.LoginRequest;
import com.lee.campusmarket.dto.LoginResponse;
import com.lee.campusmarket.service.MarketService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final MarketService market;

    public AuthController(MarketService market) {
        this.market = market;
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.ok(market.login(request));
    }
}

