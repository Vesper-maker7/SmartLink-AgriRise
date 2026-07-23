<template>
  <view class="mall-page bg-gradient-page safe-area-bottom">

    <!-- ═══════════════ 头部搜索区 ═══════════════ -->
    <view class="mall-header">
      <view class="header-top-row">
        <view class="logo-area">
          <text class="logo-icon">🌾</text>
          <text class="logo-text text-gradient-green">智链优选</text>
        </view>
        <view class="header-actions">
          <view class="icon-btn" @click="toggleView" v-if="false">
            <text>{{ viewMode === 'grid' ? '☰' : '⊞' }}</text>
          </view>
          <view class="icon-btn cart-btn" @click="goCart">
            <text>🛒</text>
            <view class="cart-badge" v-if="cartCount > 0">{{ cartCount > 99 ? '99+' : cartCount }}</view>
          </view>
        </view>
      </view>
      <view class="search-box" @click="focusSearch">
        <text class="search-icon">🔍</text>
        <text class="search-placeholder">搜索农产品、产地、品牌...</text>
        <view class="search-ai-tag">
          <text class="ai-dot"></text>
          <text>AI推荐</text>
        </view>
      </view>
      <!-- 今日数据小条 -->
      <view class="stats-strip">
        <view class="stat-item">
          <text class="stat-val">{{ productCount }}</text>
          <text class="stat-label">好物</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-val">{{ organicCount }}</text>
          <text class="stat-label">有机认证</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-val">{{ originCount }}</text>
          <text class="stat-label">产地直发</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-val accent">AI</text>
          <text class="stat-label">智能甄选</text>
        </view>
      </view>
    </view>

    <!-- ═══════════════ 分类导航 ═══════════════ -->
    <view class="category-section">
      <scroll-view scroll-x class="category-scroll" :show-scrollbar="false">
        <view
          class="category-chip"
          v-for="item in categories"
          :key="item.value"
          :class="{ active: activeCategory === item.value }"
          @click="switchCategory(item.value)"
        >
          <text class="chip-icon">{{ item.icon }}</text>
          <text class="chip-label">{{ item.label }}</text>
        </view>
      </scroll-view>
    </view>

    <!-- ═══════════════ AI精选推荐 ═══════════════ -->
    <view class="section-block" v-if="aiProducts.length">
      <view class="section-head">
        <view class="section-head-left">
          <text class="ai-dot"></text>
          <text class="section-title">AI 为你甄选</text>
        </view>
        <text class="section-more" @click="changeAIRecommend">换一批 ⟳</text>
      </view>
      <scroll-view scroll-x class="ai-scroll" :show-scrollbar="false">
        <view
          class="ai-product-card"
          v-for="(item, i) in aiProducts"
          :key="item.id"
          @click="goDetail(item)"
          :style="{ animationDelay: (i * 0.1) + 's' }"
        >
          <view class="apc-image-box">
            <image :src="item.image" mode="aspectFill" class="apc-image" />
            <view class="apc-badge" v-if="item.reason">
              <text>🤖 {{ item.reason }}</text>
            </view>
          </view>
          <view class="apc-info">
            <text class="apc-name text-ellipsis">{{ item.name }}</text>
            <view class="apc-meta">
              <text class="apc-origin">{{ item.origin }}</text>
              <text class="apc-score">★ {{ item.rating }}</text>
            </view>
            <view class="apc-price-row">
              <view class="apc-price">
                <text class="apc-sym">¥</text>
                <text class="apc-val">{{ item.price }}</text>
              </view>
              <view class="apc-cart-btn" @click.stop="addCart(item)">+</view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- ═══════════════ 热门推荐 / 全部商品 ═══════════════ -->
    <view class="section-block">
      <view class="section-head">
        <view class="section-head-left">
          <view class="section-line"></view>
          <text class="section-title">{{ activeCategoryLabel }}</text>
        </view>
        <view class="sort-tabs">
          <text
            class="sort-item"
            :class="{ active: sortBy === 'default' }"
            @click="sortBy = 'default'"
          >推荐</text>
          <text
            class="sort-item"
            :class="{ active: sortBy === 'sales' }"
            @click="sortBy = 'sales'"
          >销量</text>
          <text
            class="sort-item"
            :class="{ active: sortBy === 'price' }"
            @click="togglePriceSort"
          >价格{{ sortBy === 'price-asc' ? '↑' : sortBy === 'price-desc' ? '↓' : '' }}</text>
        </view>
      </view>

      <!-- 商品网格 -->
      <view class="product-grid">
        <view
          class="product-cell"
          v-for="(item, i) in filteredProducts"
          :key="item.id"
          @click="goDetail(item)"
          :style="{ animationDelay: (i * 0.05) + 's' }"
        >
          <view class="pc-image-box">
            <image :src="item.image" mode="aspectFill" class="pc-image" />
            <view v-if="item.traceCode" class="pc-tag trace">溯源</view>
            <view v-if="item.isNew" class="pc-tag new">首发</view>
            <view v-if="item.isOrganic" class="pc-tag organic">有机</view>
          </view>
          <view class="pc-info">
            <text class="pc-name text-ellipsis-2">{{ item.name }}</text>
            <text class="pc-origin">📌 {{ item.origin }}</text>
            <view class="pc-bottom-row">
              <view class="pc-price">
                <text class="pc-sym">¥</text>
                <text class="pc-val">{{ item.price }}</text>
                <text class="pc-unit" v-if="item.unit">/{{ item.unit }}</text>
              </view>
              <view class="pc-cart-btn" @click.stop="addCart(item)">
                <text>+</text>
              </view>
            </view>
            <view class="pc-sales-row">
              <text class="pc-sales">已售 {{ fmtSales(item.sales) }}</text>
              <view class="pc-rating">
                <text class="pc-star">{{ item.rating >= 4.8 ? '★★★★★' : item.rating >= 4.5 ? '★★★★☆' : '★★★★' }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 加载更多 -->
      <view class="load-more" v-if="hasMore">
        <view class="loading-dots">
          <view></view><view></view><view></view>
        </view>
        <text>加载更多</text>
      </view>
      <view class="load-more end" v-else>
        <text>🌱 已经到底了，更多好物敬请期待</text>
      </view>
    </view>

    <!-- 底部导航 -->
    <CustomTabBar page="mall" />
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import CustomTabBar from '@/components/CustomTabBar.vue'

// ========== 分类 ==========
const categories = ref([
  { label: '全部', value: 'all', icon: '🌿' },
  { label: '水果', value: 'fruit', icon: '🍎' },
  { label: '茶叶', value: 'tea', icon: '🍵' },
  { label: '五谷', value: 'grain', icon: '🌾' },
  { label: '干货', value: 'dry', icon: '🥜' },
  { label: '蜂蜜', value: 'honey', icon: '🍯' },
  { label: '菌菇', value: 'mushroom', icon: '🍄' },
  { label: '药材', value: 'herb', icon: '🌿' },
  { label: '畜禽', value: 'livestock', icon: '🥚' },
])

const activeCategory = ref('all')
const activeCategoryLabel = computed(() => {
  const c = categories.value.find(c => c.value === activeCategory.value)
  return c ? c.label + '好物' : '全部好物'
})
const sortBy = ref('default')

function switchCategory(val) {
  activeCategory.value = val
  sortBy.value = 'default'
}
function togglePriceSort() {
  if (sortBy.value === 'price-asc') sortBy.value = 'price-desc'
  else if (sortBy.value === 'price-desc') sortBy.value = 'price-asc'
  else sortBy.value = 'price-asc'
}

// ========== 商品数据 ==========
const products = ref([
  { id: 1, name: '新疆阿克苏冰糖心苹果', origin: '新疆阿克苏', price: 68, sales: 12500, rating: 4.9, image: '/static/goods/apple.png', category: 'fruit', traceCode: 'XJ2026A001', isNew: true, isOrganic: true, unit: '5斤' },
  { id: 2, name: '云南高山蓝莓 新鲜大果', origin: '云南大理', price: 89, sales: 8920, rating: 4.8, image: '/static/goods/blueberry.png', category: 'fruit', traceCode: 'YN2026B002', isOrganic: true, unit: '500g' },
  { id: 3, name: '西湖龙井明前特级绿茶', origin: '浙江杭州', price: 298, sales: 3450, rating: 4.9, image: '/static/goods/tea.png', category: 'tea', traceCode: 'ZJ2026C003', unit: '250g' },
  { id: 4, name: '宁夏中宁有机枸杞', origin: '宁夏中宁', price: 45, sales: 23000, rating: 4.7, image: '/static/goods/goji.png', category: 'herb', isOrganic: true, unit: '250g' },
  { id: 5, name: '五常稻花香大米', origin: '黑龙江五常', price: 128, sales: 18900, rating: 4.9, image: '/static/goods/rice.png', category: 'grain', traceCode: 'HLJ2026D004', isOrganic: true, unit: '5kg' },
  { id: 6, name: '福建古田银耳', origin: '福建古田', price: 35, sales: 15200, rating: 4.6, image: '/static/goods/fungus.png', category: 'dry', unit: '200g' },
  { id: 7, name: '长白山野生松子', origin: '吉林长白山', price: 78, sales: 6780, rating: 4.8, image: '/static/goods/pinenut.png', category: 'dry', isNew: true, unit: '500g' },
  { id: 8, name: '云南普洱古树茶饼', origin: '云南西双版纳', price: 398, sales: 2340, rating: 4.9, image: '/static/goods/puer.png', category: 'tea', traceCode: 'YN2026E005', unit: '357g' },
  { id: 9, name: '秦岭土蜂蜜纯天然', origin: '陕西秦岭', price: 88, sales: 9870, rating: 4.7, image: '/static/goods/honey.png', category: 'honey', isOrganic: true, unit: '500g' },
  { id: 10, name: '东北黑木耳野生', origin: '黑龙江大兴安岭', price: 42, sales: 16500, rating: 4.6, image: '/static/goods/woodear.png', category: 'mushroom', unit: '200g' },
  { id: 11, name: '赣南脐橙新鲜当季', origin: '江西赣州', price: 52, sales: 21000, rating: 4.8, image: '/static/goods/orange.png', category: 'fruit', isNew: true, unit: '5斤' },
  { id: 12, name: '赤峰有机小米', origin: '内蒙古赤峰', price: 36, sales: 11200, rating: 4.7, image: '/static/goods/millet.png', category: 'grain', isOrganic: true, unit: '2.5kg' },
])

const cartCount = ref(2)

// 统计数据
const productCount = ref(1286)
const organicCount = ref(432)
const originCount = ref(316)

// 筛选
const filteredProducts = computed(() => {
  let list = [...products.value]
  if (activeCategory.value !== 'all') {
    list = list.filter(p => p.category === activeCategory.value)
  }
  if (sortBy.value === 'sales') {
    list.sort((a, b) => b.sales - a.sales)
  } else if (sortBy.value === 'price-asc') {
    list.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price-desc') {
    list.sort((a, b) => b.price - a.price)
  }
  return list
})
const hasMore = ref(true)

function fmtSales(n) {
  if (!n) return '0'
  if (n >= 10000) return (n / 10000).toFixed(1) + '万'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}

// ========== AI精选商品 ==========
const aiProducts = ref([
  { id: 1, name: '新疆阿克苏冰糖心苹果', origin: '新疆阿克苏', price: 68, rating: 4.9, image: '/static/goods/apple.png', reason: '当季推荐' },
  { id: 3, name: '西湖龙井明前特级', origin: '浙江杭州', price: 298, rating: 4.9, image: '/static/goods/tea.png', reason: '送礼首选' },
  { id: 5, name: '五常稻花香大米', origin: '黑龙江五常', price: 128, rating: 4.9, image: '/static/goods/rice.png', reason: '家庭必备' },
  { id: 4, name: '宁夏中宁有机枸杞', origin: '宁夏中宁', price: 45, rating: 4.7, image: '/static/goods/goji.png', reason: '养生热榜' },
  { id: 2, name: '云南高山蓝莓', origin: '云南大理', price: 89, rating: 4.8, image: '/static/goods/blueberry.png', reason: '好评如潮' },
])

function changeAIRecommend() {
  const all = products.value
  const shuffled = [...all].sort(() => Math.random() - 0.5)
  aiProducts.value = shuffled.slice(0, 5).map(p => ({
    ...p,
    reason: ['当季推荐','好评如潮','员工最爱','基地直发','复购之王'][Math.floor(Math.random()*5)]
  }))
}

// ========== 操作 ==========
function goDetail(item) {
  uni.navigateTo({ url: `/pages/consumer/mall/detail?id=${item.id}` })
}
function addCart(item) {
  uni.showToast({ title: `已加入购物车`, icon: 'success', duration: 800 })
  cartCount.value++
}
function focusSearch() {
  uni.showToast({ title: '搜索功能开发中', icon: 'none' })
}
function goCart() {
  uni.showToast({ title: '购物车功能开发中', icon: 'none' })
}
</script>

<style lang="scss" scoped>
/* ═══════════════ 页面基础 ═══════════════ */
.mall-page {
  min-height: 100vh;
  padding-bottom: 120rpx;
}

/* ═══════════════ 头部 ═══════════════ */
.mall-header {
  padding: calc(var(--status-bar-height) + 16rpx) 28rpx 20rpx;
  background: linear-gradient(165deg, #064E28 0%, #0D7B3E 50%, #10B981 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -60%;
    right: -30%;
    width: 400rpx;
    height: 400rpx;
    background: radial-gradient(circle, rgba(0,212,170,0.25) 0%, transparent 70%);
    border-radius: 50%;
  }
  &::after {
    content: '';
    position: absolute;
    bottom: -40%;
    left: -20%;
    width: 300rpx;
    height: 300rpx;
    background: radial-gradient(circle, rgba(10,132,255,0.15) 0%, transparent 70%);
    border-radius: 50%;
  }
}

.header-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
  position: relative;
  z-index: 1;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 8rpx;
  .logo-icon { font-size: 36rpx; }
  .logo-text {
    font-size: 38rpx;
    font-weight: 800;
    background: linear-gradient(135deg, #FFFFFF, #D1FAE5);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.header-actions {
  display: flex;
  gap: 12rpx;
}

.icon-btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: rgba(255,255,255,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  backdrop-filter: blur(10rpx);
  position: relative;

  .cart-badge {
    position: absolute;
    top: -6rpx;
    right: -6rpx;
    min-width: 32rpx;
    height: 32rpx;
    background: #EF4444;
    border-radius: 16rpx;
    color: #FFF;
    font-size: 18rpx;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 6rpx;
    border: 2rpx solid rgba(255,255,255,0.6);
  }
}

/* 搜索框 */
.search-box {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(16rpx);
  border-radius: 48rpx;
  padding: 16rpx 22rpx;
  position: relative;
  z-index: 1;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
  border: 1rpx solid rgba(255,255,255,0.4);

  .search-icon { font-size: 28rpx; margin-right: 10rpx; }
  .search-placeholder {
    flex: 1;
    color: #94A3B8;
    font-size: 26rpx;
  }
  .search-ai-tag {
    display: flex;
    align-items: center;
    gap: 6rpx;
    background: linear-gradient(135deg, rgba(0,212,170,0.15), rgba(10,132,255,0.15));
    padding: 6rpx 16rpx;
    border-radius: 24rpx;
    font-size: 22rpx;
    color: #0A84FF;
    font-weight: 600;
    .ai-dot {
      width: 10rpx; height: 10rpx;
      background: #00D4AA;
      border-radius: 50%;
      box-shadow: 0 0 8rpx rgba(0,212,170,0.5);
    }
  }
}

/* 数据条 */
.stats-strip {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 20rpx;
  position: relative;
  z-index: 1;
  padding: 12rpx 0;

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rpx;
    .stat-val {
      font-size: 32rpx;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: 1rpx;
      &.accent {
        color: #00D4AA;
        text-shadow: 0 0 12rpx rgba(0,212,170,0.4);
      }
    }
    .stat-label {
      font-size: 20rpx;
      color: rgba(255,255,255,0.7);
      font-weight: 500;
    }
  }

  .stat-divider {
    width: 1rpx;
    height: 36rpx;
    background: rgba(255,255,255,0.2);
  }
}

/* ═══════════════ 分类导航 ═══════════════ */
.category-section {
  background: #FFF;
  padding: 20rpx 0;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2rpx 16rpx rgba(0,0,0,0.04);
}

.category-scroll {
  display: flex;
  padding: 0 20rpx;
  white-space: nowrap;
}

.category-chip {
  display: inline-flex;
  align-items: center;
  gap: 6rpx;
  padding: 12rpx 22rpx;
  margin-right: 12rpx;
  border-radius: 36rpx;
  font-size: 26rpx;
  background: #F2F5F1;
  color: #64748B;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border: 2rpx solid transparent;

  .chip-icon { font-size: 24rpx; }
  .chip-label { white-space: nowrap; }

  &.active {
    background: linear-gradient(135deg, #0D7B3E, #10B981);
    color: #FFF;
    font-weight: 700;
    box-shadow: 0 4rpx 16rpx rgba(13,123,62,0.25);
    border-color: transparent;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
}

/* ═══════════════ 区块通用 ═══════════════ */
.section-block {
  padding: 16rpx 0;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10rpx 28rpx 16rpx;

  .section-head-left {
    display: flex;
    align-items: center;
    gap: 10rpx;

    .ai-dot {
      width: 10rpx; height: 10rpx;
      background: #00D4AA;
      border-radius: 50%;
      box-shadow: 0 0 10rpx rgba(0,212,170,0.5);
      animation: ai-dot-pulse 2s ease-in-out infinite;
    }

    .section-line {
      width: 4rpx;
      height: 28rpx;
      background: linear-gradient(180deg, #0D7B3E, #10B981);
      border-radius: 2rpx;
    }
  }

  .section-title {
    font-size: 32rpx;
    font-weight: 800;
    color: #0F172A;
  }

  .section-more {
    font-size: 24rpx;
    color: #64748B;
    padding: 6rpx 16rpx;
    border-radius: 20rpx;
    background: #F2F5F1;
    font-weight: 500;
  }

  .sort-tabs {
    display: flex;
    gap: 4rpx;
    background: #F2F5F1;
    border-radius: 24rpx;
    padding: 4rpx;

    .sort-item {
      padding: 8rpx 20rpx;
      border-radius: 20rpx;
      font-size: 24rpx;
      color: #64748B;
      font-weight: 500;
      transition: all 0.25s ease;

      &.active {
        background: #FFF;
        color: #0D7B3E;
        font-weight: 700;
        box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.08);
      }
    }
  }
}

/* ═══════════════ AI精选横滑 ═══════════════ */
.ai-scroll {
  display: flex;
  padding: 0 24rpx;
  white-space: nowrap;
}

.ai-product-card {
  display: inline-flex;
  flex-direction: column;
  width: 260rpx;
  background: #FFF;
  border-radius: 20rpx;
  margin-right: 16rpx;
  overflow: hidden;
  box-shadow: 0 3rpx 16rpx rgba(0,0,0,0.06);
  animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
  border: 1rpx solid #EEF2EC;
  transition: all 0.3s ease;

  &:active { transform: scale(0.96); }
  &:last-child { margin-right: 24rpx; }
}

.apc-image-box {
  width: 100%;
  height: 200rpx;
  position: relative;
  overflow: hidden;

  .apc-image {
    width: 100%;
    height: 100%;
    transition: transform 0.4s ease;
  }

  .apc-badge {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 8rpx 14rpx;
    background: linear-gradient(180deg, transparent, rgba(0,0,0,0.6));
    font-size: 20rpx;
    color: #FFF;
    font-weight: 600;
  }
}

.apc-info {
  padding: 14rpx 16rpx;
  .apc-name {
    font-size: 26rpx;
    font-weight: 700;
    color: #0F172A;
    margin-bottom: 6rpx;
    display: block;
  }
  .apc-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10rpx;
    .apc-origin { font-size: 20rpx; color: #64748B; }
    .apc-score { font-size: 20rpx; color: #F59E0B; font-weight: 600; }
  }
  .apc-price-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .apc-price {
      .apc-sym { font-size: 20rpx; color: #E74C3C; font-weight: 700; }
      .apc-val { font-size: 30rpx; color: #E74C3C; font-weight: 800; }
    }
    .apc-cart-btn {
      width: 42rpx; height: 42rpx;
      background: linear-gradient(135deg, #0D7B3E, #10B981);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFF;
      font-size: 26rpx;
      font-weight: 700;
      box-shadow: 0 3rpx 12rpx rgba(13,123,62,0.2);
    }
  }
}

/* ═══════════════ 商品网格 ═══════════════ */
.product-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 0 20rpx;
  gap: 16rpx 12rpx;
}

.product-cell {
  width: calc(50% - 6rpx);
  background: #FFF;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
  border: 1rpx solid #EEF2EC;
  animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.97);
    box-shadow: 0 6rpx 24rpx rgba(0,0,0,0.08);
  }
}

.pc-image-box {
  width: 100%;
  padding-bottom: 100%;
  position: relative;
  overflow: hidden;
  background: #F8FAF7;

  .pc-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .pc-tag {
    position: absolute;
    top: 10rpx;
    font-size: 18rpx;
    padding: 3rpx 10rpx;
    border-radius: 6rpx;
    color: #FFF;
    font-weight: 700;
    z-index: 1;

    &.trace { right: 10rpx; background: rgba(0,0,0,0.5); }
    &.new { left: 10rpx; background: #EF4444; }
    &.organic {
      left: 10rpx;
      top: 40rpx;
      background: linear-gradient(135deg, #0D7B3E, #10B981);
      font-size: 16rpx;
    }
  }
}

.pc-info {
  padding: 14rpx 16rpx 16rpx;

  .pc-name {
    font-size: 26rpx;
    font-weight: 700;
    color: #0F172A;
    line-height: 1.4;
    margin-bottom: 6rpx;
  }

  .pc-origin {
    font-size: 20rpx;
    color: #94A3B8;
    margin-bottom: 10rpx;
    display: block;
  }

  .pc-bottom-row {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .pc-price {
      .pc-sym { font-size: 20rpx; color: #E74C3C; font-weight: 700; }
      .pc-val { font-size: 30rpx; color: #E74C3C; font-weight: 800; }
      .pc-unit { font-size: 18rpx; color: #94A3B8; margin-left: 2rpx; }
    }
    .pc-cart-btn {
      width: 44rpx; height: 44rpx;
      background: linear-gradient(135deg, #0D7B3E, #10B981);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFF;
      font-size: 28rpx;
      font-weight: 700;
      box-shadow: 0 3rpx 12rpx rgba(13,123,62,0.2);
      transition: all 0.2s ease;
      &:active { transform: scale(0.85); }
    }
  }

  .pc-sales-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 8rpx;
    .pc-sales { font-size: 18rpx; color: #94A3B8; }
    .pc-rating {
      .pc-star { font-size: 16rpx; color: #F59E0B; letter-spacing: -1rpx; }
    }
  }
}

/* ═══════════════ 加载更多 ═══════════════ */
.load-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 32rpx;
  color: #94A3B8;
  font-size: 24rpx;

  &.end { color: #CBD5E1; }
}

.loading-dots {
  display: flex;
  gap: 6rpx;
  view {
    width: 10rpx; height: 10rpx;
    background: #0D7B3E;
    border-radius: 50%;
    animation: dot-bounce 1.4s ease-in-out infinite both;
    &:nth-child(1) { animation-delay: 0s; }
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
}

@keyframes dot-bounce {
  0%, 80%, 100% { transform: scale(0.3); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20rpx); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes ai-dot-pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 6rpx #00D4AA; }
  50% { opacity: 0.4; box-shadow: 0 0 16rpx #00D4AA; }
}
</style>
