<template>
  <view class="detail-page" v-if="product">
    <!-- 自定义导航栏 -->
    <view class="detail-nav">
      <view class="nav-back" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="nav-title">商品详情</text>
      <view class="nav-cart" @click="goToCart">
        <text class="cart-icon">🛒</text>
        <view v-if="productStore.cartCount > 0" class="cart-badge">
          <text class="badge-text">{{ productStore.cartCount > 99 ? '99+' : productStore.cartCount }}</text>
        </view>
      </view>
    </view>

    <!-- 商品图片轮播 -->
    <swiper class="image-swiper" :indicator-dots="true" indicator-color="#FFF" indicator-active-color="#2D8B3E">
      <swiper-item v-for="(img, idx) in product.images" :key="idx">
        <image :src="img" mode="aspectFill" class="swiper-image" />
      </swiper-item>
    </swiper>

    <!-- 商品基本信息 -->
    <view class="product-base">
      <view class="price-row">
        <text class="price">¥{{ product.price }}</text>
        <text class="original-price">¥{{ product.originalPrice }}</text>
        <view class="tag-ai">
          <text>✦ AI推荐</text>
        </view>
      </view>
      <text class="product-name">{{ product.name }}</text>
      <view class="product-meta">
        <text class="meta-item">产地：{{ product.origin }}</text>
        <text class="meta-item">已售{{ product.sales }}</text>
        <text class="meta-item">⭐ {{ product.rating }}</text>
      </view>
    </view>

    <!-- 一物一码 -->
    <view class="trace-section">
      <view class="trace-header">
        <view class="trace-title-row">
          <text class="trace-icon">🔗</text>
          <text class="trace-title">一物一码 · 全链路溯源</text>
        </view>
        <text class="trace-code">溯源码：{{ product.traceCode }}</text>
      </view>

      <view class="trace-timeline">
        <view v-for="(item, key) in product.trace" :key="key" class="timeline-item">
          <view class="timeline-dot"></view>
          <view class="timeline-content">
            <text class="timeline-title">{{ item.title }}</text>
            <text class="timeline-desc">{{ item.content }}</text>
          </view>
        </view>
      </view>

      <view class="trace-footer" @click="handleTraceDetail">
        <text class="trace-footer-text">查看完整溯源信息 →</text>
      </view>
    </view>

    <!-- 商品介绍 -->
    <view class="intro-section">
      <text class="section-title">商品介绍</text>
      <text class="intro-text">{{ product.desc }}</text>
    </view>

    <!-- AI食用建议 -->
    <view class="ai-advice">
      <view class="advice-header">
        <text class="advice-icon">🤖</text>
        <text class="advice-title">AI食用建议</text>
        <text class="advice-badge">个性化</text>
      </view>
      <text class="advice-text">{{ product.aiAdvice }}</text>
    </view>

    <!-- 农庄信息 -->
    <view class="farmer-section">
      <text class="section-title">农庄信息</text>
      <view class="farmer-card">
        <view class="farmer-avatar">
          <text>🏡</text>
        </view>
        <view class="farmer-info">
          <text class="farmer-name">{{ product.farmerName }}</text>
          <text class="farmer-desc">{{ product.origin }} · 有机认证</text>
        </view>
        <view class="farmer-action" @click="handleFarmerClick">
          <text>进店逛逛 →</text>
        </view>
      </view>
    </view>

    <!-- 安全区 -->
    <view style="height: 120rpx;"></view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar safe-area-bottom">
      <view class="bar-left">
        <view class="bar-icon-item" @click="toggleFavorite">
          <text class="bar-icon">{{ isFav ? '❤️' : '🤍' }}</text>
          <text class="bar-text">{{ isFav ? '已收藏' : '收藏' }}</text>
        </view>
        <view class="bar-icon-item" @click="goToCart">
          <text class="bar-icon">🛒</text>
          <text class="bar-text">购物车</text>
          <view v-if="productStore.cartCount > 0" class="cart-badge">{{ productStore.cartCount }}</view>
        </view>
      </view>
      <view class="bar-right">
        <view class="btn-add-cart" @click="handleAddCart">
          <text>加入购物车</text>
        </view>
        <view class="btn-buy" @click="handleBuyNow">
          <text>立即购买</text>
        </view>
      </view>
    </view>
  </view>

  <view v-else class="loading-page">
    <text>加载中...</text>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useProductStore } from '@/store/product.js'
import { useUserStore } from '@/store/user.js'

const productStore = useProductStore()
const userStore = useUserStore()
const product = ref(null)
const isFav = ref(false)

onLoad((options) => {
  const id = options.id
  if (id) {
    product.value = productStore.getProductById(id)
    if (product.value) {
      uni.setNavigationBarTitle({ title: product.value.name })
      isFav.value = userStore.isFavorite(product.value.id)
    }
  }
})

function toggleFavorite() {
  if (!product.value) return
  if (isFav.value) {
    userStore.removeFromFavorites(product.value.id)
    isFav.value = false
  } else {
    userStore.addToFavorites(product.value.id)
    isFav.value = true
  }
}

function handleAddCart() {
  if (product.value) {
    productStore.addToCart(product.value)
  }
}

function handleBuyNow() {
  if (product.value) {
    // 立即购买：清空购物车选购，加入当前商品，跳转订单确认
    productStore.clearCart()
    productStore.addToCart(product.value)
    uni.navigateTo({ url: '/pages/consumer/mall/order-confirm' })
  }
}

function goToCart() {
  uni.navigateTo({ url: '/pages/consumer/mall/cart' })
}

function goBack() {
  uni.navigateBack()
}

function handleTraceDetail() {
  uni.showToast({ title: '完整溯源信息', icon: 'none' })
}

function handleFarmerClick() {
  uni.showToast({ title: '进入农庄', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.detail-page {
  background: #F5F7FA;
  min-height: 100vh;
}

// 自定义导航栏
.detail-nav {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 28rpx;
  padding-top: calc(24rpx + var(--status-bar-height, 0px));

  .nav-back {
    width: 56rpx;
    height: 56rpx;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(10rpx);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .back-icon {
    font-size: 38rpx;
    color: #fff;
    font-weight: 500;
  }

  .nav-title {
    font-size: 34rpx;
    font-weight: 700;
    color: #fff;
    text-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.2);
  }

  .nav-cart {
    position: relative;
    width: 56rpx;
    height: 56rpx;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(10rpx);
    display: flex;
    align-items: center;
    justify-content: center;

    .cart-icon {
      font-size: 30rpx;
    }
  }

  .cart-badge {
    position: absolute;
    top: -4rpx;
    right: -6rpx;
    min-width: 28rpx;
    height: 28rpx;
    border-radius: 14rpx;
    background: #e53935;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 6rpx;

    .badge-text {
      font-size: 18rpx;
      color: #fff;
      font-weight: 600;
    }
  }
}

.image-swiper {
  width: 100%;
  height: 750rpx;
  
  .swiper-image {
    width: 100%;
    height: 100%;
  }
}

.product-base {
  background: #FFF;
  padding: 32rpx;
  margin: -24rpx 0 0;
  border-radius: 24rpx 24rpx 0 0;
  position: relative;
  z-index: 1;
  
  .price-row {
    display: flex;
    align-items: baseline;
    
    .price {
      font-size: 48rpx;
      font-weight: 700;
      color: #E53935;
    }
    
    .original-price {
      font-size: 26rpx;
      color: #BBB;
      text-decoration: line-through;
      margin-left: 12rpx;
    }
    
    .tag-ai {
      margin-left: auto;
      background: linear-gradient(135deg, #E8F5E9, #C8E6C9);
      padding: 6rpx 16rpx;
      border-radius: 16rpx;
      
      text {
        font-size: 22rpx;
        color: #2D8B3E;
        font-weight: 500;
      }
    }
  }
  
  .product-name {
    font-size: 34rpx;
    font-weight: 600;
    color: #1A1A1A;
    display: block;
    margin-top: 12rpx;
  }
  
  .product-meta {
    display: flex;
    gap: 32rpx;
    margin-top: 12rpx;
    
    .meta-item {
      font-size: 24rpx;
      color: #888;
    }
  }
}

.trace-section {
  background: #FFF;
  margin-top: 16rpx;
  padding: 32rpx;
  
  .trace-header {
    .trace-title-row {
      display: flex;
      align-items: center;
      
      .trace-icon {
        font-size: 32rpx;
        margin-right: 8rpx;
      }
      
      .trace-title {
        font-size: 30rpx;
        font-weight: 600;
        color: #1A1A1A;
      }
    }
    
    .trace-code {
      font-size: 24rpx;
      color: #2D8B3E;
      background: #E8F5E9;
      padding: 4rpx 16rpx;
      border-radius: 8rpx;
      display: inline-block;
      margin-top: 12rpx;
    }
  }
  
  .trace-timeline {
    margin-top: 28rpx;
    position: relative;
    padding-left: 24rpx;
    
    &::before {
      content: '';
      position: absolute;
      left: 10rpx;
      top: 6rpx;
      bottom: 6rpx;
      width: 2rpx;
      background: linear-gradient(180deg, #2D8B3E, #C8E6C9);
    }
    
    .timeline-item {
      display: flex;
      margin-bottom: 24rpx;
      position: relative;
      
      .timeline-dot {
        width: 12rpx;
        height: 12rpx;
        background: #2D8B3E;
        border-radius: 50%;
        position: absolute;
        left: 5rpx;
        top: 8rpx;
        transform: translateX(-50%);
      }
      
      .timeline-content {
        flex: 1;
        padding-left: 20rpx;
        
        .timeline-title {
          font-size: 26rpx;
          font-weight: 600;
          color: #333;
          display: block;
        }
        
        .timeline-desc {
          font-size: 24rpx;
          color: #888;
          display: block;
          margin-top: 4rpx;
        }
      }
    }
  }
  
  .trace-footer {
    text-align: center;
    margin-top: 8rpx;
    
    .trace-footer-text {
      font-size: 26rpx;
      color: #2D8B3E;
      font-weight: 500;
    }
  }
}

.intro-section {
  background: #FFF;
  margin-top: 16rpx;
  padding: 32rpx;
  
  .section-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #1A1A1A;
    display: block;
    margin-bottom: 12rpx;
  }
  
  .intro-text {
    font-size: 28rpx;
    color: #555;
    line-height: 1.8;
  }
}

.ai-advice {
  background: linear-gradient(135deg, #F1F8E9, #E8F5E9);
  margin: 16rpx 0;
  padding: 32rpx;
  border-radius: 0;
  
  .advice-header {
    display: flex;
    align-items: center;
    margin-bottom: 12rpx;
    
    .advice-icon {
      font-size: 36rpx;
      margin-right: 10rpx;
    }
    
    .advice-title {
      font-size: 30rpx;
      font-weight: 600;
      color: #1B5E20;
    }
    
    .advice-badge {
      margin-left: 12rpx;
      font-size: 20rpx;
      color: #2D8B3E;
      background: rgba(255,255,255,0.8);
      padding: 2rpx 12rpx;
      border-radius: 8rpx;
    }
  }
  
  .advice-text {
    font-size: 26rpx;
    color: #4CAF50;
    line-height: 1.8;
  }
}

.farmer-section {
  background: #FFF;
  margin-top: 16rpx;
  padding: 32rpx;
  
  .section-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #1A1A1A;
    display: block;
    margin-bottom: 16rpx;
  }
  
  .farmer-card {
    display: flex;
    align-items: center;
    
    .farmer-avatar {
      width: 80rpx;
      height: 80rpx;
      background: linear-gradient(135deg, #E8F5E9, #C8E6C9);
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      
      text {
        font-size: 40rpx;
      }
    }
    
    .farmer-info {
      flex: 1;
      margin-left: 16rpx;
      
      .farmer-name {
        font-size: 28rpx;
        font-weight: 600;
        color: #333;
        display: block;
      }
      
      .farmer-desc {
        font-size: 24rpx;
        color: #888;
        display: block;
        margin-top: 4rpx;
      }
    }
    
    .farmer-action {
      background: linear-gradient(135deg, #2D8B3E, #4CAF50);
      padding: 12rpx 24rpx;
      border-radius: 24rpx;
      
      text {
        font-size: 24rpx;
        color: #FFF;
        font-weight: 500;
      }
    }
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFF;
  display: flex;
  align-items: center;
  height: 100rpx;
  padding: 0 24rpx;
  box-shadow: 0 -2rpx 12rpx rgba(0,0,0,0.06);
  z-index: 100;
  
  .bar-left {
    display: flex;
    align-items: center;
    
    .bar-icon-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 32rpx;
      position: relative;
      
      .bar-icon {
        font-size: 36rpx;
      }
      
      .bar-text {
        font-size: 20rpx;
        color: #888;
        margin-top: 2rpx;
      }
      
      .cart-badge {
        position: absolute;
        top: -4rpx;
        right: -8rpx;
        min-width: 28rpx;
        height: 28rpx;
        background: #E53935;
        color: #FFF;
        font-size: 18rpx;
        border-radius: 14rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 6rpx;
      }
    }
  }
  
  .bar-right {
    display: flex;
    flex: 1;
    justify-content: flex-end;
    
    .btn-add-cart {
      background: linear-gradient(135deg, #FF7A00, #FF9800);
      color: #FFF;
      padding: 18rpx 36rpx;
      border-radius: 36rpx 0 0 36rpx;
      font-size: 26rpx;
      font-weight: 500;
    }
    
    .btn-buy {
      background: linear-gradient(135deg, #E53935, #FF5252);
      color: #FFF;
      padding: 18rpx 36rpx;
      border-radius: 0 36rpx 36rpx 0;
      font-size: 26rpx;
      font-weight: 500;
    }
  }
}

.loading-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 28rpx;
  color: #999;
}
</style>
