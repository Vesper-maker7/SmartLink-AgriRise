<template>
  <view class="home-page bg-gradient-page safe-area-bottom">

    <!-- ═══════════════ 背景装饰 ═══════════════ -->
    <view class="bg-layer">
      <view class="bg-glow bg-glow-1"></view>
      <view class="bg-glow bg-glow-2"></view>
    </view>

    <!-- ═══════════════ 一、Hero — AI今日助手 ═══════════════ -->
    <view class="section-hero">
      <view class="hero-card">
        <view class="hero-bg-glow"></view>
        <view class="hero-particles">
          <view v-for="n in 10" :key="n" class="hp-dot" :style="heroDotStyle(n)"></view>
        </view>
        <view class="hero-content">
          <!-- 标签栏 -->
          <view class="hero-badge">
            <text class="badge-dot"></text>
            <text class="badge-text">AI农业生活助手</text>
          </view>
          <!-- 问候 -->
          <view class="hero-greeting">
            <text class="greeting-emoji">🤖</text>
            <text class="greeting-text">{{ greeting }}</text>
            <text class="greeting-wave">👋</text>
          </view>
          <!-- 今日建议 -->
          <view class="hero-tips">
            <text class="tips-label">今日建议</text>
            <view class="tips-list">
              <view class="tip-row" v-for="tip in dailyTips" :key="tip">
                <text class="tip-check">✓</text>
                <text class="tip-text">{{ tip }}</text>
              </view>
            </view>
          </view>
          <!-- CTA按钮 -->
          <view class="hero-cta" @click="goAiCenter('free-chat')">
            <view class="cta-glow"></view>
            <text class="cta-text">开始AI咨询</text>
            <text class="cta-arrow">→</text>
          </view>
        </view>
      </view>
    </view>

    <!-- ═══════════════ 二、智能搜索 ═══════════════ -->
    <view class="section-search">
      <view class="search-card glass-card">
        <view class="search-main" @click="focusSearch">
          <text class="search-icon">🔍</text>
          <text class="search-placeholder">搜索农产品、产地、品牌...</text>
        </view>
        <view class="search-actions">
          <view class="sa-btn" @click="voiceSearch">
            <text>🎤</text>
          </view>
          <view class="sa-divider"></view>
          <view class="sa-btn" @click="aiRecognition">
            <text>📷</text>
          </view>
        </view>
      </view>
    </view>

    <!-- ═══════════════ 三、AI快捷服务 ═══════════════ -->
    <view class="section-ai-services">
      <view class="section-head">
        <view class="sh-left">
          <view class="sh-line"></view>
          <text class="sh-title">AI快捷服务</text>
        </view>
      </view>
      <view class="services-grid">
        <view
          v-for="svc in aiServices"
          :key="svc.key"
          class="svc-card glass-card"
          :class="{ pulse: svc.key === 'shopping' }"
          @click="goAiCenter(svc.module)"
        >
          <view class="svc-icon-wrap" :style="{ background: svc.bg }">
            <text class="svc-icon">{{ svc.icon }}</text>
            <view v-if="svc.key === 'shopping'" class="svc-hot-dot"></view>
          </view>
          <text class="svc-name">{{ svc.name }}</text>
          <text class="svc-desc">{{ svc.desc }}</text>
        </view>
      </view>
    </view>

    <!-- ═══════════════ 四、AI今日推荐 ═══════════════ -->
    <view class="section-today">
      <view class="section-head">
        <view class="sh-left">
          <view class="ai-dot-pulse"></view>
          <text class="sh-title">AI今日推荐</text>
        </view>
        <text class="sh-more" @click="goMall">全部 ›</text>
      </view>
      <scroll-view scroll-x class="today-scroll" :show-scrollbar="false">
        <view
          v-for="(item, i) in todayRecommends"
          :key="item.id"
          class="today-card glass-card"
          @click="goDetail(item.id)"
          :style="{ animationDelay: (i * 0.1) + 's' }"
        >
          <view class="tc-img-box">
            <image :src="item.image" mode="aspectFill" class="tc-img" />
            <view class="tc-ai-tag">AI推荐</view>
          </view>
          <view class="tc-info">
            <text class="tc-name">{{ item.name }}</text>
            <view class="tc-stars">
              <text class="star-on" v-for="s in item.stars">★</text>
            </view>
            <view class="tc-reasons">
              <text class="tc-reason" v-for="r in item.reasons" :key="r">✓ {{ r }}</text>
            </view>
            <view class="tc-price-row">
              <view class="tc-price">
                <text class="tc-sym">¥</text>
                <text class="tc-val">{{ item.price }}</text>
              </view>
              <view class="tc-add-btn" @click.stop="addCart(item)">+</view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- ═══════════════ 五、中国风味地图入口 ═══════════════ -->
    <view class="section-flavor" @click="goFlavorMap">
      <view class="flavor-card glass-card">
        <view class="flavor-bg">
          <view class="flavor-map-lines"></view>
        </view>
        <view class="flavor-content">
          <view class="flavor-left">
            <text class="flavor-emoji">🗺</text>
            <view class="flavor-text">
              <text class="flavor-title">中国风味地图</text>
              <text class="flavor-sub">探索全国特色农产品</text>
            </view>
          </view>
          <view class="flavor-right">
            <view class="flavor-dots">
              <view class="fd-hot" v-for="d in flavorHotspots" :key="d.name" :style="d.style">
                <text class="fd-label">{{ d.name }}</text>
              </view>
            </view>
            <text class="flavor-arrow">→</text>
          </view>
        </view>
      </view>
    </view>

    <!-- ═══════════════ 六、助农专区 ═══════════════ -->
    <view class="section-nong">
      <view class="section-head">
        <view class="sh-left">
          <view class="sh-line"></view>
          <text class="sh-title">🌱 今日助农</text>
        </view>
      </view>
      <text class="nong-subtitle">帮助更多优质农产品走向全国</text>

      <!-- 主打助农产品 -->
      <view class="nong-hero-card glass-card" @click="goDetail(2)">
        <view class="nhc-img-area">
          <image src="/static/goods/blueberry.png" mode="aspectFill" class="nhc-img" />
          <view class="nhc-badge">🔥 热销</view>
        </view>
        <view class="nhc-info">
          <text class="nhc-name">云南高山蓝莓</text>
          <text class="nhc-origin">📌 云南大理 · 合作农户</text>
          <view class="nhc-progress">
            <view class="nhc-p-bar">
              <view class="nhc-p-fill" style="width: 72%"></view>
            </view>
            <text class="nhc-p-text">已帮助销售 12,000斤</text>
          </view>
          <view class="nhc-bottom">
            <view class="nhc-price">
              <text class="nhc-sym">¥</text>
              <text class="nhc-val">89</text>
              <text class="nhc-unit">/箱</text>
            </view>
            <view class="nhc-support-btn">立即支持 →</view>
          </view>
        </view>
      </view>

      <!-- 助农卡片列表 -->
      <view class="nong-cards">
        <view
          v-for="item in nongProducts"
          :key="item.id"
          class="nong-card glass-card"
          @click="goDetail(item.id)"
        >
          <image :src="item.image" mode="aspectFill" class="nc-img" />
          <text class="nc-name">{{ item.name }}</text>
          <text class="nc-from">{{ item.from }}</text>
          <view class="nc-price-row">
            <text class="nc-price">¥{{ item.price }}</text>
            <view class="nc-cart-btn" @click.stop="addCart(item)">+</view>
          </view>
        </view>
      </view>

      <!-- 公益数据 -->
      <view class="nong-stats glass-card">
        <view class="ns-item">
          <text class="ns-val">1,200+</text>
          <text class="ns-label">已帮助农户</text>
        </view>
        <view class="ns-divider"></view>
        <view class="ns-item">
          <text class="ns-val accent">58万斤</text>
          <text class="ns-label">累计销量</text>
        </view>
        <view class="ns-divider"></view>
        <view class="ns-item">
          <text class="ns-val">322个</text>
          <text class="ns-label">合作基地</text>
        </view>
      </view>
    </view>

    <!-- ═══════════════ 七、AI健康推荐 ═══════════════ -->
    <view class="section-health">
      <view class="section-head">
        <view class="sh-left">
          <view class="ai-dot-pulse"></view>
          <text class="sh-title">AI健康建议</text>
        </view>
        <text class="sh-more" @click="goAiCenter('nutritionist')">详细分析 ›</text>
      </view>
      <view class="health-panel glass-card">
        <view class="hp-score-row">
          <view class="hp-score-ring">
            <text class="hp-score-num">{{ healthScore }}</text>
            <text class="hp-score-unit">分</text>
          </view>
          <view class="hp-score-text">
            <text class="hp-score-label">您的饮食评分</text>
            <text class="hp-score-desc">比上周提升了2分</text>
          </view>
        </view>
        <view class="hp-divider"></view>
        <view class="hp-advice">
          <view class="hp-advice-section">
            <view class="hp-advice-label add">
              <text>🟢</text><text>建议增加</text>
            </view>
            <view class="hp-advice-tags">
              <text class="hp-tag add" v-for="item in healthAdd" :key="item">{{ item }}</text>
            </view>
          </view>
          <view class="hp-advice-section">
            <view class="hp-advice-label reduce">
              <text>🟡</text><text>建议减少</text>
            </view>
            <view class="hp-advice-tags">
              <text class="hp-tag reduce" v-for="item in healthReduce" :key="item">{{ item }}</text>
            </view>
          </view>
        </view>
      </view>
      <!-- 推荐商品 -->
      <view class="health-products">
        <view
          v-for="p in healthProducts"
          :key="p.id"
          class="hp-product glass-card"
          @click="goDetail(p.id)"
        >
          <image :src="p.image" mode="aspectFill" class="hpp-img" />
          <text class="hpp-name">{{ p.name }}</text>
          <text class="hpp-price">¥{{ p.price }}</text>
          <view class="hpp-add" @click.stop="addCart(p)">+</view>
        </view>
      </view>
    </view>

    <!-- ═══════════════ 八、AI农业资讯 ═══════════════ -->
    <view class="section-news">
      <view class="section-head">
        <view class="sh-left">
          <view class="sh-line"></view>
          <text class="sh-title">AI农业资讯</text>
        </view>
        <view class="news-ai-tag">AI精选</view>
      </view>
      <view class="news-list">
        <view
          v-for="(news, i) in aiNews"
          :key="i"
          class="news-item glass-card"
        >
          <view class="ni-dot"></view>
          <text class="ni-title">{{ news.title }}</text>
          <text class="ni-time">{{ news.time }}</text>
        </view>
      </view>
      <view class="news-summary glass-card">
        <view class="ns-head">
          <text class="ns-ai-icon">🤖</text>
          <text class="ns-ai-label">AI分析</text>
        </view>
        <text class="ns-summary-text">{{ aiSummary }}</text>
      </view>
    </view>

    <!-- ═══════════════ 九、猜你喜欢 ═══════════════ -->
    <view class="section-guess">
      <view class="section-head">
        <view class="sh-left">
          <view class="ai-dot-pulse"></view>
          <text class="sh-title">AI猜你喜欢</text>
        </view>
        <text class="sh-more" @click="goMall">更多 ›</text>
      </view>
      <view class="guess-grid">
        <view
          v-for="(item, i) in guessLikes"
          :key="item.id"
          class="guess-cell glass-card"
          @click="goDetail(item.id)"
          :style="{ animationDelay: (i * 0.08) + 's' }"
        >
          <image :src="item.image" mode="aspectFill" class="gc-img" />
          <view class="gc-info">
            <text class="gc-name">{{ item.name }}</text>
            <text class="gc-reason">{{ item.reason }}</text>
            <view class="gc-stars-row">
              <text class="star-on" v-for="s in 5" :key="s">★</text>
            </view>
            <view class="gc-price-row">
              <text class="gc-price">¥{{ item.price }}</text>
              <view class="gc-add" @click.stop="addCart(item)">+</view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- ═══════════════ 十、AI悬浮助手按钮 ═══════════════ -->
    <view class="fab-area">
      <view class="fab-menu" :class="{ open: fabOpen }">
        <view class="fab-menu-item" @click="fabAction('diet-advisor')">
          <view class="fmi-icon" style="background: #16C47F;">🍽</view>
          <text class="fmi-label">饮食顾问</text>
        </view>
        <view class="fab-menu-item" @click="fabAction('nutritionist')">
          <view class="fmi-icon" style="background: #0A84FF;">🥗</view>
          <text class="fmi-label">AI营养师</text>
        </view>
        <view class="fab-menu-item" @click="fabAction('smart-shopping')">
          <view class="fmi-icon" style="background: #F59E0B;">🛒</view>
          <text class="fmi-label">智能选购</text>
        </view>
      </view>
      <view class="fab-btn" :class="{ active: fabOpen }" @click="fabOpen = !fabOpen">
        <text class="fab-icon">{{ fabOpen ? '✕' : '🤖' }}</text>
        <view class="fab-ripple" v-if="!fabOpen"></view>
      </view>
    </view>

    <!-- 底部间距 -->
    <view style="height: 160rpx;"></view>

    <!-- 底部导航 -->
    <CustomTabBar page="home" />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import CustomTabBar from '@/components/CustomTabBar.vue'

// ============ 问候语 ============
const greeting = computed(() => {
  const hour = new Date().getHours()
  const name = '小农' // 可从userStore读取
  const prefix = hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好'
  return `${prefix}，${name}`
})

// ============ 每日建议 ============
const dailyTips = ref([
  '今日适合补充维生素C',
  '推荐云南蓝莓，新鲜上市',
  '广东荔枝今日上市，尝鲜推荐'
])

// ============ Hero 粒子动画 ============
function heroDotStyle(n) {
  const seed = n * 7
  return {
    left: ((seed * 13) % 90 + 5) + '%',
    top: ((seed * 17) % 70 + 15) + '%',
    animationDelay: ((seed * 3) % 5) + 's',
    animationDuration: (2 + (seed % 3)) + 's',
    width: (4 + (seed % 6)) + 'rpx',
    height: (4 + (seed % 6)) + 'rpx'
  }
}

// ============ AI快捷服务 ============
const aiServices = ref([
  { key: 'diet', name: 'AI饮食顾问', desc: '制定专属饮食方案', icon: '🍽', bg: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)', module: 'diet-advisor' },
  { key: 'nutrition', name: 'AI营养师', desc: '分析营养与健康', icon: '🥗', bg: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', module: 'nutritionist' },
  { key: 'shopping', name: 'AI智能选购', desc: '精准推荐好物', icon: '🛒', bg: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', module: 'smart-shopping' },
  { key: 'health', name: 'AI健康分析', desc: '全方位评估', icon: '📈', bg: 'linear-gradient(135deg, #F3E8FF, #E9D5FF)', module: 'nutritionist' },
])

// ============ AI今日推荐 ============
const todayRecommends = ref([
  {
    id: 1, name: '阿克苏冰糖心苹果', price: 68, stars: 5,
    image: '/static/goods/apple.png',
    reasons: ['当季新鲜', '富含维C', '销量增长32%']
  },
  {
    id: 2, name: '云南高山蓝莓', price: 89, stars: 5,
    image: '/static/goods/blueberry.png',
    reasons: ['适合减脂', '适合儿童', '今日优惠']
  },
  {
    id: 3, name: '西湖龙井明前特级', price: 298, stars: 4,
    image: '/static/goods/tea.png',
    reasons: ['送礼首选', '好评率高', '限量发售']
  },
  {
    id: 5, name: '五常稻花香大米', price: 128, stars: 5,
    image: '/static/goods/rice.png',
    reasons: ['家庭必备', '有机认证', '复购之王']
  },
  {
    id: 4, name: '宁夏中宁有机枸杞', price: 45, stars: 4,
    image: '/static/goods/goji.png',
    reasons: ['养生推荐', '性价比高', '产地直发']
  }
])

// ============ 风味地图热点 ============
const flavorHotspots = ref([
  { name: '新疆', style: { top: '20%', left: '28%' } },
  { name: '云南', style: { top: '55%', left: '30%' } },
  { name: '福建', style: { top: '42%', left: '72%' } },
  { name: '宁夏', style: { top: '28%', left: '45%' } },
  { name: '四川', style: { top: '48%', left: '40%' } }
])

// ============ 助农产品 ============
const nongProducts = ref([
  { id: 1, name: '新疆阿克苏苹果', price: 68, image: '/static/goods/apple.png', from: '新疆阿克苏' },
  { id: 12, name: '赤峰有机小米', price: 36, image: '/static/goods/millet.png', from: '内蒙古赤峰' },
  { id: 11, name: '赣南脐橙', price: 52, image: '/static/goods/orange.png', from: '江西赣州' }
])

// ============ AI健康建议 ============
const healthScore = ref(87)
const healthAdd = ref(['山药', '燕麦', '苹果', '蓝莓'])
const healthReduce = ref(['高糖饮料', '油炸食品'])

const healthProducts = ref([
  { id: 1, name: '河南铁棍山药', price: 38, image: '/static/goods/goji.png' },
  { id: 12, name: '赤峰有机燕麦', price: 42, image: '/static/goods/millet.png' },
  { id: 1, name: '新疆苹果', price: 68, image: '/static/goods/apple.png' }
])

// ============ AI农业资讯 ============
const aiNews = ref([
  { title: '广东荔枝大量上市，品质优良', time: '2小时前' },
  { title: '云南蓝莓进入最佳采摘期', time: '5小时前' },
  { title: '本周苹果市场价上涨8%', time: '8小时前' },
])
const aiSummary = ref('本周水果价格整体趋稳，蓝莓、荔枝等季节性水果供应充足。建议近期购买蓝莓，品质最佳且价格适中。')

// ============ 猜你喜欢 ============
const guessLikes = ref([
  { id: 1, name: '新疆阿克苏苹果', price: 68, image: '/static/goods/apple.png', reason: '你最近购买了燕麦，适合搭配' },
  { id: 5, name: '五常有机大米', price: 128, image: '/static/goods/rice.png', reason: '根据你的健康需求推荐' },
  { id: 2, name: '云南高山蓝莓', price: 89, image: '/static/goods/blueberry.png', reason: '当季新鲜，你可能会喜欢' },
  { id: 4, name: '宁夏有机枸杞', price: 45, image: '/static/goods/goji.png', reason: '养生好物，季节推荐' }
])

// ============ FAB悬浮按钮 ============
const fabOpen = ref(false)

function fabAction(module) {
  fabOpen.value = false
  uni.showToast({ title: '跳转到AI中心', icon: 'none' })
}

// ============ 导航函数 ============
function goAiCenter(module) {
  uni.switchTab({ url: '/pages/consumer/ai-center/index' })
}
function goMall() {
  uni.switchTab({ url: '/pages/consumer/mall/index' })
}
function goFlavorMap() {
  uni.switchTab({ url: '/pages/consumer/ai-center/index' })
}
function goDetail(id) {
  uni.navigateTo({ url: `/pages/consumer/mall/detail?id=${id}` })
}
function addCart(item) {
  uni.showToast({ title: '已加入购物车', icon: 'success', duration: 800 })
}
function focusSearch() {
  uni.showToast({ title: 'AI智能搜索开发中', icon: 'none' })
}
function voiceSearch() {
  uni.showToast({ title: '语音搜索开发中', icon: 'none' })
}
function aiRecognition() {
  uni.showToast({ title: 'AI识物开发中', icon: 'none' })
}
</script>

<style lang="scss" scoped>
/* ═══════════════ 全局变量 ═══════════════ */
$primary: #0D7B3E;
$primary-light: #10B981;
$cyan: #00D4AA;
$blue: #0A84FF;
$amber: #F59E0B;
$text: #0F172A;
$text-secondary: #64748B;
$border: #E2E8F0;
$radius: 24rpx;

/* ═══════════════ 页面 ═══════════════ */
.home-page {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* ═══════════════ 背景装饰 ═══════════════ */
.bg-layer { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.bg-glow {
  position: absolute; border-radius: 50%;
  &.bg-glow-1 {
    width: 500rpx; height: 500rpx;
    background: radial-gradient(circle, rgba(0,212,170,.06), transparent 70%);
    top: -100rpx; right: -120rpx;
  }
  &.bg-glow-2 {
    width: 400rpx; height: 400rpx;
    background: radial-gradient(circle, rgba(13,123,62,.05), transparent 70%);
    bottom: 300rpx; left: -80rpx;
  }
}

/* ═══════════════ 通用Glass Card ═══════════════ */
.glass-card {
  background: #FFF;
  border-radius: $radius;
  border: 1rpx solid #EEF2EC;
  box-shadow: 0 2rpx 16rpx rgba(0,0,0,.04);
  transition: all .25s cubic-bezier(0.16, 1, 0.3, 1);
  &:active { transform: scale(.97); box-shadow: 0 4rpx 24rpx rgba(0,0,0,.08); }
}

/* ═══════════════ Section头部通用 ═══════════════ */
.section-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8rpx 28rpx 16rpx;
}
.sh-left { display: flex; align-items: center; gap: 10rpx; }
.sh-line {
  width: 4rpx; height: 28rpx;
  background: linear-gradient(180deg, $primary, $primary-light);
  border-radius: 2rpx;
}
.sh-title {
  font-size: 30rpx; font-weight: 800; color: $text;
}
.ai-dot-pulse {
  width: 10rpx; height: 10rpx;
  background: $cyan;
  border-radius: 50%;
  box-shadow: 0 0 10rpx rgba(0,212,170,.5);
  animation: ai-dot-pulse 2s ease-in-out infinite;
}
@keyframes ai-dot-pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 6rpx $cyan; }
  50% { opacity: .4; box-shadow: 0 0 16rpx $cyan; }
}
.sh-more {
  font-size: 24rpx; color: $text-secondary; font-weight: 500;
}

/* ═══════════════ 一、Hero ═══════════════ */
.section-hero { position: relative; z-index: 2; padding: 20rpx 24rpx 0; }

.hero-card {
  position: relative;
  background: linear-gradient(145deg, #0C1F3A 0%, #0A1628 40%, #0F2648 100%);
  border-radius: 36rpx;
  padding: 44rpx 34rpx 36rpx;
  overflow: hidden;
  box-shadow: 0 10rpx 60rpx rgba(10,20,45,.3);
}

.hero-bg-glow {
  position: absolute;
  top: -50%; right: -30%;
  width: 400rpx; height: 400rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0,212,170,.18), transparent 65%);
}

/* 粒子 */
.hero-particles {
  position: absolute; inset: 0; pointer-events: none;
}
.hp-dot {
  position: absolute;
  background: rgba(0,212,170,.35);
  border-radius: 50%;
  animation: hp-float 3s ease-in-out infinite;
}
@keyframes hp-float {
  0%, 100% { transform: translateY(0) scale(1); opacity: .3; }
  50% { transform: translateY(-20rpx) scale(1.6); opacity: .1; }
}

.hero-content { position: relative; z-index: 2; }

/* 标签 */
.hero-badge {
  display: inline-flex; align-items: center; gap: 10rpx;
  background: rgba(22,196,127,.15);
  border: 1rpx solid rgba(22,196,127,.25);
  border-radius: 40rpx;
  padding: 8rpx 20rpx;
  margin-bottom: 24rpx;

  .badge-dot {
    width: 12rpx; height: 12rpx;
    background: #16C47F;
    border-radius: 50%;
    box-shadow: 0 0 12rpx rgba(22,196,127,.6);
    animation: breath 2s ease infinite;
  }
  .badge-text {
    font-size: 22rpx; color: #16C47F; font-weight: 600;
  }
}
@keyframes breath {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: .5; transform: scale(1.4); }
}

/* 问候 */
.hero-greeting {
  display: flex; align-items: center; gap: 12rpx;
  margin-bottom: 22rpx;
  .greeting-emoji { font-size: 40rpx; }
  .greeting-text { font-size: 34rpx; color: #FFF; font-weight: 700; }
  .greeting-wave { font-size: 32rpx; }
}

/* 今日建议 */
.hero-tips { margin-bottom: 28rpx; }
.tips-label {
  font-size: 22rpx; color: rgba(255,255,255,.45);
  font-weight: 500; margin-bottom: 12rpx; display: block;
}
.tips-list { display: flex; flex-direction: column; gap: 10rpx; }
.tip-row { display: flex; align-items: center; gap: 12rpx; }
.tip-check {
  width: 32rpx; height: 32rpx;
  border-radius: 50%;
  background: rgba(22,196,127,.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 18rpx; color: #16C47F; font-weight: 700;
  flex-shrink: 0;
}
.tip-text { font-size: 24rpx; color: rgba(255,255,255,.7); }

/* CTA按钮 */
.hero-cta {
  display: flex; align-items: center; justify-content: center; gap: 12rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #16C47F, #0D9E5E);
  border-radius: 22rpx;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8rpx 28rpx rgba(22,196,127,.35);

  .cta-glow {
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,.2) 50%, transparent 100%);
    animation: cta-shine 3s ease-in-out infinite;
  }
  .cta-text { font-size: 28rpx; color: #FFF; font-weight: 700; position: relative; z-index: 1; }
  .cta-arrow { font-size: 26rpx; color: #FFF; position: relative; z-index: 1; }
  &:active { transform: scale(.96); }
}
@keyframes cta-shine {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
}

/* ═══════════════ 二、搜索栏 ═══════════════ */
.section-search { position: relative; z-index: 2; padding: 20rpx 24rpx; }

.search-card {
  display: flex; align-items: center; gap: 10rpx;
  padding: 12rpx 18rpx;
  border-radius: 48rpx;
}

.search-main {
  flex: 1; display: flex; align-items: center; gap: 10rpx;
  padding: 14rpx 16rpx;
  background: #F5F7F3;
  border-radius: 40rpx;

  .search-icon { font-size: 26rpx; }
  .search-placeholder { font-size: 26rpx; color: #94A3B8; }
}

.search-actions {
  display: flex; align-items: center; gap: 6rpx;
  flex-shrink: 0;
}

.sa-btn {
  width: 60rpx; height: 60rpx;
  border-radius: 50%;
  background: #F5F7F3;
  display: flex; align-items: center; justify-content: center;
  font-size: 26rpx;
  &:active { transform: scale(.9); }
}

.sa-divider {
  width: 1rpx; height: 28rpx; background: #E8EDE8;
}

/* ═══════════════ 三、AI快捷服务 ═══════════════ */
.section-ai-services { position: relative; z-index: 2; padding: 0 24rpx; }

.services-grid {
  display: flex; gap: 14rpx;
  padding: 0 4rpx;
}

.svc-card {
  flex: 1;
  display: flex; flex-direction: column; align-items: center;
  padding: 24rpx 14rpx 20rpx;
  gap: 8rpx;

  &.pulse { animation: svc-pulse 3s ease-in-out infinite; }

  .svc-icon-wrap {
    width: 68rpx; height: 68rpx;
    border-radius: 18rpx;
    display: flex; align-items: center; justify-content: center;
    position: relative;
    .svc-icon { font-size: 32rpx; }
    .svc-hot-dot {
      position: absolute; top: -4rpx; right: -4rpx;
      width: 12rpx; height: 12rpx;
      background: #EF4444;
      border-radius: 50%;
      border: 2rpx solid #FFF;
    }
  }
  .svc-name {
    font-size: 24rpx; font-weight: 700; color: $text;
    text-align: center;
  }
  .svc-desc {
    font-size: 18rpx; color: $text-secondary;
    text-align: center;
  }
}
@keyframes svc-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,.2); }
  50% { box-shadow: 0 0 0 12rpx rgba(245,158,11,0); }
}

/* ═══════════════ 四、AI今日推荐 ═══════════════ */
.section-today { position: relative; z-index: 2; margin-top: 8rpx; }

.today-scroll {
  display: flex; padding: 0 24rpx; white-space: nowrap;
}

.today-card {
  display: inline-flex; flex-direction: column;
  width: 280rpx;
  margin-right: 18rpx;
  overflow: hidden;
  animation: fadeInUp .5s cubic-bezier(0.16, 1, 0.3, 1) both;
  &:last-child { margin-right: 24rpx; }
}

.tc-img-box {
  width: 100%; height: 200rpx; position: relative; overflow: hidden;
  .tc-img { width: 100%; height: 100%; }
  .tc-ai-tag {
    position: absolute; top: 10rpx; right: 10rpx;
    padding: 4rpx 14rpx;
    background: linear-gradient(135deg, $cyan, $blue);
    border-radius: 12rpx;
    font-size: 18rpx; color: #FFF; font-weight: 700;
  }
}

.tc-info {
  padding: 16rpx 18rpx 14rpx;
  white-space: normal;

  .tc-name {
    font-size: 26rpx; font-weight: 700; color: $text;
    display: block; margin-bottom: 6rpx;
  }
  .tc-stars {
    margin-bottom: 8rpx;
    .star-on { font-size: 20rpx; color: $amber; }
  }
  .tc-reasons {
    display: flex; flex-wrap: wrap; gap: 6rpx;
    margin-bottom: 12rpx;
    .tc-reason {
      font-size: 18rpx; color: $cyan;
      background: rgba(0,212,170,.08);
      padding: 2rpx 10rpx; border-radius: 8rpx;
      font-weight: 500;
    }
  }
  .tc-price-row {
    display: flex; align-items: center; justify-content: space-between;
    .tc-price {
      .tc-sym { font-size: 20rpx; color: #E74C3C; font-weight: 700; }
      .tc-val { font-size: 30rpx; color: #E74C3C; font-weight: 800; }
    }
    .tc-add-btn {
      width: 42rpx; height: 42rpx;
      background: linear-gradient(135deg, $primary, $primary-light);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: #FFF; font-size: 24rpx; font-weight: 700;
      box-shadow: 0 3rpx 12rpx rgba(13,123,62,.2);
      &:active { transform: scale(.85); }
    }
  }
}

/* ═══════════════ 五、中国风味地图 ═══════════════ */
.section-flavor {
  position: relative; z-index: 2;
  padding: 20rpx 24rpx;
}

.flavor-card {
  border-radius: 28rpx;
  overflow: hidden;
  position: relative;
  background: linear-gradient(135deg, #0C1F3A 0%, #122845 50%, #091730 100%);
}

.flavor-bg {
  position: absolute; inset: 0;
  .flavor-map-lines {
    position: absolute; inset: 0;
    opacity: .06;
    background-image:
      linear-gradient(45deg, #00D4AA 1rpx, transparent 1rpx),
      linear-gradient(-45deg, #0A84FF 1rpx, transparent 1rpx);
    background-size: 40rpx 40rpx;
  }
}

.flavor-content {
  display: flex; align-items: center; justify-content: space-between;
  padding: 28rpx 28rpx;
  position: relative; z-index: 1;
}

.flavor-left {
  display: flex; align-items: center; gap: 16rpx;
  .flavor-emoji { font-size: 48rpx; }
  .flavor-text {
    display: flex; flex-direction: column; gap: 4rpx;
    .flavor-title { font-size: 28rpx; font-weight: 800; color: #FFF; }
    .flavor-sub  { font-size: 22rpx; color: rgba(255,255,255,.55); }
  }
}

.flavor-right {
  display: flex; align-items: center; gap: 16rpx;

  .flavor-dots {
    position: relative;
    width: 120rpx; height: 80rpx;
  }

  .fd-hot {
    position: absolute;
    .fd-label {
      font-size: 18rpx; color: rgba(255,255,255,.5); font-weight: 500;
      position: relative;
      &::before {
        content: '';
        width: 6rpx; height: 6rpx;
        background: $cyan;
        border-radius: 50%;
        position: absolute;
        left: 50%; top: -14rpx;
        transform: translateX(-50%);
        box-shadow: 0 0 8rpx rgba(0,212,170,.6);
      }
    }
  }

  .flavor-arrow {
    width: 44rpx; height: 44rpx;
    border-radius: 50%;
    background: rgba(255,255,255,.1);
    display: flex; align-items: center; justify-content: center;
    font-size: 22rpx; color: #FFF;
  }
}

/* ═══════════════ 六、助农专区 ═══════════════ */
.section-nong { position: relative; z-index: 2; padding: 0 24rpx; }

.nong-subtitle {
  font-size: 22rpx; color: $text-secondary;
  padding: 0 28rpx 14rpx; display: block;
}

.nong-hero-card {
  display: flex;
  padding: 20rpx;
  margin-bottom: 18rpx;
  border: 2rpx solid rgba($primary-light, .15);
  background: linear-gradient(135deg, #FFF, #F0FDF5);
}

.nhc-img-area {
  width: 180rpx; height: 180rpx;
  border-radius: 18rpx;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
  .nhc-img { width: 100%; height: 100%; }
  .nhc-badge {
    position: absolute; top: 8rpx; left: 8rpx;
    padding: 4rpx 14rpx;
    background: linear-gradient(135deg, #EF4444, #F59E0B);
    border-radius: 10rpx;
    font-size: 18rpx; color: #FFF; font-weight: 700;
  }
}

.nhc-info {
  flex: 1; margin-left: 18rpx; display: flex; flex-direction: column; justify-content: space-between;
  min-width: 0;

  .nhc-name {
    font-size: 28rpx; font-weight: 800; color: $text;
    margin-bottom: 2rpx;
  }
  .nhc-origin {
    font-size: 20rpx; color: $text-secondary;
    margin-bottom: 8rpx;
  }
}

.nhc-progress {
  margin-bottom: 8rpx;
  .nhc-p-bar {
    width: 100%; height: 8rpx;
    background: #E8EDE8; border-radius: 4rpx;
    overflow: hidden; margin-bottom: 6rpx;
    .nhc-p-fill {
      height: 100%; border-radius: 4rpx;
      background: linear-gradient(90deg, $primary-light, $cyan);
    }
  }
  .nhc-p-text { font-size: 18rpx; color: $primary; font-weight: 600; }
}

.nhc-bottom {
  display: flex; align-items: center; justify-content: space-between;
  .nhc-price {
    .nhc-sym { font-size: 20rpx; color: #E74C3C; font-weight: 700; }
    .nhc-val { font-size: 32rpx; color: #E74C3C; font-weight: 800; }
    .nhc-unit { font-size: 20rpx; color: $text-secondary; }
  }
  .nhc-support-btn {
    padding: 10rpx 20rpx;
    background: linear-gradient(135deg, $primary, $primary-light);
    border-radius: 20rpx;
    font-size: 22rpx; color: #FFF; font-weight: 600;
    box-shadow: 0 4rpx 14rpx rgba(13,123,62,.25);
    &:active { transform: scale(.94); }
  }
}

.nong-cards {
  display: flex; gap: 14rpx; margin-bottom: 18rpx;
}

.nong-card {
  flex: 1;
  display: flex; flex-direction: column; align-items: center;
  padding: 18rpx 12rpx 14rpx;
  gap: 6rpx;

  .nc-img {
    width: 100rpx; height: 100rpx;
    border-radius: 18rpx;
  }
  .nc-name {
    font-size: 24rpx; font-weight: 700; color: $text;
    text-align: center;
  }
  .nc-from {
    font-size: 18rpx; color: $text-secondary;
  }
  .nc-price-row {
    display: flex; align-items: center; gap: 16rpx;
    width: 100%; justify-content: center;
    .nc-price { font-size: 28rpx; font-weight: 800; color: #E74C3C; }
    .nc-cart-btn {
      width: 40rpx; height: 40rpx;
      background: $primary-light;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: #FFF; font-size: 22rpx; font-weight: 700;
      &:active { transform: scale(.85); }
    }
  }
}

.nong-stats {
  display: flex; align-items: center;
  padding: 24rpx 20rpx;
  margin-bottom: 8rpx;

  .ns-item {
    flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4rpx;
    .ns-val {
      font-size: 32rpx; font-weight: 800; color: $text;
      &.accent { color: $primary; }
    }
    .ns-label { font-size: 20rpx; color: $text-secondary; font-weight: 500; }
  }
  .ns-divider {
    width: 1rpx; height: 40rpx; background: #E8EDE8;
  }
}

/* ═══════════════ 七、AI健康建议 ═══════════════ */
.section-health {
  position: relative; z-index: 2;
  padding: 8rpx 24rpx;
}

.health-panel {
  padding: 28rpx 24rpx;
  margin-bottom: 18rpx;
}

.hp-score-row {
  display: flex; align-items: center; gap: 24rpx;
  margin-bottom: 20rpx;

  .hp-score-ring {
    width: 110rpx; height: 110rpx;
    border-radius: 50%;
    background: conic-gradient($primary-light 0% 87%, #E8F5E9 87% 100%);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    position: relative;
    flex-shrink: 0;

    &::after {
      content: '';
      position: absolute;
      width: 82rpx; height: 82rpx;
      border-radius: 50%;
      background: #FFF;
    }

    .hp-score-num {
      position: relative; z-index: 2;
      font-size: 38rpx; font-weight: 800; color: $text;
    }
    .hp-score-unit {
      position: relative; z-index: 2;
      font-size: 18rpx; color: $text-secondary;
    }
  }

  .hp-score-text {
    .hp-score-label {
      display: block;
      font-size: 26rpx; font-weight: 700; color: $text;
      margin-bottom: 4rpx;
    }
    .hp-score-desc {
      font-size: 20rpx; color: #16C47F; font-weight: 500;
    }
  }
}

.hp-divider {
  height: 1rpx; background: #ECF0EB;
  margin-bottom: 18rpx;
}

.hp-advice-section {
  margin-bottom: 14rpx;
  &:last-child { margin-bottom: 0; }
}

.hp-advice-label {
  display: flex; align-items: center; gap: 6rpx;
  font-size: 22rpx; font-weight: 600;
  margin-bottom: 10rpx;

  &.add { color: $primary; }
  &.reduce { color: #F59E0B; }
}

.hp-advice-tags {
  display: flex; flex-wrap: wrap; gap: 10rpx;
}

.hp-tag {
  padding: 8rpx 18rpx;
  border-radius: 14rpx;
  font-size: 22rpx; font-weight: 500;

  &.add { background: rgba(16,185,129,.08); color: $primary-light; }
  &.reduce { background: rgba(245,158,11,.08); color: $amber; }
}

.health-products {
  display: flex; gap: 12rpx;
}

.hp-product {
  flex: 1;
  display: flex; flex-direction: column; align-items: center;
  padding: 16rpx 10rpx 14rpx;
  gap: 6rpx;

  .hpp-img {
    width: 90rpx; height: 90rpx;
    border-radius: 16rpx;
  }
  .hpp-name {
    font-size: 22rpx; font-weight: 600; color: $text;
    text-align: center;
  }
  .hpp-price {
    font-size: 26rpx; font-weight: 800; color: #E74C3C;
  }
  .hpp-add {
    width: 38rpx; height: 38rpx;
    background: $primary-light;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: #FFF; font-size: 20rpx; font-weight: 700;
    &:active { transform: scale(.85); }
  }
}

/* ═══════════════ 八、AI农业资讯 ═══════════════ */
.section-news {
  position: relative; z-index: 2;
  padding: 8rpx 24rpx;
}

.news-ai-tag {
  padding: 6rpx 18rpx;
  background: rgba(0,212,170,.08);
  border: 1rpx solid rgba(0,212,170,.25);
  border-radius: 20rpx;
  font-size: 20rpx; color: $cyan; font-weight: 600;
}

.news-list {
  display: flex; flex-direction: column;
  gap: 10rpx;
  margin-bottom: 16rpx;
}

.news-item {
  display: flex; align-items: center; gap: 14rpx;
  padding: 20rpx 22rpx;

  .ni-dot {
    width: 8rpx; height: 8rpx;
    background: $primary-light;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .ni-title {
    flex: 1;
    font-size: 26rpx; color: $text; font-weight: 500;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .ni-time {
    font-size: 20rpx; color: #94A3B8;
    flex-shrink: 0;
  }
}

.news-summary {
  padding: 22rpx 24rpx;
  background: linear-gradient(135deg, rgba(0,212,170,.02), rgba(10,132,255,.02));
  border: 1rpx solid rgba(0,212,170,.1);
}

.ns-head {
  display: flex; align-items: center; gap: 8rpx;
  margin-bottom: 10rpx;
  .ns-ai-icon { font-size: 24rpx; }
  .ns-ai-label {
    font-size: 22rpx; font-weight: 700;
    color: $cyan;
  }
}
.ns-summary-text {
  font-size: 24rpx; color: $text-secondary;
  line-height: 1.6;
}

/* ═══════════════ 九、猜你喜欢 ═══════════════ */
.section-guess {
  position: relative; z-index: 2;
  padding: 8rpx 24rpx;
}

.guess-grid {
  display: flex; flex-wrap: wrap;
  gap: 14rpx;
  padding: 0 4rpx;
}

.guess-cell {
  width: calc(50% - 7rpx);
  overflow: hidden;
  animation: fadeInUp .5s cubic-bezier(0.16, 1, 0.3, 1) both;

  .gc-img {
    width: 100%; height: 210rpx;
    background: #F8FAF7;
  }
  .gc-info {
    padding: 14rpx 16rpx 16rpx;
    .gc-name {
      font-size: 26rpx; font-weight: 700; color: $text;
      display: block; margin-bottom: 6rpx;
    }
    .gc-reason {
      font-size: 20rpx; color: $cyan;
      margin-bottom: 8rpx;
      display: block;
    }
    .gc-stars-row {
      margin-bottom: 10rpx;
      .star-on { font-size: 18rpx; color: $amber; }
    }
    .gc-price-row {
      display: flex; align-items: center; justify-content: space-between;
      .gc-price { font-size: 28rpx; font-weight: 800; color: #E74C3C; }
      .gc-add {
        width: 40rpx; height: 40rpx;
        background: linear-gradient(135deg, $primary, $primary-light);
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        color: #FFF; font-size: 22rpx; font-weight: 700;
        box-shadow: 0 3rpx 10rpx rgba(13,123,62,.2);
        &:active { transform: scale(.85); }
      }
    }
  }
}

/* ═══════════════ 十、悬浮按钮 ═══════════════ */
.fab-area {
  position: fixed;
  right: 28rpx;
  bottom: 200rpx;
  z-index: 99;
  display: flex; flex-direction: column; align-items: flex-end;
  gap: 16rpx;
}

.fab-menu {
  display: flex; flex-direction: column;
  gap: 14rpx;
  opacity: 0;
  transform: translateY(20rpx);
  pointer-events: none;
  transition: all .35s cubic-bezier(0.16, 1, 0.3, 1);

  &.open {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
}

.fab-menu-item {
  display: flex; align-items: center; gap: 10rpx;
  .fmi-icon {
    width: 52rpx; height: 52rpx;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 22rpx;
    box-shadow: 0 4rpx 16rpx rgba(0,0,0,.15);
    &:active { transform: scale(.88); }
  }
  .fmi-label {
    font-size: 22rpx; color: $text; font-weight: 600;
    background: #FFF;
    padding: 6rpx 18rpx;
    border-radius: 16rpx;
    box-shadow: 0 2rpx 12rpx rgba(0,0,0,.06);
  }
}

.fab-btn {
  width: 96rpx; height: 96rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #16C47F, #0D9E5E);
  box-shadow: 0 8rpx 32rpx rgba(22,196,127,.4);
  display: flex; align-items: center; justify-content: center;
  transition: all .35s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;

  &.active {
    background: #FFF;
    box-shadow: 0 8rpx 32rpx rgba(0,0,0,.15);
    .fab-icon { color: $text; }
  }

  .fab-icon { font-size: 40rpx; color: #FFF; position: relative; z-index: 2; }
  .fab-ripple {
    position: absolute; inset: -6rpx;
    border-radius: 50%;
    border: 3rpx solid rgba(22,196,127,.3);
    animation: fab-ripple 2s ease-out infinite;
  }
}

@keyframes fab-ripple {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}

/* ═══════════════ 通用动画 ═══════════════ */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24rpx); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
