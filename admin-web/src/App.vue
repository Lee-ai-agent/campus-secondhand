<template>
  <div class="shell">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="brand">
        <strong>校园二手后台</strong>
        <span>管理员 Web 控制台</span>
      </div>
      <nav>
        <button v-for="item in nav" :key="item.key" :class="{ active: current === item.key }" @click="current = item.key">
          {{ item.label }}
        </button>
      </nav>
    </aside>

    <!-- Main -->
    <main class="main">
      <!-- Login -->
      <section v-if="!token" class="login-panel">
        <h1>管理员登录</h1>
        <p>使用 admin / admin123 登录后台，完成商品审核和答辩演示。</p>
        <input v-model="loginForm.username" placeholder="账号" style="width:100%;padding:12px;border:1px solid var(--admin-line);border-radius:6px;font-size:14px" />
        <input v-model="loginForm.password" type="password" placeholder="密码" style="width:100%;padding:12px;border:1px solid var(--admin-line);border-radius:6px;font-size:14px" />
        <button class="btn-custom primary" @click="login" style="width:100%;padding:14px;border:0;border-radius:6px;background:var(--admin-green);color:#fff;font-weight:800;font-size:16px;cursor:pointer">登录</button>
      </section>

      <template v-else>
        <!-- Header -->
        <header class="topbar">
          <div>
            <span class="eyebrow">管理员控制台</span>
            <h1>{{ title }}</h1>
          </div>
          <el-button @click="logout">退出</el-button>
        </header>

        <!-- Dashboard -->
        <template v-if="current === 'dashboard'">
          <section class="metrics">
            <article v-for="m in metricCards" :key="m.label" class="metric" :class="{ urgent: m.urgent }">
              <span>{{ m.label }}</span>
              <strong>{{ m.value }}</strong>
            </article>
          </section>
          <div class="audit-focus">
            <div><strong>审核工作台</strong><p style="color:var(--admin-muted);margin:4px 0 0;font-size:13px">待审核商品、违规用户和异常订单集中处理。</p></div>
            <el-button type="primary" @click="current = 'products'">进入审核</el-button>
          </div>
          <div class="chart-row">
            <div class="admin-card"><strong>近 7 天订单趋势</strong><div class="bars"><div class="bar" v-for="d in chartData" :key="d.label"><span>{{ d.label }}</span><div class="bar-fill" :style="{ width: d.pct + '%' }"></div><b>{{ d.val }}</b></div></div></div>
            <div class="admin-card"><strong>热门分类</strong><div class="bars"><div class="bar" v-for="c in hotCats" :key="c.name"><span>{{ c.name }}</span><div class="bar-fill" :style="{ width: c.pct + '%' }"></div><b>{{ c.pct }}%</b></div></div></div>
          </div>
          <div style="display:flex;gap:10px;margin-top:14px">
            <el-button type="primary" @click="current = 'products'">查看待审核</el-button>
            <el-button @click="current = 'orders'">查看订单</el-button>
          </div>
        </template>

        <!-- Products (审核) -->
        <section v-if="current === 'products'" class="panel">
          <div class="panel-head"><h2>商品审核</h2><el-button @click="loadPending">刷新</el-button></div>
          <div class="filters">
            <input placeholder="关键词/编号/用户…" />
            <select><option>全部状态</option><option>待审核</option></select>
            <select><option>全部分类</option></select>
            <el-button type="primary">查询</el-button>
          </div>
          <el-table :data="pendingProducts" stripe>
            <el-table-column prop="title" label="商品" />
            <el-table-column prop="price" label="价格" width="120" />
            <el-table-column prop="stock" label="库存" width="100" />
            <el-table-column prop="pickupLocation" label="取货点" />
            <el-table-column prop="sellerNickname" label="卖家" width="100" />
            <el-table-column label="操作" width="240">
              <template #default="{ row }">
                <el-button type="success" size="small" @click="approve(row.id)">通过</el-button>
                <el-button type="danger" size="small" @click="reject(row.id)">驳回</el-button>
                <el-button size="small" @click="viewProduct(row.id)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="admin-card" style="margin-top:14px"><strong>验收状态</strong><p style="color:var(--admin-muted);font-size:13px">支持筛选、查看、状态处理、空状态和异常提示。驳回商品必须填写原因。</p></div>
        </section>

        <!-- Users -->
        <section v-if="current === 'users'" class="panel">
          <div class="panel-head"><h2>用户管理</h2><el-button @click="loadUsers">刷新</el-button></div>
          <div class="filters">
            <input placeholder="关键词/账号/手机号…" />
            <select><option>全部状态</option><option>正常</option><option>禁用</option></select>
            <select><option>全部角色</option><option>普通用户</option></select>
            <el-button type="primary">查询</el-button>
          </div>
          <el-table :data="users" stripe>
            <el-table-column prop="username" label="账号" />
            <el-table-column prop="nickname" label="昵称" />
            <el-table-column prop="phone" label="手机号" />
            <el-table-column prop="role" label="角色" />
            <el-table-column prop="status" label="状态">
              <template #default="{ row }">
                <span :style="{ color: row.status === 'DISABLED' ? '#c84848' : '#16875d', fontWeight: 700 }">{{ row.status === 'DISABLED' ? '禁用' : '正常' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160">
              <template #default="{ row }">
                <el-button size="small">查看</el-button>
                <el-button :type="row.status === 'DISABLED' ? 'success' : 'danger'" size="small">{{ row.status === 'DISABLED' ? '解禁' : '禁用' }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </section>

        <!-- Products Management -->
        <section v-if="current === 'all-products'" class="panel">
          <div class="panel-head"><h2>商品管理</h2><el-button @click="loadAllProducts">刷新</el-button></div>
          <div class="filters">
            <input placeholder="关键词/编号/用户…" />
            <select><option>全部状态</option></select>
            <select><option>全部分类</option></select>
            <el-button type="primary">查询</el-button>
          </div>
          <el-table :data="allProducts" stripe>
            <el-table-column prop="title" label="商品" />
            <el-table-column prop="sellerNickname" label="卖家" width="100" />
            <el-table-column prop="price" label="价格" width="120" />
            <el-table-column prop="stock" label="库存" width="80" />
            <el-table-column prop="status" label="状态" width="100" />
            <el-table-column label="操作" width="100">
              <template #default><el-button size="small">查看</el-button></template>
            </el-table-column>
          </el-table>
        </section>

        <!-- Categories -->
        <section v-if="current === 'categories'" class="panel">
          <div class="panel-head"><h2>分类管理</h2><el-button type="primary" size="small">新增分类</el-button></div>
          <el-table :data="categories" stripe>
            <el-table-column prop="name" label="分类名称" />
            <el-table-column prop="parentName" label="父级" width="120" />
            <el-table-column prop="level" label="层级" width="80" />
            <el-table-column prop="sortOrder" label="排序" width="80" />
            <el-table-column prop="status" label="状态" width="100" />
            <el-table-column label="操作" width="180">
              <template #default>
                <el-button size="small">编辑</el-button>
                <el-button type="danger" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </section>

        <!-- Orders -->
        <section v-if="current === 'orders'" class="panel">
          <div class="panel-head"><h2>订单管理</h2><el-button @click="loadOrders">刷新</el-button></div>
          <div class="filters">
            <input placeholder="订单号/买家/卖家…" />
            <select><option>全部状态</option></select>
            <select><option>全部类型</option></select>
            <el-button type="primary">查询</el-button>
          </div>
          <el-table :data="orders" stripe>
            <el-table-column prop="orderNo" label="订单号" />
            <el-table-column prop="buyerNickname" label="买家" width="100" />
            <el-table-column prop="sellerNickname" label="卖家" width="100" />
            <el-table-column prop="totalAmount" label="金额" width="120" />
            <el-table-column prop="status" label="状态" width="100" />
            <el-table-column label="操作" width="100">
              <template #default><el-button size="small">查看</el-button></template>
            </el-table-column>
          </el-table>
        </section>

        <!-- Wanted -->
        <section v-if="current === 'wanted'" class="panel">
          <div class="panel-head"><h2>求购管理</h2><el-button @click="loadWanted">刷新</el-button></div>
          <div class="filters">
            <input placeholder="标题/发布人…" />
            <select><option>全部状态</option></select>
            <select><option>全部预算</option></select>
            <el-button type="primary">查询</el-button>
          </div>
          <el-table :data="wantedPosts" stripe>
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="userNickname" label="发布人" width="100" />
            <el-table-column prop="minPrice" label="预算" width="140">
              <template #default="{ row }">¥{{ row.minPrice }}-{{ row.maxPrice }}</template>
            </el-table-column>
            <el-table-column prop="conditionLevel" label="成色" width="100" />
            <el-table-column prop="status" label="状态" width="100" />
            <el-table-column label="操作" width="140">
              <template #default>
                <el-button size="small">查看</el-button>
                <el-button type="danger" size="small">删除违规</el-button>
              </template>
            </el-table-column>
          </el-table>
        </section>

        <!-- Announcements -->
        <section v-if="current === 'announcements'" class="panel">
          <div class="panel-head"><h2>公告管理</h2><el-button type="primary" size="small">新建公告</el-button></div>
          <el-table :data="announcements" stripe>
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="status" label="状态" width="100" />
            <el-table-column prop="sortOrder" label="排序" width="80" />
            <el-table-column prop="createdAt" label="创建时间" width="160" />
            <el-table-column label="操作" width="180">
              <template #default>
                <el-button size="small">编辑</el-button>
                <el-button size="small">下线</el-button>
              </template>
            </el-table-column>
          </el-table>
        </section>

        <!-- Messages -->
        <section v-if="current === 'messages'" class="panel">
          <div class="panel-head"><h2>咨询管理</h2></div>
          <div class="filters">
            <input placeholder="商品/发送人/接收人…" />
            <select><option>全部状态</option></select>
            <select><option>全部类型</option></select>
            <el-button type="primary">查询</el-button>
          </div>
          <el-table :data="allMessages" stripe>
            <el-table-column prop="productTitle" label="商品" />
            <el-table-column prop="senderNickname" label="发送人" width="100" />
            <el-table-column prop="receiverNickname" label="接收人" width="100" />
            <el-table-column prop="content" label="内容摘要" />
            <el-table-column prop="status" label="状态" width="80" />
            <el-table-column label="操作" width="100">
              <template #default><el-button type="danger" size="small">删除违规</el-button></template>
            </el-table-column>
          </el-table>
        </section>

        <!-- Stats -->
        <section v-if="current === 'stats'" class="panel">
          <div class="panel-head"><h2>数据统计</h2></div>
          <div class="filters">
            <select><option>近 7 天</option><option>近 30 天</option></select>
            <input value="2026-05-23 至 2026-05-29" />
            <el-button type="primary">查询</el-button>
          </div>
          <section class="metrics">
            <article v-for="m in metricCards" :key="m.label" class="metric"><span>{{ m.label }}</span><strong>{{ m.value }}</strong></article>
          </section>
          <div class="chart-row" style="margin-top:14px">
            <div class="admin-card"><strong>近 7 天订单趋势</strong><div class="bars"><div class="bar" v-for="d in chartData" :key="d.label"><span>{{ d.label }}</span><div class="bar-fill" :style="{ width: d.pct + '%' }"></div><b>{{ d.val }}</b></div></div></div>
            <div class="admin-card"><strong>热门分类</strong><div class="bars"><div class="bar" v-for="c in hotCats" :key="c.name"><span>{{ c.name }}</span><div class="bar-fill" :style="{ width: c.pct + '%' }"></div><b>{{ c.pct }}%</b></div></div></div>
          </div>
          <div class="admin-card" style="margin-top:14px"><strong>空状态</strong><p style="color:var(--admin-muted);font-size:13px">无数据时统计卡片展示 0，图表区域展示暂无数据。</p></div>
        </section>
      </template>
    </main>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';

const API_BASE = 'http://localhost:8080/api';
const token = ref(localStorage.getItem('adminToken') || '');
const current = ref('dashboard');
const dashboard = ref(null);
const pendingProducts = ref([]);
const users = ref([]);
const orders = ref([]);
const allProducts = ref([]);
const categories = ref([]);
const wantedPosts = ref([]);
const announcements = ref([
  { title: '毕业季交易安全提示', status: '启用', sortOrder: 1, createdAt: '2026-05-29' },
  { title: '线下自提规范', status: '下线', sortOrder: 2, createdAt: '2026-05-20' }
]);
const allMessages = ref([]);
const loginForm = reactive({ username: 'admin', password: 'admin123' });

const nav = [
  { key: 'dashboard', label: '仪表盘' },
  { key: 'users', label: '用户管理' },
  { key: 'products', label: '商品审核' },
  { key: 'all-products', label: '商品管理' },
  { key: 'categories', label: '分类管理' },
  { key: 'orders', label: '订单管理' },
  { key: 'wanted', label: '求购管理' },
  { key: 'announcements', label: '公告管理' },
  { key: 'messages', label: '咨询管理' },
  { key: 'stats', label: '数据统计' }
];

const title = computed(() => nav.find(item => item.key === current.value)?.label || '后台');

const metricCards = computed(() => {
  const d = dashboard.value || {};
  return [
    { label: '用户数', value: d.userCount ?? '-' },
    { label: '商品数', value: d.productCount ?? '-' },
    { label: '待审核', value: d.pendingProductCount ?? '-', urgent: (d.pendingProductCount || 0) > 0 },
    { label: '订单数', value: d.orderCount ?? '-' },
    { label: '成交额', value: `¥${d.paidAmount ?? 0}` }
  ];
});

const chartData = [
  { label: 'D1', val: 42, pct: 42 }, { label: 'D2', val: 56, pct: 56 },
  { label: 'D3', val: 38, pct: 38 }, { label: 'D4', val: 64, pct: 64 },
  { label: 'D5', val: 72, pct: 72 }, { label: 'D6', val: 61, pct: 61 },
  { label: 'D7', val: 83, pct: 83 }
];

const hotCats = [
  { name: '教材资料', pct: 80 }, { name: '生活用品', pct: 62 }, { name: '数码电子', pct: 44 }
];

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method || 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: token.value ? `Bearer ${token.value}` : '' },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const body = await response.json();
  if (body.code !== 0) throw new Error(body.message || '请求失败');
  return body.data;
}

async function login() {
  const data = await api('/auth/login', { method: 'POST', body: loginForm });
  if (data.role !== 'ADMIN') { ElMessage.error('当前账号不是管理员'); return; }
  token.value = data.token;
  localStorage.setItem('adminToken', data.token);
  await loadAll();
}

function logout() {
  token.value = '';
  localStorage.removeItem('adminToken');
}

async function loadDashboard() { dashboard.value = await api('/admin/dashboard'); }
async function loadPending() { pendingProducts.value = await api('/admin/products/pending'); }
async function loadUsers() { users.value = await api('/admin/users'); }
async function loadOrders() { orders.value = await api('/admin/orders'); }
async function loadAllProducts() { allProducts.value = await api('/admin/products'); }
async function loadCategories() { categories.value = await api('/categories'); }
async function loadWanted() { wantedPosts.value = await api('/wanted'); }
async function loadMessages() { allMessages.value = await api('/admin/messages'); }

async function approve(id) {
  await api(`/admin/products/${id}/approve`, { method: 'POST' });
  ElMessage.success('已通过');
  await loadPending(); await loadDashboard();
}
async function reject(id) {
  await api(`/admin/products/${id}/reject`, { method: 'POST', body: { reason: '信息不完整，请补充图片和描述' } });
  ElMessage.success('已驳回');
  await loadPending(); await loadDashboard();
}
function viewProduct(id) { /* detail navigation */ }

async function loadAll() {
  await Promise.all([loadDashboard(), loadPending(), loadUsers(), loadOrders(), loadAllProducts(), loadCategories(), loadWanted(), loadMessages()]);
}

watch(current, async (value) => {
  if (!token.value) return;
  const loaders = { dashboard: loadDashboard, products: loadPending, users: loadUsers, orders: loadOrders, 'all-products': loadAllProducts, categories: loadCategories, wanted: loadWanted, messages: loadMessages, stats: loadDashboard };
  if (loaders[value]) await loaders[value]();
});

if (token.value) loadAll().catch(err => ElMessage.error(err.message));
</script>
