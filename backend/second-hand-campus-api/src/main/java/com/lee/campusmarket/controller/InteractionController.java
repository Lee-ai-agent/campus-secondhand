package com.lee.campusmarket.controller;

import com.lee.campusmarket.common.ApiResponse;
import com.lee.campusmarket.domain.Address;
import com.lee.campusmarket.domain.Message;
import com.lee.campusmarket.domain.Order;
import com.lee.campusmarket.domain.WantedPost;
import com.lee.campusmarket.dto.AddressRequest;
import com.lee.campusmarket.dto.ConversationSummary;
import com.lee.campusmarket.dto.CreateOrderRequest;
import com.lee.campusmarket.dto.MessageRequest;
import com.lee.campusmarket.dto.WantedRequest;
import com.lee.campusmarket.security.DemoTokenService;
import com.lee.campusmarket.service.MarketService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class InteractionController {
    private final MarketService market;
    private final DemoTokenService tokens;

    public InteractionController(MarketService market, DemoTokenService tokens) {
        this.market = market;
        this.tokens = tokens;
    }

    @GetMapping("/messages")
    public ApiResponse<List<ConversationSummary>> messages(@RequestHeader(value = "Authorization", required = false) String authorization, @RequestParam Long userId) {
        tokens.requireUserId(authorization, userId);
        return ApiResponse.ok(market.conversations(userId));
    }

    @GetMapping("/messages/{conversationId}")
    public ApiResponse<List<Message>> conversation(@RequestHeader(value = "Authorization", required = false) String authorization, @PathVariable Long conversationId, @RequestParam Long userId) {
        tokens.requireUserId(authorization, userId);
        return ApiResponse.ok(market.conversation(conversationId, userId));
    }

    @PostMapping("/messages")
    public ApiResponse<Message> send(@RequestHeader(value = "Authorization", required = false) String authorization, @Valid @RequestBody MessageRequest request) {
        tokens.requireUserId(authorization, request.senderId());
        return ApiResponse.ok(market.sendMessage(request));
    }

    @PostMapping("/messages/{conversationId}/orders")
    public ApiResponse<Order> createConversationOrder(@RequestHeader(value = "Authorization", required = false) String authorization, @PathVariable Long conversationId, @Valid @RequestBody CreateOrderRequest request) {
        tokens.requireUserId(authorization, request.buyerId());
        market.conversation(conversationId, request.buyerId());
        return ApiResponse.ok(market.createOrder(request));
    }

    @PutMapping("/messages/{conversationId}/orders/{id}/pay")
    public ApiResponse<Order> payConversationOrder(@RequestHeader(value = "Authorization", required = false) String authorization, @PathVariable Long conversationId, @PathVariable Long id, @RequestParam Long buyerId) {
        tokens.requireUserId(authorization, buyerId);
        return ApiResponse.ok(market.payConversationOrder(conversationId, id, buyerId));
    }

    @GetMapping("/wanted")
    public ApiResponse<List<WantedPost>> wanted() {
        return ApiResponse.ok(market.wantedPosts());
    }

    @GetMapping("/wanted/{id}")
    public ApiResponse<WantedPost> wantedDetail(@PathVariable Long id) {
        return ApiResponse.ok(market.wantedPost(id));
    }

    @PostMapping("/wanted")
    public ApiResponse<WantedPost> createWanted(@RequestHeader(value = "Authorization", required = false) String authorization, @Valid @RequestBody WantedRequest request) {
        tokens.requireUserId(authorization, request.userId());
        return ApiResponse.ok(market.createWanted(request));
    }

    @PostMapping("/favorites/{productId}")
    public ApiResponse<Void> favorite(@RequestHeader(value = "Authorization", required = false) String authorization, @PathVariable Long productId, @RequestParam Long userId) {
        tokens.requireUserId(authorization, userId);
        market.addFavorite(userId, productId);
        return ApiResponse.ok(null);
    }

    @DeleteMapping("/favorites/{productId}")
    public ApiResponse<Void> unfavorite(@RequestHeader(value = "Authorization", required = false) String authorization, @PathVariable Long productId, @RequestParam Long userId) {
        tokens.requireUserId(authorization, userId);
        market.removeFavorite(userId, productId);
        return ApiResponse.ok(null);
    }

    @GetMapping("/addresses")
    public ApiResponse<List<Address>> addresses(@RequestHeader(value = "Authorization", required = false) String authorization, @RequestParam Long userId) {
        tokens.requireUserId(authorization, userId);
        return ApiResponse.ok(market.addresses(userId));
    }

    @PostMapping("/addresses")
    public ApiResponse<Address> createAddress(@RequestHeader(value = "Authorization", required = false) String authorization, @Valid @RequestBody AddressRequest request) {
        tokens.requireUserId(authorization, request.userId());
        return ApiResponse.ok(market.addAddress(request));
    }
}
