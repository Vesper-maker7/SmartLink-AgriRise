<template>
  <view class="typing-indicator">
    <view class="ai-avatar">
      <text>{{ icon }}</text>
    </view>
    <view class="typing-bubble">
      <view class="dot dot-1"></view>
      <view class="dot dot-2"></view>
      <view class="dot dot-3"></view>
    </view>
  </view>
</template>

<script setup>
defineProps({
  icon: { type: String, default: '🌿' }
})
</script>

<style lang="scss" scoped>
.typing-indicator {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}

.ai-avatar {
  width: 68rpx;
  height: 68rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #E8F5E9, #C8E6C9);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 16rpx;
  font-size: 32rpx;
}

.typing-bubble {
  display: flex;
  align-items: center;
  gap: 10rpx;
  background: #fff;
  border-radius: 6rpx 24rpx 24rpx 24rpx;
  padding: 22rpx 28rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: #C8E6C9;
  animation: bounce 1.4s infinite ease-in-out both;

  &-1 { animation-delay: -0.32s; }
  &-2 { animation-delay: -0.16s; }
  &-3 { animation-delay: 0s; }
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
}
</style>
