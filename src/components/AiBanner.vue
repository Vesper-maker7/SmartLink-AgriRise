<template>
  <view class="ai-banner" @click="emit('click')" :style="{ background: bgColor || 'linear-gradient(135deg, #0A1628, #0F2847)' }">
    <view class="ai-bg-particles">
      <view class="abp p1"></view>
      <view class="abp p2"></view>
    </view>
    <view class="ai-content">
      <view class="ai-icon-wrap">
        <text class="ai-emoji">{{ icon }}</text>
        <view class="ai-glow-ring"></view>
      </view>
      <view class="ai-text-area">
        <view class="ai-title-row">
          <text class="ai-title">{{ title }}</text>
          <view v-if="badge" class="ai-tag">{{ badge }}</view>
        </view>
        <text class="ai-desc">{{ desc }}</text>
      </view>
      <view class="ai-action">
        <view class="ai-action-circle">
          <text class="ai-action-arrow">→</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' },
  desc: { type: String, default: '' },
  icon: { type: String, default: '🧠' },
  badge: { type: String, default: '' },
  bgColor: { type: String, default: '' }
})

const emit = defineEmits(['click'])
</script>

<style lang="scss" scoped>
.ai-banner {
  margin: 8rpx 32rpx;
  padding: 28rpx;
  border-radius: 20rpx;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  &:active { transform: scale(0.98); opacity: 0.9; }

  .ai-bg-particles {
    position: absolute;
    inset: 0;
    pointer-events: none;
    .abp {
      position: absolute;
      border-radius: 50%;
      &.p1 {
        width: 120rpx; height: 120rpx;
        background: radial-gradient(circle, rgba(0,212,170,0.15), transparent);
        top: -30rpx; right: 40rpx;
      }
      &.p2 {
        width: 80rpx; height: 80rpx;
        background: radial-gradient(circle, rgba(10,132,255,0.12), transparent);
        bottom: -10rpx; left: 120rpx;
      }
    }
  }

  .ai-content {
    display: flex;
    align-items: center;
    gap: 20rpx;
    position: relative;
    z-index: 1;
  }

  .ai-icon-wrap {
    position: relative;
    width: 80rpx; height: 80rpx;
    border-radius: 20rpx;
    background: rgba(0,212,170,0.1);
    border: 1rpx solid rgba(0,212,170,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    .ai-emoji { font-size: 40rpx; }
    .ai-glow-ring {
      position: absolute;
      inset: -6rpx;
      border-radius: 24rpx;
      border: 1rpx solid rgba(0,212,170,0.2);
      animation: ai-dot-pulse 2.5s ease-in-out infinite;
    }
  }

  .ai-text-area {
    flex: 1;
    .ai-title-row {
      display: flex;
      align-items: center;
      gap: 10rpx;
      margin-bottom: 6rpx;
    }
    .ai-title {
      font-size: 32rpx;
      font-weight: 700;
      color: #FFF;
    }
    .ai-tag {
      font-size: 18rpx;
      color: #00D4AA;
      background: rgba(0,212,170,0.15);
      padding: 2rpx 10rpx;
      border-radius: 8rpx;
      font-weight: 700;
    }
    .ai-desc {
      font-size: 24rpx;
      color: rgba(255,255,255,0.5);
    }
  }

  .ai-action-circle {
    width: 56rpx; height: 56rpx;
    background: linear-gradient(135deg, #00D4AA, #0A84FF);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 16rpx rgba(0,212,170,0.3);
    flex-shrink: 0;
    .ai-action-arrow {
      font-size: 28rpx;
      color: #FFF;
      font-weight: 700;
    }
  }
}
</style>
