<template>
  <view class="address-card" @click="$emit('click', address)">
    <!-- 选中态边框 -->
    <view class="address-card__inner" :class="{ 'address-card__inner--active': selected }">
      <!-- 头部 -->
      <view class="address-card__header">
        <view class="address-card__tags">
          <text v-if="address.isDefault" class="tag tag--default">默认</text>
        </view>
        <view class="address-card__contact">
          <text class="contact-name">{{ address.name }}</text>
          <text class="contact-phone">{{ address.phone }}</text>
        </view>
        <view v-if="showEdit" class="address-card__edit" @click.stop="$emit('edit', address)">
          <text class="edit-text">编辑</text>
        </view>
      </view>

      <!-- 地址详情 -->
      <view class="address-card__body">
        <image class="addr-icon" src="/static/icons/location.png" mode="aspectFit" v-if="false" />
        <text class="addr-icon-text">📍</text>
        <text class="addr-text">{{ fullAddress }}</text>
      </view>

      <!-- 选中图标 -->
      <view v-if="selectable && selected" class="address-card__check">
        <text class="check-mark">✓</text>
      </view>
    </view>

    <!-- 操作区 -->
    <view v-if="showActions" class="address-card__actions">
      <view v-if="!address.isDefault" class="action-link" @click.stop="$emit('set-default', address)">
        <text>设为默认</text>
      </view>
      <view class="action-link action-link--danger" @click.stop="$emit('delete', address)">
        <text>删除</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  address: { type: Object, required: true },
  selected: { type: Boolean, default: false },
  selectable: { type: Boolean, default: false },
  showEdit: { type: Boolean, default: true },
  showActions: { type: Boolean, default: false }
})

defineEmits(['click', 'edit', 'delete', 'set-default'])

const fullAddress = computed(() => {
  const a = props.address
  return `${a.province}${a.city}${a.district} ${a.detail}`
})
</script>

<style lang="scss" scoped>
.address-card {
  margin-bottom: 20rpx;

  &__inner {
    background: #fff;
    border-radius: 20rpx;
    padding: 28rpx;
    border: 3rpx solid transparent;
    position: relative;
    transition: border-color 0.2s;

    &--active {
      border-color: #2D8B3E;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    margin-bottom: 14rpx;
  }

  &__tags {
    display: flex;
    gap: 8rpx;
    margin-right: 16rpx;
  }

  &__contact {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 20rpx;
  }

  &__edit {
    padding: 6rpx 16rpx;

    .edit-text {
      font-size: 24rpx;
      color: #2D8B3E;
    }
  }

  &__body {
    display: flex;
    align-items: flex-start;
  }

  &__check {
    position: absolute;
    bottom: 20rpx;
    right: 20rpx;
    width: 40rpx;
    height: 40rpx;
    background: #2D8B3E;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 32rpx;
    padding: 12rpx 28rpx 0;
  }
}

.tag {
  font-size: 20rpx;
  padding: 4rpx 14rpx;
  border-radius: 8rpx;

  &--default {
    background: #e8f5e9;
    color: #2D8B3E;
  }
}

.contact-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #1a1a1a;
}

.contact-phone {
  font-size: 26rpx;
  color: #666;
}

.addr-icon-text {
  font-size: 28rpx;
  margin-right: 6rpx;
  flex-shrink: 0;
}

.addr-text {
  font-size: 26rpx;
  color: #555;
  line-height: 1.5;
  flex: 1;
}

.check-mark {
  color: #fff;
  font-size: 24rpx;
  font-weight: 700;
}

.action-link {
  font-size: 24rpx;
  color: #2D8B3E;

  &--danger {
    color: #e53935;
  }
}
</style>
