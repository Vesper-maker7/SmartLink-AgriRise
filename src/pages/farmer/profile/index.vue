<!-- 农户端 — 我的页面 -->
<template>
  <view class="me-page">
    <!-- 头部 -->
    <view class="me-top">
      <view class="me-bg"></view>
      <view class="me-safe"></view>
      <!-- 用户信息 -->
      <view class="me-user">
        <view class="me-avatar-wrap">
          <view class="me-avatar">👨‍🌾</view>
          <view class="me-avatar-ring"></view>
        </view>
        <view class="me-info">
          <view class="me-name-row">
            <text class="me-name">李大叔</text>
            <view class="me-badge">认证农户</view>
          </view>
          <text class="me-sub">天山有机农场 · 新疆阿克苏</text>
          <text class="me-id">农场ID: FM-2024-0018</text>
        </view>
        <view class="me-edit">编辑</view>
      </view>
      <!-- 农场数据 -->
      <view class="me-stats">
        <view class="ms-item">
          <text class="ms-num">{{ farmData.products }}</text>
          <text class="ms-label">商品</text>
        </view>
        <view class="ms-item">
          <text class="ms-num">{{ farmData.score }}</text>
          <text class="ms-label">综合评分</text>
        </view>
        <view class="ms-item">
          <text class="ms-num">{{ farmData.trace }}</text>
          <text class="ms-label">可溯源</text>
        </view>
        <view class="ms-item">
          <text class="ms-num">{{ farmData.days }}</text>
          <text class="ms-label">入驻天数</text>
        </view>
      </view>
    </view>

    <!-- 认证信息 -->
    <view class="cert-card card-glow anim-fade-in anim-delay-1">
      <view class="cert-header">
        <text class="cert-title">🏅 农场认证</text>
        <text class="cert-see">查看详情 →</text>
      </view>
      <view class="cert-list">
        <view class="cert-item" v-for="(c, i) in certs" :key="i">
          <text class="cert-icon">{{ c.icon }}</text>
          <text class="cert-name">{{ c.name }}</text>
          <view class="cert-status ok">✓</view>
        </view>
      </view>
    </view>

    <!-- 菜单列表 -->
    <view class="menu-section anim-fade-in anim-delay-2">
      <view class="menu-group">
        <view class="menu-item" v-for="(m, i) in menu1" :key="i" @click="m.action">
          <view class="mi-icon" :style="{ background: m.bg }">{{ m.icon }}</view>
          <text class="mi-title">{{ m.title }}</text>
          <text class="mi-desc">{{ m.desc }}</text>
          <text class="mi-arrow">›</text>
        </view>
      </view>
      <view class="menu-group" style="margin-top: 20rpx;">
        <view class="menu-item" v-for="(m, i) in menu2" :key="i" @click="m.action">
          <view class="mi-icon" :style="{ background: m.bg }">{{ m.icon }}</view>
          <text class="mi-title">{{ m.title }}</text>
          <text class="mi-desc">{{ m.desc }}</text>
          <text class="mi-arrow">›</text>
        </view>
      </view>
      <view class="menu-group" style="margin-top: 20rpx;">
        <view class="menu-item" v-for="(m, i) in menu3" :key="i" @click="m.action">
          <view class="mi-icon" :style="{ background: m.bg }">{{ m.icon }}</view>
          <text class="mi-title">{{ m.title }}</text>
          <text class="mi-arrow">›</text>
        </view>
      </view>
    </view>

    <!-- 切换身份 -->
    <view class="switch-btn anim-fade-in anim-delay-3" @click="switchToConsumer">
      <text class="sb-icon">🔄</text>
      <text class="sb-text">切换到消费者端</text>
    </view>

    <view style="height: 160rpx;"></view>
    <FarmerTabBar page="profile" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import FarmerTabBar from '@/components/FarmerTabBar.vue'
import { useUserStore } from '@/store/user.js'

const userStore = useUserStore()

const farmData = ref({ products: 16, score: 4.8, trace: 12, days: 486 })
const certs = ref([
  { icon: '🌿', name: '有机食品认证' },
  { icon: '🌍', name: '地理标志认证' },
  { icon: '✅', name: '绿色食品认证' },
  { icon: '📋', name: '溯源体系认证' }
])

const menu1 = ref([
  { icon: '📦', title: '我的商品', desc: '管理上架商品', bg: '#D1FAE5', action: () => uni.navigateTo({ url: '/pages/farmer/products/index' }) },
  { icon: '📋', title: '订单管理', desc: '处理所有订单', bg: '#DBEAFE', action: () => uni.showToast({ title: '开发中', icon: 'none' }) },
  { icon: '📝', title: '农事记录', desc: '记录种植农事', bg: '#FEF3C7', action: () => uni.showToast({ title: '开发中', icon: 'none' }) },
  { icon: '🔍', title: '溯源管理', desc: '维护溯源信息', bg: '#E8DCF8', action: () => uni.showToast({ title: '开发中', icon: 'none' }) }
])
const menu2 = ref([
  { icon: '💰', title: '账户余额', desc: '¥12,860.50', bg: '#FCE7F3', action: () => uni.showToast({ title: '开发中', icon: 'none' }) },
  { icon: '🏦', title: '提现记录', desc: '最近30天提现3笔', bg: '#D1FAE5', action: () => uni.showToast({ title: '开发中', icon: 'none' }) },
  { icon: '📊', title: '经营报告', desc: '查看月度报表', bg: '#DBEAFE', action: () => uni.showToast({ title: '开发中', icon: 'none' }) }
])
const menu3 = ref([
  { icon: '⚙️', title: '设置', bg: '#F0F4EF', action: () => uni.showToast({ title: '开发中', icon: 'none' }) },
  { icon: '❓', title: '帮助中心', bg: '#FEF3C7', action: () => uni.showToast({ title: '开发中', icon: 'none' }) },
  { icon: 'ℹ️', title: '关于智链兴农', bg: '#DBEAFE', action: () => uni.showToast({ title: '开发中', icon: 'none' }) }
])

function switchToConsumer() {
  userStore.logout()
  uni.reLaunch({ url: '/pages/identity/index' })
}
</script>

<style scoped>
.me-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #E8F5EC 0%, #F0F4EF 12%, #F5F7F4 100%);
}
.me-top {
  position: relative; padding: 0 32rpx 28rpx; overflow: hidden;
}
.me-bg {
  position: absolute; inset: 0;
  background: linear-gradient(160deg, #0D7B3E 0%, #064E28 35%, #0D7B3E 100%);
}
.me-bg::before {
  content: ''; position: absolute; inset: 0;
  background:
    radial-gradient(circle at 30% 20%, rgba(0,212,170,0.16) 0%, transparent 55%),
    radial-gradient(circle at 70% 70%, rgba(16,185,129,0.1) 0%, transparent 50%);
}
.me-bg::after {
  content: ''; position: absolute; bottom: 0; left: 0; right: 0;
  height: 40rpx;
  background: linear-gradient(0deg, #F0F4EF 0%, transparent 100%);
}
.me-safe { height: calc(var(--status-bar-height) + 10rpx); }

.me-user {
  display: flex; align-items: center; gap: 20rpx;
  padding: 10rpx 0 24rpx;
  position: relative; z-index: 1;
}
.me-avatar-wrap { position: relative; flex-shrink: 0; }
.me-avatar {
  width: 100rpx; height: 100rpx;
  background: linear-gradient(135deg, #10B981, #00D4AA);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 48rpx;
  position: relative; z-index: 2;
}
.me-avatar-ring {
  position: absolute;
  top: -8rpx; left: -8rpx; right: -8rpx; bottom: -8rpx;
  border-radius: 50%;
  border: 3rpx solid rgba(255,255,255,0.25);
  animation: rotate-slow 6s linear infinite;
}
.me-info { flex: 1; }
.me-name-row { display: flex; align-items: center; gap: 12rpx; }
.me-name { font-size: 36rpx; font-weight: 700; color: #FFF; }
.me-badge {
  font-size: 18rpx; color: #34D399;
  background: rgba(52,211,153,0.15);
  border: 1rpx solid rgba(52,211,153,0.3);
  padding: 2rpx 12rpx; border-radius: 16rpx;
}
.me-sub { font-size: 24rpx; color: rgba(255,255,255,0.7); display: block; margin: 4rpx 0 2rpx; }
.me-id { font-size: 20rpx; color: rgba(255,255,255,0.45); }
.me-edit {
  font-size: 24rpx; color: rgba(255,255,255,0.8);
  background: rgba(255,255,255,0.12);
  border: 1rpx solid rgba(255,255,255,0.2);
  border-radius: 28rpx;
  padding: 10rpx 24rpx;
  flex-shrink: 0;
}

.me-stats {
  display: flex; gap: 14rpx;
  position: relative; z-index: 3;
}
.ms-item {
  flex: 1; text-align: center;
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(10rpx);
  border-radius: 16rpx;
  padding: 16rpx 8rpx;
}
.ms-num { font-size: 30rpx; font-weight: 800; color: #FFF; display: block; }
.ms-label { font-size: 18rpx; color: rgba(255,255,255,0.55); }

/* 认证卡片 */
.cert-card {
  margin: 0 24rpx; margin-top: 20rpx;
  padding: 24rpx;
}
.cert-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 18rpx;
}
.cert-title { font-size: 26rpx; font-weight: 700; color: #0F172A; }
.cert-see { font-size: 22rpx; color: #0A84FF; }
.cert-list {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 12rpx;
}
.cert-item {
  display: flex; align-items: center; gap: 10rpx;
  background: #F7FAF8; border-radius: 14rpx;
  padding: 14rpx 16rpx;
}
.cert-icon { font-size: 26rpx; }
.cert-name { font-size: 22rpx; color: #334155; flex: 1; }
.cert-status { width: 32rpx; height: 32rpx; border-radius: 50%;
  background: #D1FAE5; color: #059669; font-size: 20rpx;
  display: flex; align-items: center; justify-content: center;
}

/* 菜单 */
.menu-section { padding: 0 24rpx; margin-top: 28rpx; }
.menu-group {
  background: #FFF; border-radius: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.03);
  overflow: hidden;
}
.menu-item {
  display: flex; align-items: center; gap: 14rpx;
  padding: 26rpx 24rpx;
  position: relative;
  transition: all 0.15s ease;
}
.menu-item:active { background: #F8FAF7; transform: scale(0.98); }
.menu-item + .menu-item { border-top: 1rpx solid #F2F5F1; }
.mi-icon {
  width: 44rpx; height: 44rpx; border-radius: 12rpx;
  display: flex; align-items: center; justify-content: center;
  font-size: 24rpx; flex-shrink: 0;
}
.mi-title { font-size: 28rpx; font-weight: 600; color: #0F172A; flex: 1; }
.mi-desc { font-size: 22rpx; color: #94A3B8; margin-right: 8rpx; }
.mi-arrow { font-size: 32rpx; color: #CBD5E1; font-weight: 300; }

/* 切换身份 */
.switch-btn {
  display: flex; align-items: center; justify-content: center; gap: 10rpx;
  margin: 32rpx 24rpx;
  padding: 22rpx 0;
  border-radius: 20rpx;
  border: 2rpx dashed #94A3B8;
  color: #64748B;
  font-size: 26rpx;
  transition: all 0.2s ease;
}
.switch-btn:active { border-color: #0D7B3E; color: #0D7B3E; background: #D1FAE5; }
.sb-icon { font-size: 28rpx; }
</style>
