<template>
  <view class="search-bar" :style="{ marginTop: top + 'rpx', marginBottom: bottom + 'rpx' }">
    <view class="search-box" @click="emit('click')">
      <text class="sb-icon">🔍</text>
      <text class="sb-hint">{{ placeholder }}</text>
      <view class="sb-ai">
        <text class="sb-ai-txt">AI</text>
      </view>
    </view>
  </view>
</template>

<script setup>
defineProps({
  placeholder: { type: String, default: '搜索特色农产品' },
  top: { type: Number, default: 0 },
  bottom: { type: Number, default: 0 }
})

const emit = defineEmits(['click'])
</script>

<style lang="scss" scoped>
.search-bar {
  padding: 0 32rpx;

  .search-box {
    display: flex;
    align-items: center;
    height: 76rpx;
    background: #F5F7F4;
    border-radius: 44rpx;
    padding: 0 24rpx;
    border: 1rpx solid #E8EDE8;
    transition: all 0.3s ease;

    .sb-icon { font-size: 30rpx; margin-right: 12rpx; }
    .sb-hint {
      flex: 1;
      font-size: 26rpx;
      color: #94A3B8;
    }
    .sb-ai {
      background: linear-gradient(135deg, #00D4AA, #0A84FF);
      padding: 4rpx 14rpx;
      border-radius: 16rpx;
      .sb-ai-txt {
        font-size: 18rpx;
        color: #FFF;
        font-weight: 700;
      }
    }
  }
}
</style>
