<template>
  <view class="order-page">
    <!-- 导航栏 -->
    <view class="nav-bar">
      <view class="nav-back" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="nav-title">确认订单</text>
    </view>

    <!-- 地址区域 -->
    <view class="section address-section">
      <view class="section-title">
        <text class="title-icon">📍</text>
        <text class="title-text">收货地址</text>
      </view>

      <AddressCard
        :address="selectedAddress"
        :show-edit="false"
        :show-actions="false"
        @click="showAddressPicker = true"
      >
        <template v-if="!selectedAddress">
          <view class="empty-addr" @click="showAddressPicker = true">
            <text class="empty-addr-icon">+</text>
            <text class="empty-addr-text">请添加收货地址</text>
          </view>
        </template>
      </AddressCard>

      <view v-if="selectedAddress" class="addr-change" @click="showAddressPicker = true">
        <text>切换地址</text>
        <text class="arrow">›</text>
      </view>
    </view>

    <!-- 商品列表 -->
    <view class="section">
      <view class="section-title">
        <text class="title-icon">📦</text>
        <text class="title-text">商品信息</text>
      </view>

      <view
        v-for="(item, idx) in orderProducts"
        :key="item.id"
        class="order-item"
        :class="{ 'order-item--last': idx === orderProducts.length - 1 }"
      >
        <image class="order-item-img" :src="item.image" mode="aspectFill" />
        <view class="order-item-info">
          <text class="order-item-name">{{ item.name }}</text>
          <view class="order-item-bottom">
            <view class="order-item-price">
              <text class="osym">¥</text>
              <text class="oval">{{ item.price.toFixed(2) }}</text>
            </view>
            <text class="order-item-qty">×{{ item.quantity }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 优惠券 -->
    <view class="section">
      <view class="coupon-row" @click="showCouponPicker = true">
        <text class="coupon-label">优惠券</text>
        <view class="coupon-right">
          <text class="coupon-value" :class="{ 'coupon-value--active': selectedCoupon }">
            {{ selectedCoupon ? selectedCoupon.title : `${availableCoupons.length}张可用` }}
          </text>
          <text class="arrow">›</text>
        </view>
      </view>
    </view>

    <!-- 费用明细 -->
    <view class="section">
      <view class="price-row">
        <text class="price-label">商品总价</text>
        <text class="price-value">¥{{ totalPrice.toFixed(2) }}</text>
      </view>
      <view class="price-row">
        <text class="price-label">运费</text>
        <text class="price-value price-value--free">免运费</text>
      </view>
      <view v-if="discountAmount > 0" class="price-row">
        <text class="price-label">优惠券</text>
        <text class="price-value price-value--discount">-¥{{ discountAmount.toFixed(2) }}</text>
      </view>
      <view class="price-row price-row--total">
        <text class="price-label">实付金额</text>
        <view class="price-total">
          <text class="osym">¥</text>
          <text class="onum">{{ finalPrice.toFixed(2) }}</text>
        </view>
      </view>
    </view>

    <!-- 备注 -->
    <view class="section">
      <view class="remark-row">
        <text class="remark-label">订单备注</text>
        <input
          class="remark-input"
          v-model="remark"
          placeholder="选填：如发货时间、配送要求等"
          placeholder-style="color:#ccc"
        />
      </view>
    </view>

    <!-- 底部提交 -->
    <view class="order-footer">
      <view class="footer-price">
        <text class="footer-label">合计：</text>
        <view class="footer-total">
          <text class="fsym">¥</text>
          <text class="fnum">{{ finalPrice.toFixed(2) }}</text>
        </view>
      </view>
      <button class="submit-btn" @click="handleSubmitOrder">
        提交订单
      </button>
    </view>

    <!-- 地址选择弹窗 -->
    <view v-if="showAddressPicker" class="picker-mask" @click="showAddressPicker = false">
      <view class="picker-panel" @click.stop>
        <view class="picker-header">
          <text class="picker-title">选择收货地址</text>
          <view class="picker-close" @click="showAddressPicker = false">
            <text>✕</text>
          </view>
        </view>

        <scroll-view scroll-y class="picker-body">
          <AddressCard
            v-for="addr in userStore.addresses"
            :key="addr.id"
            :address="addr"
            :selectable="true"
            :selected="tempAddressId === addr.id"
            :show-edit="false"
            @click="tempAddressId = addr.id"
          />
          <view class="add-addr-btn" @click="showAddressForm = true">
            <text class="add-icon">+</text>
            <text>新增收货地址</text>
          </view>
        </scroll-view>

        <view class="picker-footer">
          <button class="confirm-btn" @click="confirmAddress">
            确定
          </button>
        </view>
      </view>
    </view>

    <!-- 优惠券选择弹窗 -->
    <view v-if="showCouponPicker" class="picker-mask" @click="showCouponPicker = false">
      <view class="picker-panel picker-panel--small" @click.stop>
        <view class="picker-header">
          <text class="picker-title">选择优惠券</text>
          <view class="picker-close" @click="showCouponPicker = false">
            <text>✕</text>
          </view>
        </view>

        <scroll-view scroll-y class="picker-body">
          <view
            class="coupon-option"
            :class="{ 'coupon-option--active': tempCouponId === -1 }"
            @click="tempCouponId = -1"
          >
            <text>不使用优惠券</text>
            <view class="coupon-radio" :class="{ 'coupon-radio--on': tempCouponId === -1 }"></view>
          </view>
          <view
            v-for="cp in availableCoupons"
            :key="cp.id"
            class="coupon-option"
            :class="{ 'coupon-option--active': tempCouponId === cp.id }"
            @click="tempCouponId = cp.id"
          >
            <view class="coupon-info">
              <text class="coupon-name">{{ cp.title }}</text>
              <text class="coupon-desc">
                {{ cp.type === 'percent' ? `打${(1 - cp.discount) * 10}折` : `满${cp.threshold}元可用` }}
              </text>
            </view>
            <view class="coupon-radio" :class="{ 'coupon-radio--on': tempCouponId === cp.id }"></view>
          </view>
        </scroll-view>

        <view class="picker-footer">
          <button class="confirm-btn" @click="confirmCoupon">
            确定
          </button>
        </view>
      </view>
    </view>

    <!-- 支付弹窗 -->
    <PaymentModal
      :visible="showPayment"
      :amount="finalPrice"
      :order-id="currentOrderId"
      @close="showPayment = false"
      @success="handlePaySuccess"
      @fail="handlePayFail"
    />

    <!-- 支付成功弹窗 -->
    <view v-if="payResult" class="result-mask" @click="goToOrderList">
      <view class="result-card" @click.stop>
        <view class="result-icon">✅</view>
        <text class="result-title">支付成功</text>
        <text class="result-amount">¥{{ payResult.finalAmount.toFixed(2) }}</text>
        <text class="result-desc">订单号：{{ payResult.orderId }}</text>
        <view class="result-actions">
          <view class="result-btn result-btn--outline" @click="goToHome">
            <text>返回首页</text>
          </view>
          <view class="result-btn result-btn--primary" @click="goToOrderList">
            <text>查看订单</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/store/product.js'
import { useUserStore } from '@/store/user.js'
import AddressCard from '@/components/AddressCard.vue'
import PaymentModal from '@/components/PaymentModal.vue'

const productStore = useProductStore()
const userStore = useUserStore()

// 从购物车获取选中商品
const orderProducts = computed(() => productStore.getSelectedCartItems())
const totalPrice = computed(() => orderProducts.value.reduce((s, p) => s + p.price * p.quantity, 0))

// 地址
const selectedAddress = ref(null)
const showAddressPicker = ref(false)
const tempAddressId = ref(0)
const showAddressForm = ref(false)

// 优惠券
const selectedCoupon = ref(null)
const showCouponPicker = ref(false)
const tempCouponId = ref(-1)

const availableCoupons = computed(() => userStore.availableCoupons)

const discountAmount = computed(() => {
  if (!selectedCoupon.value) return 0
  const cp = selectedCoupon.value
  if (cp.type === 'percent') {
    return totalPrice.value * cp.discount
  }
  return cp.discount
})

const finalPrice = computed(() => Math.max(0, totalPrice.value - discountAmount.value))

// 备注
const remark = ref('')

// 支付
const showPayment = ref(false)
const currentOrderId = ref('')
const payResult = ref(null)

onMounted(() => {
  // 默认选中第一个地址
  if (userStore.addresses.length > 0) {
    selectedAddress.value = userStore.defaultAddress
  }
})

function confirmAddress() {
  const addr = userStore.addresses.find(a => a.id === tempAddressId.value)
  if (addr) {
    selectedAddress.value = addr
  }
  showAddressPicker.value = false
}

function confirmCoupon() {
  if (tempCouponId.value === -1) {
    selectedCoupon.value = null
  } else {
    selectedCoupon.value = userStore.coupons.find(c => c.id === tempCouponId.value)
  }
  showCouponPicker.value = false
}

function handleSubmitOrder() {
  if (!selectedAddress.value) {
    uni.showToast({ title: '请选择收货地址', icon: 'none' })
    showAddressPicker.value = true
    return
  }
  if (orderProducts.value.length === 0) {
    uni.showToast({ title: '商品信息异常', icon: 'none' })
    return
  }

  // 创建订单
  const order = productStore.createOrder({
    products: orderProducts.value.map(p => ({ ...p })),
    total: finalPrice.value,
    originalTotal: totalPrice.value,
    discount: discountAmount.value,
    freight: 0,
    coupon: selectedCoupon.value ? { id: selectedCoupon.value.id, title: selectedCoupon.value.title } : null,
    address: {
      name: selectedAddress.value.name,
      phone: selectedAddress.value.phone,
      full: `${selectedAddress.value.province}${selectedAddress.value.city}${selectedAddress.value.district} ${selectedAddress.value.detail}`
    },
    remark: remark.value
  })

  currentOrderId.value = order.id

  // 使用优惠券
  if (selectedCoupon.value) {
    userStore.useCoupon(selectedCoupon.value.id)
  }

  // 弹出支付
  showPayment.value = true
}

function handlePaySuccess(result) {
  showPayment.value = false

  // 更新订单状态
  productStore.updateOrderStatus(currentOrderId.value, 'paid', '待发货')

  // 清空购物车中已购买的商品
  const boughtIds = orderProducts.value.map(p => p.id)
  boughtIds.forEach(id => productStore.removeFromCart(id))

  // 展示支付成功
  payResult.value = {
    orderId: currentOrderId.value,
    finalAmount: finalPrice.value
  }
}

function handlePayFail() {
  uni.showToast({ title: '支付失败，请重试', icon: 'none' })
}

function goToOrderList() {
  payResult.value = null
  uni.navigateTo({ url: '/pages/consumer/mall/order-list' })
}

function goToHome() {
  payResult.value = null
  uni.switchTab({ url: '/pages/consumer/home/index' })
}

function goBack() {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.order-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 140rpx;
}

.nav-bar {
  display: flex;
  align-items: center;
  padding: 24rpx 28rpx;
  background: #fff;
  height: 88rpx;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-back {
  margin-right: 20rpx;
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

// 通用区块
.section {
  background: #fff;
  margin: 20rpx 24rpx;
  border-radius: 20rpx;
  padding: 28rpx;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-bottom: 20rpx;
}

.title-icon {
  font-size: 30rpx;
}

.title-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #1a1a1a;
}

// 地址
.empty-addr {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 40rpx 0;
}

.empty-addr-icon {
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  border: 2rpx dashed #2D8B3E;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2D8B3E;
  font-size: 32rpx;
}

.empty-addr-text {
  font-size: 26rpx;
  color: #999;
}

.addr-change {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6rpx;
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #2D8B3E;
}

.arrow {
  font-size: 30rpx;
}

// 商品
.order-item {
  display: flex;
  padding: 16rpx 0;

  &--last {
    padding-bottom: 0;
  }
}

.order-item-img {
  width: 130rpx;
  height: 130rpx;
  border-radius: 14rpx;
  background: #f5f5f5;
  flex-shrink: 0;
}

.order-item-info {
  flex: 1;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.order-item-name {
  font-size: 26rpx;
  font-weight: 500;
  color: #1a1a1a;
  line-height: 1.4;
}

.order-item-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.order-item-price {
  color: #e53935;
  font-weight: 600;
}

.order-item-price .osym { font-size: 22rpx; }
.order-item-price .oval { font-size: 30rpx; }

.order-item-qty {
  font-size: 24rpx;
  color: #999;
}

// 优惠券
.coupon-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.coupon-label {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
}

.coupon-right {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.coupon-value {
  font-size: 26rpx;
  color: #999;

  &--active {
    color: #e53935;
    font-weight: 500;
  }
}

// 费用明细
.price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12rpx 0;

  &--total {
    border-top: 1rpx solid #f0f0f0;
    margin-top: 12rpx;
    padding-top: 20rpx;
  }
}

.price-label {
  font-size: 26rpx;
  color: #666;
}

.price-value {
  font-size: 26rpx;
  color: #333;

  &--free {
    color: #2D8B3E;
  }

  &--discount {
    color: #e53935;
  }
}

.price-total {
  color: #e53935;
  font-weight: 700;
}

.price-total .osym { font-size: 26rpx; }
.price-total .onum { font-size: 40rpx; }

// 备注
.remark-row {
  display: flex;
  align-items: center;
}

.remark-label {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.remark-input {
  flex: 1;
  font-size: 26rpx;
  color: #333;
  text-align: right;
}

// 底部
.order-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 28rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.04);
  z-index: 50;
}

.footer-price {
  display: flex;
  align-items: baseline;
  gap: 6rpx;
}

.footer-label {
  font-size: 26rpx;
  color: #666;
}

.footer-total {
  color: #e53935;
  font-weight: 700;
}

.footer-total .fsym { font-size: 28rpx; }
.footer-total .fnum { font-size: 44rpx; }

.submit-btn {
  padding: 20rpx 52rpx;
  border-radius: 44rpx;
  background: linear-gradient(135deg, #2D8B3E, #4CAF50);
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
  border: none;
}

// 弹窗通用
.picker-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.picker-panel {
  background: #fff;
  border-radius: 32rpx 32rpx 0 0;
  max-height: 70vh;
  display: flex;
  flex-direction: column;

  &--small {
    max-height: 55vh;
  }
}

.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 36rpx 32rpx 20rpx;
}

.picker-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #1a1a1a;
}

.picker-close {
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

.picker-body {
  flex: 1;
  padding: 0 32rpx;
  max-height: 600rpx;
}

.picker-footer {
  padding: 28rpx 32rpx;
  padding-bottom: calc(28rpx + env(safe-area-inset-bottom));
}

.confirm-btn {
  width: 100%;
  height: 88rpx;
  border-radius: 44rpx;
  background: linear-gradient(135deg, #2D8B3E, #4CAF50);
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
  border: none;
}

// 新增地址
.add-addr-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 36rpx 0;
  font-size: 26rpx;
  color: #2D8B3E;
}

.add-icon {
  font-size: 36rpx;
  font-weight: 300;
}

// 优惠券选项
.coupon-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
  font-size: 28rpx;
  color: #333;
}

.coupon-info {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.coupon-name {
  font-size: 28rpx;
  font-weight: 500;
}

.coupon-desc {
  font-size: 22rpx;
  color: #999;
}

.coupon-radio {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 3rpx solid #d0d0d0;

  &--on {
    border-color: #2D8B3E;
    background: #2D8B3E;
  }
}

// 支付成功
.result-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-card {
  width: 560rpx;
  background: #fff;
  border-radius: 28rpx;
  padding: 60rpx 40rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.result-icon {
  font-size: 80rpx;
  margin-bottom: 24rpx;
}

.result-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 16rpx;
}

.result-amount {
  font-size: 56rpx;
  font-weight: 700;
  color: #e53935;
  margin-bottom: 12rpx;
}

.result-desc {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 44rpx;
}

.result-actions {
  display: flex;
  gap: 24rpx;
  width: 100%;
}

.result-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 500;

  &--outline {
    border: 2rpx solid #d0d0d0;
    color: #666;
    background: #fff;
  }

  &--primary {
    background: linear-gradient(135deg, #2D8B3E, #4CAF50);
    color: #fff;
  }
}

input {
  min-height: auto;
}
</style>
