<template>
  <view class="profile-page bg-gradient-page safe-area-bottom">

    <!-- ═══════════════ 顶部头部区 ═══════════════ -->
    <view class="profile-header">
      <!-- 背景光效 -->
      <view class="header-glow header-glow-1"></view>
      <view class="header-glow header-glow-2"></view>

      <!-- 用户信息 -->
      <view class="user-basic">
        <view class="avatar-box">
          <image :src="userInfo.avatar" mode="aspectFill" class="avatar-img" />
          <view class="avatar-ring"></view>
        </view>
        <view class="user-text">
          <text class="user-name">{{ userInfo.nickname }}</text>
          <view class="user-tags">
            <text class="user-tag member" v-if="userInfo.isMember">
              <text class="tag-dot"></text>认证会员
            </text>
            <text class="user-tag loyal">
              {{ userInfo.memberDays }}天忠实用户
            </text>
          </view>
          <text class="user-signature">{{ userInfo.signature }}</text>
        </view>
        <view class="setting-btn" @click="goSettings">
          <text>⚙️</text>
        </view>
      </view>

      <!-- AI健康速览 -->
      <view class="health-card">
        <view class="health-card-head">
          <view class="health-card-title">
            <text class="ai-dot"></text>
            <text>AI 健康速览</text>
          </view>
          <text class="health-refresh" @click="refreshHealth">刷新 ⟳</text>
        </view>
        <view class="health-items">
          <view class="health-item">
            <view class="hi-icon hi-icon-score">📊</view>
            <view class="hi-content">
              <text class="hi-val">{{ healthData.nutritionScore }}</text>
              <text class="hi-label">营养评分</text>
            </view>
          </view>
          <view class="health-divider"></view>
          <view class="health-item">
            <view class="hi-icon hi-icon-bmi">💪</view>
            <view class="hi-content">
              <text class="hi-val">{{ healthData.bmi }}</text>
              <text class="hi-label">BMI指数</text>
            </view>
          </view>
          <view class="health-divider"></view>
          <view class="health-item">
            <view class="hi-icon hi-icon-rec">📝</view>
            <view class="hi-content">
              <text class="hi-val">{{ healthData.recordCount }}条</text>
              <text class="hi-label">健康记录</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 快捷数据 -->
      <view class="quick-stats">
        <view class="qs-item" v-for="s in quickStats" :key="s.key">
          <text class="qs-val">{{ s.value }}</text>
          <text class="qs-label">{{ s.label }}</text>
        </view>
      </view>
    </view>

    <!-- ═══════════════ 常用服务 ═══════════════ -->
    <view class="panel-section">
      <view class="panel-title-row">
        <view class="panel-title-line"></view>
        <text class="panel-title-text">常用服务</text>
      </view>
      <view class="service-grid">
        <view
          class="service-item"
          v-for="item in services"
          :key="item.key"
          @click="navigate(item.url)"
        >
          <view class="si-icon-box" :style="{ background: item.bg }">
            <text class="si-icon">{{ item.icon }}</text>
          </view>
          <text class="si-label">{{ item.label }}</text>
          <text class="si-desc">{{ item.desc }}</text>
        </view>
      </view>
    </view>

    <!-- ═══════════════ 我的订单 ═══════════════ -->
    <view class="panel-section">
      <view class="panel-title-row">
        <view class="panel-title-line"></view>
        <text class="panel-title-text">我的订单</text>
        <text class="panel-all" @click="goOrders">全部订单 ›</text>
      </view>
      <view class="order-status-bar">
        <view
          class="os-item"
          v-for="item in orderStatuses"
          :key="item.key"
          @click="filterOrders(item.key)"
        >
          <view class="os-icon-wrap">
            <text class="os-icon">{{ item.icon }}</text>
            <view class="os-badge" v-if="item.count > 0">{{ item.count > 99 ? '99+' : item.count }}</view>
          </view>
          <text class="os-label">{{ item.label }}</text>
        </view>
      </view>
    </view>

    <!-- ═══════════════ 我的资产 ═══════════════ -->
    <view class="panel-section">
      <view class="panel-title-row">
        <view class="panel-title-line"></view>
        <text class="panel-title-text">我的资产</text>
      </view>
      <view class="asset-row">
        <view class="asset-item" v-for="a in assets" :key="a.key" @click="navigate(a.url)">
          <view class="ai-icon-wrap" :style="{ background: a.bg }">
            <text>{{ a.icon }}</text>
          </view>
          <view class="ai-info">
            <text class="ai-val">{{ a.value }}</text>
            <text class="ai-label">{{ a.label }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- ═══════════════ 菜单列表 ═══════════════ -->
    <view class="panel-section">
      <view class="panel-title-row">
        <view class="panel-title-line"></view>
        <text class="panel-title-text">更多服务</text>
      </view>
      <view class="menu-list">
        <view
          class="menu-item"
          v-for="(item, i) in menuList"
          :key="item.key"
          @click="navigate(item.url)"
          :style="{ animationDelay: (i * 0.05) + 's' }"
        >
          <view class="mi-left">
            <view class="mi-icon" :style="{ background: item.bg }">
              <text>{{ item.icon }}</text>
            </view>
            <view class="mi-text">
              <text class="mi-label">{{ item.label }}</text>
              <text class="mi-desc">{{ item.desc }}</text>
            </view>
          </view>
          <view class="mi-right">
            <text class="mi-extra" v-if="item.extra">{{ item.extra }}</text>
            <text class="mi-arrow">›</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 切换身份 -->
    <view class="switch-section">
      <view class="switch-btn" @click="switchIdentity">
        <text class="sb-icon">🔄</text>
        <text class="sb-text">切换到农户端</text>
        <text class="sb-arrow">›</text>
      </view>
    </view>

    <!-- 底部导航 -->
    <CustomTabBar page="profile" />
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import CustomTabBar from '@/components/CustomTabBar.vue'
import { useUserStore } from '@/store/user.js'

const userStore = useUserStore()

// 用户信息
const userInfo = reactive({
  nickname: '小王',
  avatar: '/static/logo.png',
  isMember: true,
  memberDays: 186,
  signature: '爱生活，爱自然，支持乡村振兴'
})

// AI健康数据
const healthData = reactive({
  nutritionScore: '86分',
  bmi: '22.4',
  recordCount: 12
})

function refreshHealth() {
  healthData.nutritionScore = (80 + Math.floor(Math.random() * 16)) + '分'
  uni.showToast({ title: '已刷新', icon: 'success', duration: 800 })
}

// 快捷数据
const quickStats = ref([
  { key: 'points', value: '2,860', label: '积分' },
  { key: 'coupon', value: '5张', label: '优惠券' },
  { key: 'footprint', value: '128件', label: '足迹' },
  { key: 'collect', value: '36件', label: '收藏' },
])

// 常用服务
const services = ref([
  { key: 'diet', icon: '🍽️', label: '饮食顾问', desc: '定制饮食方案', url: '/pages/consumer/ai-center/index?module=diet', bg: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)' },
  { key: 'nutrition', icon: '🥗', label: 'AI营养师', desc: '健康分析评估', url: '/pages/consumer/ai-center/index?module=nutrition', bg: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)' },
  { key: 'shop', icon: '🛒', label: '智能选购', desc: 'AI帮您选好物', url: '/pages/consumer/ai-center/index?module=shopping', bg: 'linear-gradient(135deg, #FEF3C7, #FDE68A)' },
  { key: 'consult', icon: '💬', label: '自由咨询', desc: '随时问AI', url: '/pages/consumer/ai-center/index?module=consult', bg: 'linear-gradient(135deg, #F3E8FF, #E9D5FF)' },
])

// 订单状态
const orderStatuses = ref([
  { key: 'all', icon: '📋', label: '全部', count: 28 },
  { key: 'pending', icon: '⏳', label: '待付款', count: 2 },
  { key: 'shipping', icon: '🚚', label: '待发货', count: 3 },
  { key: 'receiving', icon: '📦', label: '待收货', count: 5 },
  { key: 'done', icon: '✅', label: '已完成', count: 0 },
])

// 资产
const assets = ref([
  { key: 'wallet', icon: '💰', label: '余额', value: '¥128.50', url: '', bg: '#10B981' },
  { key: 'score', icon: '⭐', label: '积分', value: '2,860', url: '', bg: '#F59E0B' },
  { key: 'coupon', icon: '🎫', label: '优惠券', value: '5张', url: '', bg: '#EF4444' },
  { key: 'giftcard', icon: '🎁', label: '礼品卡', value: '2张', url: '', bg: '#7C3AED' },
])

// 菜单
const menuList = ref([
  { key: 'trace', icon: '🔍', label: '溯源查询', desc: '扫码查看农产品源头', url: '', bg: '#10B981', extra: '' },
  { key: 'addr', icon: '📍', label: '收货地址', desc: '管理您的收货地址', url: '', bg: '#0A84FF', extra: '' },
  { key: 'history', icon: '🕐', label: '浏览记录', desc: '查看最近看过的好物', url: '', bg: '#6366F1', extra: '128条' },
  { key: 'feedback', icon: '💡', label: '意见反馈', desc: '帮助我们变得更好', url: '', bg: '#8B5CF6', extra: '' },
  { key: 'about', icon: 'ℹ️', label: '关于智链', desc: '了解我们的使命', url: '', bg: '#0D7B3E', extra: 'v1.2.0' },
])

// ========== 事件 ==========
function navigate(url) {
  if (!url) {
    uni.showToast({ title: '功能开发中', icon: 'none' })
    return
  }
  if (url.startsWith('/')) {
    uni.navigateTo({ url })
  } else {
    uni.showToast({ title: '功能开发中', icon: 'none' })
  }
}
function switchIdentity() {
  userStore.logout()
  uni.reLaunch({ url: '/pages/identity/index' })
}
function goSettings() {
  uni.showToast({ title: '设置功能开发中', icon: 'none' })
}
function goOrders() {
  uni.showToast({ title: '订单功能开发中', icon: 'none' })
}
function filterOrders(status) {
  uni.showToast({ title: '订单筛选功能开发中', icon: 'none' })
}
</script>

<style lang="scss" scoped>
/* ═══════════════ 页面 ═══════════════ */
.profile-page {
  min-height: 100vh;
  padding-bottom: 140rpx;
}

/* ═══════════════ 头部 ═══════════════ */
.profile-header {
  padding: calc(var(--status-bar-height) + 20rpx) 28rpx 32rpx;
  background: linear-gradient(165deg, #064E28 0%, #0D7B3E 40%, #059669 100%);
  position: relative;
  overflow: hidden;

  .header-glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(60rpx);
    opacity: 0.3;
    &.header-glow-1 {
      width: 320rpx; height: 320rpx;
      top: -80rpx; right: -60rpx;
      background: radial-gradient(circle, rgba(0,212,170,0.5), transparent 70%);
    }
    &.header-glow-2 {
      width: 240rpx; height: 240rpx;
      bottom: -40rpx; left: 20rpx;
      background: radial-gradient(circle, rgba(10,132,255,0.35), transparent 70%);
    }
  }
}

/* 用户基本信息 */
.user-basic {
  display: flex;
  align-items: center;
  gap: 18rpx;
  position: relative;
  z-index: 1;
}

.avatar-box {
  position: relative;
  flex-shrink: 0;

  .avatar-img {
    width: 112rpx;
    height: 112rpx;
    border-radius: 50%;
    border: 4rpx solid rgba(255,255,255,0.5);
    box-shadow: 0 6rpx 24rpx rgba(0,0,0,0.2);
  }

  .avatar-ring {
    position: absolute;
    top: -6rpx; left: -6rpx;
    width: 124rpx; height: 124rpx;
    border-radius: 50%;
    border: 3rpx solid rgba(0,212,170,0.3);
    animation: ring-spin 8s linear infinite;
  }
}

@keyframes ring-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.user-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6rpx;

  .user-name {
    font-size: 38rpx;
    font-weight: 800;
    color: #FFF;
    letter-spacing: 1rpx;
  }

  .user-tags {
    display: flex;
    gap: 10rpx;
    .user-tag {
      font-size: 20rpx;
      padding: 4rpx 14rpx;
      border-radius: 20rpx;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 4rpx;

      &.member {
        background: rgba(0,212,170,0.2);
        color: #00D4AA;
        border: 1rpx solid rgba(0,212,170,0.3);
        .tag-dot {
          width: 8rpx; height: 8rpx;
          background: #00D4AA;
          border-radius: 50%;
        }
      }
      &.loyal {
        background: rgba(255,255,255,0.15);
        color: rgba(255,255,255,0.9);
      }
    }
  }

  .user-signature {
    font-size: 22rpx;
    color: rgba(255,255,255,0.65);
  }
}

.setting-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  backdrop-filter: blur(10rpx);
}

/* AI健康速览卡片 */
.health-card {
  margin-top: 24rpx;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(20rpx);
  border-radius: 20rpx;
  padding: 20rpx 24rpx;
  position: relative;
  z-index: 1;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
  border: 1rpx solid rgba(255,255,255,0.5);
}

.health-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;

  .health-card-title {
    display: flex;
    align-items: center;
    gap: 8rpx;
    font-size: 26rpx;
    font-weight: 700;
    color: #0F172A;

    .ai-dot {
      width: 10rpx; height: 10rpx;
      background: #00D4AA;
      border-radius: 50%;
      box-shadow: 0 0 10rpx rgba(0,212,170,0.5);
      animation: ai-dot-pulse 2s ease-in-out infinite;
    }
  }

  .health-refresh {
    font-size: 22rpx;
    color: #0D7B3E;
    font-weight: 600;
    padding: 4rpx 12rpx;
    background: #ECFDF5;
    border-radius: 16rpx;
  }
}

.health-items {
  display: flex;
  align-items: center;
}

.health-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10rpx;

  .hi-icon {
    width: 52rpx;
    height: 52rpx;
    border-radius: 14rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24rpx;

    &.hi-icon-score { background: #ECFDF5; }
    &.hi-icon-bmi { background: #EFF6FF; }
    &.hi-icon-rec { background: #FEF3C7; }
  }

  .hi-content {
    display: flex;
    flex-direction: column;
    .hi-val {
      font-size: 28rpx;
      font-weight: 800;
      color: #0F172A;
    }
    .hi-label {
      font-size: 20rpx;
      color: #94A3B8;
    }
  }
}

.health-divider {
  width: 1rpx;
  height: 44rpx;
  background: #E8EDE8;
}

/* 快捷数据 */
.quick-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 20rpx;
  position: relative;
  z-index: 1;

  .qs-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4rpx;

    .qs-val {
      font-size: 30rpx;
      font-weight: 800;
      color: #FFF;
    }
    .qs-label {
      font-size: 20rpx;
      color: rgba(255,255,255,0.7);
      font-weight: 500;
    }
  }
}

/* ═══════════════ 面板通用 ═══════════════ */
.panel-section {
  margin: 20rpx 24rpx;
}

.panel-title-row {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-bottom: 16rpx;

  .panel-title-line {
    width: 4rpx;
    height: 28rpx;
    background: linear-gradient(180deg, #0D7B3E, #10B981);
    border-radius: 2rpx;
  }

  .panel-title-text {
    font-size: 30rpx;
    font-weight: 800;
    color: #0F172A;
  }

  .panel-all {
    margin-left: auto;
    font-size: 24rpx;
    color: #94A3B8;
    font-weight: 500;
  }
}

/* 常用服务网格 */
.service-grid {
  display: flex;
  gap: 12rpx;

  .service-item {
    flex: 1;
    background: #FFF;
    border-radius: 20rpx;
    padding: 20rpx 14rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8rpx;
    box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
    border: 1rpx solid #EEF2EC;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

    &:active {
      transform: scale(0.95);
      box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08);
    }

    .si-icon-box {
      width: 60rpx;
      height: 60rpx;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28rpx;
    }
    .si-label {
      font-size: 24rpx;
      font-weight: 700;
      color: #0F172A;
    }
    .si-desc {
      font-size: 18rpx;
      color: #94A3B8;
      text-align: center;
    }
  }
}

/* 订单状态栏 */
.order-status-bar {
  display: flex;
  justify-content: space-around;
  background: #FFF;
  border-radius: 20rpx;
  padding: 24rpx 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
  border: 1rpx solid #EEF2EC;
}

.os-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  transition: all 0.2s ease;

  &:active { transform: scale(0.9); }

  .os-icon-wrap {
    position: relative;
    width: 56rpx;
    height: 56rpx;
    background: #F2F5F1;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26rpx;

    .os-badge {
      position: absolute;
      top: -4rpx;
      right: -4rpx;
      min-width: 28rpx;
      height: 28rpx;
      background: #EF4444;
      border-radius: 14rpx;
      color: #FFF;
      font-size: 16rpx;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4rpx;
      border: 2rpx solid #FFF;
    }
  }

  .os-label {
    font-size: 22rpx;
    color: #64748B;
    font-weight: 500;
  }
}

/* 资产行 */
.asset-row {
  display: flex;
  gap: 12rpx;

  .asset-item {
    flex: 1;
    background: #FFF;
    border-radius: 20rpx;
    padding: 18rpx 14rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8rpx;
    box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
    border: 1rpx solid #EEF2EC;
    transition: all 0.3s ease;

    &:active { transform: scale(0.95); }

    .ai-icon-wrap {
      width: 48rpx;
      height: 48rpx;
      border-radius: 14rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22rpx;
    }

    .ai-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      .ai-val {
        font-size: 26rpx;
        font-weight: 800;
        color: #0F172A;
      }
      .ai-label {
        font-size: 18rpx;
        color: #94A3B8;
      }
    }
  }
}

/* 菜单列表 */
.menu-list {
  background: #FFF;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
  border: 1rpx solid #EEF2EC;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22rpx 20rpx;
  border-bottom: 1rpx solid #F2F5F1;
  transition: all 0.2s ease;
  animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;

  &:last-child { border-bottom: none; }

  &:active {
    background: #F8FAF7;
    transform: scale(0.98);
  }

  .mi-left {
    display: flex;
    align-items: center;
    gap: 16rpx;
    flex: 1;

    .mi-icon {
      width: 48rpx;
      height: 48rpx;
      border-radius: 14rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22rpx;
      flex-shrink: 0;
    }

    .mi-text {
      display: flex;
      flex-direction: column;
      gap: 2rpx;
      .mi-label {
        font-size: 28rpx;
        font-weight: 600;
        color: #0F172A;
      }
      .mi-desc {
        font-size: 22rpx;
        color: #94A3B8;
      }
    }
  }

  .mi-right {
    display: flex;
    align-items: center;
    gap: 6rpx;
    .mi-extra {
      font-size: 22rpx;
      color: #94A3B8;
    }
    .mi-arrow {
      font-size: 28rpx;
      color: #CBD5E1;
      font-weight: 300;
    }
  }
}

/* 底部 */
.footer-safe {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx 0;
  .footer-text {
    font-size: 22rpx;
    color: #CBD5E1;
  }
}

/* 切换身份 */
.switch-section {
  margin: 32rpx 24rpx;
}
.switch-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 24rpx 0;
  border-radius: 20rpx;
  border: 2rpx dashed #CBD5E1;
  background: #FFF;
  transition: all 0.25s ease;
}
.switch-btn:active {
  border-color: #0D7B3E;
  background: #D1FAE5;
}
.sb-icon { font-size: 30rpx; }
.sb-text { font-size: 28rpx; color: #64748B; font-weight: 600; }
.sb-arrow { font-size: 32rpx; color: #CBD5E1; }

@keyframes ai-dot-pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 6rpx #00D4AA; }
  50% { opacity: 0.4; box-shadow: 0 0 16rpx #00D4AA; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16rpx); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
