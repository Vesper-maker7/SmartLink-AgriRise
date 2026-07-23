<template>
  <view class="tab-bar safe-area-bottom">
    <view
      v-for="tab in tabs"
      :key="tab.key"
      class="tab-item"
      :class="{ active: page === tab.key }"
      @click="switchTab(tab.key)"
    >
      <text class="tab-emoji">{{ page === tab.key ? tab.iconActive : tab.icon }}</text>
      <text class="tab-label">{{ tab.label }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  page: { type: String, default: 'home' }
})

const tabs = ref([
  { key: 'home',  label: '首页', icon: '🏠', iconActive: '🏠' },
  { key: 'mall',  label: '商城', icon: '🛒', iconActive: '🛒' },
  { key: 'ai-center', label: 'AI生活', icon: '🌱', iconActive: '🌱' },
  { key: 'profile', label: '我的', icon: '👤', iconActive: '👤' }
])

function switchTab(key) {
  if (key === props.page) return
  const routes = {
    home: '/pages/consumer/home/index',
    mall: '/pages/consumer/mall/index',
    'ai-center': '/pages/consumer/ai-center/index',
    profile: '/pages/consumer/profile/index'
  }
  uni.switchTab({ url: routes[key] })
}
</script>

<style lang="scss" scoped>
.tab-bar {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 999;
  display: flex; justify-content: space-around; align-items: flex-end;
  height: 120rpx; padding-bottom: 12rpx;
  background: rgba(7,19,32,.95);
  backdrop-filter: blur(30rpx);
  -webkit-backdrop-filter: blur(30rpx);
  border-top: 1rpx solid rgba(0,212,170,.08);
}

.tab-item {
  display: flex; flex-direction: column; align-items: center;
  gap: 4rpx; padding: 8rpx 16rpx; position: relative;
  transition: all .2s ease;

  .tab-emoji { font-size: 38rpx; transition: all .3s ease; }

  .tab-label {
    font-size: 20rpx; color: rgba(255,255,255,.35);
    font-weight: 500; transition: color .3s ease;
  }

  &.active {
    .tab-label { color: #00D4AA; font-weight: 700; }
  }

  &:active { transform: scale(.92); }
}
</style>
