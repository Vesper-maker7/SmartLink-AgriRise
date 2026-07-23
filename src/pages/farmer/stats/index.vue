<!-- 农户端 — 数据中心 -->
<template>
  <view class="stats-page">
    <!-- 头部 -->
    <view class="page-top">
      <view class="top-safe"></view>
      <view class="top-header">
        <view class="top-title-row">
          <text class="top-icon">📊</text>
          <text class="top-title">数据中心</text>
        </view>
        <text class="top-sub">AI驱动的经营数据分析</text>
      </view>
    </view>

    <!-- AI总结卡片 -->
    <view class="section-row">
      <view class="ai-summary card-glow anim-fade-in anim-delay-1">
        <view class="ais-header">
          <text class="ais-icon">🤖</text>
          <text class="ais-title">AI经营总结</text>
          <text class="ais-date">本月</text>
        </view>
        <view class="ais-content">
          <view class="ais-item up">
            <text class="ais-num">12%</text>
            <text class="ais-label">销售增长</text>
          </view>
          <view class="ais-divider"></view>
          <view class="ais-item up">
            <text class="ais-num">8.5%</text>
            <text class="ais-label">利润提升</text>
          </view>
          <view class="ais-divider"></view>
          <view class="ais-item">
            <text class="ais-num warn">蓝莓</text>
            <text class="ais-label">建议增库存</text>
          </view>
        </view>
        <view class="ais-tip">
          <view class="ai-dot"></view>
          <text>AI分析：本月水果类表现最佳，建议扩大蓝莓供应量</text>
        </view>
      </view>
    </view>

    <!-- 销售趋势 -->
    <view class="section-row">
      <view class="sec-header">
        <view class="sec-title-line"></view>
        <text class="sec-title">销售趋势</text>
        <view class="period-switch">
          <text class="ps-item active">周</text>
          <text class="ps-item">月</text>
          <text class="ps-item">年</text>
        </view>
      </view>
      <view class="card-glow chart-area anim-fade-in anim-delay-2">
        <view class="chart-y-axis">
          <text v-for="l in 5" :key="l">{{ (6 - l) * 400 }}</text>
        </view>
        <view class="chart-body">
          <view class="cb-grid">
            <view class="cb-line" v-for="l in 5" :key="l"></view>
          </view>
          <!-- 折线 -->
          <svg class="cb-svg" viewBox="0 0 600 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#10B981" stop-opacity="0.25" />
                <stop offset="100%" stop-color="#10B981" stop-opacity="0.02" />
              </linearGradient>
              <linearGradient id="lineGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#0A84FF" stop-opacity="0.2" />
                <stop offset="100%" stop-color="#0A84FF" stop-opacity="0.02" />
              </linearGradient>
            </defs>
            <polyline fill="url(#lineGrad)" stroke="#10B981" stroke-width="3"
              points="0,120 100,110 200,80 300,90 400,50 500,40 600,20" />
            <polyline fill="none" stroke="#10B981" stroke-width="2.5"
              points="0,120 100,110 200,80 300,90 400,50 500,40 600,20" />
            <polyline fill="url(#lineGrad2)" stroke="#0A84FF" stroke-width="2.5"
              points="0,150 100,140 200,130 300,100 400,80 500,50 600,35" />
            <polyline fill="none" stroke="#0A84FF" stroke-width="2"
              points="0,150 100,140 200,130 300,100 400,80 500,50 600,35" />
          </svg>
        </view>
        <view class="chart-x-labels">
          <text v-for="d in chartLabels" :key="d">{{ d }}</text>
        </view>
        <view class="chart-legend">
          <view class="cl-item"><view class="cl-dot green"></view> <text>销售额</text></view>
          <view class="cl-item"><view class="cl-dot blue"></view> <text>订单量</text></view>
        </view>
      </view>
    </view>

    <!-- 订单分布 -->
    <view class="section-row double-charts">
      <view class="card-glow half-chart anim-fade-in anim-delay-3">
        <text class="hc-title">商品品类占比</text>
        <view class="pie-simple">
          <view class="pie-ring" style="background: conic-gradient(#10B981 0% 35%, #0A84FF 35% 60%, #F59E0B 60% 80%, #EC4899 80% 100%);">
            <view class="pie-hole"><text class="pie-total">16</text></view>
          </view>
        </view>
        <view class="pie-legend">
          <view class="pl-item"><view class="pl-d c1"></view> 水果 35%</view>
          <view class="pl-item"><view class="pl-d c2"></view> 粮油 25%</view>
          <view class="pl-item"><view class="pl-d c3"></view> 茶叶 20%</view>
          <view class="pl-item"><view class="pl-d c4"></view> 其他 20%</view>
        </view>
      </view>
      <view class="card-glow half-chart anim-fade-in anim-delay-4">
        <text class="hc-title">用户来源分析</text>
        <view class="h-bar-list">
          <view class="hb-item" v-for="(s, i) in sourceData" :key="i">
            <text class="hb-name">{{ s.name }}</text>
            <view class="hb-track">
              <view class="hb-fill" :style="{ width: s.percent + '%', background: s.color }"></view>
            </view>
            <text class="hb-val">{{ s.percent }}%</text>
          </view>
        </view>
      </view>
    </view>

    <!-- Top商品 -->
    <view class="section-row">
      <view class="sec-header">
        <view class="sec-title-line"></view>
        <text class="sec-title">热销商品 TOP3</text>
      </view>
      <view class="top3-list">
        <view class="t3-card" v-for="(t, i) in topProducts" :key="i"
          :class="'anim-fade-in anim-delay-' + (i+1)">
          <view class="t3-rank" :class="'rank' + (i+1)">{{ i + 1 }}</view>
          <image :src="t.image" class="t3-img" mode="aspectFill" />
          <view class="t3-info">
            <text class="t3-name">{{ t.name }}</text>
            <text class="t3-origin">{{ t.origin }}</text>
          </view>
          <view class="t3-right">
            <text class="t3-sales">{{ t.sales }}单</text>
            <text class="t3-revenue">¥{{ t.revenue }}</text>
          </view>
        </view>
      </view>
    </view>

    <view style="height: 160rpx;"></view>
    <FarmerTabBar page="stats" />
  </view>
</template>

<script setup>
import FarmerTabBar from '@/components/FarmerTabBar.vue'

const chartLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const sourceData = [
  { name: '平台搜索', percent: 42, color: '#10B981' },
  { name: '推荐流量', percent: 28, color: '#0A84FF' },
  { name: '分享引流', percent: 18, color: '#F59E0B' },
  { name: '直接访问', percent: 12, color: '#94A3B8' }
]
const topProducts = [
  { name: '云南蓝莓', origin: '云南大理', sales: 286, revenue: '19,448', image: 'https://via.placeholder.com/400x400/4CAF50/FFFFFF?text=蓝莓' },
  { name: '五常大米', origin: '黑龙江五常', sales: 245, revenue: '21,805', image: 'https://via.placeholder.com/400x400/66BB6A/FFFFFF?text=大米' },
  { name: '宁夏枸杞', origin: '宁夏中卫', sales: 198, revenue: '25,344', image: 'https://via.placeholder.com/400x400/FF7043/FFFFFF?text=枸杞' }
]
</script>

<style scoped>
.stats-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #E8F5EC 0%, #F0F4EF 10%, #F5F7F4 100%);
}
.page-top {
  background: linear-gradient(160deg, #0D7B3E 0%, #064E28 40%, #0D7B3E 100%);
  padding: 0 32rpx 30rpx;
  position: relative;
}
.page-top::after {
  content: ''; position: absolute; bottom: 0; left: 0; right: 0;
  height: 40rpx;
  background: linear-gradient(0deg, #F0F4EF 0%, transparent 100%);
}
.top-safe { height: calc(var(--status-bar-height) + 10rpx); }
.top-header { padding: 8rpx 0; position: relative; z-index: 1; }
.top-title-row { display: flex; align-items: center; gap: 10rpx; }
.top-icon { font-size: 34rpx; }
.top-title { font-size: 38rpx; font-weight: 800; color: #FFF; }
.top-sub { font-size: 24rpx; color: rgba(255,255,255,0.6); display: block; margin-top: 4rpx; }

/* 通用 */
.section-row { padding: 0 24rpx; margin-top: 28rpx; }
.sec-header {
  display: flex; align-items: center; gap: 10rpx;
  margin-bottom: 16rpx;
}
.sec-title-line {
  width: 6rpx; height: 28rpx;
  background: linear-gradient(180deg, #0D7B3E, #10B981); border-radius: 3rpx;
}
.sec-title { font-size: 30rpx; font-weight: 700; color: #0F172A; flex: 1; }
.period-switch { display: flex; background: #F0F4EF; border-radius: 20rpx; padding: 4rpx; }
.ps-item { font-size: 22rpx; color: #64748B; padding: 6rpx 18rpx; border-radius: 16rpx; }
.ps-item.active { background: #0D7B3E; color: #FFF; font-weight: 600; }

/* AI总结 */
.ai-summary { padding: 24rpx; }
.ais-header { display: flex; align-items: center; gap: 8rpx; margin-bottom: 18rpx; }
.ais-icon { font-size: 32rpx; }
.ais-title { font-size: 26rpx; font-weight: 700; color: #0F172A; flex: 1; }
.ais-date { font-size: 20rpx; color: #94A3B8; }
.ais-content { display: flex; align-items: center; justify-content: space-around; margin-bottom: 16rpx; }
.ais-item { text-align: center; }
.ais-num { font-size: 32rpx; font-weight: 800; color: #059669; display: block; }
.ais-num.warn { color: #F59E0B; font-size: 24rpx; }
.ais-label { font-size: 20rpx; color: #64748B; }
.ais-item.up .ais-num { color: #059669; }
.ais-divider { width: 1rpx; height: 48rpx; background: #E8EDE8; }
.ais-tip {
  display: flex; align-items: center; gap: 10rpx;
  background: linear-gradient(135deg, rgba(0,212,170,0.06), rgba(10,132,255,0.06));
  border-radius: 14rpx; padding: 14rpx 18rpx;
  font-size: 22rpx; color: #334155;
}

/* 图表 */
.chart-area {
  padding: 24rpx 12rpx 20rpx 60rpx;
  position: relative;
}
.chart-y-axis {
  position: absolute; left: 8rpx; top: 24rpx; bottom: 60rpx;
  display: flex; flex-direction: column; justify-content: space-between;
}
.chart-y-axis text { font-size: 18rpx; color: #CBD5E1; }
.chart-body {
  height: 280rpx; position: relative;
}
.cb-grid {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; justify-content: space-between;
}
.cb-line { height: 1rpx; background: #F2F5F1; }
.cb-svg {
  position: absolute; inset: 0; width: 100%; height: 100%;
}
.chart-x-labels {
  display: flex; justify-content: space-between;
  padding: 8rpx 0 0;
}
.chart-x-labels text { font-size: 18rpx; color: #94A3B8; }
.chart-legend {
  display: flex; justify-content: center; gap: 32rpx;
  margin-top: 12rpx;
}
.cl-item { display: flex; align-items: center; gap: 8rpx; font-size: 20rpx; color: #64748B; }
.cl-dot { width: 16rpx; height: 16rpx; border-radius: 4rpx; }
.cl-dot.green { background: #10B981; }
.cl-dot.blue { background: #0A84FF; }

/* 双图表 */
.double-charts { display: flex; gap: 16rpx; }
.half-chart { flex: 1; padding: 20rpx; }
.hc-title { font-size: 24rpx; font-weight: 700; color: #0F172A; margin-bottom: 16rpx; display: block; }
.pie-simple { display: flex; justify-content: center; margin-bottom: 14rpx; }
.pie-ring {
  width: 140rpx; height: 140rpx; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}
.pie-hole {
  width: 80rpx; height: 80rpx; background: #FFF; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}
.pie-total { font-size: 28rpx; font-weight: 800; color: #0F172A; }
.pie-legend { display: flex; flex-direction: column; gap: 6rpx; }
.pl-item { display: flex; align-items: center; gap: 8rpx; font-size: 20rpx; color: #64748B; }
.pl-d { width: 14rpx; height: 14rpx; border-radius: 4rpx; }
.pl-d.c1 { background: #10B981; } .pl-d.c2 { background: #0A84FF; }
.pl-d.c3 { background: #F59E0B; } .pl-d.c4 { background: #EC4899; }

/* 横向柱状 */
.h-bar-list { display: flex; flex-direction: column; gap: 14rpx; }
.hb-item { display: flex; align-items: center; gap: 8rpx; }
.hb-name { font-size: 20rpx; color: #64748B; width: 88rpx; }
.hb-track { flex: 1; height: 14rpx; background: #F0F4EF; border-radius: 7rpx; overflow: hidden; }
.hb-fill { height: 100%; border-radius: 7rpx; transition: width 0.6s ease; }
.hb-val { font-size: 20rpx; font-weight: 600; color: #334155; width: 48rpx; text-align: right; }

/* TOP3 */
.top3-list { display: flex; flex-direction: column; gap: 14rpx; }
.t3-card {
  display: flex; align-items: center; gap: 14rpx;
  background: #FFF; border-radius: 18rpx; padding: 18rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.03);
}
.t3-rank {
  width: 44rpx; height: 44rpx; border-radius: 12rpx;
  display: flex; align-items: center; justify-content: center;
  font-size: 24rpx; font-weight: 800; color: #FFF;
  flex-shrink: 0;
}
.rank1 { background: linear-gradient(135deg, #F59E0B, #EF4444); }
.rank2 { background: linear-gradient(135deg, #94A3B8, #64748B); }
.rank3 { background: linear-gradient(135deg, #D4A853, #B8860B); }
.t3-img { width: 72rpx; height: 72rpx; border-radius: 14rpx; flex-shrink: 0; }
.t3-info { flex: 1; }
.t3-name { font-size: 26rpx; font-weight: 600; color: #0F172A; display: block; }
.t3-origin { font-size: 20rpx; color: #94A3B8; }
.t3-right { text-align: right; flex-shrink: 0; }
.t3-sales { font-size: 24rpx; font-weight: 700; color: #0F172A; display: block; }
.t3-revenue { font-size: 20rpx; color: #EF4444; }
</style>
