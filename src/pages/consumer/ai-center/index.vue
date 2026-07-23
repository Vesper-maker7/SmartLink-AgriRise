<template>
  <view class="ai-center-page">
    <!-- ============ 背景装饰 ============ -->
    <view class="bg-decor">
      <view class="bg-circle c1"></view>
      <view class="bg-circle c2"></view>
      <view class="bg-grid"></view>
    </view>

    <!-- ============ 首页视图 ============ -->
    <view v-if="currentView === 'home'" class="view-home fade-in">
      <!-- Hero Card -->
      <view class="hero-section">
        <view class="hero-glow"></view>
        <view class="hero-content">
          <view class="hero-badge">
            <text class="badge-dot"></text>
            <text>AI 农业生活中心</text>
          </view>
          <text class="hero-title">让AI陪你健康饮食</text>
          <text class="hero-subtitle">科学选购 · 助力乡村振兴</text>
          <view class="hero-divider"></view>

          <view class="greeting-row">
            <text class="greeting-emoji">👋</text>
            <text class="greeting-text">{{ greeting }}</text>
          </view>

          <view class="daily-tips">
            <view class="tip-item" v-for="tip in dailyTips" :key="tip">
              <text class="tip-check">✓</text>
              <text class="tip-text">{{ tip }}</text>
            </view>
          </view>
        </view>
        <view class="hero-particles">
          <view class="particle" v-for="n in 6" :key="n" :style="particleStyle(n)"></view>
        </view>
      </view>

      <!-- 四个AI能力卡片 -->
      <view class="capabilities-section">
        <text class="section-label">选择AI服务</text>
        <view class="capability-grid">
          <view
            v-for="cap in capabilities"
            :key="cap.id"
            class="cap-card glass-card"
            :style="{ '--card-accent': cap.color }"
            @click="navigateTo(cap.id)"
          >
            <view class="cap-icon-wrap" :style="{ background: cap.color + '18' }">
              <text class="cap-icon">{{ cap.icon }}</text>
            </view>
            <view class="cap-info">
              <text class="cap-name">{{ cap.name }}</text>
              <text class="cap-desc">{{ cap.desc }}</text>
            </view>
            <view class="cap-arrow">
              <text>›</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- ============ AI饮食顾问视图 ============ -->
    <view v-if="currentView === 'diet-advisor'" class="view-sub fade-in">
      <view class="sub-header">
        <view class="back-btn" @click="goHome">
          <text class="back-arrow">‹</text>
        </view>
        <text class="sub-title">AI饮食顾问</text>
        <view class="spacer"></view>
      </view>

      <!-- 步骤指示器 -->
      <view class="step-indicator">
        <view class="step-dot" :class="{ active: dietStep >= 1, done: dietStep > 1 }">
          <text>1</text>
        </view>
        <view class="step-line" :class="{ active: dietStep >= 2 }"></view>
        <view class="step-dot" :class="{ active: dietStep >= 2, done: dietStep > 2 }">
          <text>2</text>
        </view>
        <view class="step-line" :class="{ active: dietStep >= 3 }"></view>
        <view class="step-dot" :class="{ active: dietStep >= 3 }">
          <text>3</text>
        </view>
      </view>

      <!-- Step 1: 选择目标 -->
      <view v-if="dietStep === 1" class="wizard-step fade-in">
        <text class="wizard-question">今天希望解决什么？</text>
        <view class="option-grid col2">
          <view
            v-for="opt in dietGoals"
            :key="opt"
            class="option-card glass-card"
            :class="{ selected: dietForm.goal === opt }"
            @click="dietForm.goal = opt"
          >
            <text class="option-text">{{ opt }}</text>
          </view>
        </view>
        <view class="wizard-actions">
          <button class="btn-primary" :disabled="!dietForm.goal" @click="dietStep = 2">
            下一步
          </button>
        </view>
      </view>

      <!-- Step 2: 基本信息 -->
      <view v-if="dietStep === 2" class="wizard-step fade-in">
        <text class="wizard-question">请选择基本信息</text>
        <view class="form-group">
          <text class="form-label">性别</text>
          <view class="option-row">
            <view
              class="option-tag"
              :class="{ selected: dietForm.gender === '男' }"
              @click="dietForm.gender = '男'"
            ><text>男</text></view>
            <view
              class="option-tag"
              :class="{ selected: dietForm.gender === '女' }"
              @click="dietForm.gender = '女'"
            ><text>女</text></view>
          </view>
        </view>
        <view class="form-group">
          <text class="form-label">年龄</text>
          <view class="option-row wrap">
            <view
              v-for="age in ageOptions"
              :key="age"
              class="option-tag"
              :class="{ selected: dietForm.age === age }"
              @click="dietForm.age = age"
            ><text>{{ age }}</text></view>
          </view>
        </view>
        <view class="form-group">
          <text class="form-label">运动情况</text>
          <view class="option-row">
            <view
              v-for="ex in exerciseOptions"
              :key="ex"
              class="option-tag"
              :class="{ selected: dietForm.exercise === ex }"
              @click="dietForm.exercise = ex"
            ><text>{{ ex }}</text></view>
          </view>
        </view>
        <view class="wizard-actions">
          <button class="btn-outline" @click="dietStep = 1">上一步</button>
          <button class="btn-primary" :disabled="!dietForm.gender || !dietForm.age || !dietForm.exercise" @click="dietStep = 3">
            下一步
          </button>
        </view>
      </view>

      <!-- Step 3: 特殊情况 -->
      <view v-if="dietStep === 3" class="wizard-step fade-in">
        <text class="wizard-question">请选择特殊情况</text>
        <view class="option-grid col2">
          <view
            v-for="opt in specialConditions"
            :key="opt"
            class="option-card glass-card"
            :class="{ selected: dietForm.conditions.includes(opt) }"
            @click="toggleCondition(opt)"
          >
            <text class="option-check">{{ dietForm.conditions.includes(opt) ? '✓' : '' }}</text>
            <text class="option-text">{{ opt }}</text>
          </view>
        </view>
        <view class="wizard-actions">
          <button class="btn-outline" @click="dietStep = 2">上一步</button>
          <button class="btn-primary" @click="generateDietPlan">
            <text v-if="generatingMeal">生成中...</text>
            <text v-else>生成方案</text>
          </button>
        </view>
      </view>

      <!-- 结果展示 -->
      <view v-if="dietStep === 4" class="result-view fade-in">
        <view class="result-card glass-card">
          <text class="result-title">🍽 AI饮食方案</text>
          <view v-for="meal in mealPlan" :key="meal.time" class="meal-block">
            <text class="meal-time">{{ meal.time }}</text>
            <view class="meal-items">
              <text v-for="food in meal.foods" :key="food" class="meal-food">{{ food }}</text>
            </view>
          </view>
        </view>

        <text class="section-label">推荐购买</text>
        <view class="recommend-products">
          <view
            v-for="p in recommendedProducts"
            :key="p.id"
            class="product-mini glass-card"
            @click="goToProduct(p.id)"
          >
            <image :src="p.image" mode="aspectFill" class="pm-img" />
            <view class="pm-info">
              <text class="pm-name">{{ p.name }}</text>
              <text class="pm-price">¥{{ p.price }}</text>
            </view>
            <view class="pm-add" @click.stop="addToCartHandler(p)">
              <text>+</text>
            </view>
          </view>
        </view>

        <view class="chat-prompt glass-card" @click="openFreeChat('我选择的方案是：' + dietForm.goal + '，请给我更多建议')">
          <text class="cp-icon">💬</text>
          <text class="cp-text">继续咨询AI...</text>
          <text class="cp-arrow">›</text>
        </view>
      </view>
    </view>

    <!-- ============ AI营养师视图 ============ -->
    <view v-if="currentView === 'nutritionist'" class="view-sub fade-in">
      <view class="sub-header">
        <view class="back-btn" @click="goHome"><text class="back-arrow">‹</text></view>
        <text class="sub-title">AI营养师</text>
        <view class="spacer"></view>
      </view>

      <view class="step-indicator">
        <view class="step-dot" :class="{ active: nutriStep >= 1, done: nutriStep > 1 }"><text>1</text></view>
        <view class="step-line" :class="{ active: nutriStep >= 2 }"></view>
        <view class="step-dot" :class="{ active: nutriStep >= 2 }"><text>2</text></view>
      </view>

      <!-- Step 1: 分析类型 -->
      <view v-if="nutriStep === 1" class="wizard-step fade-in">
        <text class="wizard-question">请选择分析类型</text>
        <view class="option-list">
          <view
            v-for="t in analysisTypes"
            :key="t"
            class="option-card glass-card"
            :class="{ selected: nutriForm.type === t }"
            @click="nutriForm.type = t"
          >
            <text class="option-text">{{ t }}</text>
          </view>
        </view>
        <view class="wizard-actions">
          <button class="btn-primary" :disabled="!nutriForm.type" @click="nutriStep = 2">下一步</button>
        </view>
      </view>

      <!-- Step 2: 身体数据 -->
      <view v-if="nutriStep === 2" class="wizard-step fade-in">
        <text class="wizard-question">请输入身体信息</text>
        <view class="form-group">
          <text class="form-label">年龄</text>
          <input class="form-input" v-model="nutriForm.age" type="number" placeholder="输入年龄" />
        </view>
        <view class="form-group">
          <text class="form-label">身高 (cm)</text>
          <input class="form-input" v-model="nutriForm.height" type="number" placeholder="输入身高" />
        </view>
        <view class="form-group">
          <text class="form-label">体重 (kg)</text>
          <input class="form-input" v-model="nutriForm.weight" type="number" placeholder="输入体重" />
        </view>
        <view class="wizard-actions">
          <button class="btn-outline" @click="nutriStep = 1">上一步</button>
          <button class="btn-primary" :disabled="!nutriForm.age || !nutriForm.height || !nutriForm.weight" @click="generateNutrition">
            <text v-if="nutriLoading">分析中...</text>
            <text v-else>开始分析</text>
          </button>
        </view>
      </view>

      <!-- 营养分析结果 -->
      <view v-if="nutriStep === 3" class="result-view fade-in">
        <view class="result-card glass-card nutri-score-card">
          <text class="result-title">AI营养评分</text>
          <view class="score-main">
            <view class="score-ring" :style="{ '--score': nutriScore }">
              <text class="score-num">{{ nutriScore }}</text>
              <text class="score-unit">分</text>
            </view>
            <view class="score-stars">★★★★☆</view>
          </view>

          <view class="bmi-row">
            <text class="bmi-label">BMI</text>
            <text class="bmi-value">{{ bmiValue }}</text>
            <view class="bmi-tag" :class="bmiLevel">{{ bmiText }}</view>
          </view>

          <view class="radar-section">
            <text class="radar-title">营养雷达图</text>
            <view class="radar-bars">
              <view v-for="item in radarData" :key="item.name" class="radar-bar-row">
                <text class="rb-label">{{ item.name }}</text>
                <view class="rb-track">
                  <view class="rb-fill" :style="{ width: item.value + '%', background: item.color }"></view>
                </view>
                <text class="rb-star">{{ item.stars }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- AI建议 -->
        <view class="result-card glass-card">
          <text class="result-title">💡 AI建议</text>
          <view class="advice-section">
            <text class="advice-label type-add">增加摄入</text>
            <view class="advice-items">
              <text v-for="item in nutriAdvice.add" :key="item" class="advice-item-add">{{ item }}</text>
            </view>
          </view>
          <view class="advice-section">
            <text class="advice-label type-reduce">减少摄入</text>
            <view class="advice-items">
              <text v-for="item in nutriAdvice.reduce" :key="item" class="advice-item-reduce">{{ item }}</text>
            </view>
          </view>
        </view>

        <text class="section-label">推荐购买</text>
        <view class="recommend-products">
          <view
            v-for="p in nutriProducts"
            :key="p.id"
            class="product-mini glass-card"
            @click="goToProduct(p.id)"
          >
            <image :src="p.image" mode="aspectFill" class="pm-img" />
            <view class="pm-info">
              <text class="pm-name">{{ p.name }}</text>
              <text class="pm-price">¥{{ p.price }}</text>
            </view>
            <view class="pm-add" @click.stop="addToCartHandler(p)">
              <text>+</text>
            </view>
          </view>
        </view>

        <view class="chat-prompt glass-card" @click="openFreeChat('根据我的营养分析结果，请给我更多建议')">
          <text class="cp-icon">💬</text>
          <text class="cp-text">继续咨询AI...</text>
          <text class="cp-arrow">›</text>
        </view>
      </view>
    </view>

    <!-- ============ AI智能选购视图 ============ -->
    <view v-if="currentView === 'smart-shopping'" class="view-sub fade-in">
      <view class="sub-header">
        <view class="back-btn" @click="goHome"><text class="back-arrow">‹</text></view>
        <text class="sub-title">AI智能选购</text>
        <view class="spacer"></view>
      </view>

      <view class="step-indicator">
        <view class="step-dot" :class="{ active: shopStep >= 1, done: shopStep > 1 }"><text>1</text></view>
        <view class="step-line" :class="{ active: shopStep >= 2 }"></view>
        <view class="step-dot" :class="{ active: shopStep >= 2, done: shopStep > 2 }"><text>2</text></view>
        <view class="step-line" :class="{ active: shopStep >= 3 }"></view>
        <view class="step-dot" :class="{ active: shopStep >= 3 }"><text>3</text></view>
      </view>

      <!-- Step 1: 品类 -->
      <view v-if="shopStep === 1" class="wizard-step fade-in">
        <text class="wizard-question">今天准备买什么？</text>
        <view class="option-grid col2">
          <view
            v-for="cat in shopCategories"
            :key="cat"
            class="option-card glass-card"
            :class="{ selected: shopForm.category === cat }"
            @click="shopForm.category = cat"
          >
            <text class="option-text">{{ cat }}</text>
          </view>
        </view>
        <view class="wizard-actions">
          <button class="btn-primary" :disabled="!shopForm.category" @click="shopStep = 2">下一步</button>
        </view>
      </view>

      <!-- Step 2: 用途 -->
      <view v-if="shopStep === 2" class="wizard-step fade-in">
        <text class="wizard-question">购买用途</text>
        <view class="option-grid col2">
          <view
            v-for="purpose in shopPurposes"
            :key="purpose"
            class="option-card glass-card"
            :class="{ selected: shopForm.purpose === purpose }"
            @click="shopForm.purpose = purpose"
          >
            <text class="option-text">{{ purpose }}</text>
          </view>
        </view>
        <view class="wizard-actions">
          <button class="btn-outline" @click="shopStep = 1">上一步</button>
          <button class="btn-primary" :disabled="!shopForm.purpose" @click="shopStep = 3">下一步</button>
        </view>
      </view>

      <!-- Step 3: 预算 -->
      <view v-if="shopStep === 3" class="wizard-step fade-in">
        <text class="wizard-question">预算范围</text>
        <view class="option-list">
          <view
            v-for="budget in budgets"
            :key="budget"
            class="option-card glass-card"
            :class="{ selected: shopForm.budget === budget }"
            @click="shopForm.budget = budget"
          >
            <text class="option-text">{{ budget }}</text>
          </view>
        </view>
        <view class="wizard-actions">
          <button class="btn-outline" @click="shopStep = 2">上一步</button>
          <button class="btn-primary" @click="generateShopping">
            <text v-if="shopLoading">推荐中...</text>
            <text v-else>AI 推荐</text>
          </button>
        </view>
      </view>

      <!-- 推荐结果 -->
      <view v-if="shopStep === 4" class="result-view fade-in">
        <text class="section-label">AI 为您推荐</text>
        <view class="shop-result-list">
          <view
            v-for="(p, idx) in shopResults"
            :key="p.id"
            class="shop-result-card glass-card"
            @click="goToProduct(p.id)"
          >
            <view class="sr-rank" :style="{ background: rankColors[idx] }">
              <text>{{ idx + 1 }}</text>
            </view>
            <image :src="p.image" mode="aspectFill" class="sr-img" />
            <view class="sr-info">
              <text class="sr-name">{{ p.name }}</text>
              <view class="sr-stars-row">
                <text class="sr-star">★</text>
                <text class="sr-star" v-if="idx < 2">★</text>
                <text class="sr-star" v-if="idx === 0">★</text>
                <text class="sr-star" v-if="idx === 0">★</text>
                <text class="sr-star" v-if="idx === 0">★</text>
                <text class="sr-score">{{ p.aiScore }}分</text>
              </view>
              <text class="sr-reason">{{ p.reason }}</text>
            </view>
            <view class="sr-price">
              <text class="sr-price-label">¥</text>
              <text class="sr-price-val">{{ p.price }}</text>
            </view>
            <view class="sr-add" @click.stop="addToCartHandler(p)">
              <text>+</text>
            </view>
          </view>
        </view>

        <view class="quick-actions-row">
          <button class="btn-outline-small" @click="addAllToCart">一键加入购物车</button>
        </view>

        <view class="chat-prompt glass-card" @click="openFreeChat('关于' + shopForm.category + '的选购，还有更多问题')">
          <text class="cp-icon">💬</text>
          <text class="cp-text">继续咨询AI...</text>
          <text class="cp-arrow">›</text>
        </view>
      </view>
    </view>

    <!-- ============ AI自由咨询视图 ============ -->
    <view v-if="currentView === 'free-chat'" class="view-sub fade-in chat-view">
      <view class="sub-header">
        <view class="back-btn" @click="goHome"><text class="back-arrow">‹</text></view>
        <text class="sub-title">AI自由咨询</text>
        <view class="spacer"></view>
      </view>

      <!-- 上下文标签 -->
      <view v-if="chatContext" class="context-tag">
        <text class="ctx-label">上下文已关联</text>
        <text class="ctx-text">{{ chatContext }}</text>
      </view>

      <!-- 快捷问题 -->
      <view v-if="chatMessages.length <= 1" class="quick-questions">
        <text class="qq-title">最近咨询</text>
        <view class="qq-list">
          <view
            v-for="q in quickQuestions"
            :key="q"
            class="qq-item glass-card"
            @click="sendQuickQuestion(q)"
          >
            <text>{{ q }}</text>
          </view>
        </view>
      </view>

      <!-- 消息列表 -->
      <scroll-view class="chat-messages" scroll-y :scroll-top="scrollTop" :scroll-with-animation="true">
        <view v-for="(msg, idx) in chatMessages" :key="idx" class="msg-wrapper">
          <!-- AI消息 -->
          <view v-if="msg.role === 'ai'" class="msg-ai">
            <view class="msg-ai-avatar">
              <text>🌿</text>
            </view>
            <view class="msg-ai-bubble">
              <text class="msg-text">{{ msg.text }}</text>
            </view>
          </view>
          <!-- 用户消息 -->
          <view v-else class="msg-user">
            <view class="msg-user-bubble">
              <text class="msg-text">{{ msg.text }}</text>
            </view>
            <view class="msg-user-avatar">
              <text>👤</text>
            </view>
          </view>
        </view>

        <!-- 打字指示器 -->
        <view v-if="chatTyping" class="msg-wrapper">
          <view class="msg-ai">
            <view class="msg-ai-avatar"><text>🌿</text></view>
            <view class="msg-ai-bubble typing-bubble">
              <view class="typing-dot"></view>
              <view class="typing-dot"></view>
              <view class="typing-dot"></view>
            </view>
          </view>
        </view>

        <view class="msg-spacer"></view>
      </scroll-view>

      <!-- 输入框 -->
      <view class="chat-input-bar">
        <input
          class="chat-input"
          v-model="chatInputText"
          placeholder="输入您的问题..."
          confirm-type="send"
          @confirm="sendChatMessage"
        />
        <view class="chat-send-btn" :class="{ disabled: !chatInputText.trim() || chatTyping }" @click="sendChatMessage">
          <text>发送</text>
        </view>
      </view>
    </view>

    <!-- ============ 底部TabBar ============ -->
    <view class="tab-bar-safe"></view>
    <CustomTabBar page="ai-center" />
  </view>
</template>

<script setup>
import { ref, computed, reactive, onMounted, nextTick } from 'vue'
import { useUserStore } from '@/store/user.js'
import { useProductStore } from '@/store/product.js'
import { useChatStore } from '@/store/chat.js'
import CustomTabBar from '@/components/CustomTabBar.vue'

const userStore = useUserStore()
const productStore = useProductStore()
const chatStore = useChatStore()

// ============ 视图状态 ============
const currentView = ref('home') // 'home' | 'diet-advisor' | 'nutritionist' | 'smart-shopping' | 'free-chat'

// ============ 问候 ============
const greeting = computed(() => {
  const hour = new Date().getHours()
  const name = userStore.userInfo?.name || '用户'
  const prefix = hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好'
  return `${prefix}，${name}`
})

const dailyTips = ref([
  '今日适合补充维生素C',
  '推荐云南蓝莓',
  '广东荔枝今日上市'
])

// ============ 能力卡片 ============
const capabilities = ref([
  { id: 'diet-advisor', name: 'AI饮食顾问', desc: '制定专属饮食方案', icon: '🍽', color: '#16C47F' },
  { id: 'nutritionist',  name: 'AI营养师',   desc: '分析身体状况',     icon: '🥗', color: '#0A84FF' },
  { id: 'smart-shopping',name: 'AI智能选购',  desc: '根据需求推荐商品', icon: '🛒', color: '#F59E0B' },
  { id: 'free-chat',     name: 'AI自由咨询',  desc: '随时随地问AI',     icon: '💬', color: '#00D4AA' }
])

// ============ 粒子动画 ============
function particleStyle(n) {
  const left = Math.random() * 90 + 5
  const delay = Math.random() * 3
  const size = Math.random() * 8 + 4
  return {
    left: left + '%',
    top: Math.random() * 60 + 20 + '%',
    width: size + 'rpx',
    height: size + 'rpx',
    animationDelay: delay + 's',
    opacity: Math.random() * 0.5 + 0.2
  }
}

// ============ 导航 ============
function navigateTo(view) {
  currentView.value = view
  if (view === 'free-chat') resetChat()
}

function goHome() {
  currentView.value = 'home'
}

function goToProduct(id) {
  uni.navigateTo({ url: `/pages/consumer/mall/detail?id=${id}` })
}

function addToCartHandler(product) {
  productStore.addToCart(product, 1)
}

function addAllToCart() {
  shopResults.value.forEach(p => productStore.addToCart(p, 1))
  uni.showToast({ title: '已全部加入购物车', icon: 'success' })
}

// ============ AI饮食顾问 ============
const dietStep = ref(1)
const generatingMeal = ref(false)

const dietForm = reactive({
  goal: '',
  gender: '',
  age: '',
  exercise: '',
  conditions: []
})

const dietGoals = ['今天吃什么', '减脂', '增肌', '控糖', '老人养生', '儿童营养', '孕妇饮食', '提高免疫力']
const ageOptions = ['18岁以下', '18-25', '26-35', '36-45', '46-60', '60岁以上']
const exerciseOptions = ['很少运动', '偶尔运动', '经常运动', '专业健身']
const specialConditions = ['糖尿病', '高血压', '素食', '海鲜过敏', '无']

function toggleCondition(cond) {
  if (cond === '无') {
    dietForm.conditions = ['无']
  } else {
    dietForm.conditions = dietForm.conditions.filter(c => c !== '无')
    const idx = dietForm.conditions.indexOf(cond)
    if (idx > -1) {
      dietForm.conditions.splice(idx, 1)
    } else {
      dietForm.conditions.push(cond)
    }
  }
}

const mealPlan = ref([])

function generateDietPlan() {
  generatingMeal.value = true
  setTimeout(() => {
    mealPlan.value = [
      { time: '早餐', foods: ['燕麦', '鸡蛋', '牛奶'] },
      { time: '午餐', foods: ['山药', '鸡胸肉', '西兰花'] },
      { time: '晚餐', foods: ['番茄', '牛肉', '苹果'] }
    ]
    // 根据目标调整
    if (dietForm.goal === '减脂') {
      mealPlan.value = [
        { time: '早餐', foods: ['全麦面包', '鸡蛋白', '酸奶'] },
        { time: '午餐', foods: ['鸡胸肉', '藜麦', '芦笋'] },
        { time: '晚餐', foods: ['三文鱼', '西兰花', '蓝莓'] }
      ]
    } else if (dietForm.goal === '增肌') {
      mealPlan.value = [
        { time: '早餐', foods: ['全麦吐司', '鸡蛋x3', '牛奶'] },
        { time: '午餐', foods: ['鸡胸肉', '糙米饭', '菠菜'] },
        { time: '晚餐', foods: ['牛排', '红薯', '西兰花'] }
      ]
    } else if (dietForm.goal === '老人养生') {
      mealPlan.value = [
        { time: '早餐', foods: ['小米粥', '蒸蛋', '核桃'] },
        { time: '午餐', foods: ['清蒸鱼', '山药', '青菜'] },
        { time: '晚餐', foods: ['杂粮粥', '豆腐', '红枣'] }
      ]
    }
    generatingMeal.value = false
    dietStep.value = 4
  }, 1500)
}

const recommendedProducts = computed(() => {
  return productStore.productList?.slice(0, 3).map(p => ({
    id: p.id, name: p.name, image: p.image, price: p.price
  })) || []
})

// ============ AI营养师 ============
const nutriStep = ref(1)
const nutriLoading = ref(false)
const nutriScore = ref(0)
const bmiValue = ref('--')
const bmiLevel = ref('normal')
const bmiText = ref('正常')

const nutriForm = reactive({
  type: '',
  age: '',
  height: '',
  weight: ''
})

const analysisTypes = ['营养分析', '身体评估', '健康报告', '一周饮食']

const radarData = ref([
  { name: '蛋白质', value: 0, stars: '★★★★☆', color: '#16C47F' },
  { name: '维生素', value: 0, stars: '★★★☆☆', color: '#0A84FF' },
  { name: '矿物质', value: 0, stars: '★★★★★', color: '#F59E0B' },
  { name: '膳食纤维', value: 0, stars: '★★★☆☆', color: '#00D4AA' }
])

const nutriAdvice = reactive({ add: ['蓝莓', '菠菜', '燕麦'], reduce: ['高糖饮料'] })

const nutriProducts = computed(() => {
  return productStore.productList?.slice(1, 4).map(p => ({
    id: p.id, name: p.name, image: p.image, price: p.price
  })) || []
})

function generateNutrition() {
  nutriLoading.value = true
  setTimeout(() => {
    nutriScore.value = 88
    const h = Number(nutriForm.height) / 100
    const w = Number(nutriForm.weight)
    const bmi = (w / (h * h)).toFixed(1)
    bmiValue.value = bmi
    if (bmi < 18.5) { bmiLevel.value = 'under'; bmiText.value = '偏瘦' }
    else if (bmi < 24) { bmiLevel.value = 'normal'; bmiText.value = '正常' }
    else if (bmi < 28) { bmiLevel.value = 'over'; bmiText.value = '偏重' }
    else { bmiLevel.value = 'obese'; bmiText.value = '肥胖' }
    radarData.value = [
      { name: '蛋白质', value: 78, stars: '★★★★☆', color: '#16C47F' },
      { name: '维生素', value: 55, stars: '★★★☆☆', color: '#0A84FF' },
      { name: '矿物质', value: 90, stars: '★★★★★', color: '#F59E0B' },
      { name: '膳食纤维', value: 62, stars: '★★★☆☆', color: '#00D4AA' }
    ]
    nutriAdvice.add = ['蓝莓', '菠菜', '燕麦']
    nutriAdvice.reduce = ['高糖饮料', '油炸食品']
    nutriLoading.value = false
    nutriStep.value = 3
  }, 1800)
}

// ============ AI智能选购 ============
const shopStep = ref(1)
const shopLoading = ref(false)

const shopForm = reactive({
  category: '',
  purpose: '',
  budget: ''
})

const shopCategories = ['水果', '茶叶', '礼盒', '五谷', '调味品']
const shopPurposes = ['自己吃', '送父母', '送朋友', '儿童', '健身', '企业采购']
const budgets = ['50以内', '50-100', '100-200', '200-500', '500+']
const rankColors = ['#F59E0B', '#94A3B8', '#CDA58E']

const shopResults = ref([])

function generateShopping() {
  shopLoading.value = true
  setTimeout(() => {
    const products = productStore.productList || []
    const shuffled = [...products].sort(() => Math.random() - 0.5).slice(0, 3)
    const reasons = [
      '当季新鲜 评价高 符合预算',
      '有机种植 产地直发 性价比高',
      '优质品控 适合送礼 回购率高'
    ]
    shopResults.value = shuffled.map((p, idx) => ({
      id: p.id,
      name: p.name,
      image: p.image,
      price: p.price,
      aiScore: 98 - idx * 3,
      reason: reasons[idx]
    }))
    shopLoading.value = false
    shopStep.value = 4
  }, 1200)
}

// ============ AI自由咨询 ============
const chatMessages = ref([])
const chatInputText = ref('')
const chatTyping = ref(false)
const scrollTop = ref(0)
const chatContext = ref('')

const quickQuestions = ref([
  '今天吃什么？',
  '推荐当季水果？',
  '适合老人吃什么？',
  '如何挑选苹果？',
  '什么农产品最健康？'
])

function resetChat() {
  chatMessages.value = [{
    role: 'ai',
    text: '你好！我是智链兴农的AI助手 🌿\n我可以根据你的需求，帮你健康饮食、科学选购。有什么想了解的吗？'
  }]
  chatContext.value = ''
}

function openFreeChat(contextText) {
  currentView.value = 'free-chat'
  chatContext.value = contextText
  chatMessages.value = [{
    role: 'ai',
    text: `你好！我已经了解了你刚才的选择，可以继续深入交流。${contextText ? '你想了解更多关于"' + contextText + '"的内容吗？' : '有什么可以帮你的？'}`
  }]
}

function sendQuickQuestion(q) {
  chatInputText.value = q
  sendChatMessage()
}

async function sendChatMessage() {
  const text = chatInputText.value.trim()
  if (!text || chatTyping.value) return

  chatMessages.value.push({ role: 'user', text, timestamp: Date.now() })
  chatInputText.value = ''
  chatTyping.value = true

  scrollToBottom()

  // 调用现有的 chat API
  setTimeout(async () => {
    try {
      const response = await generateAIResponse(text)
      chatMessages.value.push({ role: 'ai', text: response, timestamp: Date.now() })
    } catch (e) {
      chatMessages.value.push({ role: 'ai', text: '抱歉，网络开小差了～请稍后重试', timestamp: Date.now() })
    }
    chatTyping.value = false
    scrollToBottom()
  }, 800 + Math.random() * 1200)
}

function generateAIResponse(query) {
  // 模拟AI响应
  const q = query.toLowerCase()
  if (q.includes('吃什么') || q.includes('推荐')) {
    return '根据你的偏好和当前季节，我推荐你可以尝试：\n\n🥬 当季蔬菜：空心菜、苦瓜、丝瓜\n🍎 当季水果：荔枝、芒果、西瓜\n🥩 优质蛋白：土鸡蛋、草鱼\n\n这些都来自我们的合作农户，新鲜直发！\n\n需要我帮你加入购物车吗？'
  }
  if (q.includes('老人') || q.includes('养生')) {
    return '为老人选择农产品，建议关注：\n\n🌿 宁夏枸杞 — 滋补肝肾\n🍯 土蜂蜜 — 增强免疫\n🌾 有机小米 — 养胃好消化\n🍵 养生花茶 — 清热明目\n\n需要我为你推荐具体商品吗？'
  }
  if (q.includes('减肥') || q.includes('减脂')) {
    return '减脂期间推荐以下食材：\n\n🥦 西兰花 — 低卡高纤维\n🥒 黄瓜 — 超低热量\n🍠 红薯 — 替代主食\n🥚 土鸡蛋 — 优质蛋白\n\n建议少食多餐，每餐配合运动效果更佳！'
  }
  return '感谢你的咨询！🌿\n\n在智链兴农平台，我们提供：\n• 产地直发的优质农产品\n• AI智能营养分析\n• 全生命周期溯源\n• 科学的饮食建议\n\n你可以试试我们的"AI智能选购"功能，让我帮你精准选品！'
}

function scrollToBottom() {
  nextTick(() => {
    scrollTop.value = 99999
  })
}

// ============ 初始化 ============
onMounted(() => {
  resetChat()
})
</script>

<style lang="scss" scoped>
// ==================== 全局变量 ====================
$primary: #16C47F;
$ai-blue: #0A84FF;
$accent: #00D4AA;
$warm: #F59E0B;
$bg: #F0F7F5;
$text: #0F172A;
$text-secondary: #64748B;
$border: #E2E8F0;
$radius: 24rpx;

// ==================== 页面容器 ====================
.ai-center-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #E8F4EC 0%, $bg 30%, #FAFBFC 100%);
  position: relative;
  overflow-x: hidden;
  padding-bottom: 140rpx;
}

// ==================== 背景装饰 ====================
.bg-decor {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  pointer-events: none; z-index: 0; overflow: hidden;
}

.bg-circle {
  position: absolute; border-radius: 50%;
  &.c1 {
    width: 500rpx; height: 500rpx;
    background: radial-gradient(circle, rgba(22,196,127,.06) 0%, transparent 70%);
    top: -100rpx; right: -150rpx;
  }
  &.c2 {
    width: 400rpx; height: 400rpx;
    background: radial-gradient(circle, rgba(10,132,255,.05) 0%, transparent 70%);
    bottom: 200rpx; left: -100rpx;
  }
}

.bg-grid {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background-image:
    linear-gradient(rgba(22,196,127,.03) 1rpx, transparent 1rpx),
    linear-gradient(90deg, rgba(22,196,127,.03) 1rpx, transparent 1rpx);
  background-size: 48rpx 48rpx;
}

// ==================== 动画 ====================
.fade-in {
  animation: fadeInUp .4s ease;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24rpx); }
  to   { opacity: 1; transform: translateY(0); }
}

// ==================== Hero Section ====================
.hero-section {
  position: relative; z-index: 2;
  margin: 24rpx 24rpx 0;
  border-radius: 36rpx;
  background: linear-gradient(145deg, #0C1F3A 0%, #0A1628 40%, #0D2645 100%);
  overflow: hidden;
  padding: 48rpx 36rpx 40rpx;
  box-shadow: 0 8rpx 48rpx rgba(10,20,40,.25);
}

.hero-glow {
  position: absolute; top: -60%; right: -30%;
  width: 400rpx; height: 400rpx;
  background: radial-gradient(circle, rgba(22,196,127,.2) 0%, transparent 70%);
  border-radius: 50%;
}

.hero-content {
  position: relative; z-index: 2;
}

.hero-badge {
  display: inline-flex; align-items: center; gap: 10rpx;
  background: rgba(22,196,127,.15);
  border: 1rpx solid rgba(22,196,127,.25);
  border-radius: 40rpx;
  padding: 8rpx 20rpx;
  margin-bottom: 24rpx;

  text {
    font-size: 22rpx; color: #16C47F; font-weight: 600;
  }
}

.badge-dot {
  display: inline-block;
  width: 12rpx; height: 12rpx;
  border-radius: 50%;
  background: #16C47F;
  box-shadow: 0 0 12rpx rgba(22,196,127,.6);
  animation: breath 2s ease infinite;
}

@keyframes breath {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: .5; transform: scale(1.4); }
}

.hero-title {
  display: block;
  font-size: 44rpx; font-weight: 800;
  color: #fff; line-height: 1.3;
  margin-bottom: 8rpx;
}

.hero-subtitle {
  display: block;
  font-size: 26rpx; color: rgba(255,255,255,.55);
  letter-spacing: 2rpx;
}

.hero-divider {
  width: 60rpx; height: 4rpx;
  background: linear-gradient(90deg, #16C47F, #00D4AA);
  border-radius: 4rpx;
  margin: 28rpx 0 24rpx;
}

.greeting-row {
  display: flex; align-items: center; gap: 12rpx;
  margin-bottom: 20rpx;

  .greeting-emoji { font-size: 36rpx; }
  .greeting-text { font-size: 30rpx; color: rgba(255,255,255,.9); font-weight: 600; }
}

.daily-tips {
  display: flex; flex-direction: column; gap: 12rpx;
}

.tip-item {
  display: flex; align-items: center; gap: 12rpx;

  .tip-check {
    width: 32rpx; height: 32rpx;
    background: rgba(22,196,127,.2);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 18rpx; color: #16C47F; font-weight: 700;
    flex-shrink: 0;
  }

  .tip-text {
    font-size: 24rpx; color: rgba(255,255,255,.7);
  }
}

.hero-particles {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(22,196,127,.3);
  animation: floatUp 3s ease-in-out infinite;
}

@keyframes floatUp {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20rpx) scale(1.5); opacity: .1; }
}

// ==================== Glass Card 通用 ====================
.glass-card {
  background: rgba(255,255,255,.72);
  backdrop-filter: blur(24rpx);
  -webkit-backdrop-filter: blur(24rpx);
  border: 1rpx solid rgba(255,255,255,.6);
  border-radius: $radius;
  box-shadow: 0 2rpx 20rpx rgba(0,0,0,.04);
  transition: all .2s ease;

  &:active {
    transform: scale(.97);
    box-shadow: 0 4rpx 28rpx rgba(0,0,0,.08);
  }
}

// ==================== 能力卡片区域 ====================
.capabilities-section {
  position: relative; z-index: 2;
  padding: 0 24rpx;
  margin-top: 32rpx;
}

.section-label {
  display: block;
  font-size: 28rpx; font-weight: 700;
  color: $text;
  margin-bottom: 20rpx;
  padding-left: 8rpx;
}

.capability-grid {
  display: flex; flex-direction: column; gap: 16rpx;
}

.cap-card {
  display: flex; align-items: center;
  padding: 28rpx 24rpx;
  border-left: 6rpx solid var(--card-accent, #16C47F);

  .cap-icon-wrap {
    width: 80rpx; height: 80rpx;
    border-radius: 22rpx;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;

    .cap-icon { font-size: 40rpx; }
  }

  .cap-info {
    flex: 1; margin-left: 20rpx;

    .cap-name {
      display: block;
      font-size: 28rpx; font-weight: 700; color: $text;
      margin-bottom: 4rpx;
    }

    .cap-desc {
      font-size: 22rpx; color: $text-secondary;
    }
  }

  .cap-arrow {
    font-size: 40rpx; color: $text-secondary; opacity: .5;
  }
}

// ==================== 子视图通用 ====================
.view-sub {
  position: relative; z-index: 2;
  padding: 0 24rpx;
  padding-top: 20rpx;
}

.sub-header {
  display: flex; align-items: center;
  padding: 16rpx 0 24rpx;

  .back-btn {
    width: 60rpx; height: 60rpx;
    background: rgba(255,255,255,.8);
    border-radius: 18rpx;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2rpx 12rpx rgba(0,0,0,.04);

    &:active { transform: scale(.92); }
  }

  .back-arrow {
    font-size: 44rpx; color: $text; font-weight: 300;
    line-height: 1;
    margin-top: -4rpx;
  }

  .sub-title {
    flex: 1; text-align: center;
    font-size: 32rpx; font-weight: 700; color: $text;
  }

  .spacer { width: 60rpx; }
}

// ==================== 步骤指示器 ====================
.step-indicator {
  display: flex; align-items: center; justify-content: center;
  padding: 12rpx 0 32rpx; gap: 0;
}

.step-dot {
  width: 48rpx; height: 48rpx;
  border-radius: 50%;
  background: $border;
  display: flex; align-items: center; justify-content: center;
  font-size: 22rpx; color: #94A3B8; font-weight: 600;
  transition: all .3s ease;

  &.active {
    background: $primary; color: #fff;
    box-shadow: 0 4rpx 16rpx rgba(22,196,127,.3);
  }

  &.done {
    background: $accent; color: #fff;
  }
}

.step-line {
  width: 80rpx; height: 3rpx;
  background: $border;
  transition: all .3s ease;

  &.active { background: $primary; }
}

// ==================== 向导步骤 ====================
.wizard-step {
  padding: 0 8rpx;
}

.wizard-question {
  display: block;
  font-size: 30rpx; font-weight: 700; color: $text;
  margin-bottom: 28rpx;
  text-align: center;
}

.option-grid {
  display: flex; flex-wrap: wrap; gap: 16rpx;

  &.col2 .option-card { width: calc(50% - 8rpx); }
}

.option-list {
  display: flex; flex-direction: column; gap: 14rpx;
}

.option-card {
  padding: 28rpx 24rpx;
  text-align: center;
  position: relative;

  &.selected {
    border-color: $primary;
    background: rgba(22,196,127,.06);
    box-shadow: 0 0 0 2rpx $primary;

    .option-text { color: $primary; font-weight: 700; }
  }

  &:active { transform: scale(.96); }
}

.option-check {
  position: absolute; top: 14rpx; right: 20rpx;
  font-size: 22rpx; color: $primary; font-weight: 700;
}

.option-text {
  font-size: 26rpx; color: $text; font-weight: 500;
}

.option-row {
  display: flex; gap: 14rpx;
  flex-wrap: wrap;

  &.wrap { flex-wrap: wrap; }
}

.option-tag {
  padding: 14rpx 28rpx;
  border-radius: 20rpx;
  background: rgba(255,255,255,.7);
  border: 1rpx solid $border;
  font-size: 24rpx; color: $text-secondary;
  transition: all .2s ease;

  &.selected {
    background: rgba(22,196,127,.08);
    border-color: $primary;
    color: $primary;
    font-weight: 600;
  }

  &:active { transform: scale(.94); }
}

// ==================== 表单 ====================
.form-group {
  margin-bottom: 24rpx;

  .form-label {
    display: block;
    font-size: 24rpx; color: $text-secondary;
    margin-bottom: 12rpx; font-weight: 500;
    padding-left: 4rpx;
  }

  .form-input {
    width: 100%; height: 88rpx;
    background: rgba(255,255,255,.8);
    border: 1rpx solid $border;
    border-radius: 20rpx;
    padding: 0 24rpx;
    font-size: 28rpx; color: $text;
    box-sizing: border-box;

    &:focus { border-color: $primary; }
  }
}

// ==================== 按钮 ====================
.wizard-actions {
  display: flex; gap: 20rpx;
  margin-top: 40rpx;
  padding: 0 16rpx;
}

.btn-primary {
  flex: 1;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 24rpx;
  border: none;
  background: linear-gradient(135deg, #16C47F, #0D9E5E);
  color: #fff;
  font-size: 28rpx; font-weight: 700;
  box-shadow: 0 6rpx 24rpx rgba(22,196,127,.3);

  &[disabled] {
    opacity: .4;
    box-shadow: none;
  }

  &:active:not([disabled]) {
    transform: scale(.96);
  }
}

.btn-outline {
  flex: 1;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 24rpx;
  border: 2rpx solid $border;
  background: rgba(255,255,255,.6);
  color: $text-secondary;
  font-size: 28rpx; font-weight: 600;

  &:active { transform: scale(.96); }
}

.btn-outline-small {
  height: 72rpx;
  padding: 0 36rpx;
  border-radius: 20rpx;
  border: 2rpx solid $primary;
  background: rgba(22,196,127,.06);
  color: $primary;
  font-size: 26rpx; font-weight: 600;

  &:active { transform: scale(.95); }
}

.quick-actions-row {
  display: flex; justify-content: center;
  margin-top: 24rpx;
}

// ==================== 结果视图 ====================
.result-view {
  padding: 0 8rpx;
}

.result-card {
  padding: 32rpx 28rpx;
  margin-bottom: 24rpx;
}

.result-title {
  display: block;
  font-size: 28rpx; font-weight: 700; color: $text;
  margin-bottom: 24rpx;
}

// ==================== 饮食方案 ====================
.meal-block {
  margin-bottom: 20rpx;

  &:last-child { margin-bottom: 0; }

  .meal-time {
    display: block;
    font-size: 24rpx; color: $primary; font-weight: 700;
    margin-bottom: 10rpx;
  }

  .meal-items {
    display: flex; flex-wrap: wrap; gap: 12rpx;
  }

  .meal-food {
    padding: 10rpx 22rpx;
    background: rgba(22,196,127,.07);
    border-radius: 16rpx;
    font-size: 24rpx; color: $text;
    border: 1rpx solid rgba(22,196,127,.15);
  }
}

// ==================== 推荐商品 ====================
.recommend-products {
  display: flex; flex-direction: column; gap: 14rpx;
  margin-bottom: 24rpx;
}

.product-mini {
  display: flex; align-items: center;
  padding: 16rpx 20rpx;

  .pm-img {
    width: 80rpx; height: 80rpx;
    border-radius: 16rpx;
    background: #eee;
    flex-shrink: 0;
  }

  .pm-info {
    flex: 1; margin-left: 16rpx;

    .pm-name {
      display: block;
      font-size: 26rpx; color: $text; font-weight: 600;
    }

    .pm-price {
      font-size: 28rpx; color: #E53935; font-weight: 700;
    }
  }

  .pm-add {
    width: 56rpx; height: 56rpx;
    border-radius: 50%;
    background: $primary;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;

    text { font-size: 36rpx; color: #fff; line-height: 1; }

    &:active { transform: scale(.88); }
  }
}

// ==================== 聊聊提示 ====================
.chat-prompt {
  display: flex; align-items: center;
  padding: 24rpx 28rpx;
  margin-top: 8rpx;

  .cp-icon { font-size: 36rpx; margin-right: 14rpx; }
  .cp-text {
    flex: 1;
    font-size: 26rpx; color: $text-secondary; font-weight: 500;
  }
  .cp-arrow {
    font-size: 36rpx; color: $text-secondary; opacity: .4;
  }
}

// ==================== 营养评分 ====================
.nutri-score-card {
  text-align: center;
}

.score-main {
  display: flex; flex-direction: column; align-items: center;
  margin-bottom: 28rpx;
}

.score-ring {
  width: 160rpx; height: 160rpx;
  border-radius: 50%;
  background: conic-gradient(#16C47F calc(var(--score, 0) * 1%), #E8F5E9 0);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    width: 120rpx; height: 120rpx;
    border-radius: 50%;
    background: #fff;
  }

  .score-num {
    position: relative; z-index: 2;
    font-size: 48rpx; font-weight: 800; color: $text;
  }

  .score-unit {
    position: relative; z-index: 2;
    font-size: 20rpx; color: $text-secondary;
  }
}

.score-stars {
  font-size: 36rpx; color: #F59E0B;
  margin-top: 16rpx;
  letter-spacing: 4rpx;
}

.bmi-row {
  display: flex; align-items: center; justify-content: center;
  gap: 16rpx;
  margin-bottom: 32rpx;

  .bmi-label {
    font-size: 24rpx; color: $text-secondary;
  }

  .bmi-value {
    font-size: 36rpx; font-weight: 800; color: $text;
  }

  .bmi-tag {
    padding: 6rpx 16rpx;
    border-radius: 12rpx;
    font-size: 20rpx; font-weight: 600;

    &.normal { background: rgba(22,196,127,.1); color: $primary; }
    &.under  { background: rgba(10,132,255,.1); color: $ai-blue; }
    &.over   { background: rgba(245,158,11,.1); color: $warm; }
    &.obese  { background: rgba(239,68,68,.1); color: #EF4444; }
  }
}

.radar-section {
  text-align: left;
}

.radar-title {
  display: block;
  font-size: 24rpx; font-weight: 700; color: $text;
  margin-bottom: 16rpx;
}

.radar-bars {
  display: flex; flex-direction: column; gap: 14rpx;
}

.radar-bar-row {
  display: flex; align-items: center; gap: 14rpx;

  .rb-label {
    width: 120rpx;
    font-size: 22rpx; color: $text-secondary;
    flex-shrink: 0;
  }

  .rb-track {
    flex: 1; height: 16rpx;
    background: #F1F5F9;
    border-radius: 8rpx;
    overflow: hidden;
  }

  .rb-fill {
    height: 100%;
    border-radius: 8rpx;
    transition: width .8s ease;
  }

  .rb-star {
    font-size: 20rpx; color: $warm;
    flex-shrink: 0; width: 140rpx;
  }
}

.advice-section {
  margin-bottom: 20rpx;

  &:last-child { margin-bottom: 0; }
}

.advice-label {
  display: block;
  font-size: 22rpx; font-weight: 600;
  margin-bottom: 10rpx;
  padding-left: 4rpx;

  &.type-add { color: $primary; }
  &.type-reduce { color: #EF4444; }
}

.advice-items {
  display: flex; flex-wrap: wrap; gap: 10rpx;
}

.advice-item-add {
  padding: 8rpx 18rpx;
  background: rgba(22,196,127,.08);
  border-radius: 14rpx;
  font-size: 22rpx; color: $primary; font-weight: 500;
}

.advice-item-reduce {
  padding: 8rpx 18rpx;
  background: rgba(239,68,68,.08);
  border-radius: 14rpx;
  font-size: 22rpx; color: #EF4444; font-weight: 500;
}

// ==================== 智能选购结果 ====================
.shop-result-list {
  display: flex; flex-direction: column; gap: 16rpx;
  margin-bottom: 8rpx;
}

.shop-result-card {
  display: flex; align-items: center;
  padding: 20rpx;

  .sr-rank {
    width: 52rpx; height: 52rpx;
    border-radius: 16rpx;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;

    text { font-size: 24rpx; color: #fff; font-weight: 800; }
  }

  .sr-img {
    width: 96rpx; height: 96rpx;
    border-radius: 18rpx;
    background: #eee;
    flex-shrink: 0;
    margin-left: 16rpx;
  }

  .sr-info {
    flex: 1; margin-left: 16rpx;
    min-width: 0;

    .sr-name {
      display: block;
      font-size: 26rpx; color: $text; font-weight: 700;
      margin-bottom: 6rpx;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }

    .sr-stars-row {
      display: flex; align-items: center; gap: 2rpx;
      margin-bottom: 4rpx;

      .sr-star { font-size: 22rpx; color: #F59E0B; }
      .sr-score { font-size: 20rpx; color: $warm; font-weight: 600; margin-left: 6rpx; }
    }

    .sr-reason {
      font-size: 20rpx; color: $text-secondary;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
  }

  .sr-price {
    flex-shrink: 0; margin-left: 12rpx;
    color: #E53935; font-weight: 700;
    .sr-price-label { font-size: 20rpx; }
    .sr-price-val { font-size: 30rpx; }
  }

  .sr-add {
    width: 52rpx; height: 52rpx;
    border-radius: 50%;
    background: $primary;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; margin-left: 10rpx;

    text { font-size: 32rpx; color: #fff; line-height: 1; }

    &:active { transform: scale(.88); }
  }
}

// ==================== 自由咨询 ====================
.chat-view {
  display: flex; flex-direction: column;
  height: calc(100vh - 200rpx);
}

.context-tag {
  display: flex; align-items: center; gap: 12rpx;
  padding: 14rpx 20rpx;
  background: rgba(10,132,255,.08);
  border-radius: 16rpx;
  margin-bottom: 16rpx;
  border: 1rpx solid rgba(10,132,255,.15);

  .ctx-label {
    font-size: 20rpx; color: $ai-blue; font-weight: 600;
    flex-shrink: 0;
  }

  .ctx-text {
    font-size: 22rpx; color: $text-secondary;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
}

.quick-questions {
  margin-bottom: 20rpx;
}

.qq-title {
  display: block;
  font-size: 24rpx; color: $text-secondary; font-weight: 600;
  margin-bottom: 14rpx;
}

.qq-list {
  display: flex; flex-wrap: wrap; gap: 12rpx;
}

.qq-item {
  padding: 16rpx 24rpx;
  border-radius: 40rpx;
  font-size: 24rpx; color: $text; font-weight: 500;
  background: rgba(255,255,255,.8);
  border: 1rpx solid $border;

  &:active {
    background: rgba(22,196,127,.08);
    border-color: $primary;
    transform: scale(.96);
  }
}

.chat-messages {
  flex: 1;
  max-height: 60vh;
  padding-right: 8rpx;
}

.msg-wrapper {
  margin-bottom: 24rpx;
}

.msg-ai {
  display: flex;
  padding-right: 60rpx;

  .msg-ai-avatar {
    width: 56rpx; height: 56rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(22,196,127,.15), rgba(0,212,170,.15));
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; margin-right: 14rpx;
    font-size: 28rpx;
  }

  .msg-ai-bubble {
    background: #fff;
    border-radius: 6rpx 22rpx 22rpx 22rpx;
    padding: 20rpx 24rpx;
    box-shadow: 0 2rpx 14rpx rgba(0,0,0,.03);

    .msg-text {
      font-size: 26rpx; color: $text;
      line-height: 1.7;
      white-space: pre-wrap;
    }
  }
}

.msg-user {
  display: flex; justify-content: flex-end;
  padding-left: 60rpx;

  .msg-user-bubble {
    background: linear-gradient(135deg, #16C47F, #0D9E5E);
    border-radius: 22rpx 6rpx 22rpx 22rpx;
    padding: 20rpx 26rpx;

    .msg-text {
      font-size: 26rpx; color: #fff;
      line-height: 1.65;
      white-space: pre-wrap;
    }
  }

  .msg-user-avatar {
    width: 56rpx; height: 56rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(10,132,255,.12), rgba(10,132,255,.06));
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; margin-left: 14rpx;
    font-size: 24rpx;
  }
}

.typing-bubble {
  display: flex; align-items: center; gap: 10rpx;
  padding: 24rpx 28rpx;
}

.typing-dot {
  width: 14rpx; height: 14rpx;
  border-radius: 50%;
  background: #C8E6C9;
  animation: bounce 1.4s infinite ease-in-out both;

  &:nth-child(1) { animation-delay: -.32s; }
  &:nth-child(2) { animation-delay: -.16s; }
  &:nth-child(3) { animation-delay: 0s; }
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(.8); opacity: .5; }
  40% { transform: scale(1.2); opacity: 1; }
}

.msg-spacer { height: 12rpx; }

.chat-input-bar {
  display: flex; align-items: center; gap: 14rpx;
  padding: 16rpx 0;
  margin-top: auto;
  background: rgba(255,255,255,.9);
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);
}

.chat-input {
  flex: 1;
  height: 76rpx;
  background: #F1F5F9;
  border-radius: 22rpx;
  padding: 0 24rpx;
  font-size: 26rpx; color: $text;
  border: 1rpx solid $border;

  &:focus { border-color: $primary; }
}

.chat-send-btn {
  width: 120rpx; height: 76rpx;
  border-radius: 22rpx;
  background: linear-gradient(135deg, #16C47F, #0D9E5E);
  display: flex; align-items: center; justify-content: center;

  text { font-size: 26rpx; color: #fff; font-weight: 600; }

  &.disabled {
    opacity: .4;
  }

  &:active:not(.disabled) {
    transform: scale(.94);
  }
}

.tab-bar-safe {
  height: 20rpx;
}
</style>
