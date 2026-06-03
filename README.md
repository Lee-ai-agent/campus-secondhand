# 二手校园小程序

本项目用于沉淀”二手校园小程序”相关的需求、讨论、设计与实现资料。

## 当前交付物

- `backend/second-hand-campus-api`：Spring Boot 后端工程，覆盖登录、商品、购物车、订单、消息、求购和管理员审核接口。
- `miniprogram`：原生微信小程序工程，覆盖买家、卖家和求购/消息核心页面。
- `admin-web`：Vue3 + Element Plus 管理后台，覆盖登录、仪表盘、商品审核、用户管理和订单管理。
- `database`：MySQL 建表脚本和演示数据脚本。

## 快速启动

后端：

```bash
cd backend/second-hand-campus-api
mvn spring-boot:run
```

管理后台：

```bash
cd admin-web
npm install
npm run dev
```

小程序：用微信开发者工具导入 `miniprogram` 目录。

演示账号：

| 角色 | 账号 | 密码 |
|---|---|---|
| 管理员 | `admin` | `admin123` |
| 买家 | `student01` | `123456` |
| 卖家 | `seller01` | `123456` |
