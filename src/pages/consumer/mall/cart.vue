<template>
  <view class="cart-page">
    <!-- 导航栏 -->
    <view class="nav-bar">
      <view class="nav-back" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="nav-title">购物车</text>
      <view class="nav-action" @click="manageMode = !manageMode">
        <text>{{ manageMode ? '完成' : '管理' }}</text>
      </view>
    </view>

    <!-- 有商品 -->
    <template v-if="cart.length > 0">
      <!-- 商品列表 -->
      <scroll-view scroll-y class="cart-list" :style="{ height: scrollHeight + 'px' }">
        <CartItem
          v-for="(item, idx) in cart"
          :key="item.id"
          :item="item"
          :selected="selectedCartIds.includes(item.id)"
          :is-last="idx === cart.length - 1"
          @toggle="productStore.toggleCartSelect(item.id)"
          @click="goToDetail"
          @quantity-change="handleQtyChange"
        />
      </scroll-view>

      <!-- 底部结算栏 -->
      <view class="cart-footer">
        <view class="footer-left">
          <view class="select-all" @click="productStore.toggleSelectAll()">
            <view class="check-circle" :class="{ 'check-circle--active': productStore.isAllSelected }">
              <text v-if="productStore.isAllSelected" class="check-icon">✓</text>
            </view>
            <text class="select-text">全选</text>
          </view>
          <view class="total-info">
            <text class="total-label">合计：</text>
            <view class="total-price">
              <text class="price-symbol">¥</text>
              <text class="price-value">{{ productStore.cartTotal.toFixed(2) }}</text>
            </view>
          </view>
        </view>

        <view
          class="checkout-btn"
          :class="{ 'checkout-btn--disabled': selectedCartIds.length === 0 }"
          @click="goToOrderConfirm"
        >
          <text v-if="!manageMode">结算({{ selectedCartIds.length }})</text>
          <text v-else class="delete-text" @click.stop="deleteSelected">删除({{ selectedCartIds.length }})</text>
        </view>
      </view>
    </template>

    <!-- 空状态 -->
    <view v-else class="empty-state">
      <image class="empty-img" src="/static/icons/cart-empty.png" mode="aspectFit" v-if="false" />
      <text class="empty-icon">🛒</text>
      <text class="empty-title">购物车空空如也</text>
      <text class="empty-desc">去商城逛逛，发现更多好物</text>
      <view class="empty-btn" @click="goToMall">
        <text>去逛逛</text>
      </view>
    </view>

    <!-- 悬浮购物图标 -->
    <view v-if="cart.length > 0" class="floating-cart" @click="goToMall">
      <text class="floating-text">+</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProductStore } from '@/store/product.js'
import CartItem from '@/components/CartItem.vue'

const productStore = useProductStore()

const { cart, selectedCartIds } = productStore
const manageMode = ref(false)

// 计算滚动区域高度（减去顶栏和底栏）
const scrollHeight = computed(() => {
  const systemInfo = uni.getSystemInfoSync()
  return systemInfo.windowHeight - 88 - 116
})

function handleQtyChange(id, qty) {
  productStore.updateCartQuantity(id, qty)
}

function goToDetail(item) {
  uni.navigateTo({ url: `/pages/consumer/mall/detail?id=${item.id}` })
}

function goToOrderConfirm() {
  if (manageMode.value) return
  if (selectedCartIds.value.length === 0) {
    uni.showToast({ title: '请选择商品', icon: 'none' })
    return
  }
  uni.navigateTo({ url: '/pages/consumer/mall/order-confirm' })
}

function deleteSelected() {
  if (selectedCartIds.value.length === 0) {
    uni.showToast({ title: '请选择要删除的商品', icon: 'none' })
    return
  }
  uni.showModal({
    title: '确认删除',
    content: `确定要删除选中的${selectedCartIds.value.length}件商品吗？`,
    success: (res) => {
      if (res.confirm) {
        selectedCartIds.value.forEach(id => {
          productStore.removeFromCart(id)
        })
        uni.showToast({ title: '已删除', icon: 'success' })
      }
    }
  })
}

function goToMall() {
  uni.switchTab({ url: '/pages/consumer/mall/index' })
}

function goBack() {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.cart-page {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 28rpx;
  background: #fff;
  height: 88rpx;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-back {
  padding: 8rpx;
  width: 60rpx;
}

.back-icon {
  font-size: 38rpx;
  color: #333;
  font-weight: 500;
}

.nav-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #1a1a1a;
}

.nav-action {
  width: 60rpx;
  text-align: right;
  font-size: 26rpx;
  color: #2D8B3E;
}

.cart-list {
  flex: 1;
}

// 底部结算
.cart-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 28rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.footer-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.select-all {
  display: flex;
  align-items: center;
  gap: 14rpx;
  margin-right: 24rpx;
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
  font-size: 24rpx;
  font-weight: 700;
}

.select-text {
  font-size: 26rpx;
  color: #333;
}

.total-info {
  display: flex;
  align-items: baseline;
  gap: 6rpx;
}

.total-label {
  font-size: 24rpx;
  color: #888;
}

.total-price {
  color: #e53935;
  font-weight: 700;
}

.price-symbol {
  font-size: 28rpx;
}

.price-value {
  font-size: 40rpx;
}

.checkout-btn {
  padding: 18rpx 44rpx;
  border-radius: 44rpx;
  background: linear-gradient(135deg, #2D8B3E, #4CAF50);
  color: #fff;
  font-size: 28rpx;
  font-weight: 600;
  transition: opacity 0.2s;

  &:active {
    opacity: 0.85;
  }

  &--disabled {
    background: #ccc;
    color: #fff;
  }
}

.delete-text {
  color: #fff;
}

// 空状态
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 120rpx;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 20rpx;
}

.empty-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 12rpx;
}

.empty-desc {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 40rpx;
}

.empty-btn {
  padding: 20rpx 64rpx;
  border-radius: 44rpx;
  background: linear-gradient(135deg, #2D8B3E, #4CAF50);
  color: #fff;
  font-size: 28rpx;
  font-weight: 500;
}

// 悬浮按钮
.floating-cart {
  position: fixed;
  right: 32rpx;
  bottom: 200rpx;
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-text {
  font-size: 46rpx;
  color: #2D8B3E;
  font-weight: 300;
}
</style>
