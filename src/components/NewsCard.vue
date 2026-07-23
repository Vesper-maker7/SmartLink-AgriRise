<template>
  <view class="news-card" @click="emit('click')">
    <view class="nc-image-box">
      <image :src="item.image" mode="aspectFill" class="nc-image" />
      <view v-if="item.tag" class="nc-image-tag">{{ item.tag }}</view>
    </view>
    <view class="nc-body">
      <text class="nc-title text-ellipsis-2">{{ item.title }}</text>
      <view class="nc-meta">
        <view class="nc-ai" v-if="item.aiGenerated">
          <view class="ai-dot"></view>
          <text>AI摘要</text>
        </view>
        <text class="nc-source">{{ item.source }}</text>
        <text class="nc-time">{{ item.time }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
defineProps({
  item: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['click'])
</script>

<style lang="scss" scoped>
.news-card {
  display: flex;
  gap: 20rpx;
  padding: 20rpx;
  background: #FFF;
  border-radius: 16rpx;
  box-shadow: 0 1rpx 6rpx rgba(0,0,0,0.04);
  transition: all 0.2s ease;
  &:active { background: #F8FAF7; }

  .nc-image-box {
    width: 200rpx; height: 140rpx;
    border-radius: 12rpx;
    overflow: hidden;
    flex-shrink: 0;
    position: relative;
    .nc-image { width: 100%; height: 100%; }
    .nc-image-tag {
      position: absolute;
      bottom: 8rpx; left: 8rpx;
      font-size: 18rpx;
      background: rgba(0,0,0,0.5);
      color: #FFF;
      padding: 2rpx 10rpx;
      border-radius: 6rpx;
    }
  }

  .nc-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .nc-title {
      font-size: 26rpx;
      font-weight: 500;
      color: #0F172A;
      line-height: 1.5;
    }
    .nc-meta {
      display: flex;
      align-items: center;
      gap: 14rpx;
      .nc-ai {
        display: flex;
        align-items: center;
        gap: 4rpx;
        font-size: 18rpx;
        color: #00D4AA;
        font-weight: 600;
      }
      .nc-source { font-size: 20rpx; color: #0D7B3E; }
      .nc-time { font-size: 20rpx; color: #94A3B8; }
    }
  }
}
</style>
