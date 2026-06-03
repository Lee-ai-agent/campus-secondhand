# 二手校园小程序

本项目用于沉淀”二手校园小程序”相关的需求、讨论、设计与实现资料。

## 当前交付物

- `backend/second-hand-campus-api`：Spring Boot 后端工程，覆盖登录、商品、购物车、订单、消息、求购和管理员审核接口。
- `miniprogram`：原生微信小程序工程，覆盖买家、卖家和求购/消息核心页面。
- `admin-web`：Vue3 + Element Plus 管理后台，覆盖登录、仪表盘、商品审核、用户管理和订单管理。
- `database`：MySQL 建表脚本和演示数据脚本。
- `docs/second-hand-campus-miniprogram/delivery`：数据库设计、接口设计、状态机、测试用例、运行手册和验收清单。
- `docs/second-hand-campus-miniprogram/thesis`：毕业论文提纲和初稿。
- `docs/second-hand-campus-miniprogram/defense`：答辩演示脚本和 PPT 大纲。

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

## 文档

- [对话归档](docs/second-hand-campus-miniprogram/conversation.md)
- [项目概要](docs/second-hand-campus-miniprogram/overview.md)
- [PRD 原文归档](docs/second-hand-campus-miniprogram/prd.md)
- [PRD 摘要](docs/second-hand-campus-miniprogram/prd-summary.md)
- [原型生成需求](docs/second-hand-campus-miniprogram/prototype-requirements.md)
- [PRD 评审报告](docs/second-hand-campus-miniprogram/校园二手物品交易小程序-需求评审报告2026-05-29.md)
- [数据库设计](docs/second-hand-campus-miniprogram/delivery/database-design.md)
- [接口设计](docs/second-hand-campus-miniprogram/delivery/api-design.md)
- [状态机](docs/second-hand-campus-miniprogram/delivery/state-machines.md)
- [运行手册](docs/second-hand-campus-miniprogram/delivery/runbook.md)
- [测试用例](docs/second-hand-campus-miniprogram/delivery/test-cases.md)
- [论文初稿](docs/second-hand-campus-miniprogram/thesis/thesis-draft.md)
- [答辩演示脚本](docs/second-hand-campus-miniprogram/defense/demo-script.md)
- [线程归档：019e6372](docs/second-hand-campus-miniprogram/threads/019e6372-6d72-7213-8120-c9e54a91b3c0.md)
- [线程归档：019e681c](docs/second-hand-campus-miniprogram/threads/019e681c-2a80-78d1-9a9f-b045618b785d.md)
