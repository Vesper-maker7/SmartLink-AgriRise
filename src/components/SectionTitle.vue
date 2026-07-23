<template>
  <view class="section-title" :class="[align, { 'with-divider': divider }]">
    <view class="title-left" v-if="icon || ai">
      <view v-if="ai" class="ai-dot"></view>
      <text v-if="icon" class="title-icon">{{ icon }}</text>
    </view>
    <text class="title-text" :class="[size, weight]">{{ title }}</text>
    <text v-if="subtitle" class="title-sub">{{ subtitle }}</text>
    <view class="title-line" v-if="divider"></view>
    <text v-if="more" class="title-more" @click="emit('more')">{{ more }} ›</text>
  </view>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  more: { type: String, default: '' },
  icon: { type: String, default: '' },
  ai: { type: Boolean, default: false },
  divider: { type: Boolean, default: false },
  align: { type: String, default: 'left' },
  size: { type: String, default: 'md' },
  weight: { type: String, default: 'bold' }
})

const emit = defineEmits(['more'])
</script>

<style lang="scss" scoped>
.section-title {
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 16rpx 32rpx;
  box-sizing: border-box;
  position: relative;

  &.center { justify-content: center; }

  .ai-dot {
    width: 10rpx; height: 10rpx;
    background: #00D4AA;
    border-radius: 50%;
    box-shadow: 0 0 8rpx rgba(0,212,170,0.5);
    flex-shrink: 0;
  }

  .title-icon { font-size: 32rpx; flex-shrink: 0; }

  .title-text {
    color: #0F172A;
    &.sm { font-size: 26rpx; }
    &.md { font-size: 32rpx; }
    &.lg { font-size: 36rpx; }
    &.normal { font-weight: 500; }
    &.bold { font-weight: 700; }
    &.black { font-weight: 800; }
  }

  .title-sub {
    font-size: 22rpx;
    color: #94A3B8;
    margin-left: 4rpx;
  }

  .title-more {
    font-size: 24rpx;
    color: #94A3B8;
    margin-left: auto;
    flex-shrink: 0;
  }

  .title-line {
    width: 4rpx;
    height: 28rpx;
    background: linear-gradient(180deg, #0D7B3E, #10B981);
    border-radius: 2rpx;
    margin-right: 6rpx;
  }
}
</style>
