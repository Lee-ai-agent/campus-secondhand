# 校园二手交易管理后台

## 启动

```bash
cd admin-web
npm install
npm run dev
```

默认访问：`http://localhost:5173`

## 演示流程

1. 使用 `admin / admin123` 登录。
2. 打开“商品审核”，查看待审核商品。
3. 点击“通过”或“驳回”，后台会调用 `/api/admin/products/{id}/approve` 或 `/api/admin/products/{id}/reject`。
4. 打开“仪表盘”和“订单管理”查看统计与订单数据。

