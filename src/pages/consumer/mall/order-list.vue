<template>
  <view class="order-list-page">
    <!-- 导航栏 -->
    <view class="nav-bar">
      <view class="nav-back" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="nav-title">我的订单</text>
    </view>

    <!-- 状态筛选 -->
    <view class="tabs">
      <view
        v-for="tab in tabs"
        :key="tab.value"
        class="tab-item"
        :class="{ 'tab-item--active': activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        <text>{{ tab.label }}</text>
        <view v-if="activeTab === tab.value" class="tab-indicator"></view>
      </view>
    </view>

    <!-- 订单列表 -->
    <scroll-view scroll-y class="order-scroll" :style="{ height: scrollHeight + 'px' }">
      <template v-if="filteredOrders.length > 0">
        <view
          v-for="order in filteredOrders"
          :key="order.id"
          class="order-card"
        >
          <!-- 订单头部 -->
          <view class="order-head">
            <text class="order-id">订单号：{{ order.id }}</text>
            <text
              class="order-status"
              :class="{
                'status-pending': order.status === 'pending',
                'status-paid': order.status === 'paid',
                'status-shipped': order.status === 'shipped',
                'status-completed': order.status === 'completed'
              }"
            >
              {{ order.statusText }}
            </text>
          </view>

          <!-- 商品 -->
          <view
            v-for="product in order.products"
            :key="product.id"
            class="order-product"
            @click="goToDetail(product.id)"
          >
            <image class="product-img" :src="product.image" mode="aspectFill" />
            <view class="product-info">
              <text class="product-name">{{ product.name }}</text>
              <view class="product-bottom">
                <view class="product-price">
                  <text class="psym">¥</text>
                  <text class="pval">{{ product.price.toFixed(2) }}</text>
                </view>
                <text class="product-qty">×{{ product.quantity }}</text>
              </view>
            </view>
          </view>

          <!-- 订单底部 -->
          <view class="order-foot">
            <text class="order-time">{{ order.time }}</text>
            <text class="order-total">共{{ totalProductCount(order) }}件 合计：¥{{ order.total.toFixed(2) }}</text>
          </view>

          <!-- 操作按钮 -->
          <view class="order-actions">
            <view
              v-if="order.status === 'pending'"
              class="action-btn action-btn--danger"
              @click="cancelOrder(order)"
            >
              取消订单
            </view>
            <view
              v-if="order.status === 'pending'"
              class="action-btn action-btn--primary"
              @click="goToPay(order)"
            >
              去支付
            </view>
            <view
              v-if="order.status === 'paid'"
              class="action-btn action-btn--primary"
              @click="remindShip(order)"
            >
              提醒发货
            </view>
            <view
              v-if="order.status === 'shipped'"
              class="action-btn action-btn--primary"
              @click="confirmReceive(order)"
            >
              确认收货
            </view>
            <view
              v-if="order.status === 'completed'"
              class="action-btn action-btn--primary"
              @click="buyAgain(order)"
            >
              再次购买
            </view>
          </view>
        </view>

        <!-- 底部提示 -->
        <view class="list-end">
          <text>— 没有更多订单了 —</text>
        </view>
      </template>

      <!-- 空状态 -->
      <view v-else class="empty-state">
        <text class="empty-icon">📋</text>
        <text class="empty-title">暂无相关订单</text>
        <text class="empty-desc">去商城逛逛，发现更多好物</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/store/product.js'

const productStore = useProductStore()

const tabs = [
  { label: '全部', value: 'all' },
  { label: '待付款', value: 'pending' },
  { label: '待发货', value: 'paid' },
  { label: '运输中', value: 'shipped' },
  { label: '已完成', value: 'completed' }
]

const activeTab = ref('all')

const scrollHeight = computed(() => {
  const info = uni.getSystemInfoSync()
  return info.windowHeight - 88 - 88
})

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') {
    return productStore.orders
  }
  return productStore.orders.filter(o => o.status === activeTab.value)
})

function totalProductCount(order) {
  return order.products.reduce((s, p) => s + p.quantity, 0)
}

function goToDetail(pid) {
  uni.navigateTo({ url: `/pages/consumer/mall/detail?id=${pid}` })
}

function goToPay(order) {
  uni.navigateTo({ url: `/pages/consumer/mall/order-confirm?orderId=${order.id}` })
}

function cancelOrder(order) {
  uni.showModal({
    title: '确认取消',
    content: '确定要取消此订单吗？',
    success: (res) => {
      if (res.confirm) {
        productStore.updateOrderStatus(order.id, 'cancelled', '已取消')
        uni.showToast({ title: '已取消', icon: 'success' })
      }
    }
  })
}

function remindShip() {
  uni.showToast({ title: '已提醒卖家发货', icon: 'success' })
}

function confirmReceive(order) {
  uni.showModal({
    title: '确认收货',
    content: '确定已收到商品吗？',
    success: (res) => {
      if (res.confirm) {
        productStore.updateOrderStatus(order.id, 'completed', '已完成')
        uni.showToast({ title: '确认收货成功', icon: 'success' })
      }
    }
  })
}

function buyAgain(order) {
  order.products.forEach(p => {
    productStore.addToCart({ id: p.id, name: p.name, image: p.image, price: p.price }, p.quantity)
  })
  uni.navigateTo({ url: '/pages/consumer/mall/cart' })
}

function goBack() {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.order-list-page {
  min-height: 100vh;
  background: $bg-base;
}

.nav-bar {
  display: flex;
  align-items: center;
  padding: 24rpx 28rpx;
  background: #FFF;
  .nav-back { margin-right: 16rpx; }
  .back-icon { font-size: 36rpx; color: $text-100; font-weight: 600; }
  .nav-title { font-size: 34rpx; font-weight: 700; color: $text-100; }
}

.tabs {
  display: flex;
  background: #FFF;
  padding: 4rpx 24rpx 0;
  .tab-item {
    flex: 1;
    text-align: center;
    padding: 18rpx 0;
    font-size: 26rpx;
    color: $text-60;
    position: relative;
    &--active { color: $primary; font-weight: 700; }
  }
  .tab-indicator {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 36rpx;
    height: 4rpx;
    border-radius: 2rpx;
    background: linear-gradient(90deg, $primary, $primary-light);
  }
}

.order-scroll { padding: 16rpx 0; }

.order-card {
  background: #FFF;
  margin: 0 24rpx 16rpx;
  border-radius: 18rpx;
  overflow: hidden;
  box-shadow: $shadow-sm;
}

.order-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22rpx 24rpx 0;
  .order-id { font-size: 22rpx; color: $text-40; font-family: monospace; }
  .order-status {
    font-size: 24rpx; font-weight: 600; padding: 4rpx 14rpx; border-radius: 10rpx;
    &.status-pending { color: #F97316; background: #FFF3E0; }
    &.status-paid { color: #0A84FF; background: #E3F2FD; }
    &.status-shipped { color: $primary; background: $primary-mist; }
    &.status-completed { color: $text-40; background: #F5F7F4; }
  }
}

.order-product {
  display: flex;
  padding: 20rpx 24rpx;
}

.product-img {
  width: 130rpx; height: 130rpx;
  border-radius: 14rpx;
  background: #F5F7F4;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
  margin-left: 18rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .product-name { font-size: 26rpx; font-weight: 600; color: $text-100; line-height: 1.4; }
  .product-bottom { display: flex; align-items: center; justify-content: space-between; }
  .product-price {
    color: #E74C3C; font-weight: 700;
    .psym { font-size: 22rpx; }
    .pval { font-size: 30rpx; }
  }
  .product-qty { font-size: 24rpx; color: $text-40; }
}

.order-foot {
  display: flex;
  justify-content: space-between;
  padding: 14rpx 24rpx;
  border-top: 1rpx solid #F2F5F1;
  .order-time { font-size: 22rpx; color: $text-40; }
  .order-total { font-size: 24rpx; color: $text-80; font-weight: 500; }
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 14rpx;
  padding: 0 24rpx 22rpx;
}

.action-btn {
  padding: 12rpx 28rpx;
  border-radius: 32rpx;
  font-size: 24rpx;
  border: 1rpx solid $border;
  color: $text-60;
  background: #FFF;
  font-weight: 500;
  transition: all 0.2s ease;
  &:active { background: #F8FAF7; }
  &--primary {
    border-color: $primary;
    color: $primary;
    background: $primary-mist;
    font-weight: 600;
  }
  &--danger {
    border-color: #EF4444;
    color: #EF4444;
    background: #FEE2E2;
    font-weight: 600;
  }
}

.list-end {
  text-align: center;
  padding: 32rpx 0 80rpx;
  font-size: 24rpx;
  color: $text-20;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200rpx;
  .empty-icon { font-size: 100rpx; margin-bottom: 20rpx; }
  .empty-title { font-size: 32rpx; font-weight: 600; color: $text-100; margin-bottom: 12rpx; }
  .empty-desc { font-size: 26rpx; color: $text-40; }
}
</style>
