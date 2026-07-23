<template>
  <view>
    <!-- AI 消息 -->
    <view v-if="message.role === 'ai'" class="ai-message-wrapper">
      <view class="ai-avatar">
        <text>{{ avatarEmoji }}</text>
      </view>

      <view class="ai-bubble">
        <!-- 文本内容 -->
        <view class="bubble-text" v-if="message.text">
          <text class="text-content">{{ message.text }}</text>
        </view>

        <!-- 推荐商品卡片组 -->
        <view v-if="message.cards && message.cards.length" class="recommend-cards">
          <view
            v-for="card in message.cards"
            :key="card.id"
            class="recommend-card"
            @click="goToProduct(card.id)"
          >
            <image :src="card.image" mode="aspectFill" class="card-img" />
            <view class="card-info">
              <text class="card-name">{{ card.name }}</text>
              <view class="card-price">
                <text class="price-sym">¥</text>
                <text class="price-val">{{ card.price }}</text>
              </view>
            </view>
            <view class="card-arrow">
              <text>›</text>
            </view>
          </view>
        </view>

        <!-- 营养卡片 -->
        <view v-if="message.nutritionCard" class="nutrition-card">
          <view class="nutri-header">
            <text class="nutri-title">{{ message.nutritionCard.title }}</text>
            <text v-if="message.nutritionCard.grade" class="nutri-grade">{{
              message.nutritionCard.grade
            }}</text>
          </view>
          <view class="nutri-table">
            <view
              v-for="(nut, idx) in message.nutritionCard.nutrients"
              :key="idx"
              class="nutri-row"
              :class="{ 'nutri-row--last': idx === message.nutritionCard.nutrients.length - 1 }"
            >
              <text class="nutri-name">{{ nut.name }}</text>
              <text class="nutri-value">{{ nut.value }}</text>
              <text class="nutri-daily">{{ nut.daily }}</text>
            </view>
          </view>
          <view
            v-if="message.nutritionCard.productId"
            class="nutri-link"
            @click="goToProduct(message.nutritionCard.productId)"
          >
            <text>查看关联商品 →</text>
          </view>
        </view>

        <!-- 消息时间 -->
        <text v-if="showTime" class="msg-time">{{ formatTime(message.timestamp) }}</text>
      </view>
    </view>

    <!-- 用户消息 -->
    <view v-else class="user-message-wrapper">
      <view class="user-bubble">
        <text class="text-content">{{ message.text }}</text>
      </view>
      <view class="user-avatar">
        <text>👤</text>
      </view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  message: { type: Object, required: true },
  showTime: { type: Boolean, default: false },
  avatarEmoji: { type: String, default: '🌿' }
})

function goToProduct(id) {
  uni.navigateTo({ url: `/pages/consumer/mall/detail?id=${id}` })
}

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  const pad = n => String(n).padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}
</script>

<style lang="scss" scoped>
// ========== AI消息 ==========
.ai-message-wrapper {
  display: flex;
  margin-bottom: 32rpx;
  padding-right: 80rpx;
}

.ai-avatar {
  width: 68rpx;
  height: 68rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #E8F5E9, #C8E6C9);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 16rpx;
  font-size: 32rpx;
}

.ai-bubble {
  flex: 1;
  background: #fff;
  border-radius: 6rpx 24rpx 24rpx 24rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.bubble-text {
  .text-content {
    font-size: 28rpx;
    color: #333;
    line-height: 1.75;
    white-space: pre-wrap;
    word-break: break-all;
  }
}

// ========== 推荐卡片 ==========
.recommend-cards {
  display: flex;
  gap: 16rpx;
  margin-top: 20rpx;
  overflow-x: auto;
  padding-bottom: 4rpx;

  &::-webkit-scrollbar {
    display: none;
  }
}

.recommend-card {
  display: flex;
  align-items: center;
  background: #f9fafb;
  border-radius: 16rpx;
  padding: 12rpx;
  min-width: 320rpx;
  border: 1rpx solid #f0f0f0;
  transition: background 0.15s;

  &:active {
    background: #f0f4f1;
  }

  .card-img {
    width: 88rpx;
    height: 88rpx;
    border-radius: 12rpx;
    background: #eee;
    flex-shrink: 0;
  }

  .card-info {
    flex: 1;
    margin-left: 14rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8rpx;
    overflow: hidden;
  }

  .card-name {
    font-size: 24rpx;
    color: #333;
    font-weight: 500;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }

  .card-price {
    color: #e53935;
    font-weight: 600;
    .price-sym { font-size: 20rpx; }
    .price-val { font-size: 28rpx; }
  }

  .card-arrow {
    font-size: 36rpx;
    color: #ccc;
    margin-left: 8rpx;
    flex-shrink: 0;
  }
}

// ========== 营养卡片 ==========
.nutrition-card {
  margin-top: 20rpx;
  background: #f0faf2;
  border-radius: 20rpx;
  overflow: hidden;
  border: 1rpx solid #d4edda;
}

.nutri-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 24rpx 14rpx;

  .nutri-title {
    font-size: 26rpx;
    font-weight: 600;
    color: #1a1a1a;
  }

  .nutri-grade {
    font-size: 20rpx;
    color: #2D8B3E;
    background: #fff;
    padding: 4rpx 14rpx;
    border-radius: 12rpx;
    font-weight: 500;
  }
}

.nutri-table {
  padding: 0 24rpx;
}

.nutri-row {
  display: flex;
  align-items: center;
  padding: 14rpx 0;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);

  &--last {
    border-bottom: none;
  }

  .nutri-name {
    width: 140rpx;
    font-size: 24rpx;
    color: #555;
  }

  .nutri-value {
    flex: 1;
    font-size: 24rpx;
    color: #333;
    font-weight: 500;
  }

  .nutri-daily {
    font-size: 22rpx;
    color: #2D8B3E;
    font-weight: 500;
  }
}

.nutri-link {
  padding: 16rpx 24rpx;
  font-size: 24rpx;
  color: #2D8B3E;
  text-align: center;
  border-top: 1rpx solid rgba(0, 0, 0, 0.05);
}

// ========== 用户消息 ==========
.user-message-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 32rpx;
  padding-left: 80rpx;
}

.user-bubble {
  background: linear-gradient(135deg, #2D8B3E, #4CAF50);
  border-radius: 24rpx 6rpx 24rpx 24rpx;
  padding: 20rpx 26rpx;
  max-width: 100%;

  .text-content {
    font-size: 28rpx;
    color: #fff;
    line-height: 1.65;
    white-space: pre-wrap;
    word-break: break-all;
  }
}

.user-avatar {
  width: 68rpx;
  height: 68rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #E3F2FD, #BBDEFB);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: 16rpx;
  font-size: 28rpx;
}

// ========== 时间 ==========
.msg-time {
  display: block;
  font-size: 20rpx;
  color: #bbb;
  margin-top: 12rpx;
  text-align: right;
}
</style>
