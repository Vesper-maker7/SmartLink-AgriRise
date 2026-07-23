<template>
  <view class="identity-page">
    <!-- 背景装饰 -->
    <view class="bg-layer">
      <view class="bg-circle c1"></view>
      <view class="bg-circle c2"></view>
      <view class="bg-circle c3"></view>
      <view class="bg-grid"></view>
      <!-- 粒子光点 -->
      <view class="particle p1"></view>
      <view class="particle p2"></view>
      <view class="particle p3"></view>
      <view class="particle p4"></view>
    </view>

    <!-- 品牌区 -->
    <view class="brand-section safe-area-top">
      <view class="brand-icon-wrap">
        <view class="brand-ring"></view>
        <view class="brand-icon">
          <text class="brand-emoji">🌾</text>
        </view>
        <view class="brand-badge anim-fade-scale">
          <text class="brand-badge-text">AI</text>
        </view>
      </view>
      <text class="brand-name">智链兴农</text>
      <text class="brand-slogan">AI驱动 · 从田间到餐桌 · 可信溯源</text>
      <view class="brand-features">
        <view class="f-item anim-fade-in anim-delay-1">
          <view class="f-dot"></view>
          <text>区块链溯源</text>
        </view>
        <view class="f-item anim-fade-in anim-delay-2">
          <view class="f-dot cyan"></view>
          <text>AI智能推荐</text>
        </view>
        <view class="f-item anim-fade-in anim-delay-3">
          <view class="f-dot gold"></view>
          <text>绿色有机认证</text>
        </view>
      </view>
    </view>

    <!-- 身份选择区 -->
    <view class="select-section">
      <view class="select-hint">
        <view class="hint-line"></view>
        <text class="hint-text">选择您的身份开始体验</text>
        <view class="hint-line"></view>
      </view>

      <!-- 消费者卡片 -->
      <view class="role-card consumer anim-fade-in anim-delay-2" @click="selectIdentity('consumer')">
        <view class="role-glow"></view>
        <view class="role-icon-area">
          <view class="role-icon-bg"></view>
          <text class="role-emoji">🛒</text>
        </view>
        <view class="role-info">
          <text class="role-name">我是消费者</text>
          <text class="role-desc">发现产地好物，AI营养管理，全链路溯源</text>
        </view>
        <view class="role-arrow">
          <view class="arrow-circle">
            <text class="arrow-icon">→</text>
          </view>
        </view>
      </view>

      <!-- 农户卡片 -->
      <view class="role-card farmer anim-fade-in anim-delay-3" @click="selectIdentity('farmer')">
        <view class="role-glow"></view>
        <view class="role-icon-area">
          <view class="role-icon-bg"></view>
          <text class="role-emoji">👨‍🌾</text>
        </view>
        <view class="role-info">
          <text class="role-name">我是农户</text>
          <text class="role-desc">AI智慧种植 · 销量预测 · 智能定价 · 风险预警</text>
        </view>
        <view class="role-arrow">
          <view class="arrow-circle">
            <text class="arrow-icon">→</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部 -->
    <view class="bottom-bar">
      <text class="bottom-version">智链兴农 v1.0 · 创新大赛Demo</text>
    </view>
  </view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/store/user.js'

const userStore = useUserStore()

onShow(() => {
  if (userStore.loadIdentity()) {
    redirectToHome()
  }
})

function selectIdentity(type) {
  userStore.setIdentity(type)
  const name = type === 'consumer' ? '消费者模式' : '农户模式'
  uni.showToast({ title: name, icon: 'none', duration: 600 })
  setTimeout(() => redirectToHome(), 400)
}

function redirectToHome() {
  if (userStore.isConsumer) {
    uni.switchTab({ url: '/pages/consumer/home/index' })
  } else if (userStore.isFarmer) {
    uni.reLaunch({ url: '/pages/farmer/home/index' })
  }
}
</script>

<style lang="scss" scoped>
.identity-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #0A1F14 0%, #0D3320 20%, #0F4228 40%, #F0F4EF 65%, #F5F7F4 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ===== 背景层 ===== */
.bg-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.08;
  &.c1 {
    width: 600rpx; height: 600rpx;
    background: radial-gradient(circle, #00D4AA, transparent);
    top: -120rpx; right: -150rpx;
    animation: float 6s ease-in-out infinite;
  }
  &.c2 {
    width: 400rpx; height: 400rpx;
    background: radial-gradient(circle, #10B981, transparent);
    bottom: 30%; left: -100rpx;
    animation: float 8s ease-in-out infinite 2s;
  }
  &.c3 {
    width: 300rpx; height: 300rpx;
    background: radial-gradient(circle, #D4A853, transparent);
    top: 45%; right: -60rpx;
    animation: float 7s ease-in-out infinite 1s;
  }
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1rpx, transparent 1rpx),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1rpx, transparent 1rpx);
  background-size: 60rpx 60rpx;
  mask-image: linear-gradient(180deg, black 0%, black 40%, transparent 100%);
}

/* 光点 */
.particle {
  position: absolute;
  width: 8rpx; height: 8rpx;
  background: #00D4AA;
  border-radius: 50%;
  opacity: 0.6;
  animation: ai-dot-pulse 3s ease-in-out infinite;
  &.p1 { top: 15%; left: 20%; animation-delay: 0s; }
  &.p2 { top: 30%; right: 15%; animation-delay: 1.2s; background: #0A84FF; }
  &.p3 { top: 55%; left: 10%; animation-delay: 2s; }
  &.p4 { top: 70%; right: 25%; animation-delay: 0.8s; background: #7C3AED; }
}

/* ===== 品牌区 ===== */
.brand-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 120rpx;
  padding-bottom: 20rpx;
  position: relative;
  z-index: 2;
}

.brand-icon-wrap {
  position: relative;
  margin-bottom: 24rpx;
}

.brand-ring {
  position: absolute;
  inset: -24rpx;
  border-radius: 50%;
  border: 3rpx solid rgba(0,212,170,0.25);
  animation: rotate-slow 12s linear infinite;
}

.brand-icon {
  width: 130rpx; height: 130rpx;
  background: linear-gradient(145deg, #0D7B3E, #10B981);
  border-radius: 34rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 40rpx rgba(0,212,170,0.35);
  position: relative;
  .brand-emoji { font-size: 64rpx; }
}

.brand-badge {
  position: absolute;
  top: -8rpx;
  right: -16rpx;
  background: linear-gradient(135deg, #0A84FF, #00D4AA);
  padding: 4rpx 14rpx;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,212,170,0.4);
  .brand-badge-text {
    font-size: 20rpx;
    font-weight: 800;
    color: #FFF;
    letter-spacing: 2rpx;
  }
}

.brand-name {
  font-size: 52rpx;
  font-weight: 800;
  background: linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.85) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 6rpx;
  margin-bottom: 10rpx;
}

.brand-slogan {
  font-size: 24rpx;
  color: rgba(255,255,255,0.55);
  letter-spacing: 2rpx;
  font-weight: 400;
}

.brand-features {
  display: flex;
  gap: 24rpx;
  margin-top: 32rpx;
  .f-item {
    display: flex;
    align-items: center;
    gap: 8rpx;
    font-size: 22rpx;
    color: rgba(255,255,255,0.7);
    .f-dot {
      width: 10rpx; height: 10rpx;
      border-radius: 50%;
      background: #00D4AA;
      &.cyan { background: #0A84FF; }
      &.gold { background: #D4A853; }
    }
  }
}

/* ===== 身份选择 ===== */
.select-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40rpx 36rpx;
  position: relative;
  z-index: 2;
}

.select-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  margin-bottom: 36rpx;
  .hint-line {
    width: 48rpx; height: 2rpx;
    background: rgba(255,255,255,0.2);
    border-radius: 1rpx;
  }
  .hint-text {
    font-size: 24rpx;
    color: rgba(255,255,255,0.5);
    letter-spacing: 2rpx;
  }
}

/* 角色卡片 */
.role-card {
  display: flex;
  align-items: center;
  padding: 32rpx 28rpx;
  margin-bottom: 20rpx;
  border-radius: 24rpx;
  position: relative;
  overflow: hidden;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(24rpx);
  -webkit-backdrop-filter: blur(24rpx);
  border: 1rpx solid rgba(255,255,255,0.8);
  box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.1);
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);

  &:active {
    transform: scale(0.97);
    box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.12);
  }

  .role-glow {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 0.35s ease;
  }

  &.consumer .role-glow {
    background: radial-gradient(ellipse at 30% 50%, rgba(13,123,62,0.06), transparent 60%);
  }
  &.farmer .role-glow {
    background: radial-gradient(ellipse at 30% 50%, rgba(10,132,255,0.06), transparent 60%);
  }

  &:active .role-glow { opacity: 1; }

  .role-icon-area {
    position: relative;
    margin-right: 24rpx;
    flex-shrink: 0;
  }

  .role-icon-bg {
    width: 88rpx; height: 88rpx;
    border-radius: 22rpx;
    position: absolute;
    inset: 0;
  }
  &.consumer .role-icon-bg {
    background: linear-gradient(135deg, rgba(13,123,62,0.1), rgba(16,185,129,0.15));
    border: 1rpx solid rgba(13,123,62,0.12);
  }
  &.farmer .role-icon-bg {
    background: linear-gradient(135deg, rgba(10,132,255,0.1), rgba(124,58,237,0.1));
    border: 1rpx solid rgba(10,132,255,0.12);
  }

  .role-emoji {
    width: 88rpx; height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 44rpx;
    position: relative;
    z-index: 1;
  }

  .role-info {
    flex: 1;
    .role-name {
      display: block;
      font-size: 32rpx;
      font-weight: 700;
      color: #0F172A;
      margin-bottom: 6rpx;
    }
    .role-desc {
      display: block;
      font-size: 24rpx;
      color: #64748B;
      line-height: 1.5;
    }
  }

  .role-arrow {
    .arrow-circle {
      width: 48rpx; height: 48rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #F5F7F4;
      transition: all 0.3s ease;
      .arrow-icon {
        font-size: 28rpx;
        color: #94A3B8;
        transition: all 0.3s ease;
      }
    }
  }

  &.consumer {
    border-left: 5rpx solid #0D7B3E;
  }
  &.farmer {
    border-left: 5rpx solid #0A84FF;
  }

  &:active .arrow-circle {
    background: #0D7B3E;
    .arrow-icon { color: #FFF; }
  }
  &.farmer:active .arrow-circle {
    background: #0A84FF;
  }
}

/* ===== 底部 ===== */
.bottom-bar {
  padding: 32rpx 0 60rpx;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 2;
  .bottom-version {
    font-size: 22rpx;
    color: rgba(148,163,184,0.6);
    letter-spacing: 1rpx;
  }
}
</style>
