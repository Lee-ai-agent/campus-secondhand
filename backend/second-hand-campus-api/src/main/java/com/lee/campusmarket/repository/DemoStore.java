package com.lee.campusmarket.repository;

import com.lee.campusmarket.domain.*;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class DemoStore {
    private final AtomicLong ids = new AtomicLong(100);
    private final Map<Long, User> users = new LinkedHashMap<>();
    private final Map<Long, Category> categories = new LinkedHashMap<>();
    private final Map<Long, Product> products = new LinkedHashMap<>();
    private final Map<Long, Order> orders = new LinkedHashMap<>();
    private final Map<Long, Message> messages = new LinkedHashMap<>();
    private final Map<Long, WantedPost> wantedPosts = new LinkedHashMap<>();
    private final Map<Long, Address> addresses = new LinkedHashMap<>();
    private final Set<String> favorites = new LinkedHashSet<>();

    public DemoStore() {
        seedUsers();
        seedCategories();
        seedProducts();
        seedAddresses();
        seedWanted();
    }

    private void seedUsers() {
        users.put(1L, new User(1L, "admin", "admin123", "管理员", "13800000000", "ADMIN", "active"));
        users.put(2L, new User(2L, "student01", "123456", "李同学", "13800000001", "USER", "active"));
        users.put(3L, new User(3L, "seller01", "123456", "张同学", "13800000002", "USER", "active"));
    }

    private void seedCategories() {
        categories.put(1L, new Category(1L, "数码", 1, true));
        categories.put(2L, new Category(2L, "教材", 2, true));
        categories.put(3L, new Category(3L, "生活用品", 3, true));
    }

    private void seedProducts() {
        products.put(1L, new Product(1L, 3L, 1L, "九成新蓝牙耳机", "宿舍自用，续航正常，支持当面验货。",
                new BigDecimal("89.00"), "九成新", "南区食堂", "approved", null,
                List.of("/uploads/headphone.jpg")));
        products.put(2L, new Product(2L, 3L, 2L, "Java 程序设计教材", "课程结束转让，笔记少。",
                new BigDecimal("28.00"), "八成新", "图书馆门口", "pending", null,
                List.of("/uploads/book.jpg")));
    }

    private void seedAddresses() {
        addresses.put(1L, new Address(1L, 2L, "李同学", "13800000001", "北区 3 栋 502", true));
    }

    private void seedWanted() {
        wantedPosts.put(1L, new WantedPost(1L, 2L, "求购二手显示器", new BigDecimal("200"),
                new BigDecimal("500"), "正常使用", "希望 24 寸以上，可在校内自提。", "active"));
    }

    public long nextId() {
        return ids.incrementAndGet();
    }

    public Collection<User> users() {
        return users.values();
    }

    public Optional<User> user(Long id) {
        return Optional.ofNullable(users.get(id));
    }

    public Optional<User> userByUsername(String username) {
        return users.values().stream().filter(user -> user.username().equals(username)).findFirst();
    }

    public Collection<Category> categories() {
        return categories.values();
    }

    public Collection<Product> products() {
        return products.values();
    }

    public Optional<Product> product(Long id) {
        return Optional.ofNullable(products.get(id));
    }

    public Product saveProduct(Product product) {
        products.put(product.id(), product);
        return product;
    }


    public Collection<Order> orders() {
        return orders.values();
    }

    public Optional<Order> order(Long id) {
        return Optional.ofNullable(orders.get(id));
    }

    public Order saveOrder(Order order) {
        orders.put(order.id(), order);
        return order;
    }

    public Collection<Message> messages() {
        return messages.values();
    }

    public Message saveMessage(Message message) {
        messages.put(message.id(), message);
        return message;
    }

    public Collection<WantedPost> wantedPosts() {
        return wantedPosts.values();
    }

    public WantedPost saveWanted(WantedPost post) {
        wantedPosts.put(post.id(), post);
        return post;
    }

    public Collection<Address> addresses() {
        return addresses.values();
    }

    public Address saveAddress(Address address) {
        addresses.put(address.id(), address);
        return address;
    }

    public boolean addFavorite(Long userId, Long productId) {
        return favorites.add(userId + ":" + productId);
    }

    public void removeFavorite(Long userId, Long productId) {
        favorites.remove(userId + ":" + productId);
    }

    public LocalDateTime now() {
        return LocalDateTime.now();
    }
}
