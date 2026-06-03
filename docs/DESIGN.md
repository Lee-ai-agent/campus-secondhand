---
version: beta
name: 校园二手 Apple C2C Mini Program
description: 面向高校学生的买卖一体二手交易微信小程序，设计语言以 Apple/iOS 清爽移动体验为基准，强调真实商品、校内可信、轻量交易和低干扰操作。
source:
  - docs/design/apple-c2c-pages/home.png
  - docs/design/apple-c2c-pages/wanted.png
  - docs/design/apple-c2c-pages/publish.png
  - docs/design/apple-c2c-pages/messages.png
  - docs/design/apple-c2c-pages/profile.png
  - docs/design/apple-c2c-pages/detail.png
  - docs/design/apple-c2c-pages/chat.png
  - docs/design/apple-c2c-pages/confirm-meetup.png
colors:
  page-bg: "#f5f6f8"
  surface: "#ffffff"
  surface-subtle: "#f8fafc"
  surface-blue: "#eef6ff"
  primary: "#007aff"
  primary-deep: "#0068e8"
  primary-soft: "#e8f2ff"
  success: "#19b45b"
  success-soft: "#e8f8ef"
  danger: "#ff2d2f"
  warning: "#ff9500"
  text-primary: "#111111"
  text-secondary: "#6b7280"
  text-tertiary: "#9ca3af"
  border: "#e5e7eb"
  border-strong: "#d8dde6"
  icon: "#111111"
  icon-muted: "#6b7280"
  tab-inactive: "#2f343b"
  shadow-card: "rgba(15, 23, 42, 0.08)"
  shadow-float: "rgba(15, 23, 42, 0.12)"
  white-alpha-92: "rgba(255, 255, 255, 0.92)"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: 44rpx
    fontWeight: 800
    lineHeight: 1.22
  page-title:
    fontFamily: "-apple-system, BlinkMacSystemFont, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: 36rpx
    fontWeight: 700
    lineHeight: 1.28
  section-title:
    fontFamily: "-apple-system, BlinkMacSystemFont, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: 32rpx
    fontWeight: 700
    lineHeight: 1.35
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: 30rpx
    fontWeight: 700
    lineHeight: 1.35
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: 28rpx
    fontWeight: 400
    lineHeight: 1.55
  body-sm:
    fontFamily: "-apple-system, BlinkMacSystemFont, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: 26rpx
    fontWeight: 400
    lineHeight: 1.45
  caption:
    fontFamily: "-apple-system, BlinkMacSystemFont, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: 24rpx
    fontWeight: 400
    lineHeight: 1.35
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: 28rpx
    fontWeight: 600
    lineHeight: 1.35
  price:
    fontFamily: "-apple-system, BlinkMacSystemFont, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: 34rpx
    fontWeight: 700
    lineHeight: 1.15
  price-xl:
    fontFamily: "-apple-system, BlinkMacSystemFont, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: 44rpx
    fontWeight: 700
    lineHeight: 1.12
rounded:
  sm: 12rpx
  md: 20rpx
  lg: 28rpx
  xl: 32rpx
  full: 999rpx
spacing:
  xs: 8rpx
  sm: 16rpx
  md: 24rpx
  lg: 32rpx
  xl: 48rpx
  page-padding: 28rpx
  card-padding: 28rpx
  card-gap: 20rpx
  bottom-safe: 34rpx
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    height: 88rpx
    padding: "0 36rpx"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    borderColor: "{colors.primary}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    height: 80rpx
    padding: "0 32rpx"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.label}"
  card-default:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: "{spacing.card-padding}"
    borderColor: "{colors.border}"
    shadow: "0 10rpx 30rpx {colors.shadow-card}"
  input-search:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    placeholderColor: "{colors.text-tertiary}"
    rounded: "{rounded.full}"
    height: 72rpx
    borderColor: "{colors.border}"
  chip-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.full}"
    height: 64rpx
    borderColor: "{colors.border}"
  chip-active:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    height: 64rpx
  badge-success:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success}"
    rounded: "{rounded.full}"
  badge-info:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
  bottom-tabbar:
    backgroundColor: "{colors.white-alpha-92}"
    selectedColor: "{colors.primary}"
    color: "{colors.tab-inactive}"
    roundedTop: "{rounded.xl}"
    shadow: "0 -10rpx 30rpx {colors.shadow-float}"
---

## Design Style Summary

小程序端采用 **Apple/iOS 清爽校园 C2C** 风格。设计稿的核心体验是面向学生的真实物品交易：浅灰背景、白色大圆角卡片、真实商品图、线性图标、蓝色主操作、绿色可信标记和红色价格共同构成统一视觉。

设计目标：

- 让商品内容优先，首页和详情页都以真实图片、价格、成色、面交地点和发布者可信状态为第一信息层级。
- 保持 iOS 原生感，使用状态栏、居中标题、右侧更多/分享、底部 TabBar、底部固定操作栏等移动端模式。
- 降低交易焦虑，围绕校内面交、现场验货、认证同学、待付款卡片等信息建立可信交易感。

## Colors

### Core Palette

- **Primary Blue (`#007aff`)**：全局主行动色。用于发布、筛选激活、底部导航选中态、提交订单、立即购买、去付款等强操作。
- **Primary Soft (`#e8f2ff`)**：蓝色浅底。用于求购状态、系统图标背景、蓝色插画背景和轻提示。
- **Success Green (`#19b45b`)**：可信和成功语义。用于已认证同学、校内保障、现场验货、求购发布入口变体、未读徽标。
- **Danger Red (`#ff2d2f`)**：价格和风险金额。商品价格、预算金额、合计金额必须使用红色，不用于普通强调。
- **Warning Orange (`#ff9500`)**：少量用于待付款、未提交、审核中等提醒状态。
- **Page Background (`#f5f6f8`)**：页面底色，接近 iOS 浅灰；不得改为暖纸色或纹理底。
- **Surface (`#ffffff`)**：所有主要卡片和底栏底色。
- **Text Primary (`#111111`)**：标题、正文、导航标题。
- **Text Secondary (`#6b7280`)**：说明、地点、时间、辅助信息。
- **Text Tertiary (`#9ca3af`)**：placeholder、弱提示、底部说明。
- **Border (`#e5e7eb`)**：卡片边界、列表分割线、输入框描边。

### Color Rules

- 主按钮和主选中态统一使用蓝色。
- 绿色只承载认证、安全、成功、求购辅助等语义，不替代全局主色。
- 红色只用于价格、预算、合计金额和风险反馈。
- 页面大面积背景保持白色/浅灰，不使用纸张纹理、木纹、胶带或暖黄底。
- 同一模块内最多出现一个高饱和行动色；蓝、绿、红同时出现时必须各自承担清晰语义。

## Typography

字体使用系统默认中文字体栈：

```css
-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif
```

字号和字重按设计稿层级执行：

- **Display 44rpx/800**：首页 Hero 标题、求购 Banner 标题。
- **Page Title 36rpx/700**：页面导航标题，如“校园二手物品交易”“商品详情”“确认面交”“消息”“我的”。
- **Section Title 32rpx/700**：卡片分组标题，如“交易记录”“我的发布”“面交信息”。
- **Title 30rpx/700**：商品标题、求购标题、会话昵称。
- **Body 28rpx/400**：商品描述、表单行文字、聊天正文。
- **Caption 24rpx/400**：时间、地点、说明、底部提示、Tab 文案。
- **Price 34-44rpx/700**：价格和合计金额，必须使用 `danger` 红色。

规则：

- 页面标题和重要卡片标题使用黑色高字重，辅助文字使用灰色。
- 同一页面不要超过 4 个字号层级。
- 价格字号可显著大于普通正文，但不得使用蓝色或绿色。
- Placeholder 使用浅灰，不能与已输入正文同权重。

## Layout

### Global Structure

- 移动端以 750rpx 设计基准实现，采用单列竖向滚动。
- 页面左右安全距约 28rpx，卡片间距约 20-24rpx。
- 一级页面保留底部 5 项 TabBar：首页、求购、发布、消息、我的。
- 二级流程页隐藏底部 TabBar，使用顶部返回 + 居中标题 + 右侧更多/分享，底部按需固定操作栏。
- 页面背景为浅灰；所有业务内容放入白色大圆角卡片或图片卡中。

### Page Patterns

- **首页**：居中标题 + 微信胶囊菜单；搜索框和筛选按钮横排；Hero 大卡展示校园交易卖点和真实/拟物图片；分类 5 列卡片；商品双列瀑布流；底部 TabBar。
- **求购页**：大标题“求购”；搜索框；蓝色浅底 Banner；横向胶囊分类；求购卡单列列表；底部 TabBar。
- **发布页**：居中标题；顶部说明卡；发布闲置和发求购两张大入口卡；最近草稿和发布规则卡；底部 TabBar。
- **消息页**：居中标题；搜索框；横向胶囊筛选；一张白色会话列表卡承载多行会话；底部说明文字；底部 TabBar。
- **我的页**：个人资料大卡；统计四列；交易记录、我的发布、个人资料三组列表卡；底部 TabBar。
- **详情页**：顶部大图轮播；商品信息卡；描述卡；卖家卡；保障卡；推荐横向卡；底部固定操作栏。
- **聊天页**：顶部会话标题；关联商品/订单卡；消息流；订单付款卡；底部固定输入栏。
- **确认面交页**：商品摘要卡；面交信息卡；面交提醒卡；模拟支付说明卡；金额卡；底部结算栏。

## Cards

卡片是主要容器，统一使用白底、大圆角、轻阴影、细边界。

- **Default Card**：白底，28-32rpx 圆角，轻阴影，适用于详情信息、个人中心分组、确认面交模块。
- **Hero Card**：浅蓝或真实场景背景，32rpx 圆角，承载首页和求购页主视觉。
- **Product Card**：双列卡片，上方真实商品图，下方标题、红色价格、地点、发布者、收藏数；图片顶部可叠加灰色成色标签。
- **Wanted Card**：单列大卡，左上状态标签，标题、预算、成色、用户、地点和“联系TA”按钮；右侧可有 chevron。
- **Message List Card**：一张大卡内包含多个会话行，行间使用浅色分割线。
- **Order/Payment Card**：聊天页和确认面交页使用商品缩略图 + 标题 + 价格 + 状态 + 蓝色行动按钮。

规则：

- 商品卡不得微旋转，不使用胶带或图钉装饰。
- 图片必须是真实商品图或清晰拟物图，不使用纯色占位作为最终视觉。
- 卡片圆角必须明显，接近 iOS 大圆角；列表行内部可使用细分割线。
- 阴影保持柔和，不使用重投影或强模糊。

## Buttons

- **Primary Button**：蓝底白字胶囊，承载发布闲置、发求购、立即购买、去付款、提交订单等主操作。
- **Secondary Button**：白底蓝字蓝描边胶囊，用于“聊一聊”“联系TA”等次要但可见操作。
- **Icon/Text Button**：用于收藏、更多、分享、编辑资料、列表跳转；使用线性图标或蓝色文本。
- **State Button/Label**：待付款、进行中、已认证等状态使用浅色底标签，不作为主按钮。

规则：

- 主操作统一为蓝色。
- 底部固定栏中主按钮靠右或占主要宽度，左侧可放价格合计或次要操作。
- 同一底栏可同时出现收藏、聊天、购买，但购买按钮必须是最高视觉权重。
- 求购页“联系TA”使用白底蓝描边；发布页“填写求购”可使用绿色文本以区分求购语义。

## Forms

设计稿中表单以“卡片 + 信息行 + 选择跳转”为主：

- 搜索框为白底胶囊，左侧放大镜图标，placeholder 使用浅灰。
- 确认面交页信息行包含线性图标、字段名、右侧当前值和 chevron，例如面交地点、约定时间、联系人。
- 发布入口页不直接展示长表单，而是先提供“发布闲置”和“发求购”两张动作分流卡。
- 具体发布表单应延续大卡分组：图片上传、标题价格、分类成色、描述地点；选择优先于手输。
- 风险或规则说明使用普通说明卡，不使用答辩注释型大段说明。

校验和反馈：

- 必填项缺失使用字段提示或 Toast。
- 状态变化后使用轻提示并刷新对应卡片状态。
- 高风险操作仍需二次确认，但弹窗视觉使用系统样式。

## Icons

图标统一为 Apple/iOS 风格线性图标：

- 线条清晰、圆角端点，默认黑色或灰色。
- 底部导航选中态使用蓝色填充/高亮，未选中为深灰线性。
- 分类图标使用蓝色线性图标放在白色圆角分类卡中。
- 安全、认证、现场验货使用绿色线性图标或绿色圆形浅底。
- 发布 Tab 使用中心凸起蓝色圆形加号。
- 不使用手绘图钉、胶带、印章、木板纹理类图标装饰。

## Navigation & Bars

- **Top Bar**：保留 iOS 状态栏高度；一级页标题可居中或左对齐，右侧保留微信胶囊菜单；二级页左侧返回，标题居中，右侧更多/分享。
- **Bottom TabBar**：5 项固定底部，白色半透明/毛玻璃感，大圆角上边界；中间“发布”是蓝色凸起圆形加号。
- **Bottom Action Bar**：二级交易页底部固定，白底或白色半透明，顶部轻阴影；详情页展示收藏、聊一聊、立即购买；确认面交页展示合计与提交订单。
- **Chat Input Bar**：底部固定，白底，左侧表情，中央胶囊输入框，右侧加号附件。

## Chat & Messages

### Messages List

- 顶部提供搜索会话输入框和横向胶囊筛选：全部、商品咨询、求购、系统。
- 会话列表放在一张白色大卡中，每行包含头像、昵称、认证标、关联类型、最新消息、缩略图/状态标签、时间、未读数。
- 未读数使用绿色圆点，系统通知头像使用蓝色圆形图标。
- 底部提示“长按会话可置顶或删除”使用浅灰文字。

### Chat Detail

- 顶部关联商品/订单卡固定在消息流上方，包含缩略图、标题、价格、地点、状态和“去付款”按钮。
- 对方消息靠左，白色气泡；自己消息靠右，浅蓝气泡。
- 消息时间居中浅灰；自己消息可显示“已读”。
- 订单卡在聊天流中以白色大卡展示，含金额、地点和全宽蓝色“去付款”按钮。
- 输入栏只包含表情、文字输入和加号附件；附件限定图片/相机。

## Interaction & Motion

- 页面切换、返回、底部 Tab 切换使用平台默认过渡。
- 搜索框、筛选胶囊、TabBar 选中态即时响应。
- 商品图片轮播使用圆点分页指示。
- 会话长按触发置顶/删除操作，完成后 Toast 反馈。
- 下单、付款、提交发布、保存草稿等状态变化后刷新对应卡片和列表状态。
- 加载态使用系统 loading 或骨架占位；不要自定义强装饰动画。

## Responsive Rules

- 设计稿为 iPhone 竖屏移动端，页面宽度约 851-863px，按微信小程序 750rpx 基准实现。
- 小程序端只定义移动单列布局；不从设计稿推导桌面端布局。
- 双列商品卡在窄屏保持两列时必须保证标题、价格、地点、头像和收藏数不重叠；极窄屏可降为单列。
- 底部固定栏必须避开安全区，内容底部增加安全区占位。
- 所有触控热区不小于 44px。

## Page Reference

| Design File | Page | Key UI Decisions |
| --- | --- | --- |
| `home.png` | 首页 | 蓝色主色、真实 Hero 图、搜索 + 筛选、5 列分类、双列商品卡、底部发布凸起按钮 |
| `wanted.png` | 求购 | 左对齐大标题、搜索框、浅蓝 Banner、横向分类胶囊、求购大卡、联系TA 描边按钮 |
| `publish.png` | 发布 | 发布动作分流，不直接进入表单；蓝色闲置入口、绿色求购入口、草稿和规则卡 |
| `messages.png` | 消息 | 搜索会话、分类胶囊、会话列表大卡、缩略图/未读数/状态标签 |
| `profile.png` | 我的 | 个人资料大卡、认证标签、四列统计、分组列表卡和彩色线性图标 |
| `detail.png` | 商品详情 | 顶部图片轮播、信息分区卡、卖家认证卡、校内面交保障、底部购买栏 |
| `chat.png` | 聊天 | 关联商品付款卡、白/浅蓝气泡、订单付款卡、固定输入栏 |
| `confirm-meetup.png` | 确认面交 | 商品摘要、面交信息行、面交提醒、模拟支付说明、底部合计提交栏 |

## Do's and Don'ts

- DO 使用蓝色作为全局主操作和选中态。
- DO 使用红色展示价格、预算、合计金额。
- DO 使用绿色表达认证、成功、安全和现场验货。
- DO 使用白色大圆角卡片、浅灰背景和柔和阴影。
- DO 商品和推荐区域优先使用真实图片。
- DO 保持底部 TabBar、底部操作栏和聊天输入栏的 iOS 固定栏体验。
- DO 二级页隐藏底部 TabBar，只保留返回和当前流程操作。
