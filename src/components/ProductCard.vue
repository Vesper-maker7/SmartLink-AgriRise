<template>
  <view class="product-card" @click="emit('click')" :class="[layout]">
    <!-- 竖版布局 -->
    <template v-if="layout === 'vertical'">
      <view class="pcv-image-box">
        <image :src="product.image" mode="aspectFill" class="pcv-image" />
        <view v-if="product.traceCode" class="pcv-tag trace">溯源</view>
        <view v-if="product.isNew" class="pcv-tag new">首发</view>
      </view>
      <view class="pcv-info">
        <text class="pcv-name text-ellipsis-2">{{ product.name }}</text>
        <view class="pcv-meta">
          <text class="pcv-origin">📌 {{ product.origin }}</text>
          <view class="pcv-rating">
            <text class="pcv-star">★</text>
            <text>{{ product.rating }}</text>
          </view>
        </view>
        <view class="pcv-bottom-row">
          <view class="pcv-price">
            <text class="pcv-sym">¥</text>
            <text class="pcv-val">{{ product.price }}</text>
          </view>
          <view class="pcv-cart" @click.stop="emit('cart', product)">
            <text>+</text>
          </view>
        </view>
      </view>
    </template>

    <!-- 横版布局 -->
    <template v-else>
      <view class="pch-image-box">
        <image :src="product.image" mode="aspectFill" class="pch-image" />
        <view v-if="product.traceCode" class="pch-tag trace">溯源</view>
        <view v-if="product.isNew" class="pch-tag new">首发</view>
      </view>
      <view class="pch-info">
        <text class="pch-name text-ellipsis">{{ product.name }}</text>
        <text class="pch-origin">{{ product.origin }}</text>
        <view class="pch-price-row">
          <view class="pch-price">
            <text class="pch-sym">¥</text>
            <text class="pch-val">{{ product.price }}</text>
          </view>
          <text class="pch-sales">已售{{ fmt(product.sales) }}</text>
        </view>
      </view>
    </template>
  </view>
</template>

<script setup>
defineProps({
  product: { type: Object, default: () => ({}) },
  layout: { type: String, default: 'horizontal' } // horizontal | vertical
})

const emit = defineEmits(['click', 'cart'])

function fmt(n) {
  if (!n) return '0'
  if (n >= 10000) return (n / 10000).toFixed(1) + '万'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}
</script>

<style lang="scss" scoped>
.product-card {
  background: #FFF;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05);
  overflow: hidden;
  transition: all 0.25s ease;
  &:active { transform: scale(0.97); }
}

/* 横版 */
.product-card.horizontal {
  display: flex;
  padding: 16rpx;
  gap: 16rpx;

  .pch-image-box {
    width: 240rpx; height: 200rpx;
    border-radius: 14rpx;
    overflow: hidden;
    position: relative;
    flex-shrink: 0;
    .pch-image { width: 100%; height: 100%; }
  }

  .pch-tag {
    position: absolute;
    top: 8rpx;
    font-size: 18rpx;
    padding: 2rpx 10rpx;
    border-radius: 6rpx;
    color: #FFF;
    font-weight: 600;
    &.trace { right: 8rpx; background: rgba(0,0,0,0.45); }
    &.new { left: 8rpx; background: #E74C3C; }
  }

  .pch-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .pch-name {
      font-size: 28rpx;
      font-weight: 600;
      color: #0F172A;
      line-height: 1.4;
    }
    .pch-origin {
      font-size: 22rpx;
      color: #64748B;
    }
    .pch-price-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .pch-price {
        .pch-sym { font-size: 22rpx; color: #E74C3C; font-weight: 700; }
        .pch-val { font-size: 34rpx; color: #E74C3C; font-weight: 800; }
      }
      .pch-sales { font-size: 20rpx; color: #94A3B8; }
    }
  }
}

/* 竖版 */
.product-card.vertical {
  .pcv-image-box {
    position: relative;
    width: 100%;
    padding-bottom: 100%;
    overflow: hidden;
    .pcv-image {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }
  }

  .pcv-tag {
    position: absolute;
    top: 10rpx;
    font-size: 18rpx;
    padding: 2rpx 12rpx;
    border-radius: 6rpx;
    color: #FFF;
    font-weight: 600;
    &.trace { right: 10rpx; background: rgba(0,0,0,0.45); }
    &.new { left: 10rpx; background: #E74C3C; }
  }

  .pcv-info {
    padding: 16rpx;
    .pcv-name {
      font-size: 26rpx;
      font-weight: 600;
      color: #0F172A;
      line-height: 1.4;
      margin-bottom: 8rpx;
      min-height: 70rpx;
    }
    .pcv-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12rpx;
      .pcv-origin { font-size: 20rpx; color: #64748B; }
      .pcv-rating {
        font-size: 20rpx;
        color: #F59E0B;
        .pcv-star { margin-right: 2rpx; }
      }
    }
    .pcv-bottom-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .pcv-price {
        .pcv-sym { font-size: 22rpx; color: #E74C3C; font-weight: 700; }
        .pcv-val { font-size: 34rpx; color: #E74C3C; font-weight: 800; }
      }
      .pcv-cart {
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
      }
    }
  }
}
</style>
