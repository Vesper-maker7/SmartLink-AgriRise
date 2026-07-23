<!-- AI智慧农场 — 农户端首页 -->
<template>
  <view class="farm-page">
    <!-- ═══════════ AI Hero 头部 ═══════════ -->
    <view class="hero-wrap">
      <view class="hero-bg"></view>
      <view class="hero-particles">
        <view v-for="i in 15" :key="'p'+i" class="particle" :style="particleStyle(i)"></view>
      </view>
      <view class="hero-drone"></view>
      <!-- 安全区 -->
      <view class="hero-safe"></view>
      <!-- 主内容 -->
      <view class="hero-content">
        <view class="hero-header">
          <view class="hero-greeting">
            <text class="hero-ai-icon">🤖</text>
            <text class="hero-label">AI智慧农场</text>
          </view>
          <view class="hero-score-chip">
            <text class="hero-score-num">92</text>
            <text class="hero-score-text">优秀</text>
          </view>
        </view>
        <view class="hero-welcome">
          <text class="hero-name">欢迎回来，李大叔 👋</text>
          <text class="hero-sub">今天AI已经为您分析完成</text>
        </view>
        <!-- 天气 + AI提醒 -->
        <view class="hero-weather-row">
          <view class="hw-card">
            <view class="hw-icon">☀️</view>
            <view class="hw-info">
              <text class="hw-temp">26℃</text>
              <text class="hw-desc">晴朗 · 微风</text>
            </view>
          </view>
          <view class="hw-divider"></view>
          <view class="hw-card">
            <view class="hw-icon">⚠️</view>
            <view class="hw-info">
              <text class="hw-temp-sm">未来两天降雨</text>
              <text class="hw-desc-sm">建议今天完成施肥</text>
            </view>
          </view>
          <view class="hw-tag">可减少风险 18%</view>
        </view>
      </view>
    </view>

    <!-- ═══════════ 农场总览 — 4数据卡片 ═══════════ -->
    <view class="overview-row">
      <view class="ov-card anim-fade-in anim-delay-1" @click="goStat('orders')">
        <text class="ov-num">{{ farmData.orders }}</text>
        <text class="ov-label">今日订单</text>
        <view class="ov-trend up">
          <text>↑ 12%</text>
        </view>
      </view>
      <view class="ov-card anim-fade-in anim-delay-2" @click="goStat('revenue')">
        <text class="ov-num">¥{{ farmData.revenue }}</text>
        <text class="ov-label">销售额</text>
        <view class="ov-trend up">
          <text>↑ 8%</text>
        </view>
      </view>
      <view class="ov-card anim-fade-in anim-delay-3" @click="goStat('shipping')">
        <text class="ov-num">{{ farmData.shipping }}</text>
        <text class="ov-label">待发货</text>
        <view class="ov-trend normal">
          <text>正常</text>
        </view>
      </view>
      <view class="ov-card ov-warn anim-fade-in anim-delay-4" @click="goStat('alert')">
        <text class="ov-num warn">{{ farmData.alerts }}</text>
        <text class="ov-label">库存预警</text>
        <view class="ov-trend down">
          <text>需关注</text>
        </view>
      </view>
    </view>

    <!-- ═══════════ AI智能分析 — 4宫格 ═══════════ -->
    <view class="section-block">
      <view class="sec-header">
        <view class="sec-title-line"></view>
        <text class="sec-title">AI 智能分析中心</text>
        <view class="ai-dot"></view>
      </view>
      <view class="ai-grid">
        <view class="ai-card" v-for="(item, i) in aiServices" :key="i"
          :class="'anim-fade-in anim-delay-'+(i+1)" @click="item.action">
          <view class="ai-card-icon" :style="{background: item.bg}">{{ item.icon }}</view>
          <text class="ai-card-title">{{ item.title }}</text>
          <text class="ai-card-sub">{{ item.sub }}</text>
          <view class="ai-card-tag">{{ item.tag }}</view>
        </view>
      </view>
    </view>

    <!-- ═══════════ AI销量预测 ═══════════ -->
    <view class="section-block">
      <view class="card-glow predict-card">
        <view class="predict-header">
          <view class="predict-title-row">
            <text class="predict-icon">📈</text>
            <text class="predict-title">AI销量预测</text>
          </view>
          <text class="predict-date">本周预估</text>
        </view>
        <view class="predict-main">
          <view class="predict-num-wrap">
            <text class="predict-num">1,280</text>
            <text class="predict-unit">kg</text>
          </view>
          <view class="predict-badge up">↑ 18%</view>
        </view>
        <view class="predict-reason">
          <text class="pr-item">🌤 最近天气良好</text>
          <text class="pr-item">🎉 节假日临近</text>
          <text class="pr-item">📊 水果需求上涨</text>
        </view>
      </view>
    </view>

    <!-- ═══════════ AI智能定价 ═══════════ -->
    <view class="section-block">
      <view class="card-glow pricing-card">
        <view class="pricing-header">
          <text class="pricing-icon">💰</text>
          <text class="pricing-title">AI智能定价建议</text>
        </view>
        <view class="pricing-product">
          <view class="pp-left">
            <text class="pp-emoji">🍎</text>
            <view class="pp-info">
              <text class="pp-name">阿克苏苹果</text>
              <text class="pp-current">当前 ¥5.2/kg</text>
            </view>
          </view>
          <view class="pp-right">
            <text class="pp-suggest-label">AI建议</text>
            <text class="pp-suggest-price">¥5.80/kg</text>
            <text class="pp-profit">预计利润 +13%</text>
          </view>
        </view>
        <view class="pricing-reasons">
          <view class="prs-item">📊 周边市场价格上涨</view>
          <view class="prs-item">📦 库存较少</view>
          <view class="prs-item">📈 需求增加</view>
        </view>
        <view class="pricing-actions">
          <view class="btn-mini btn-accept" @click="acceptPrice">接受AI建议</view>
          <view class="btn-mini btn-reject" @click="rejectPrice">保持当前价</view>
        </view>
      </view>
    </view>

    <!-- ═══════════ AI风险预警 ═══════════ -->
    <view class="section-block">
      <view class="card-glow risk-card">
        <view class="risk-header">
          <view class="risk-title-row">
            <view class="risk-icon-wrap">
              <text class="risk-icon pulse-warn">⚡</text>
            </view>
            <view>
              <text class="risk-title">AI风险预警</text>
              <text class="risk-subtitle">实时监测 · 智能预警</text>
            </view>
          </view>
          <text class="risk-time">未来48小时</text>
        </view>
        <view class="risk-alert-card">
          <text class="risk-alert-title">🌧 暴雨预警</text>
          <text class="risk-alert-desc">预计未来48小时有强降雨，请提前做好防护措施</text>
        </view>
        <view class="risk-suggestions">
          <view class="rs-item">
            <view class="rs-check">✓</view>
            <text>提前采摘成熟果实</text>
          </view>
          <view class="rs-item">
            <view class="rs-check">✓</view>
            <text>覆盖防水薄膜</text>
          </view>
          <view class="rs-item">
            <view class="rs-check">✓</view>
            <text>检查排水沟渠</text>
          </view>
        </view>
      </view>
    </view>

    <!-- ═══════════ 农场管理 — 4卡片 ═══════════ -->
    <view class="section-block">
      <view class="sec-header">
        <view class="sec-title-line"></view>
        <text class="sec-title">农场管理</text>
      </view>
      <view class="manage-grid">
        <view class="mg-card" v-for="(item, i) in manageItems" :key="i"
          :class="'anim-fade-in anim-delay-'+(i+1)" @click="item.action">
          <view class="mg-icon-wrap" :style="{background: item.bg}">{{ item.icon }}</view>
          <text class="mg-title">{{ item.title }}</text>
          <text class="mg-desc">{{ item.desc }}</text>
          <view class="mg-arrow">→</view>
        </view>
      </view>
    </view>

    <!-- ═══════════ 数据中心 ═══════════ -->
    <view class="section-block">
      <view class="sec-header">
        <view class="sec-title-line"></view>
        <text class="sec-title">数据中心</text>
        <text class="sec-link" @click="goPage('/pages/farmer/stats/index')">查看更多 →</text>
      </view>
      <view class="card-glow chart-card">
        <view class="chart-header">
          <text class="chart-title">📊 近7天销售趋势</text>
          <text class="chart-period">7月17日 - 7月23日</text>
        </view>
        <!-- 简易柱状图 -->
        <view class="mini-chart">
          <view class="bar-col" v-for="(val, i) in chartData" :key="i">
            <view class="bar-fill" :style="{height: val.height, background: val.bg}"></view>
            <text class="bar-label">{{ val.day }}</text>
            <text class="bar-val">{{ val.value }}</text>
          </view>
        </view>
        <!-- AI分析 -->
        <view class="chart-ai-row">
          <view class="chart-ai-icon">🤖</view>
          <view class="chart-ai-content">
            <text class="chart-ai-text">AI分析：本月销售增长12%，建议增加蓝莓库存</text>
          </view>
        </view>
      </view>
    </view>

    <!-- ═══════════ AI农场健康评分 ═══════════ -->
    <view class="section-block">
      <view class="card-glow health-card">
        <view class="health-header">
          <text class="health-icon">🩺</text>
          <text class="health-title">AI农场健康评分</text>
        </view>
        <view class="health-score-row">
          <view class="health-ring">
            <view class="ring-circle">
              <text class="ring-num">93</text>
              <text class="ring-label">优秀</text>
            </view>
          </view>
          <view class="health-metrics">
            <view class="hm-item" v-for="(m, i) in healthMetrics" :key="i">
              <text class="hm-name">{{ m.name }}</text>
              <view class="hm-stars">
                <text v-for="s in 5" :key="s" :class="s <= m.score ? 'star active' : 'star'">★</text>
              </view>
            </view>
          </view>
        </view>
        <view class="health-advice">
          <view class="ha-prefix">AI综合建议</view>
          <text class="ha-content">保持当前种植方案，建议扩大蓝莓种植面积</text>
        </view>
      </view>
    </view>

    <!-- 底部间距 -->
    <view style="height: 160rpx;"></view>

    <!-- 底部导航 -->
    <FarmerTabBar page="home" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import FarmerTabBar from '@/components/FarmerTabBar.vue'

const farmData = ref({
  orders: 38,
  revenue: '8,623',
  shipping: 12,
  alerts: 3
})

const aiServices = ref([
  { icon: '🌱', title: 'AI农事助手', sub: '病虫害识别·种植指导', tag: '智能问诊', bg: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)', action: () => uni.showToast({ title: 'AI农事助手开发中', icon: 'none' }) },
  { icon: '📈', title: 'AI销量预测', sub: '需求分析·趋势预测', tag: '实时预测', bg: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)', action: () => uni.showToast({ title: 'AI销量预测开发中', icon: 'none' }) },
  { icon: '💰', title: 'AI智能定价', sub: '动态调价·利润优化', tag: '智能调价', bg: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', action: () => uni.showToast({ title: 'AI智能定价开发中', icon: 'none' }) },
  { icon: '⚠️', title: 'AI风险预警', sub: '天气·病虫害·市场', tag: '实时监测', bg: 'linear-gradient(135deg, #FEE2E2, #FECACA)', action: () => uni.showToast({ title: 'AI风险预警开发中', icon: 'none' }) }
])

const manageItems = ref([
  { icon: '📦', title: '商品管理', desc: '管理上架商品', bg: '#D1FAE5', action: () => uni.navigateTo({ url: '/pages/farmer/products/index' }) },
  { icon: '📋', title: '订单管理', desc: '查看处理订单', bg: '#DBEAFE', action: () => uni.showToast({ title: '订单管理开发中', icon: 'none' }) },
  { icon: '📝', title: '农事记录', desc: '记录种植过程', bg: '#FEF3C7', action: () => uni.showToast({ title: '农事记录开发中', icon: 'none' }) },
  { icon: '🔍', title: '溯源管理', desc: '管理溯源信息', bg: '#E8DCF8', action: () => uni.showToast({ title: '溯源管理开发中', icon: 'none' }) }
])

const chartData = ref([
  { day: '17日', value: 620, height: '60%', bg: 'linear-gradient(180deg, #10B981, #0D7B3E)' },
  { day: '18日', value: 540, height: '52%', bg: 'linear-gradient(180deg, #10B981, #0D7B3E)' },
  { day: '19日', value: 780, height: '75%', bg: 'linear-gradient(180deg, #10B981, #0D7B3E)' },
  { day: '20日', value: 650, height: '63%', bg: 'linear-gradient(180deg, #10B981, #0D7B3E)' },
  { day: '21日', value: 890, height: '88%', bg: 'linear-gradient(180deg, #00D4AA, #10B981)' },
  { day: '22日', value: 720, height: '70%', bg: 'linear-gradient(180deg, #10B981, #0D7B3E)' },
  { day: '23日', value: 950, height: '94%', bg: 'linear-gradient(180deg, #00D4AA, #0D7B3E)' }
])

const healthMetrics = ref([
  { name: '病虫害风险', score: 4 },
  { name: '天气风险', score: 2 },
  { name: '库存健康', score: 5 },
  { name: '订单健康', score: 5 }
])

function particleStyle(i) {
  const left = (i * 7 + 3) % 100
  const delay = (i * 0.6) % 5
  const size = 4 + (i % 4) * 2
  return `left:${left}%; animation-delay:${delay}s; width:${size}rpx; height:${size}rpx;`
}

function goStat(type) {
  uni.showToast({ title: '查看详情', icon: 'none' })
}
function goPage(url) {
  uni.navigateTo({ url })
}
function acceptPrice() {
  uni.showToast({ title: '已采纳AI建议价格', icon: 'success' })
}
function rejectPrice() {
  uni.showToast({ title: '已保持当前价格', icon: 'none' })
}
</script>

<style scoped>
.farm-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #E8F5EC 0%, #F0F4EF 8%, #F5F7F4 40%, #FAFBFA 100%);
}

/* ========== Hero ========== */
.hero-wrap {
  position: relative;
  overflow: hidden;
  padding: 0 32rpx;
  padding-top: calc(var(--status-bar-height) + 20rpx);
}
.hero-bg {
  position: absolute; inset: 0;
  background: linear-gradient(160deg, #0D7B3E 0%, #064E28 25%, #0D7B3E 50%, #047857 75%, #0D7B3E 100%);
}
.hero-bg::before {
  content: ''; position: absolute; inset: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(0,212,170,0.18) 0%, transparent 50%),
    radial-gradient(circle at 80% 60%, rgba(10,132,255,0.12) 0%, transparent 50%),
    radial-gradient(circle at 50% 80%, rgba(16,185,129,0.1) 0%, transparent 40%);
}
.hero-bg::after {
  content: ''; position: absolute; bottom: 0; left: 0; right: 0;
  height: 60rpx;
  background: linear-gradient(0deg, #F0F4EF 0%, transparent 100%);
}
.hero-particles {
  position: absolute; inset: 0; pointer-events: none;
}
.particle {
  position: absolute;
  top: 20%;
  background: rgba(0,212,170,0.5);
  border-radius: 50%;
  animation: particle-float 4s ease-in-out infinite;
}
@keyframes particle-float {
  0%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
  50% { transform: translateY(-40rpx) scale(1.5); opacity: 0.2; }
}
.hero-drone {
  position: absolute;
  top: 30rpx; right: 20rpx;
  width: 90rpx; height: 90rpx;
  background: radial-gradient(circle, rgba(0,212,170,0.08) 0%, transparent 70%);
  border-radius: 50%;
}
.hero-safe { height: 10rpx; }
.hero-content {
  position: relative; z-index: 2;
  padding: 8rpx 0 32rpx 0;
}
.hero-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 16rpx;
}
.hero-greeting {
  display: flex; align-items: center; gap: 10rpx;
}
.hero-ai-icon { font-size: 36rpx; }
.hero-label {
  font-size: 24rpx; color: rgba(255,255,255,0.8);
  font-weight: 500;
}
.hero-score-chip {
  display: flex; align-items: center; gap: 8rpx;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(20rpx);
  border: 1rpx solid rgba(255,255,255,0.2);
  border-radius: 40rpx;
  padding: 8rpx 20rpx;
}
.hero-score-num {
  font-size: 32rpx; font-weight: 800; color: #00D4AA;
}
.hero-score-text {
  font-size: 20rpx; color: rgba(255,255,255,0.9);
}
.hero-welcome {
  margin-bottom: 24rpx;
}
.hero-name {
  display: block;
  font-size: 40rpx; font-weight: 700; color: #FFF;
  margin-bottom: 6rpx;
}
.hero-sub {
  display: block;
  font-size: 24rpx; color: rgba(255,255,255,0.65);
}
/* 天气行 */
.hero-weather-row {
  display: flex; align-items: center;
  gap: 16rpx;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(20rpx);
  border: 1rpx solid rgba(255,255,255,0.15);
  border-radius: 20rpx;
  padding: 18rpx 20rpx;
  position: relative;
}
.hw-card {
  display: flex; align-items: center; gap: 12rpx;
  flex: 1;
}
.hw-icon { font-size: 36rpx; }
.hw-info { display: flex; flex-direction: column; }
.hw-temp { font-size: 28rpx; font-weight: 700; color: #FFF; }
.hw-desc { font-size: 20rpx; color: rgba(255,255,255,0.6); }
.hw-temp-sm { font-size: 22rpx; font-weight: 600; color: #FFF; }
.hw-desc-sm { font-size: 20rpx; color: rgba(255,255,255,0.6); }
.hw-divider {
  width: 2rpx; height: 48rpx;
  background: rgba(255,255,255,0.15);
}
.hw-tag {
  position: absolute;
  top: -18rpx; right: 16rpx;
  font-size: 18rpx; color: #34D399;
  background: rgba(0,212,170,0.15);
  border: 1rpx solid rgba(0,212,170,0.3);
  border-radius: 20rpx;
  padding: 2rpx 14rpx;
}

/* ========== 农场总览 ========== */
.overview-row {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 12rpx;
  padding: 0 24rpx;
  margin-top: -20rpx;
  position: relative; z-index: 5;
}
.ov-card {
  background: #FFF;
  border-radius: 20rpx;
  padding: 20rpx 12rpx;
  text-align: center;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
  transition: all 0.2s ease;
}
.ov-card:active { transform: scale(0.95); }
.ov-card.ov-warn { border: 2rpx solid rgba(239,68,68,0.15); }
.ov-num {
  display: block;
  font-size: 34rpx; font-weight: 800; color: #0F172A;
  margin-bottom: 6rpx;
}
.ov-num.warn { color: #EF4444; }
.ov-label {
  display: block;
  font-size: 20rpx; color: #64748B;
  margin-bottom: 8rpx;
}
.ov-trend {
  display: inline-flex; align-items: center;
  font-size: 18rpx; font-weight: 600;
  border-radius: 12rpx;
  padding: 2rpx 10rpx;
}
.ov-trend.up { color: #059669; background: #D1FAE5; }
.ov-trend.down { color: #EF4444; background: #FEE2E2; }
.ov-trend.normal { color: #0A84FF; background: #DBEAFE; }

/* ========== 通用区块 ========== */
.section-block {
  padding: 0 24rpx;
  margin-top: 28rpx;
}
.sec-header {
  display: flex; align-items: center; gap: 10rpx;
  margin-bottom: 16rpx;
}
.sec-title-line {
  width: 6rpx; height: 28rpx;
  background: linear-gradient(180deg, #0D7B3E, #10B981);
  border-radius: 3rpx;
}
.sec-title {
  font-size: 30rpx; font-weight: 700; color: #0F172A;
  flex: 1;
}
.sec-link {
  font-size: 24rpx; color: #0A84FF;
}

/* ========== AI分析 4宫格 ========== */
.ai-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 16rpx;
}
.ai-card {
  background: #FFF;
  border-radius: 20rpx;
  padding: 28rpx 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
  position: relative;
  transition: all 0.2s ease;
}
.ai-card:active { transform: scale(0.96); }
.ai-card-icon {
  width: 52rpx; height: 52rpx;
  border-radius: 16rpx;
  display: flex; align-items: center; justify-content: center;
  font-size: 28rpx;
  margin-bottom: 14rpx;
}
.ai-card-title {
  display: block;
  font-size: 26rpx; font-weight: 700; color: #0F172A;
  margin-bottom: 4rpx;
}
.ai-card-sub {
  display: block;
  font-size: 20rpx; color: #94A3B8;
}
.ai-card-tag {
  position: absolute; top: 16rpx; right: 16rpx;
  font-size: 18rpx; color: #0D7B3E;
  background: #D1FAE5;
  border-radius: 12rpx;
  padding: 2rpx 10rpx;
  font-weight: 600;
}

/* ========== AI销量预测 ========== */
.predict-card {
  padding: 28rpx;
}
.predict-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 20rpx;
}
.predict-title-row {
  display: flex; align-items: center; gap: 10rpx;
}
.predict-icon { font-size: 30rpx; }
.predict-title { font-size: 26rpx; font-weight: 700; color: #0F172A; }
.predict-date { font-size: 20rpx; color: #94A3B8; }
.predict-main {
  display: flex; align-items: flex-end; gap: 16rpx;
  margin-bottom: 20rpx;
}
.predict-num-wrap {
  display: flex; align-items: baseline; gap: 8rpx;
}
.predict-num {
  font-size: 52rpx; font-weight: 800; color: #0D7B3E;
}
.predict-unit {
  font-size: 26rpx; color: #64748B;
}
.predict-badge {
  font-size: 22rpx; font-weight: 700; color: #059669;
  background: #D1FAE5;
  border-radius: 16rpx;
  padding: 6rpx 16rpx;
  margin-bottom: 8rpx;
}
.predict-reason {
  display: flex; flex-wrap: wrap; gap: 10rpx;
}
.pr-item {
  font-size: 20rpx; color: #64748B;
  background: #F0F4EF;
  padding: 6rpx 14rpx;
  border-radius: 20rpx;
}

/* ========== AI智能定价 ========== */
.pricing-card {
  padding: 28rpx;
}
.pricing-header {
  display: flex; align-items: center; gap: 10rpx;
  margin-bottom: 20rpx;
}
.pricing-icon { font-size: 30rpx; }
.pricing-title { font-size: 26rpx; font-weight: 700; color: #0F172A; }
.pricing-product {
  display: flex; justify-content: space-between; align-items: center;
  background: #F7FAF8;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 16rpx;
}
.pp-left {
  display: flex; align-items: center; gap: 14rpx;
}
.pp-emoji { font-size: 48rpx; }
.pp-info { display: flex; flex-direction: column; }
.pp-name { font-size: 26rpx; font-weight: 600; color: #0F172A; }
.pp-current { font-size: 22rpx; color: #94A3B8; }
.pp-right {
  display: flex; flex-direction: column; align-items: flex-end;
}
.pp-suggest-label {
  font-size: 18rpx; color: #00D4AA;
  background: rgba(0,212,170,0.1);
  padding: 2rpx 10rpx;
  border-radius: 8rpx;
  margin-bottom: 4rpx;
}
.pp-suggest-price {
  font-size: 36rpx; font-weight: 800; color: #0D7B3E;
}
.pp-profit {
  font-size: 20rpx; color: #10B981; font-weight: 600;
}
.pricing-reasons {
  display: flex; gap: 12rpx;
  margin-bottom: 20rpx;
}
.prs-item {
  font-size: 20rpx; color: #64748B;
  background: #F0F4EF;
  padding: 6rpx 14rpx;
  border-radius: 14rpx;
}
.pricing-actions {
  display: flex; gap: 16rpx;
}
.btn-mini {
  flex: 1;
  text-align: center;
  font-size: 24rpx; font-weight: 600;
  padding: 16rpx 0;
  border-radius: 40rpx;
  transition: all 0.2s ease;
}
.btn-mini:active { transform: scale(0.96); }
.btn-accept {
  background: linear-gradient(135deg, #0D7B3E, #10B981);
  color: #FFF;
  box-shadow: 0 4rpx 16rpx rgba(13,123,62,0.25);
}
.btn-reject {
  background: #F0F4EF;
  color: #64748B;
  border: 2rpx solid #E8EDE8;
}

/* ========== AI风险预警 ========== */
.risk-card {
  padding: 28rpx;
}
.risk-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 18rpx;
}
.risk-title-row {
  display: flex; align-items: center; gap: 14rpx;
}
.risk-icon-wrap {
  width: 52rpx; height: 52rpx;
  background: #FEF3C7;
  border-radius: 16rpx;
  display: flex; align-items: center; justify-content: center;
}
.risk-icon { font-size: 28rpx; }
.pulse-warn {
  animation: pulsate 1.5s ease-in-out infinite;
}
@keyframes pulsate {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}
.risk-title { font-size: 26rpx; font-weight: 700; color: #0F172A; display: block; }
.risk-subtitle { font-size: 20rpx; color: #94A3B8; }
.risk-time { font-size: 20rpx; color: #F97316; font-weight: 600; }
.risk-alert-card {
  background: linear-gradient(135deg, #FEF2F2, #FEE2E2);
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 16rpx;
  border: 1rpx solid rgba(239,68,68,0.15);
}
.risk-alert-title {
  display: block;
  font-size: 24rpx; font-weight: 700; color: #DC2626;
  margin-bottom: 6rpx;
}
.risk-alert-desc {
  display: block;
  font-size: 22rpx; color: #EF4444; line-height: 1.6;
}
.risk-suggestions {
  display: flex; flex-direction: column; gap: 12rpx;
}
.rs-item {
  display: flex; align-items: center; gap: 12rpx;
  font-size: 24rpx; color: #334155;
}
.rs-check {
  width: 36rpx; height: 36rpx;
  background: #D1FAE5;
  color: #059669;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 20rpx; font-weight: 700;
}

/* ========== 农场管理 ========== */
.manage-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 16rpx;
}
.mg-card {
  background: #FFF;
  border-radius: 20rpx;
  padding: 24rpx 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
  position: relative;
  transition: all 0.2s ease;
}
.mg-card:active { transform: scale(0.96); }
.mg-icon-wrap {
  width: 48rpx; height: 48rpx;
  border-radius: 14rpx;
  display: flex; align-items: center; justify-content: center;
  font-size: 26rpx;
  margin-bottom: 12rpx;
}
.mg-title {
  display: block;
  font-size: 26rpx; font-weight: 700; color: #0F172A;
  margin-bottom: 4rpx;
}
.mg-desc {
  display: block;
  font-size: 20rpx; color: #94A3B8;
}
.mg-arrow {
  position: absolute; right: 20rpx; bottom: 24rpx;
  font-size: 24rpx; color: #CBD5E1;
}

/* ========== 数据中心 ========== */
.chart-card {
  padding: 24rpx;
}
.chart-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 24rpx;
}
.chart-title { font-size: 26rpx; font-weight: 700; color: #0F172A; }
.chart-period { font-size: 20rpx; color: #94A3B8; }
.mini-chart {
  display: flex; align-items: flex-end; justify-content: space-between;
  height: 220rpx;
  padding-bottom: 8rpx;
}
.bar-col {
  display: flex; flex-direction: column; align-items: center;
  flex: 1;
}
.bar-fill {
  width: 36rpx;
  border-radius: 8rpx 8rpx 0 0;
  min-height: 16rpx;
  position: relative;
  transition: all 0.4s ease;
}
.bar-label {
  font-size: 18rpx; color: #94A3B8;
  margin-top: 8rpx;
}
.bar-val {
  font-size: 17rpx; color: #64748B; font-weight: 600;
  margin-top: 2rpx;
}
.chart-ai-row {
  display: flex; align-items: center; gap: 12rpx;
  margin-top: 16rpx;
  background: linear-gradient(135deg, rgba(0,212,170,0.06), rgba(10,132,255,0.06));
  border-radius: 16rpx;
  padding: 16rpx 20rpx;
}
.chart-ai-icon { font-size: 32rpx; }
.chart-ai-content { flex: 1; }
.chart-ai-text {
  font-size: 22rpx; color: #334155; line-height: 1.5;
}

/* ========== 农场健康评分 ========== */
.health-card {
  padding: 28rpx;
}
.health-header {
  display: flex; align-items: center; gap: 10rpx;
  margin-bottom: 24rpx;
}
.health-icon { font-size: 32rpx; }
.health-title { font-size: 26rpx; font-weight: 700; color: #0F172A; }
.health-score-row {
  display: flex; align-items: center; gap: 32rpx;
  margin-bottom: 24rpx;
}
.health-ring {
  flex-shrink: 0;
}
.ring-circle {
  width: 140rpx; height: 140rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #0D7B3E, #10B981);
  box-shadow: 0 0 32rpx rgba(13,123,62,0.3);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  position: relative;
}
.ring-circle::before {
  content: '';
  position: absolute; inset: -6rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(13,123,62,0.2);
  animation: ring-pulse 2s ease-in-out infinite;
}
@keyframes ring-pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.08); opacity: 0.2; }
}
.ring-num {
  font-size: 48rpx; font-weight: 800; color: #FFF;
}
.ring-label {
  font-size: 22rpx; color: rgba(255,255,255,0.9); font-weight: 600;
}
.health-metrics {
  flex: 1;
  display: flex; flex-direction: column; gap: 14rpx;
}
.hm-item {
  display: flex; justify-content: space-between; align-items: center;
}
.hm-name {
  font-size: 22rpx; color: #64748B;
}
.hm-stars {
  display: flex; gap: 4rpx;
}
.star {
  font-size: 22rpx; color: #E5E7EB;
  transition: color 0.3s ease;
}
.star.active { color: #F59E0B; }
.health-advice {
  background: linear-gradient(135deg, #D1FAE5, #A7F3D0);
  border-radius: 16rpx;
  padding: 20rpx;
}
.ha-prefix {
  font-size: 20rpx; font-weight: 700; color: #059669;
  margin-bottom: 6rpx;
}
.ha-content {
  display: block;
  font-size: 24rpx; color: #064E28; line-height: 1.5;
}
</style>
