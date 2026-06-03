const products = [
  {
    id: "p1",
    title: "九成新 Java 课程教材",
    category: "教材资料",
    price: 28,
    stock: 4,
    condition: "九成新",
    pickup: "东区图书馆",
    seller: "林同学",
    status: "已上架",
    audit: "审核通过",
    desc: "Spring Boot 和数据库课程配套教材，笔记完整，适合期末复习。",
    updated: "2026-05-28 18:30"
  },
  {
    id: "p2",
    title: "宿舍折叠桌带书架",
    category: "生活用品",
    price: 45,
    stock: 1,
    condition: "八成新",
    pickup: "南区 7 栋",
    seller: "周同学",
    status: "已上架",
    audit: "审核通过",
    desc: "适合床上学习使用，桌面轻微划痕，不影响使用。",
    updated: "2026-05-29 09:12"
  },
  {
    id: "p3",
    title: "无线蓝牙耳机",
    category: "数码电子",
    price: 88,
    stock: 0,
    condition: "七成新",
    pickup: "北区食堂",
    seller: "陈同学",
    status: "库存不足",
    audit: "审核通过",
    desc: "续航正常，附充电线，当前库存为 0。",
    updated: "2026-05-26 14:00"
  },
  {
    id: "p4",
    title: "毕业季台灯",
    category: "生活用品",
    price: 32,
    stock: 2,
    condition: "九成新",
    pickup: "西区操场",
    seller: "王同学",
    status: "待审核",
    audit: "待审核",
    desc: "护眼台灯，亮度可调，管理员未审核前不公开展示。",
    updated: "2026-05-29 11:20"
  }
];

const wantedPosts = [
  { id: "w1", title: "求购高等数学教材下册", price: "15-25", condition: "八成新以上", user: "李同学", status: "展示中", desc: "希望有课堂笔记，可在东区图书馆当面交易。", updated: "2026-05-29 12:20" },
  { id: "w2", title: "求购自行车", price: "120-220", condition: "能正常骑行", user: "赵同学", status: "展示中", desc: "校内通勤使用，车锁和刹车正常即可。", updated: "2026-05-28 20:10" }
];

const conversations = [
  { id: "c1", object: "九成新 Java 课程教材", type: "商品咨询", user: "林同学", avatar: "林", productId: "p1", last: "有课堂重点标注，适合复习。", unread: 2, time: "09:18", status: "未读消息", pinned: false },
  { id: "c2", object: "求购高等数学教材下册", type: "求购咨询", user: "李同学", avatar: "李", wantedId: "w1", last: "我这本八成新，今晚东区可看。", unread: 0, time: "昨天", status: "已回复", pinned: true },
  { id: "c3", object: "无线蓝牙耳机", type: "商品咨询", user: "陈同学", avatar: "陈", productId: "p3", last: "违规消息被管理员删除", unread: 0, time: "05-27", status: "违规消息被删除", pinned: false }
];

const orders = [
  { no: "SO20260529001", product: "九成新 Java 课程教材", buyer: "李同学", seller: "林同学", amount: 28, status: "待付款", payment: "未支付", refund: "无", logistics: "未发货" },
  { no: "SO20260528008", product: "宿舍折叠桌带书架", buyer: "赵同学", seller: "周同学", amount: 45, status: "待收货", payment: "已支付", refund: "无", logistics: "校内自提：南区门口 18:00" },
  { no: "SO20260527003", product: "无线蓝牙耳机", buyer: "钱同学", seller: "陈同学", amount: 88, status: "售后中", payment: "已支付", refund: "退款中", logistics: "已发货" }
];
