package com.lee.campusmarket.controller;

import com.lee.campusmarket.common.ApiResponse;
import com.lee.campusmarket.domain.Order;
import com.lee.campusmarket.domain.Product;
import com.lee.campusmarket.domain.User;
import com.lee.campusmarket.dto.AuditRequest;
import com.lee.campusmarket.dto.DashboardResponse;
import com.lee.campusmarket.dto.RejectRequest;
import com.lee.campusmarket.security.DemoTokenService;
import com.lee.campusmarket.service.MarketService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final MarketService market;
    private final DemoTokenService tokens;

    public AdminController(MarketService market, DemoTokenService tokens) {
        this.market = market;
        this.tokens = tokens;
    }

    @GetMapping("/dashboard")
    public ApiResponse<DashboardResponse> dashboard(@RequestHeader(value = "Authorization", required = false) String authorization) {
        requireAdmin(authorization);
        return ApiResponse.ok(market.dashboard());
    }

    @GetMapping("/users")
    public ApiResponse<List<User>> users(@RequestHeader(value = "Authorization", required = false) String authorization) {
        requireAdmin(authorization);
        return ApiResponse.ok(market.users());
    }

    @GetMapping("/products/pending")
    public ApiResponse<List<Product>> pending(@RequestHeader(value = "Authorization", required = false) String authorization) {
        requireAdmin(authorization);
        return ApiResponse.ok(market.products(null, null, null, "pending", 1, 100).items());
    }

    @GetMapping("/products")
    public ApiResponse<List<Product>> products(@RequestHeader(value = "Authorization", required = false) String authorization) {
        requireAdmin(authorization);
        return ApiResponse.ok(market.products(null, null, null, null, 1, 100).items());
    }

    @PostMapping("/products/{id}/approve")
    public ApiResponse<Product> approve(@RequestHeader(value = "Authorization", required = false) String authorization, @PathVariable Long id) {
        requireAdmin(authorization);
        return ApiResponse.ok(market.approveProduct(id));
    }

    @PostMapping("/products/{id}/audit")
    public ApiResponse<Product> audit(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long id,
            @Valid @RequestBody AuditRequest request
    ) {
        requireAdmin(authorization);
        if ("approve".equalsIgnoreCase(request.action())) {
            return ApiResponse.ok(market.approveProduct(id));
        }
        if ("reject".equalsIgnoreCase(request.action())) {
            return ApiResponse.ok(market.rejectProduct(id, request.reason()));
        }
        throw new com.lee.campusmarket.common.BusinessException("审核动作只能是 approve 或 reject");
    }

    @PostMapping("/products/{id}/reject")
    public ApiResponse<Product> reject(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long id,
            @Valid @RequestBody RejectRequest request
    ) {
        requireAdmin(authorization);
        return ApiResponse.ok(market.rejectProduct(id, request.reason()));
    }

    @GetMapping("/orders")
    public ApiResponse<List<Order>> orders(@RequestHeader(value = "Authorization", required = false) String authorization) {
        requireAdmin(authorization);
        return ApiResponse.ok(market.allOrders());
    }

    @GetMapping("/statistics")
    public ApiResponse<DashboardResponse> statistics(@RequestHeader(value = "Authorization", required = false) String authorization) {
        return dashboard(authorization);
    }

    private void requireAdmin(String authorization) {
        tokens.requireAdmin(authorization);
    }
}
