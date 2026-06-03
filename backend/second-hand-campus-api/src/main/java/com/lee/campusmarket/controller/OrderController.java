package com.lee.campusmarket.controller;

import com.lee.campusmarket.common.ApiResponse;
import com.lee.campusmarket.domain.Order;
import com.lee.campusmarket.dto.CreateOrderRequest;
import com.lee.campusmarket.dto.ShipOrderRequest;
import com.lee.campusmarket.security.DemoTokenService;
import com.lee.campusmarket.service.MarketService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class OrderController {
    private final MarketService market;
    private final DemoTokenService tokens;

    public OrderController(MarketService market, DemoTokenService tokens) {
        this.market = market;
        this.tokens = tokens;
    }

    @PostMapping("/orders")
    public ApiResponse<Order> create(@RequestHeader(value = "Authorization", required = false) String authorization, @Valid @RequestBody CreateOrderRequest request) {
        tokens.requireUserId(authorization, request.buyerId());
        return ApiResponse.ok(market.createOrder(request));
    }

    @PostMapping("/orders/direct")
    public ApiResponse<Order> direct(@RequestHeader(value = "Authorization", required = false) String authorization, @Valid @RequestBody CreateOrderRequest request) {
        return create(authorization, request);
    }

    @GetMapping("/orders")
    public ApiResponse<List<Order>> buyerOrders(@RequestHeader(value = "Authorization", required = false) String authorization, @RequestParam Long buyerId) {
        tokens.requireUserId(authorization, buyerId);
        return ApiResponse.ok(market.buyerOrders(buyerId));
    }

    @GetMapping("/orders/{id}")
    public ApiResponse<Order> detail(@RequestHeader(value = "Authorization", required = false) String authorization, @PathVariable Long id, @RequestParam Long userId) {
        tokens.requireUserId(authorization, userId);
        return ApiResponse.ok(market.order(id, userId));
    }

    @GetMapping("/seller/orders")
    public ApiResponse<List<Order>> sellerOrders(@RequestHeader(value = "Authorization", required = false) String authorization, @RequestParam Long sellerId) {
        tokens.requireUserId(authorization, sellerId);
        return ApiResponse.ok(market.sellerOrders(sellerId));
    }

    @PostMapping("/orders/{id}/pay")
    public ApiResponse<Order> payPost(@RequestHeader(value = "Authorization", required = false) String authorization, @PathVariable Long id, @RequestParam Long buyerId) {
        return pay(authorization, id, buyerId);
    }

    @PutMapping("/orders/{id}/pay")
    public ApiResponse<Order> pay(@RequestHeader(value = "Authorization", required = false) String authorization, @PathVariable Long id, @RequestParam Long buyerId) {
        tokens.requireUserId(authorization, buyerId);
        return ApiResponse.ok(market.payOrder(id, buyerId));
    }

    @PostMapping("/orders/{id}/ship")
    public ApiResponse<Order> shipPost(@RequestHeader(value = "Authorization", required = false) String authorization, @PathVariable Long id, @RequestParam Long sellerId, @Valid @RequestBody ShipOrderRequest request) {
        return ship(authorization, id, sellerId, request);
    }

    @PutMapping("/seller/orders/{id}/ship")
    public ApiResponse<Order> ship(@RequestHeader(value = "Authorization", required = false) String authorization, @PathVariable Long id, @RequestParam Long sellerId, @Valid @RequestBody ShipOrderRequest request) {
        tokens.requireUserId(authorization, sellerId);
        return ApiResponse.ok(market.shipOrder(id, sellerId, request));
    }

    @PostMapping("/orders/{id}/receive")
    public ApiResponse<Order> receive(@RequestHeader(value = "Authorization", required = false) String authorization, @PathVariable Long id, @RequestParam Long buyerId) {
        return confirm(authorization, id, buyerId);
    }

    @PutMapping("/orders/{id}/confirm")
    public ApiResponse<Order> confirm(@RequestHeader(value = "Authorization", required = false) String authorization, @PathVariable Long id, @RequestParam Long buyerId) {
        tokens.requireUserId(authorization, buyerId);
        return ApiResponse.ok(market.confirmOrder(id, buyerId));
    }

    @PostMapping("/orders/{id}/cancel")
    public ApiResponse<Order> cancelPost(@RequestHeader(value = "Authorization", required = false) String authorization, @PathVariable Long id, @RequestParam Long buyerId) {
        return cancel(authorization, id, buyerId);
    }

    @PutMapping("/orders/{id}/cancel")
    public ApiResponse<Order> cancel(@RequestHeader(value = "Authorization", required = false) String authorization, @PathVariable Long id, @RequestParam Long buyerId) {
        tokens.requireUserId(authorization, buyerId);
        return ApiResponse.ok(market.cancelOrder(id, buyerId));
    }
}
