<template>
  <view class="map-page">
    <!-- ========== 全局背景层 ========== -->
    <view class="bg-layer">
      <view class="bg-gradient"></view>
      <view class="bg-glow glow-top-right"></view>
      <view class="bg-glow glow-bottom-left"></view>
      <view class="bg-particles">
        <view v-for="p in particles" :key="p.id" class="particle" :style="p.style"></view>
      </view>
    </view>

    <!-- ========== 顶部导航 ========== -->
    <view class="header safe-area-top">
      <view class="h-left" @click="goBack">
        <view class="h-back"><text>←</text></view>
      </view>
      <view class="h-center">
        <text class="h-title">中国风味地图</text>
        <view class="h-subtitle">
          <view class="hs-line"></view>
          <text class="hs-text">中国农业数字风味图谱</text>
          <view class="hs-line"></view>
        </view>
      </view>
      <view class="h-right" @click="toggleAIDrawer">
        <view class="h-ai-btn"><text>🤖</text></view>
      </view>
    </view>

    <!-- ========== 地图主体 ========== -->
    <scroll-view scroll-y class="main-scroll" :enhanced="true" :show-scrollbar="false">
      <view class="main-scroll-inner">

        <!-- 地图容器 -->
        <view class="map-wrapper">
          <!-- SVG 地图 -->
          <svg class="map-svg" viewBox="0 0 800 550" preserveAspectRatio="xMidYMid meet">
            <defs>
              <!-- 地图填充渐变 -->
              <radialGradient id="mapFill" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stop-color="rgba(0,255,200,0.06)" />
                <stop offset="100%" stop-color="rgba(0,255,200,0.01)" />
              </radialGradient>
              <!-- 发光滤镜 -->
              <filter id="mapGlow" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <!-- 内部发光 -->
              <filter id="innerGlow">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                <feComposite in="blur" in2="SourceGraphic" operator="in" result="inner" />
                <feFlood flood-color="rgba(0,212,170,0.3)" result="color" />
                <feComposite in="color" in2="inner" operator="in" result="glow" />
                <feMerge>
                  <feMergeNode in="SourceGraphic" />
                  <feMergeNode in="glow" />
                </feMerge>
              </filter>
            </defs>
            <!-- 中国大陆轮廓 -->
            <path class="map-outline" d="M82,200 C88,170 105,148 130,128 C160,108 198,92 240,84 C280,76 320,70 365,65 C412,59 460,54 510,52 C560,50 612,49 662,54 C712,58 758,70 788,90 C800,102 800,118 790,138 C775,158 755,172 740,190 C723,212 718,240 735,260 C748,276 740,290 718,303 C696,318 678,328 668,348 C658,370 672,392 685,412 C695,428 680,442 658,456 C636,470 612,486 588,505 C565,522 540,528 512,524 C488,520 460,510 435,500 C408,490 382,480 358,470 C332,458 305,442 290,430 C272,418 245,412 215,408 C185,404 155,390 135,368 C112,340 96,302 88,270 C80,240 78,220 82,200 Z" />
            <!-- 台湾 -->
            <path class="map-outline" d="M730,370 C755,365 768,382 762,402 C756,424 738,434 720,426 C706,420 702,400 712,384 C720,372 722,372 730,370 Z" />
            <!-- 海南 -->
            <path class="map-outline" d="M558,538 C578,532 590,548 584,564 C578,580 556,583 545,572 C536,562 542,544 558,538 Z" />
            <!-- 地形波纹 -->
            <path class="map-wave" d="M100,280 Q200,270 300,280 Q400,290 500,280 Q600,270 700,280" />
            <path class="map-wave" d="M120,340 Q220,330 320,340 Q420,350 520,340 Q620,330 710,340" />
            <path class="map-wave" d="M140,410 Q240,400 340,410 Q440,420 540,410 Q640,400 695,410" />
            <!-- 经纬参考线 -->
            <path class="map-lat" d="M100,180 L760,180" />
            <path class="map-lat" d="M100,320 L700,320" />
            <path class="map-lat" d="M120,450 L660,450" />
            <path class="map-lng" d="M200,100 L210,480" />
            <path class="map-lng" d="M400,65 L400,470" />
            <path class="map-lng" d="M600,52 L600,500" />
            <!-- 内部虚线分界 -->
            <path class="map-divider" d="M220,100 L230,220 L250,310 L230,390" />
            <path class="map-divider" d="M360,65 L350,200 L340,330 L340,450" />
            <path class="map-divider" d="M510,52 L500,180 L490,310 L490,440" />
            <path class="map-divider" d="M130,260 Q240,270 340,265 Q500,255 660,270 Q720,280 745,300" />
            <path class="map-divider" d="M140,330 Q260,345 380,340 Q520,335 620,350" />
          </svg>

          <!-- 产区标记 -->
          <view
            v-for="region in mapRegions"
            :key="region.id"
            class="region-marker"
            :class="[region.align, { 'rm-expand': expandedRegion === region.id }]"
            :style="{ left: region.pos.left, top: region.pos.top }"
            @click.stop="toggleRegion(region.id)"
          >
            <!-- 三层脉冲标记点 -->
            <view class="rm-pin">
              <view class="rmp-ripple"></view>
              <view class="rmp-outer"></view>
              <view class="rmp-mid"></view>
              <view class="rmp-core"></view>
            </view>

            <!-- 标签卡片 -->
            <view class="rm-label">
              <view class="rml-connector"></view>
              <view class="rml-card">
                <view class="rmlc-header">
                  <text class="rmlc-emoji">{{ region.icon }}</text>
                  <view class="rmlc-divider-vert"></view>
                  <view class="rmlc-text">
                    <text class="rmlc-name">{{ region.name }}</text>
                    <text class="rmlc-sub">{{ region.sub }}</text>
                  </view>
                </view>
                <view class="rmlc-badge">
                  <text>{{ region.products.length }}种好物</text>
                </view>
              </view>
            </view>

            <!-- 展开的商品浮层 -->
            <view v-if="expandedRegion === region.id" class="rm-expand-card">
              <view class="rmec-header">
                <text class="rmec-title">{{ region.name }}特产</text>
                <view class="rmec-close" @click.stop="expandedRegion = null"><text>×</text></view>
              </view>
              <view class="rmec-divider"></view>
              <view v-for="prod in region.products" :key="prod.id" class="rmec-item" @click.stop="goProductDetail(prod.id)">
                <view class="rmec-img"><text>{{ prod.emoji }}</text></view>
                <view class="rmec-info">
                  <text class="rmec-name">{{ prod.name }}</text>
                  <view class="rmec-bottom">
                    <text class="rmec-price">¥{{ prod.price }}</text>
                    <view class="rmec-trace"><text>溯源</text></view>
                  </view>
                </view>
                <view class="rmec-arrow"><text>→</text></view>
              </view>
            </view>
          </view>
        </view>

        <!-- 图例（右下角） -->
        <view class="map-legend">
          <view class="ml-item"><view class="ml-ring active"></view><text>特色产区</text></view>
          <view class="ml-item"><view class="ml-ring"></view><text>农产品</text></view>
        </view>

        <!-- 驾驶舱统计 -->
        <view class="stats-cockpit">
          <view class="sc-bar"></view>
          <view class="sc-row">
            <view class="sc-item">
              <text class="sc-num">{{ mapRegions.length }}</text>
              <text class="sc-label">产区</text>
            </view>
            <view class="sc-split"></view>
            <view class="sc-item">
              <text class="sc-num">{{ totalProducts }}</text>
              <text class="sc-label">特色好物</text>
            </view>
            <view class="sc-split"></view>
            <view class="sc-item">
              <text class="sc-num">100%</text>
              <text class="sc-label">可追溯</text>
            </view>
          </view>
        </view>

        <!-- 今日推荐 -->
        <view class="rec-section">
          <view class="rec-header">
            <text class="rec-title">今日推荐</text>
            <text class="rec-more">查看全部 →</text>
          </view>
          <scroll-view scroll-x class="rec-scroll" :show-scrollbar="false">
            <view class="rec-list">
              <view v-for="rec in recommendations" :key="rec.id" class="rec-card" @click="goProductDetail(rec.id)">
                <view class="rec-img"><text>{{ rec.emoji }}</text></view>
                <view class="rec-body">
                  <text class="rec-name">{{ rec.name }}</text>
                  <view class="rec-stars">
                    <text v-for="i in 5" :key="i" :class="i <= rec.stars ? 'star-on' : 'star-off'">★</text>
                  </view>
                  <view class="rec-meta">
                    <text class="rec-from">{{ rec.from }}</text>
                    <text class="rec-price">¥{{ rec.price }}</text>
                  </view>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>

      </view>
    </scroll-view>

    <!-- ========== AI 底部抽屉 ========== -->
    <view class="ai-drawer" :class="[`ad-${aiDrawerState}`]">
      <view class="ad-handle" @click="cycleAIDrawer">
        <view class="adh-bar"></view>
      </view>
      <view class="ad-header">
        <text class="ad-title">🤖 AI 风味助手</text>
        <view class="ad-close" @click="closeAIDrawer"><text>×</text></view>
      </view>

      <!-- 聊天区 -->
      <scroll-view
        v-if="chatStore.hasMessages || chatStore.isTyping"
        ref="chatScroll"
        scroll-y
        class="ad-chat-scroll"
        :scroll-with-animation="true"
      >
        <view class="ad-chat-inner">
          <ChatMessage
            v-for="(msg, idx) in chatStore.currentMessages"
            :key="msg.timestamp + '-' + idx"
            :message="msg"
            :show-time="idx === 0 || (msg.timestamp - chatStore.currentMessages[idx - 1]?.timestamp > 300000)"
            avatar-emoji="🌾"
          />
          <TypingIndicator v-if="chatStore.isTyping" icon="🌾" />
          <view style="height:8rpx"></view>
        </view>
      </scroll-view>

      <!-- 欢迎引导 -->
      <view v-else class="ad-welcome">
        <view class="adw-chips">
          <view v-for="q in quickQuestions" :key="q" class="adw-chip" @click="sendQuick(q)"><text>{{ q }}</text></view>
        </view>
      </view>

      <!-- 输入栏 -->
      <view class="ad-input safe-area-bottom">
        <view class="adi-box">
          <input
            v-model="inputText"
            class="adi-input"
            placeholder="输入您想问的…"
            placeholder-style="color:#5A6E85"
            confirm-type="send"
            @confirm="handleSend"
          />
        </view>
        <view class="adi-send" @click="handleSend"><text>发送</text></view>
      </view>
    </view>

    <!-- 抽屉遮罩 -->
    <view v-if="aiDrawerState !== 'closed'" class="ad-overlay" @click="closeAIDrawer"></view>

  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useChatStore } from '@/store/chat.js'
import ChatMessage from '@/components/ChatMessage.vue'
import TypingIndicator from '@/components/TypingIndicator.vue'

const chatStore = useChatStore()
const expandedRegion = ref(null)
const inputText = ref('')
const aiDrawerState = ref('closed') // 'closed' | 'half' | 'full'

// 地图区域数据
const mapRegions = ref([
  {
    id: 'xinjiang', name: '新疆', sub: '特色水果', icon: '🍇',
    pos: { left: '14%', top: '26%' }, align: 'marker-left',
    products: [
      { id: 1, name: '天山有机雪莲果', price: 68.0, emoji: '🫐' },
      { id: 14, name: '阿克苏冰糖心苹果', price: 42.0, emoji: '🍎' },
      { id: 15, name: '吐鲁番无核白葡萄干', price: 35.0, emoji: '🍇' }
    ]
  },
  {
    id: 'dongbei', name: '黑龙江', sub: '黑土粮仓', icon: '🌾',
    pos: { left: '79%', top: '11%' }, align: 'marker-right',
    products: [
      { id: 2, name: '五常有机大米 5kg', price: 89.0, emoji: '🍚' },
      { id: 12, name: '东北黑木耳 500g', price: 32.0, emoji: '🍄' }
    ]
  },
  {
    id: 'yunnan', name: '云南', sub: '云岭风物', icon: '🍵',
    pos: { left: '38%', top: '76%' }, align: 'marker-left',
    products: [
      { id: 3, name: '古树普洱生茶', price: 298.0, emoji: '🫖' },
      { id: 9, name: '文山有机三七粉', price: 158.0, emoji: '💊' }
    ]
  },
  {
    id: 'ningxia', name: '宁夏', sub: '塞上江南', icon: '🔴',
    pos: { left: '28%', top: '33%' }, align: 'marker-center',
    products: [
      { id: 4, name: '中宁枸杞 500g', price: 45.0, emoji: '🔴' },
      { id: 13, name: '宁夏滩羊肉礼盒', price: 268.0, emoji: '🥩' }
    ]
  },
  {
    id: 'sichuan', name: '四川', sub: '天府之国', icon: '🌶️',
    pos: { left: '43%', top: '57%' }, align: 'marker-left',
    products: [
      { id: 8, name: '郫县豆瓣酱 1kg', price: 28.0, emoji: '🫙' },
      { id: 10, name: '四川雅安藏茶', price: 188.0, emoji: '🧱' }
    ]
  },
  {
    id: 'henan', name: '河南', sub: '中原粮仓', icon: '🌽',
    pos: { left: '59%', top: '47%' }, align: 'marker-center',
    products: [
      { id: 16, name: '温县铁棍山药', price: 58.0, emoji: '🥔' },
      { id: 17, name: '信阳毛尖绿茶', price: 128.0, emoji: '🍃' }
    ]
  },
  {
    id: 'fujian', name: '福建', sub: '八闽珍品', icon: '⛰️',
    pos: { left: '79%', top: '72%' }, align: 'marker-right',
    products: [
      { id: 11, name: '武夷岩茶大红袍', price: 368.0, emoji: '🍂' },
      { id: 18, name: '古田银耳 500g', price: 39.0, emoji: '🤍' }
    ]
  },
  {
    id: 'guangdong', name: '广东', sub: '岭南佳果', icon: '🥭',
    pos: { left: '70%', top: '83%' }, align: 'marker-center',
    products: [
      { id: 19, name: '增城荔枝干礼盒', price: 88.0, emoji: '🍒' },
      { id: 20, name: '新会陈皮老陈皮', price: 198.0, emoji: '🍊' }
    ]
  }
])

// 悬浮粒子
const particles = ref([])
function genParticles() {
  const arr = []
  for (let i = 0; i < 28; i++) {
    arr.push({
      id: i,
      style: {
        left: `${Math.random() * 94 + 3}%`,
        top: `${Math.random() * 92 + 4}%`,
        animationDuration: `${Math.random() * 6 + 8}s`,
        animationDelay: `${Math.random() * 6}s`,
        opacity: Math.random() * 0.06 + 0.02,
        fontSize: `${Math.random() * 14 + 8}rpx`
      }
    })
  }
  particles.value = arr
}

// 今日推荐
const recommendations = ref([
  { id: 14, name: '阿克苏冰糖心苹果', price: 42.0, emoji: '🍎', stars: 5, from: '新疆' },
  { id: 2, name: '五常有机大米', price: 89.0, emoji: '🍚', stars: 5, from: '黑龙江' },
  { id: 3, name: '古树普洱生茶', price: 298.0, emoji: '🫖', stars: 4, from: '云南' },
  { id: 13, name: '宁夏滩羊肉礼盒', price: 268.0, emoji: '🥩', stars: 5, from: '宁夏' },
  { id: 11, name: '武夷岩茶大红袍', price: 368.0, emoji: '🍂', stars: 4, from: '福建' }
])

const quickQuestions = ['天山雪莲果怎么吃？', '五常大米营养如何？', '推荐送礼农产品', '当季水果有哪些？']

const totalProducts = computed(() => {
  const ids = new Set()
  mapRegions.value.forEach(r => r.products.forEach(p => ids.add(p.id)))
  return ids.size
})

onMounted(() => {
  chatStore.init()
  genParticles()
})

function toggleRegion(id) {
  expandedRegion.value = expandedRegion.value === id ? null : id
}
function goProductDetail(productId) {
  uni.navigateTo({ url: `/pages/consumer/mall/detail?id=${productId}` })
}
function goBack() {
  uni.switchTab({ url: '/pages/consumer/home/index' })
}

// AI 抽屉
function toggleAIDrawer() {
  if (aiDrawerState.value === 'closed') {
    aiDrawerState.value = 'half'
  } else {
    aiDrawerState.value = 'closed'
  }
}
function cycleAIDrawer() {
  if (aiDrawerState.value === 'half') {
    aiDrawerState.value = 'full'
  } else if (aiDrawerState.value === 'full') {
    aiDrawerState.value = 'half'
  }
}
function closeAIDrawer() {
  aiDrawerState.value = 'closed'
}

async function handleSend() {
  const t = inputText.value.trim()
  if (!t || chatStore.isTyping) return
  inputText.value = ''
  await chatStore.sendMessage(t)
}
function sendQuick(t) {
  inputText.value = t
  handleSend()
}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

/* ============================================ */
/*               全局变量/基色                      */
/* ============================================ */
$bg-deep: #071320;
$bg-mid: #081B2D;
$bg-card: rgba(15,35,55,.75);
$primary: #00D4AA;
$secondary: #0A84FF;
$accent: #FFB84D;
$price: #18E59A;
$text-solid: #FFFFFF;
$text-dim: rgba(255,255,255,.7);
$text-fade: rgba(255,255,255,.4);
$ease-out: cubic-bezier(.22,.8,.2,1);
$ease-inout: cubic-bezier(.4,0,.2,1);

/* ============================================ */
/*               页面容器                          */
/* ============================================ */
.map-page {
  position: relative; width: 100%; height: 100vh;
  display: flex; flex-direction: column;
  background: $bg-deep; overflow: hidden;
}

/* ============================================ */
/*            背景层（三层叠加）                    */
/* ============================================ */
.bg-layer { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.bg-gradient {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, #071320 0%, #081B2D 45%, #0C2438 100%);
}
.bg-glow {
  position: absolute; border-radius: 50%; filter: blur(80rpx);
  &.glow-top-right {
    width: 500rpx; height: 500rpx;
    background: radial-gradient(circle, rgba(0,212,170,.08), transparent);
    top: -120rpx; right: -100rpx;
  }
  &.glow-bottom-left {
    width: 420rpx; height: 420rpx;
    background: radial-gradient(circle, rgba(10,132,255,.05), transparent);
    bottom: -80rpx; left: -60rpx;
  }
}
.bg-particles { position: absolute; inset: 0; }
.particle {
  position: absolute;
  color: rgba(0,212,170,.5);
  animation: particleFloat linear infinite;
  &::before { content: '·'; }
}
@keyframes particleFloat {
  0%   { transform: translateY(0) translateX(0); opacity: 0; }
  20%  { opacity: 1; }
  80%  { opacity: 1; }
  100% { transform: translateY(-60rpx) translateX(20rpx); opacity: 0; }
}

/* ============================================ */
/*               顶部导航                          */
/* ============================================ */
.header {
  position: relative; z-index: 10; flex-shrink: 0;
  display: flex; align-items: center; justify-content: space-between;
  padding: 12rpx 28rpx 16rpx;
  background: linear-gradient(180deg, rgba(7,19,32,.98) 0%, rgba(7,19,32,.85) 80%, transparent 100%);
}
.h-left, .h-right { flex-shrink: 0; }
.h-back, .h-ai-btn {
  width: 56rpx; height: 56rpx; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,.06); border: 1rpx solid rgba(255,255,255,.08);
  text { font-size: 30rpx; color: $text-solid; }
}
.h-ai-btn { border-color: rgba($primary,.2); }
.h-center { flex: 1; text-align: center; }
.h-title {
  display: block; font-size: 34rpx; font-weight: 800; letter-spacing: 3rpx;
  background: linear-gradient(135deg, $text-solid 30%, $primary);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}
.h-subtitle {
  display: flex; align-items: center; justify-content: center;
  gap: 12rpx; margin-top: 6rpx;
  .hs-line {
    width: 60rpx; height: 1rpx;
    background: linear-gradient(90deg, transparent, rgba($primary,.3), transparent);
    flex-shrink: 0;
  }
  .hs-text { font-size: 20rpx; color: rgba($primary,.45); letter-spacing: 2rpx; }
}

/* ============================================ */
/*               地图滚动区                        */
/* ============================================ */
.main-scroll {
  flex: 1; position: relative; z-index: 5; width: 100%;
}
.main-scroll-inner {
  width: 100%; display: block; padding-bottom: 240rpx; box-sizing: border-box;
}

/* ============================================ */
/*               地图容器                          */
/* ============================================ */
.map-wrapper {
  position: relative; width: 100%; height: 540rpx; margin: 0;
}
.map-svg {
  position: absolute; inset: 0; width: 100%; height: 100%;
}
.map-outline {
  fill: url(#mapFill);
  stroke: rgba($primary,.35);
  stroke-width: 1.2;
  stroke-linejoin: round;
  filter: drop-shadow(0 0 18rpx rgba($primary,.15));
}
/* 地形波纹 */
.map-wave {
  fill: none;
  stroke: rgba($primary,.06);
  stroke-width: 1;
  stroke-dasharray: 3,12;
}
/* 经纬参考线 */
.map-lat, .map-lng {
  fill: none;
  stroke: rgba(255,255,255,.025);
  stroke-width: 0.6;
}
.map-lat { stroke-dasharray: 16,28; }
.map-lng { stroke-dasharray: 10,20; }
/* 内部虚线分界 */
.map-divider {
  fill: none;
  stroke: rgba(255,255,255,.05);
  stroke-width: 0.7;
  stroke-dasharray: 4,8;
}

/* ============================================ */
/*               产区标记（三层脉冲）                */
/* ============================================ */
.region-marker {
  position: absolute; z-index: 10; user-select: none;
  transition: transform .35s $ease-out;
  &.rm-expand { z-index: 30; }
}
/* 三层脉冲点 */
.rm-pin {
  width: 52rpx; height: 52rpx; position: relative;
}
/* 涟漪（持续扩散） */
.rmp-ripple {
  position: absolute; top: 6rpx; left: 6rpx;
  width: 40rpx; height: 40rpx; border-radius: 50%;
  border: 1.5rpx solid rgba($primary,.3);
  animation: rippleOut 3s ease-out infinite;
}
@keyframes rippleOut {
  0%   { transform: scale(.6); opacity: .8; }
  50%  { opacity: .4; }
  100% { transform: scale(3.5); opacity: 0; }
}
/* 外圈 */
.rmp-outer {
  position: absolute; top: 4rpx; left: 4rpx;
  width: 44rpx; height: 44rpx; border-radius: 50%;
  border: 1rpx solid rgba($primary,.45);
  background: rgba($primary,.06);
  animation: outerPulse 3s $ease-inout infinite;
}
@keyframes outerPulse {
  0%,100% { transform: scale(1); opacity: .9; }
  50%     { transform: scale(1.15); opacity: .5; }
}
/* 中圈（渐变） */
.rmp-mid {
  position: absolute; top: 12rpx; left: 12rpx;
  width: 28rpx; height: 28rpx; border-radius: 50%;
  background: radial-gradient(circle, rgba($primary,.5) 0%, rgba($primary,.15) 60%, transparent 100%);
  box-shadow: 0 0 16rpx rgba($primary,.4);
  animation: midPulse 2.2s $ease-inout infinite;
}
@keyframes midPulse {
  0%,100% { transform: scale(1); }
  50%     { transform: scale(1.25); }
}
/* 中心白点 */
.rmp-core {
  position: absolute; top: 22rpx; left: 22rpx;
  width: 8rpx; height: 8rpx; border-radius: 50%;
  background: #FFF;
  box-shadow: 0 0 8rpx rgba(255,255,255,.8), 0 0 20rpx rgba($primary,.6);
  z-index: 5;
}

/* 标签卡片 */
.rm-label {
  position: absolute; top: 28rpx; display: flex; align-items: flex-start;
  pointer-events: none;
}
.rml-connector {
  width: 18rpx; height: 14rpx; flex-shrink: 0;
  margin-top: 6rpx;
  border-left: 1rpx solid rgba($primary,.25);
}
.rml-card {
  background: rgba(10,30,50,.88); border: 1rpx solid rgba($primary,.15);
  border-radius: 16rpx; padding: 10rpx 16rpx;
  backdrop-filter: blur(20rpx);
  box-shadow: 0 8rpx 32rpx rgba(0,0,0,.3), inset 0 1rpx 0 rgba($primary,.08);
}
.rmlc-header {
  display: flex; align-items: center; gap: 10rpx;
}
.rmlc-emoji { font-size: 26rpx; flex-shrink: 0; }
.rmlc-divider-vert {
  width: 1rpx; height: 28rpx; background: rgba($primary,.15); flex-shrink: 0;
}
.rmlc-text { display: flex; flex-direction: column; }
.rmlc-name {
  font-size: 24rpx; color: $text-solid; font-weight: 700;
  letter-spacing: 1rpx; line-height: 1.2;
}
.rmlc-sub {
  font-size: 18rpx; color: rgba($primary,.55);
  letter-spacing: 1rpx; line-height: 1.2;
}
.rmlc-badge {
  margin-top: 8rpx; padding: 4rpx 14rpx; border-radius: 20rpx;
  background: rgba($primary,.1); border: 1rpx solid rgba($primary,.15);
  align-self: flex-start;
  text {
    font-size: 18rpx; color: rgba($primary,.7); letter-spacing: 1rpx;
  }
}

/* 对齐方式 */
.marker-left {
  .rm-label { left: 20rpx; }
  .rml-card { margin-left: 2rpx; }
}
.marker-right {
  .rm-pin { margin-left: -52rpx; }
  .rm-label { right: 20rpx; left: auto; }
  .rml-connector { order: 2; margin-left: 4rpx; border-right: 1rpx solid rgba($primary,.25); border-left: none; }
  .rml-card { order: 1; margin-right: 2rpx; }
}
.marker-center {
  .rm-pin { margin-left: -26rpx; }
  .rm-label { left: -10rpx; }
  .rml-card { margin-left: 2rpx; }
}

/* ============================================ */
/*            展开商品浮层卡片                      */
/* ============================================ */
.rm-expand-card {
  position: absolute; top: 64rpx; left: -10rpx;
  width: 300rpx; background: rgba(10,28,48,.96);
  border: 1rpx solid rgba($primary,.18);
  border-radius: 20rpx; padding: 16rpx;
  backdrop-filter: blur(30rpx);
  box-shadow: 0 16rpx 48rpx rgba(0,0,0,.5), 0 0 40rpx rgba($primary,.08);
  z-index: 40;
  animation: cardExpand .28s $ease-out;
}
@keyframes cardExpand {
  from { opacity: 0; transform: translateY(-12rpx) scale(.92); filter: blur(4rpx); }
  to   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}
/* 右/中对齐偏移 */
.marker-right .rm-expand-card { left: auto; right: -10rpx; }
.marker-center .rm-expand-card { left: -20rpx; }

.rmec-header {
  display: flex; align-items: center; justify-content: space-between;
  .rmec-title { font-size: 24rpx; color: $text-solid; font-weight: 700; }
  .rmec-close {
    width: 36rpx; height: 36rpx; border-radius: 50%;
    background: rgba(255,255,255,.06); display: flex;
    align-items: center; justify-content: center;
    text { font-size: 26rpx; color: rgba(255,255,255,.5); }
  }
}
.rmec-divider {
  height: 1rpx; background: linear-gradient(90deg, transparent, rgba($primary,.15), transparent);
  margin: 12rpx 0;
}
.rmec-item {
  display: flex; align-items: center; gap: 12rpx;
  padding: 10rpx 8rpx; border-radius: 12rpx;
  transition: background .15s;
  &:active { background: rgba($primary,.08); }
}
.rmec-img {
  width: 48rpx; height: 48rpx; border-radius: 10rpx;
  background: linear-gradient(135deg, rgba($primary,.12), rgba($secondary,.08));
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  text { font-size: 26rpx; }
}
.rmec-info { flex: 1; min-width: 0; }
.rmec-name {
  font-size: 22rpx; color: rgba(255,255,255,.85); font-weight: 600;
  display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.rmec-bottom { display: flex; align-items: center; justify-content: space-between; margin-top: 4rpx; }
.rmec-price { font-size: 22rpx; color: $price; font-weight: 700; }
.rmec-trace {
  padding: 2rpx 10rpx; border-radius: 8rpx;
  background: rgba($accent,.12); border: 1rpx solid rgba($accent,.2);
  text { font-size: 16rpx; color: $accent; font-weight: 600; }
}
.rmec-arrow {
  width: 32rpx; height: 32rpx; border-radius: 50%;
  background: rgba($primary,.1); display: flex;
  align-items: center; justify-content: center; flex-shrink: 0;
  text { font-size: 20rpx; color: $primary; }
}

/* ============================================ */
/*               图例（右下角）                     */
/* ============================================ */
.map-legend {
  position: absolute; right: 16rpx; bottom: 12rpx;
  display: flex; flex-direction: column; gap: 8rpx; z-index: 20;
  padding: 10rpx 14rpx;
  background: rgba(7,19,32,.7); border-radius: 12rpx;
  backdrop-filter: blur(10rpx);
  border: 1rpx solid rgba(255,255,255,.04);
}
.ml-item {
  display: flex; align-items: center; gap: 8rpx;
  font-size: 18rpx; color: $text-fade;
}
.ml-ring {
  width: 14rpx; height: 14rpx; border-radius: 50%;
  border: 2rpx solid rgba(255,255,255,.15); background: transparent;
  &.active {
    border-color: $primary; background: rgba($primary,.25);
    box-shadow: 0 0 8rpx rgba($primary,.4);
  }
}

/* ============================================ */
/*            驾驶舱统计面板                        */
/* ============================================ */
.stats-cockpit {
  margin: 36rpx 24rpx 0;
  background: rgba(255,255,255,.03);
  border-radius: 20rpx; overflow: hidden;
  backdrop-filter: blur(20rpx);
  border: 1rpx solid rgba(255,255,255,.04);
  box-shadow: 0 8rpx 32rpx rgba(0,0,0,.3);
}
.sc-bar {
  height: 3rpx;
  background: linear-gradient(90deg, transparent 15%, $primary 50%, transparent 85%);
}
.sc-row {
  display: flex; align-items: center; padding: 28rpx 20rpx;
}
.sc-item {
  flex: 1 1 0; min-width: 0; text-align: center;
  .sc-num {
    display: block; font-size: 44rpx; font-weight: 900; letter-spacing: 2rpx;
    background: linear-gradient(180deg, $text-solid 20%, $primary 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .sc-label {
    display: block; font-size: 22rpx; color: $text-fade;
    margin-top: 6rpx; letter-spacing: 2rpx;
  }
}
.sc-split {
  width: 1rpx; height: 50rpx; background: rgba($primary,.08);
}

/* ============================================ */
/*               今日推荐                          */
/* ============================================ */
.rec-section {
  margin: 32rpx 0 0;
}
.rec-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 28rpx 16rpx;
  .rec-title { font-size: 30rpx; color: $text-solid; font-weight: 700; letter-spacing: 2rpx; }
  .rec-more { font-size: 24rpx; color: rgba($primary,.55); }
}
.rec-scroll { width: 100%; white-space: nowrap; }
.rec-list { display: inline-flex; gap: 16rpx; padding: 0 28rpx; }
.rec-card {
  display: inline-flex; align-items: center; gap: 16rpx;
  padding: 20rpx 24rpx; border-radius: 18rpx;
  background: $bg-card; border: 1rpx solid rgba(255,255,255,.05);
  backdrop-filter: blur(20rpx);
  min-width: 340rpx; white-space: normal;
  box-shadow: 0 6rpx 24rpx rgba(0,0,0,.25);
  transition: all .2s;
  &:active { background: rgba($primary,.08); border-color: rgba($primary,.2); }
}
.rec-img {
  width: 72rpx; height: 72rpx; border-radius: 16rpx;
  background: linear-gradient(135deg, rgba($primary,.15), rgba($secondary,.1));
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  text { font-size: 38rpx; }
}
.rec-body { display: flex; flex-direction: column; gap: 4rpx; }
.rec-name {
  font-size: 26rpx; color: $text-solid; font-weight: 700;
  max-width: 220rpx; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.rec-stars { display: flex; gap: 2rpx; }
.star-on  { font-size: 18rpx; color: $accent; }
.star-off { font-size: 18rpx; color: rgba(255,255,255,.12); }
.rec-meta { display: flex; align-items: center; gap: 12rpx; }
.rec-from {
  font-size: 20rpx; color: $text-fade;
  padding: 2rpx 10rpx; background: rgba($primary,.08); border-radius: 6rpx;
}
.rec-price { font-size: 24rpx; color: $price; font-weight: 700; }

/* ============================================ */
/*               AI 底部抽屉                       */
/* ============================================ */
.ad-overlay {
  position: fixed; inset: 0; z-index: 50;
  background: rgba(0,0,0,.35);
  animation: fadeIn .3s ease-out;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.ai-drawer {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 60;
  background: rgba(8,24,44,.97); border-radius: 28rpx 28rpx 0 0;
  display: flex; flex-direction: column;
  border: 1rpx solid rgba($primary,.1);
  box-shadow: 0 -8rpx 48rpx rgba(0,0,0,.5);
  backdrop-filter: blur(30rpx);
  transition: height .35s $ease-out;
  height: 0;
  &.ad-half  { height: 42%; }
  &.ad-full  { height: 82%; }
  &.ad-closed { height: 0; border: none; }
}

/* 拖拽手柄 */
.ad-handle {
  display: flex; justify-content: center; padding: 12rpx 0 4rpx;
  .adh-bar {
    width: 60rpx; height: 6rpx; border-radius: 3rpx;
    background: rgba(255,255,255,.15);
  }
}
.ad-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8rpx 28rpx 12rpx;
  .ad-title { font-size: 30rpx; color: $text-solid; font-weight: 700; }
  .ad-close {
    width: 44rpx; height: 44rpx; border-radius: 50%;
    background: rgba(255,255,255,.06); display: flex;
    align-items: center; justify-content: center;
    text { font-size: 30rpx; color: rgba(255,255,255,.5); }
  }
}

/* 聊天区域 */
.ad-chat-scroll { flex: 1; }
.ad-chat-inner { padding: 0 20rpx; }

/* 欢迎引导 */
.ad-welcome { flex: 1; display: flex; align-items: center; justify-content: center; padding: 0 28rpx; }
.adw-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 12rpx; }
.adw-chip {
  padding: 12rpx 22rpx; border-radius: 24rpx;
  background: rgba(255,255,255,.05); border: 1rpx solid rgba(255,255,255,.06);
  transition: all .15s;
  text { font-size: 24rpx; color: $text-dim; }
  &:active { background: rgba($primary,.12); border-color: rgba($primary,.25); }
}

/* 输入栏 */
.ad-input {
  display: flex; align-items: center; gap: 12rpx;
  padding: 12rpx 20rpx; flex-shrink: 0;
  border-top: 1rpx solid rgba(255,255,255,.04);
  background: rgba(7,19,32,.6);
}
.adi-box {
  flex: 1; height: 68rpx; background: rgba(255,255,255,.05);
  border-radius: 34rpx; padding: 0 24rpx; display: flex; align-items: center;
  border: 1rpx solid rgba(255,255,255,.04);
  .adi-input { flex: 1; font-size: 28rpx; color: $text-solid; }
}
.adi-send {
  height: 60rpx; padding: 0 28rpx; border-radius: 30rpx;
  background: linear-gradient(135deg, $primary, $secondary);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  text { font-size: 26rpx; color: $text-solid; font-weight: 600; }
}

/* 安全区域 */
.safe-area-top { padding-top: env(safe-area-inset-top); }
.safe-area-bottom { padding-bottom: env(safe-area-inset-bottom); }
</style>
