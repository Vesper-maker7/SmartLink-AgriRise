<template>
  <view class="cart-item" :class="{ 'cart-item--last': isLast }">
    <!-- 选择框 -->
    <view class="cart-item__check" @click="$emit('toggle')">
      <view class="check-circle" :class="{ 'check-circle--active': selected }">
        <text v-if="selected" class="check-icon">✓</text>
      </view>
    </view>

    <!-- 商品图片 -->
    <image
      class="cart-item__image"
      :src="item.image"
      mode="aspectFill"
      @click="$emit('click', item)"
    />

    <!-- 商品信息 -->
    <view class="cart-item__info" @click="$emit('click', item)">
      <view class="cart-item__name">{{ item.name }}</view>
      <view class="cart-item__price-row">
        <view class="cart-item__price">
          <text class="price-symbol">¥</text>
          <text class="price-value">{{ item.price.toFixed(2) }}</text>
        </view>
      </view>
    </view>

    <!-- 数量控制 -->
    <view class="cart-item__qty">
      <view class="qty-btn" @click.stop="decrease">
        <text class="qty-icon">−</text>
      </view>
      <text class="qty-value">{{ item.quantity }}</text>
      <view class="qty-btn qty-btn--plus" @click.stop="increase">
        <text class="qty-icon">+</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: { type: Object, required: true },
  selected: { type: Boolean, default: false },
  isLast: { type: Boolean, default: false }
})

const emit = defineEmits(['toggle', 'click', 'quantity-change', 'decrease', 'increase'])

function decrease() {
  if (props.item.quantity <= 1) return
  emit('quantity-change', props.item.id, props.item.quantity - 1)
  emit('decrease')
}

function increase() {
  emit('quantity-change', props.item.id, props.item.quantity + 1)
  emit('increase')
}
</script>

<style lang="scss" scoped>
.cart-item {
  display: flex;
  align-items: center;
  padding: 24rpx 28rpx;
  background: #fff;
  border-bottom: 1rpx solid #f0f0f0;

  &--last {
    border-bottom: none;
  }

  &__check {
    margin-right: 20rpx;
    flex-shrink: 0;
  }

  &__image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 16rpx;
    background: #f5f5f5;
    flex-shrink: 0;
  }

  &__info {
    flex: 1;
    margin-left: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 160rpx;
    overflow: hidden;
  }

  &__name {
    font-size: 28rpx;
    font-weight: 500;
    color: #1a1a1a;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  &__price-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  &__price {
    color: #e53935;
    font-weight: 700;
  }

  &__qty {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-left: 16rpx;
  }
}

.price-symbol {
  font-size: 24rpx;
}
.price-value {
  font-size: 32rpx;
}

.check-circle {
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  border: 3rpx solid #d0d0d0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &--active {
    border-color: #2D8B3E;
    background: #2D8B3E;
  }
}

.check-icon {
  color: #fff;
  font-size: 26rpx;
  font-weight: 700;
}

.qty-btn {
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  border: 2rpx solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  transition: all 0.15s;

  &:active {
    background: #eee;
  }

  &--plus {
    background: #2D8B3E;
    border-color: #2D8B3E;

    .qty-icon {
      color: #fff;
    }

    &:active {
      background: #1B6B2A;
    }
  }
}

.qty-icon {
  font-size: 32rpx;
  color: #555;
  font-weight: 700;
  line-height: 1;
}

.qty-value {
  font-size: 28rpx;
  font-weight: 600;
  color: #1a1a1a;
  min-width: 60rpx;
  text-align: center;
}
</style>
