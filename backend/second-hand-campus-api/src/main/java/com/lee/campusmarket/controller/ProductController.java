package com.lee.campusmarket.controller;

import com.lee.campusmarket.common.ApiResponse;
import com.lee.campusmarket.common.PageResult;
import com.lee.campusmarket.domain.Category;
import com.lee.campusmarket.domain.Product;
import com.lee.campusmarket.dto.ProductRequest;
import com.lee.campusmarket.security.DemoTokenService;
import com.lee.campusmarket.service.MarketService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProductController {
    private final MarketService market;
    private final DemoTokenService tokens;

    public ProductController(MarketService market, DemoTokenService tokens) {
        this.market = market;
        this.tokens = tokens;
    }

    @GetMapping("/categories")
    public ApiResponse<List<Category>> categories() {
        return ApiResponse.ok(market.categories());
    }

    @GetMapping("/products")
    public ApiResponse<PageResult<Product>> products(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long sellerId,
            @RequestParam(defaultValue = "approved") String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize
    ) {
        return ApiResponse.ok(market.products(keyword, categoryId, sellerId, status, page, pageSize));
    }

    @GetMapping("/products/{id}")
    public ApiResponse<Product> product(@PathVariable Long id) {
        return ApiResponse.ok(market.product(id));
    }

    @PostMapping("/products")
    public ApiResponse<Product> create(@RequestHeader(value = "Authorization", required = false) String authorization, @Valid @RequestBody ProductRequest request) {
        tokens.requireUserId(authorization, request.sellerId());
        return ApiResponse.ok(market.createProduct(request));
    }

    @PostMapping("/seller/products")
    public ApiResponse<Product> sellerCreate(@RequestHeader(value = "Authorization", required = false) String authorization, @Valid @RequestBody ProductRequest request) {
        return create(authorization, request);
    }

    @PutMapping("/seller/products/{id}")
    public ApiResponse<Product> sellerUpdate(@RequestHeader(value = "Authorization", required = false) String authorization, @PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        tokens.requireUserId(authorization, request.sellerId());
        return ApiResponse.ok(market.updateProduct(id, request));
    }

    @PutMapping("/seller/products/{id}/offline")
    public ApiResponse<Product> offline(@RequestHeader(value = "Authorization", required = false) String authorization, @PathVariable Long id, @RequestParam Long sellerId) {
        tokens.requireUserId(authorization, sellerId);
        return ApiResponse.ok(market.offlineProduct(id, sellerId));
    }
}
