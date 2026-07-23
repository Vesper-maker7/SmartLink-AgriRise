<template>
  <view v-if="visible" class="payment-modal">
    <!-- 遮罩 -->
    <view class="payment-mask" @click="$emit('close')"></view>

    <!-- 面板 -->
    <view class="payment-panel" :class="{ 'payment-panel--show': visible }">
      <!-- 标题栏 -->
      <view class="panel-header">
        <text class="panel-title">确认支付</text>
        <view class="panel-close" @click="$emit('close')">
          <text>✕</text>
        </view>
      </view>

      <!-- 金额展示 -->
      <view class="panel-amount">
        <text class="amount-label">支付金额</text>
        <view class="amount-value">
          <text class="amount-symbol">¥</text>
          <text class="amount-num">{{ amount.toFixed(2) }}</text>
        </view>
      </view>

      <!-- 支付方式列表 -->
      <view class="panel-methods">
        <text class="methods-title">选择支付方式</text>

        <view
          v-for="method in paymentMethods"
          :key="method.id"
          class="method-item"
          :class="{ 'method-item--active': activeMethod === method.id }"
          @click="activeMethod = method.id"
        >
          <view class="method-left">
            <image
              v-if="method.icon"
              class="method-icon"
              :src="method.icon"
              mode="aspectFit"
            />
            <text v-else class="method-icon-text">{{ method.iconText }}</text>
            <view class="method-info">
              <text class="method-name">{{ method.name }}</text>
              <text v-if="method.desc" class="method-desc">{{ method.desc }}</text>
            </view>
          </view>
          <view class="method-radio" :class="{ 'method-radio--on': activeMethod === method.id }">
            <text v-if="activeMethod === method.id" class="radio-dot">●</text>
          </view>
        </view>
      </view>

      <!-- 确认按钮 -->
      <view class="panel-footer">
        <button
          class="pay-btn"
          :class="{ 'pay-btn--loading': paying }"
          :disabled="paying"
          @click="handlePay"
        >
          <text v-if="!paying">立即支付 ¥{{ amount.toFixed(2) }}</text>
          <text v-else>支付中...</text>
        </button>
      </view>

      <!-- 安全提示 -->
      <view class="panel-safe">
        <text class="safe-icon">🔒</text>
        <text class="safe-text">支付安全由微信支付提供保障</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  amount: { type: Number, default: 0 },
  orderId: { type: String, default: '' }
})

const emit = defineEmits(['close', 'success', 'fail'])

const paying = ref(false)
const activeMethod = ref('wechat')

const paymentMethods = [
  {
    id: 'wechat',
    name: '微信支付',
    desc: '推荐使用，安全便捷',
    iconText: '💚'
  },
  {
    id: 'wallet',
    name: '零钱支付',
    desc: '余额 ¥2,680.00',
    iconText: '💰'
  },
  {
    id: 'card',
    name: '银行卡支付',
    desc: '支持储蓄卡/信用卡',
    iconText: '💳'
  }
]

function handlePay() {
  paying.value = true

  // 模拟支付接口调用(2秒)
  setTimeout(() => {
    paying.value = false
    emit('success', {
      orderId: props.orderId,
      amount: props.amount,
      method: activeMethod.value,
      time: new Date().toISOString()
    })
  }, 2000)
}
</script>

<style lang="scss" scoped>
.payment-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.payment-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.25s ease;
}

.payment-panel {
  position: relative;
  background: #fff;
  border-radius: 32rpx 32rpx 0 0;
  padding: 0 32rpx 40rpx;
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);

  &--show {
    transform: translateY(0);
  }
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 36rpx 0 20rpx;
}

.panel-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #1a1a1a;
}

.panel-close {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #999;
}

.panel-amount {
  text-align: center;
  padding: 40rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  margin-bottom: 24rpx;
}

.amount-label {
  font-size: 24rpx;
  color: #999;
  display: block;
  margin-bottom: 12rpx;
}

.amount-value {
  color: #1a1a1a;
}

.amount-symbol {
  font-size: 36rpx;
  font-weight: 700;
}

.amount-num {
  font-size: 64rpx;
  font-weight: 700;
  margin-left: 4rpx;
}

.methods-title {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 16rpx;
  display: block;
}

.method-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
  transition: background 0.15s;

  &:active {
    background: #fafafa;
  }
}

.method-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.method-icon-text {
  font-size: 44rpx;
}

.method-info {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.method-name {
  font-size: 30rpx;
  font-weight: 500;
  color: #1a1a1a;
}

.method-desc {
  font-size: 22rpx;
  color: #aaa;
}

.method-radio {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 3rpx solid #d0d0d0;
  display: flex;
  align-items: center;
  justify-content: center;

  &--on {
    border-color: #2D8B3E;
  }
}

.radio-dot {
  color: #2D8B3E;
  font-size: 22rpx;
}

.panel-footer {
  padding-top: 40rpx;
}

.pay-btn {
  width: 100%;
  height: 96rpx;
  border-radius: 48rpx;
  background: linear-gradient(135deg, #2D8B3E, #4CAF50);
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  transition: opacity 0.2s;

  &:active {
    opacity: 0.85;
  }

  &--loading {
    opacity: 0.7;
  }
}

.panel-safe {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding-top: 24rpx;
}

.safe-icon {
  font-size: 24rpx;
}

.safe-text {
  font-size: 22rpx;
  color: #bbb;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
