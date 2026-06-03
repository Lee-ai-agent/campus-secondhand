package com.lee.campusmarket.security;

import com.lee.campusmarket.common.BusinessException;
import com.lee.campusmarket.domain.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.Optional;

@Component
public class DemoTokenService {
    private static final String HMAC_SHA256 = "HmacSHA256";

    private final String prefix;
    private final String secret;

    public DemoTokenService(
            @Value("${app.demo-token-prefix}") String prefix,
            @Value("${app.demo-token-secret}") String secret
    ) {
        this.prefix = prefix;
        this.secret = secret;
    }

    public String issue(User user) {
        String payload = user.id() + ":" + user.role();
        return prefix + encode(payload) + "." + sign(payload);
    }

    public boolean isAdminToken(String authorization) {
        return parse(authorization).map(user -> "ADMIN".equals(user.role())).orElse(false);
    }

    public TokenUser requireUser(String authorization) {
        return parse(authorization).orElseThrow(() -> new BusinessException("需要登录"));
    }

    public void requireUserId(String authorization, Long userId) {
        TokenUser tokenUser = requireUser(authorization);
        if (!tokenUser.userId().equals(userId)) {
            throw new BusinessException("只能操作自己的数据");
        }
    }

    public void requireAdmin(String authorization) {
        if (!isAdminToken(authorization)) {
            throw new BusinessException("需要管理员权限");
        }
    }

    private Optional<TokenUser> parse(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer " + prefix)) {
            return Optional.empty();
        }
        String token = authorization.substring(("Bearer " + prefix).length());
        String[] parts = token.split("\\.", 2);
        if (parts.length != 2) {
            return Optional.empty();
        }
        String payload = decode(parts[0]);
        if (payload == null || !MessageDigest.isEqual(sign(payload).getBytes(StandardCharsets.UTF_8), parts[1].getBytes(StandardCharsets.UTF_8))) {
            return Optional.empty();
        }
        String[] fields = payload.split(":", 2);
        if (fields.length != 2) {
            return Optional.empty();
        }
        try {
            return Optional.of(new TokenUser(Long.valueOf(fields[0]), fields[1]));
        } catch (NumberFormatException ex) {
            return Optional.empty();
        }
    }

    private String sign(String payload) {
        try {
            Mac mac = Mac.getInstance(HMAC_SHA256);
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), HMAC_SHA256));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(mac.doFinal(payload.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new IllegalStateException("Cannot sign demo token", ex);
        }
    }

    private String encode(String payload) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(payload.getBytes(StandardCharsets.UTF_8));
    }

    private String decode(String encoded) {
        try {
            return new String(Base64.getUrlDecoder().decode(encoded), StandardCharsets.UTF_8);
        } catch (IllegalArgumentException ex) {
            return null;
        }
    }

    public record TokenUser(Long userId, String role) {
    }
}
