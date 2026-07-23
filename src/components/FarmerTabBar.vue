<!-- 农户端底部导航栏 -->
<template>
  <view class="ftb-wrap">
    <view class="ftb-inner">
      <view
        v-for="(tab, i) in tabs"
        :key="i"
        class="ftb-item"
        :class="{ active: tab.key === page }"
        @click="switchTab(tab.key)"
      >
        <image v-if="tab.key === page" :src="tab.activeIcon" class="ftb-icon" mode="aspectFit" />
        <text v-else class="ftb-emoji">{{ tab.icon }}</text>
        <text class="ftb-label">{{ tab.label }}</text>
        <view v-if="tab.badge" class="ftb-badge">{{ tab.badge }}</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  page: { type: String, default: 'home' }
})

const tabs = ref([
  { key: 'home',     label: '智慧农场', icon: '🏡', activeIcon: '/static/icons/farmer-home.png' },
  { key: 'products', label: '商品',     icon: '📦', activeIcon: '/static/icons/farmer-products.png' },
  { key: 'stats',    label: '数据',     icon: '📈', activeIcon: '/static/icons/farmer-stats.png' },
  { key: 'profile',  label: '我的',     icon: '👤', activeIcon: '/static/icons/farmer-profile.png' }
])

const routes = {
  home:     '/pages/farmer/home/index',
  products: '/pages/farmer/products/index',
  stats:    '/pages/farmer/stats/index',
  profile:  '/pages/farmer/profile/index'
}

function switchTab(key) {
  if (key === props.page) return
  uni.reLaunch({ url: routes[key] })
}
</script>

<style scoped>
.ftb-wrap {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 999;
}
.ftb-inner {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 120rpx;
  padding-bottom: env(safe-area-inset-bottom);
  background: rgba(255,255,255,0.94);
  backdrop-filter: blur(30rpx);
  -webkit-backdrop-filter: blur(30rpx);
  border-top: 1rpx solid rgba(13,123,62,0.08);
  box-shadow: 0 -4rpx 24rpx rgba(0,0,0,0.04);
}
.ftb-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  transition: all 0.25s ease;
}
.ftb-item:active { transform: scale(0.93); }
.ftb-emoji {
  font-size: 40rpx;
  margin-bottom: 4rpx;
  filter: grayscale(0.55);
  transition: all 0.25s ease;
}
.ftb-item.active .ftb-emoji { filter: grayscale(0); }
.ftb-icon {
  width: 44rpx;
  height: 44rpx;
  margin-bottom: 4rpx;
}
.ftb-label {
  font-size: 20rpx;
  color: #94A3B8;
  font-weight: 500;
  transition: all 0.25s ease;
}
.ftb-item.active .ftb-label {
  color: #0D7B3E;
  font-weight: 700;
}
.ftb-badge {
  position: absolute;
  top: 4rpx;
  left: 54%;
  transform: translateX(-50%);
  min-width: 32rpx;
  height: 32rpx;
  line-height: 32rpx;
  text-align: center;
  font-size: 18rpx;
  color: #FFF;
  background: #EF4444;
  border-radius: 16rpx;
  padding: 0 8rpx;
}
</style>
