package com.lee.campusmarket.service;

import com.lee.campusmarket.common.BusinessException;
import com.lee.campusmarket.common.PageResult;
import com.lee.campusmarket.domain.Address;
import com.lee.campusmarket.domain.Category;
import com.lee.campusmarket.domain.Message;
import com.lee.campusmarket.domain.Order;
import com.lee.campusmarket.domain.Product;
import com.lee.campusmarket.domain.User;
import com.lee.campusmarket.domain.WantedPost;
import com.lee.campusmarket.dto.AddressRequest;
import com.lee.campusmarket.dto.ConversationSummary;
import com.lee.campusmarket.dto.CreateOrderRequest;
import com.lee.campusmarket.dto.DashboardResponse;
import com.lee.campusmarket.dto.LoginRequest;
import com.lee.campusmarket.dto.LoginResponse;
import com.lee.campusmarket.dto.MessageRequest;
import com.lee.campusmarket.dto.ProductRequest;
import com.lee.campusmarket.dto.ShipOrderRequest;
import com.lee.campusmarket.dto.WantedRequest;
import com.lee.campusmarket.repository.DemoStore;
import com.lee.campusmarket.security.DemoTokenService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class MarketService {
    private static final DateTimeFormatter ORDER_NO_TIME = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    private final DemoStore store;
    private final DemoTokenService tokens;

    public MarketService(DemoStore store, DemoTokenService tokens) {
        this.store = store;
        this.tokens = tokens;
    }

    public LoginResponse login(LoginRequest request) {
        User user = store.userByUsername(request.username())
                .filter(found -> found.password().equals(request.password()))
                .orElseThrow(() -> new BusinessException("账号或密码错误"));
        if (!"active".equals(user.status())) {
            throw new BusinessException("账号已被禁用");
        }
        return new LoginResponse(tokens.issue(user), user.id(), user.nickname(), user.role());
    }

    public List<Category> categories() {
        return store.categories().stream().filter(Category::enabled).toList();
    }

    public PageResult<Product> products(String keyword, Long categoryId, Long sellerId, String status, int page, int pageSize) {
        String normalizedStatus = normalizeProductStatus(status);
        List<Product> items = store.products().stream()
                .filter(product -> normalizedStatus == null || product.status().equals(normalizedStatus))
                .filter(product -> categoryId == null || product.categoryId().equals(categoryId))
                .filter(product -> sellerId == null || product.sellerId().equals(sellerId))
                .filter(product -> keyword == null || keyword.isBlank()
                        || product.title().toLowerCase(Locale.ROOT).contains(keyword.toLowerCase(Locale.ROOT))
                        || product.description().toLowerCase(Locale.ROOT).contains(keyword.toLowerCase(Locale.ROOT)))
                .sorted(Comparator.comparing(Product::id).reversed())
                .toList();
        return slice(items, page, pageSize);
    }

    public Product product(Long id) {
        return store.product(id).orElseThrow(() -> new BusinessException("商品不存在"));
    }

    public Product createProduct(ProductRequest request) {
        Product product = new Product(store.nextId(), request.sellerId(), request.categoryId(), request.title(),
                request.description(), request.price(), request.conditionLevel(),
                request.pickupLocation(), "pending", null, request.images() == null ? List.of() : request.images());
        return store.saveProduct(product);
    }

    public Product updateProduct(Long id, ProductRequest request) {
        Product current = product(id);
        if (!current.sellerId().equals(request.sellerId())) {
            throw new BusinessException("只能编辑自己的商品");
        }
        Product product = new Product(id, request.sellerId(), request.categoryId(), request.title(),
                request.description(), request.price(), request.conditionLevel(),
                request.pickupLocation(), "pending", null, request.images() == null ? List.of() : request.images());
        return store.saveProduct(product);
    }

    public Product offlineProduct(Long id, Long sellerId) {
        Product product = product(id);
        if (!product.sellerId().equals(sellerId)) {
            throw new BusinessException("只能下架自己的商品");
        }
        if (!"approved".equals(product.status())) {
            throw new BusinessException("只有已上架商品可以下架");
        }
        return store.saveProduct(product.withStatus("offline", null));
    }

    public Product approveProduct(Long id) {
        Product product = product(id);
        if (!"pending".equals(product.status())) {
            throw new BusinessException("只有待审核商品可以通过");
        }
        return store.saveProduct(product.withStatus("approved", null));
    }

    public Product rejectProduct(Long id, String reason) {
        Product product = product(id);
        if (!"pending".equals(product.status())) {
            throw new BusinessException("只有待审核商品可以驳回");
        }
        if (reason == null || reason.isBlank()) {
            throw new BusinessException("驳回原因不能为空");
        }
        return store.saveProduct(product.withStatus("rejected", reason));
    }

    public Order createOrder(CreateOrderRequest request) {
        Product product = product(request.productId());
        if (!"approved".equals(product.status())) {
            throw new BusinessException("商品未上架，不能下单");
        }
        store.saveProduct(product.withStatus("sold", null));
        long id = store.nextId();
        BigDecimal total = product.price().multiply(BigDecimal.valueOf(request.quantity()));
        String orderNo = "SHC" + store.now().format(ORDER_NO_TIME) + id;
        Order order = new Order(id, orderNo, request.buyerId(), product.sellerId(), product.id(), request.quantity(),
                total, "pending_payment", "unpaid", request.receiverName(), request.receiverPhone(),
                request.receiverAddress(), null, null, null, store.now());
        return store.saveOrder(order);
    }

    public List<Order> buyerOrders(Long buyerId) {
        return store.orders().stream().filter(order -> order.buyerId().equals(buyerId)).toList();
    }

    public List<Order> sellerOrders(Long sellerId) {
        return store.orders().stream().filter(order -> order.sellerId().equals(sellerId)).toList();
    }

    public Order payOrder(Long id, Long buyerId) {
        Order order = order(id);
        requireBuyer(order, buyerId);
        if (!"pending_payment".equals(order.status())) {
            throw new BusinessException("只有待付款订单可以支付");
        }
        return store.saveOrder(order.withStatus("pending_shipment", "paid"));
    }

    public Order shipOrder(Long id, Long sellerId, ShipOrderRequest request) {
        Order order = order(id);
        requireSeller(order, sellerId);
        if (!"pending_shipment".equals(order.status())) {
            throw new BusinessException("只有待发货订单可以发货");
        }
        String shipType = request.normalizedShipType();
        String logisticsNo = request.normalizedLogisticsNo();
        String pickupRemark = request.normalizedPickupRemark();
        if ("express".equals(shipType) && (logisticsNo == null || logisticsNo.isBlank())) {
            throw new BusinessException("快递发货必须填写物流单号");
        }
        if ("pickup".equals(shipType) && (pickupRemark == null || pickupRemark.isBlank())) {
            throw new BusinessException("当面交易必须填写取货说明");
        }
        if (!"pickup".equals(shipType) && !"express".equals(shipType)) {
            throw new BusinessException("发货方式只能是 pickup 或 express");
        }
        return store.saveOrder(order.withShipping("pending_receipt", shipType, logisticsNo, pickupRemark));
    }

    public Order confirmOrder(Long id, Long buyerId) {
        Order order = order(id);
        requireBuyer(order, buyerId);
        if (!"pending_receipt".equals(order.status())) {
            throw new BusinessException("只有待收货订单可以确认收货");
        }
        return store.saveOrder(order.withStatus("completed", "paid"));
    }

    public Order cancelOrder(Long id, Long buyerId) {
        Order order = order(id);
        requireBuyer(order, buyerId);
        if (!"pending_payment".equals(order.status())) {
            throw new BusinessException("只有待付款订单可以取消");
        }
        Product product = product(order.productId());
        store.saveProduct(product.withStatus("approved", null));
        return store.saveOrder(order.withStatus("cancelled", "unpaid"));
    }

    public Message sendMessage(MessageRequest request) {
        Long conversationId = request.conversationId() == null ? store.nextId() : request.conversationId();
        Message message = new Message(store.nextId(), conversationId, request.senderId(), request.receiverId(),
                request.relatedType() == null ? relatedType(request) : request.relatedType(),
                request.productId(), request.wantedId(), request.orderId(),
                request.messageType() == null ? "text" : request.messageType(),
                request.content(), "unread", "normal", store.now());
        return store.saveMessage(message);
    }

    public List<ConversationSummary> conversations(Long userId) {
        Map<Long, Message> latestByConversation = new LinkedHashMap<>();
        store.messages().stream()
                .filter(message -> message.senderId().equals(userId) || message.receiverId().equals(userId))
                .sorted(Comparator.comparing(Message::createdAt))
                .forEach(message -> latestByConversation.put(message.conversationId(), message));
        return latestByConversation.values().stream()
                .sorted(Comparator.comparing(Message::createdAt).reversed())
                .map(message -> new ConversationSummary(
                        message.conversationId(), message.senderId(), message.receiverId(), message.productId(),
                        message.wantedId(), message.orderId(), message.relatedType(), conversationTitle(message),
                        message.content(), message.readStatus(), message.status(), message.createdAt()
                ))
                .toList();
    }

    public List<Message> conversation(Long conversationId, Long userId) {
        List<Message> messages = store.messages().stream()
                .filter(message -> message.conversationId().equals(conversationId))
                .filter(message -> message.senderId().equals(userId) || message.receiverId().equals(userId))
                .sorted(Comparator.comparing(Message::createdAt))
                .toList();
        if (messages.isEmpty()) {
            throw new BusinessException("会话不存在");
        }
        return messages;
    }

    public Order payConversationOrder(Long conversationId, Long orderId, Long buyerId) {
        conversation(conversationId, buyerId);
        return payOrder(orderId, buyerId);
    }

    public WantedPost createWanted(WantedRequest request) {
        if (request.maxPrice().compareTo(request.minPrice()) < 0) {
            throw new BusinessException("最高预算不能小于最低预算");
        }
        WantedPost post = new WantedPost(store.nextId(), request.userId(), request.title(), request.minPrice(),
                request.maxPrice(), request.conditionLevel(), request.description(), "active");
        return store.saveWanted(post);
    }

    public List<WantedPost> wantedPosts() {
        return store.wantedPosts().stream().toList();
    }

    public WantedPost wantedPost(Long id) {
        return store.wantedPosts().stream()
                .filter(post -> post.id().equals(id))
                .findFirst()
                .orElseThrow(() -> new BusinessException("求购不存在"));
    }

    public Address addAddress(AddressRequest request) {
        Address address = new Address(store.nextId(), request.userId(), request.receiverName(), request.phone(),
                request.detail(), request.defaultAddress());
        return store.saveAddress(address);
    }

    public List<Address> addresses(Long userId) {
        return store.addresses().stream().filter(address -> address.userId().equals(userId)).toList();
    }

    public void addFavorite(Long userId, Long productId) {
        product(productId);
        store.addFavorite(userId, productId);
    }

    public void removeFavorite(Long userId, Long productId) {
        store.removeFavorite(userId, productId);
    }

    public DashboardResponse dashboard() {
        BigDecimal paidAmount = store.orders().stream()
                .filter(order -> "paid".equals(order.paymentStatus()))
                .map(Order::totalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return new DashboardResponse(
                store.users().size(),
                store.products().size(),
                store.products().stream().filter(product -> "pending".equals(product.status())).count(),
                store.orders().size(),
                paidAmount
        );
    }

    public List<User> users() {
        return store.users().stream().toList();
    }

    public List<Order> allOrders() {
        return store.orders().stream().toList();
    }

    private Order order(Long id) {
        return store.order(id).orElseThrow(() -> new BusinessException("订单不存在"));
    }

    public Order order(Long id, Long userId) {
        Order order = order(id);
        if (!order.buyerId().equals(userId) && !order.sellerId().equals(userId)) {
            throw new BusinessException("只能查看自己的订单");
        }
        return order;
    }

    private void requireBuyer(Order order, Long buyerId) {
        if (!order.buyerId().equals(buyerId)) {
            throw new BusinessException("只能操作自己的买入订单");
        }
    }

    private void requireSeller(Order order, Long sellerId) {
        if (!order.sellerId().equals(sellerId)) {
            throw new BusinessException("只能操作自己的卖出订单");
        }
    }

    private <T> PageResult<T> slice(List<T> items, int page, int pageSize) {
        int safePage = Math.max(page, 1);
        int safePageSize = Math.max(pageSize, 1);
        int from = Math.min((safePage - 1) * safePageSize, items.size());
        int to = Math.min(from + safePageSize, items.size());
        return new PageResult<>(items.subList(from, to), safePage, safePageSize, items.size());
    }

    private String normalizeProductStatus(String status) {
        if (status == null || status.isBlank()) {
            return null;
        }
        return switch (status.toUpperCase(Locale.ROOT)) {
            case "ON_SALE", "APPROVED" -> "approved";
            case "PENDING" -> "pending";
            case "REJECTED" -> "rejected";
            case "OFFLINE" -> "offline";
            case "SOLD" -> "sold";
            default -> status.toLowerCase(Locale.ROOT);
        };
    }

    private String relatedType(MessageRequest request) {
        if (request.wantedId() != null) {
            return "wanted";
        }
        if (request.orderId() != null) {
            return "order";
        }
        return "product";
    }

    private String conversationTitle(Message message) {
        if (message.productId() != null) {
            return store.product(message.productId()).map(Product::title).orElse("商品咨询");
        }
        if (message.wantedId() != null) {
            return store.wantedPosts().stream()
                    .filter(post -> post.id().equals(message.wantedId()))
                    .findFirst()
                    .map(WantedPost::title)
                    .orElse("求购咨询");
        }
        return "校园会话";
    }
}
