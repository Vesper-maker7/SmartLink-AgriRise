<!-- 农户端 — 商品管理 -->
<template>
  <view class="products-page">
    <!-- 头部 -->
    <view class="page-top">
      <view class="top-safe"></view>
      <view class="top-header">
        <text class="top-title">商品管理</text>
        <text class="top-sub">管理您的农产品</text>
      </view>
      <!-- 统计条 -->
      <view class="top-stats">
        <view class="ts-item">
          <text class="ts-num">{{ stats.total }}</text>
          <text class="ts-label">全部商品</text>
        </view>
        <view class="ts-item">
          <text class="ts-num online">{{ stats.online }}</text>
          <text class="ts-label">在售</text>
        </view>
        <view class="ts-item">
          <text class="ts-num">{{ stats.pending }}</text>
          <text class="ts-label">待审核</text>
        </view>
        <view class="ts-item">
          <text class="ts-num warn">{{ stats.alert }}</text>
          <text class="ts-label">库存预警</text>
        </view>
      </view>
    </view>

    <!-- 筛选 -->
    <view class="filter-row">
      <view class="filter-pill" v-for="(f, i) in filters" :key="i"
        :class="{ active: activeFilter === i }" @click="activeFilter = i">
        {{ f }}
      </view>
    </view>

    <!-- 商品列表 -->
    <view class="product-list">
      <view class="p-card" v-for="(p, i) in products" :key="i"
        :class="'anim-fade-in anim-delay-' + ((i%5)+1)">
        <image :src="p.image" class="p-image" mode="aspectFill" />
        <view class="p-info">
          <text class="p-name">{{ p.name }}</text>
          <text class="p-origin">{{ p.origin }}</text>
          <view class="p-tags">
            <text class="p-tag" v-if="p.trace">✅ 已溯源</text>
            <text class="p-tag warn" v-if="p.stock < 50">⚠ 低库存</text>
          </view>
          <view class="p-bottom">
            <text class="p-price">¥{{ p.price }}/{{ p.unit }}</text>
            <view class="p-actions">
              <view class="p-btn edit" @click="editProduct(p)">编辑</view>
              <view class="p-btn toggle" :class="p.status"
                @click="toggleStatus(p)">{{ p.status === 'online' ? '下架' : '上架' }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 新增按钮 -->
    <view class="fab-add" @click="addProduct">
      <text>+</text>
    </view>

    <view style="height: 160rpx;"></view>
    <FarmerTabBar page="products" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import FarmerTabBar from '@/components/FarmerTabBar.vue'

const stats = ref({ total: 16, online: 12, pending: 2, alert: 3 })
const activeFilter = ref(0)
const filters = ref(['全部', '在售中', '已下架', '待审核', '库存预警'])

const products = ref([
  { id: 1, name: '云南高原蓝莓', price: 68, unit: '箱', origin: '云南大理', image: 'https://via.placeholder.com/400x400/4CAF50/FFFFFF?text=蓝莓', trace: true, stock: 120, status: 'online' },
  { id: 2, name: '五常有机大米', price: 89, unit: '袋', origin: '黑龙江五常', image: 'https://via.placeholder.com/400x400/66BB6A/FFFFFF?text=大米', trace: true, stock: 340, status: 'online' },
  { id: 3, name: '阿克苏苹果', price: 39.9, unit: '箱', origin: '新疆阿克苏', image: 'https://via.placeholder.com/400x400/EF5350/FFFFFF?text=苹果', trace: true, stock: 28, status: 'online' },
  { id: 4, name: '宁夏枸杞', price: 128, unit: '袋', origin: '宁夏中卫', image: 'https://via.placeholder.com/400x400/FF7043/FFFFFF?text=枸杞', trace: false, stock: 65, status: 'offline' },
  { id: 5, name: '福建高山乌龙茶', price: 168, unit: '盒', origin: '福建安溪', image: 'https://via.placeholder.com/400x400/795548/FFFFFF?text=乌龙茶', trace: true, stock: 180, status: 'online' }
])

function addProduct() { uni.showToast({ title: '新增商品', icon: 'none' }) }
function editProduct(p) { uni.showToast({ title: '编辑' + p.name, icon: 'none' }) }
function toggleStatus(p) {
  p.status = p.status === 'online' ? 'offline' : 'online'
  uni.showToast({ title: p.status === 'online' ? '已上架' : '已下架', icon: 'none' })
}
</script>

<style scoped>
.products-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #E8F5EC 0%, #F0F4EF 12%, #F5F7F4 100%);
}
.page-top {
  background: linear-gradient(160deg, #0D7B3E 0%, #064E28 40%, #0D7B3E 100%);
  padding: 0 32rpx 30rpx;
  position: relative;
  overflow: hidden;
}
.page-top::after {
  content: '';
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 40rpx;
  background: linear-gradient(0deg, #F0F4EF 0%, transparent 100%);
}
.top-safe { height: calc(var(--status-bar-height) + 10rpx); }
.top-header { padding: 8rpx 0 20rpx; position: relative; z-index: 1; }
.top-title { font-size: 38rpx; font-weight: 800; color: #FFF; display: block; }
.top-sub { font-size: 24rpx; color: rgba(255,255,255,0.6); }
.top-stats {
  display: flex; gap: 16rpx; position: relative; z-index: 3;
}
.ts-item {
  flex: 1; background: rgba(255,255,255,0.12);
  backdrop-filter: blur(10rpx);
  border-radius: 16rpx; padding: 16rpx 12rpx;
  text-align: center;
}
.ts-num { font-size: 30rpx; font-weight: 800; color: #FFF; display: block; }
.ts-num.online { color: #34D399; }
.ts-num.warn { color: #FCA5A5; }
.ts-label { font-size: 18rpx; color: rgba(255,255,255,0.6); }

/* 筛选 */
.filter-row {
  display: flex; gap: 12rpx;
  padding: 20rpx 24rpx;
}
.filter-pill {
  font-size: 22rpx; color: #64748B;
  background: #FFF; border-radius: 28rpx;
  padding: 10rpx 22rpx;
  box-shadow: 0 1rpx 4rpx rgba(0,0,0,0.04);
  transition: all 0.25s ease;
}
.filter-pill.active {
  background: #0D7B3E; color: #FFF;
  font-weight: 600;
}

/* 商品列表 */
.product-list {
  padding: 0 24rpx;
}
.p-card {
  display: flex; gap: 20rpx;
  background: #FFF; border-radius: 20rpx;
  padding: 20rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.03);
  transition: all 0.2s ease;
}
.p-card:active { transform: scale(0.98); }
.p-image {
  width: 160rpx; height: 160rpx; border-radius: 16rpx;
  flex-shrink: 0;
}
.p-info {
  flex: 1; display: flex; flex-direction: column;
}
.p-name { font-size: 28rpx; font-weight: 700; color: #0F172A; }
.p-origin { font-size: 20rpx; color: #94A3B8; margin: 4rpx 0 6rpx; }
.p-tags { display: flex; gap: 8rpx; }
.p-tag { font-size: 18rpx; color: #059669; background: #D1FAE5;
  padding: 2rpx 10rpx; border-radius: 8rpx; }
.p-tag.warn { color: #DC2626; background: #FEE2E2; }
.p-bottom {
  display: flex; justify-content: space-between; align-items: center;
  margin-top: auto;
}
.p-price { font-size: 28rpx; font-weight: 700; color: #EF4444; }
.p-actions { display: flex; gap: 10rpx; }
.p-btn {
  font-size: 20rpx; font-weight: 600;
  padding: 8rpx 18rpx; border-radius: 20rpx;
  transition: all 0.2s ease;
}
.p-btn.edit { color: #0D7B3E; background: #D1FAE5; }
.p-btn.toggle.online { color: #EF4444; background: #FEE2E2; }
.p-btn.toggle.offline { color: #059669; background: #D1FAE5; }
.p-btn:active { transform: scale(0.93); }

.fab-add {
  position: fixed; right: 32rpx; bottom: 200rpx; z-index: 100;
  width: 96rpx; height: 96rpx;
  background: linear-gradient(135deg, #0D7B3E, #10B981);
  border-radius: 50%;
  box-shadow: 0 8rpx 24rpx rgba(13,123,62,0.35);
  display: flex; align-items: center; justify-content: center;
  font-size: 44rpx; color: #FFF; font-weight: 300;
  transition: all 0.25s ease;
}
.fab-add:active { transform: scale(0.9); }
</style>
