USE second_hand_campus;

INSERT INTO users (id, username, password_hash, nickname, phone, role, status) VALUES
(1, 'admin', 'admin123', '管理员', '13800000000', 'ADMIN', 'ACTIVE'),
(2, 'student01', '123456', '李同学', '13800000001', 'USER', 'ACTIVE'),
(3, 'seller01', '123456', '张同学', '13800000002', 'USER', 'ACTIVE');

INSERT INTO categories (id, name, sort_order, enabled) VALUES
(1, '数码', 1, 1),
(2, '教材', 2, 1),
(3, '生活用品', 3, 1);

INSERT INTO products (id, seller_id, category_id, title, description, price, condition_level, pickup_location, status) VALUES
(1, 3, 1, '九成新蓝牙耳机', '宿舍自用，续航正常，支持当面验货。', 89.00, '九成新', '南区食堂', 'ON_SALE'),
(2, 3, 2, 'Java 程序设计教材', '课程结束转让，笔记少。', 28.00, '八成新', '图书馆门口', 'PENDING');

INSERT INTO product_images (product_id, image_url, sort_order) VALUES
(1, '/uploads/headphone.jpg', 1),
(2, '/uploads/book.jpg', 1);

INSERT INTO addresses (user_id, receiver_name, phone, detail, default_address) VALUES
(2, '李同学', '13800000001', '北区 3 栋 502', 1);

INSERT INTO wanted_posts (user_id, title, min_price, max_price, condition_level, description, status) VALUES
(2, '求购二手显示器', 200.00, 500.00, '正常使用', '希望 24 寸以上，可在校内自提。', 'OPEN');

