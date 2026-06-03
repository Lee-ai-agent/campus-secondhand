package com.lee.campusmarket;

import com.lee.campusmarket.common.BusinessException;
import com.lee.campusmarket.domain.Order;
import com.lee.campusmarket.dto.CreateOrderRequest;
import com.lee.campusmarket.dto.LoginRequest;
import com.lee.campusmarket.dto.MessageRequest;
import com.lee.campusmarket.dto.ShipOrderRequest;
import com.lee.campusmarket.repository.DemoStore;
import com.lee.campusmarket.security.DemoTokenService;
import com.lee.campusmarket.service.MarketService;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class MarketServiceTest {
    private final DemoTokenService tokens = new DemoTokenService("demo-token-", "test-secret");
    private final MarketService market = new MarketService(new DemoStore(), tokens);

    @Test
    void loginRejectsWrongPassword() {
        assertThatThrownBy(() -> market.login(new LoginRequest("student01", "bad")))
                .isInstanceOf(BusinessException.class)
                .hasMessage("账号或密码错误");
    }

    @Test
    void buyerOrderFlowMovesFromPaymentToCompleted() {
        Order created = market.createOrder(new CreateOrderRequest(
                2L, 1L, 1, "李同学", "13800000001", "北区 3 栋 502"
        ));

        Order paid = market.payOrder(created.id(), 2L);
        Order shipped = market.shipOrder(paid.id(), 3L, new ShipOrderRequest("pickup", null, "南区食堂当面交接", null));
        Order completed = market.confirmOrder(shipped.id(), 2L);

        assertThat(created.status()).isEqualTo("pending_payment");
        assertThat(paid.status()).isEqualTo("pending_shipment");
        assertThat(shipped.status()).isEqualTo("pending_receipt");
        assertThat(completed.status()).isEqualTo("completed");
    }

    @Test
    void orderCreationRejectsSoldProduct() {
        market.createOrder(new CreateOrderRequest(
                2L, 1L, 1, "李同学", "13800000001", "北区 3 栋 502"
        ));
        assertThatThrownBy(() -> market.createOrder(new CreateOrderRequest(
                2L, 1L, 1, "李同学", "13800000001", "北区 3 栋 502"
        ))).isInstanceOf(BusinessException.class).hasMessage("商品未上架，不能下单");
    }

    @Test
    void conversationPaymentUsesSameOrderStateMachine() {
        Long conversationId = market.sendMessage(new MessageRequest(
                null, 2L, 3L, "product", 1L, null, null, "text", "还在吗？"
        )).conversationId();
        Order created = market.createOrder(new CreateOrderRequest(
                2L, 1L, 1, "李同学", "13800000001", "北区 3 栋 502"
        ));

        Order paid = market.payConversationOrder(conversationId, created.id(), 2L);

        assertThat(paid.status()).isEqualTo("pending_shipment");
        assertThat(paid.paymentStatus()).isEqualTo("paid");
    }

    @Test
    void tokenRejectsForgedAdminSuffix() {
        assertThat(tokens.isAdminToken("Bearer demo-token-1-ADMIN")).isFalse();
    }

    @Test
    void tokenRejectsDifferentUserId() {
        String token = "Bearer " + market.login(new LoginRequest("student01", "123456")).token();

        assertThatThrownBy(() -> tokens.requireUserId(token, 3L))
                .isInstanceOf(BusinessException.class)
                .hasMessage("只能操作自己的数据");
    }
}
