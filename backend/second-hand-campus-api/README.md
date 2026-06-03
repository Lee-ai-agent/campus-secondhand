# 校园二手交易后端

## 技术栈

- Java 17
- Spring Boot 3.3
- MyBatis-Plus
- MySQL 8

## 启动

```bash
cd backend/second-hand-campus-api
mvn spring-boot:run
```

服务地址：`http://localhost:8080`

## 测试

```bash
cd backend/second-hand-campus-api
mvn test
```

## 演示账号

| 角色 | 账号 | 密码 |
|---|---|---|
| 管理员 | `admin` | `admin123` |
| 买家 | `student01` | `123456` |
| 卖家 | `seller01` | `123456` |

## 说明

当前后端使用内存演示数据保证答辩主流程可直接演示，登录后返回后端签名的演示 Token，并校验用户只能操作自己的数据。项目同时提供 `database/schema.sql` 和 `database/seed.sql` 作为 MySQL 落库依据；后续接入真实 MyBatis-Plus Mapper 时，保持现有 Controller 和 Service 行为不变。
