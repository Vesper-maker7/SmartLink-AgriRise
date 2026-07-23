<template>
  <view class="orders-page">
    <scroll-view scroll-y class="page-scroll" :show-scrollbar="false">
      <!-- 顶部 -->
      <view class="page-hero safe-area-top">
        <view class="hero-bg"><view class="hb-grid"></view><view class="hb-glow"></view></view>
        <view class="hero-content">
          <text class="back-btn" @click="goBack">← 返回</text>
          <text class="hero-title">订单管理</text>
          <text class="hero-sub">{{ farmerStore.pendingCount }}个待发货 · 今日收入 ¥{{ farmerStore.stats.todaySales }}</text>
        </view>
        <!-- 快捷统计 -->
        <view class="quick-stats">
          <view v-for="s in quickStats" :key="s.key" class="qs-item" @click="activeTab = s.key">
            <text class="qs-num">{{ s.count }}</text>
            <text class="qs-lbl">{{ s.label }}</text>
          </view>
        </view>
      </view>

      <!-- 筛选 -->
      <view class="tab-section">
        <text v-for="tab in tabs" :key="tab.key" :class="['tab-item', activeTab===tab.key && 'active']" @click="activeTab=tab.key">
          {{ tab.label }}
          <text v-if="tab.key==='pending' && farmerStore.pendingCount > 0" class="tab-badge">{{ farmerStore.pendingCount }}</text>
        </text>
      </view>

      <!-- 订单列表 -->
      <view class="order-list">
        <view v-for="order in filteredOrders" :key="order.id" class="order-card">
          <view class="oc-top">
            <view class="oc-no-row">
              <text class="oc-no">#{{ order.orderNo }}</text>
              <text class="oc-time">{{ order.time }}</text>
            </view>
            <text :class="['oc-status', 's-' + order.status]">{{ order.statusText }}</text>
          </view>
          <view v-for="item in order.products" :key="item.id" class="oc-product">
            <image :src="item.image" mode="aspectFill" class="oc-thumb" />
            <view class="oc-pinfo">
              <text class="oc-pname text-ellipsis">{{ item.name }}</text>
              <text class="oc-pspec">×{{ item.quantity }}</text>
            </view>
            <text class="oc-pprice">¥{{ item.price }}</text>
          </view>
          <view class="oc-divider"></view>
          <view class="oc-bottom">
            <view class="oc-buyer">
              <text class="oc-bname">{{ order.buyer?.name }}</text>
              <text class="oc-baddr text-ellipsis">📌 {{ order.address?.full }}</text>
            </view>
            <text class="oc-total">合计 <text class="oc-tval">¥{{ order.total + order.freight }}</text></text>
          </view>
          <!-- 操作按钮 -->
          <view v-if="order.status === 'pending'" class="oc-actions">
            <view class="oc-btn ship" @click="openShipModal(order)"><text>🚚 一键发货</text></view>
            <view class="oc-btn cancel" @click="handleCancel(order)"><text>取消</text></view>
          </view>
          <view v-else-if="order.status === 'shipped'" class="oc-actions">
            <view class="oc-btn info" @click="viewLogistics(order)">
              <text>📦 {{ order.logistics?.company }} {{ order.logistics?.no }}</text>
            </view>
          </view>
        </view>
        <view v-if="filteredOrders.length === 0" class="empty">
          <text class="e-icon">📋</text><text class="e-txt">暂无此类订单</text>
        </view>
      </view>
      <view style="height: 40rpx;"></view>
    </scroll-view>

    <!-- 发货弹窗 -->
    <view v-if="showShipModal" class="modal-overlay" @click="showShipModal=false">
      <view class="modal-card" @click.stop>
        <text class="m-title">确认发货</text>
        <text class="m-sub">订单 #{{ shippingOrder?.orderNo }}</text>
        <view class="form-item">
          <text class="fi-label">物流公司</text>
          <view class="fi-options">
            <text v-for="c in logisticsCos" :key="c" :class="['fi-opt', shipForm.company===c && 'active']" @click="shipForm.company=c">{{ c }}</text>
          </view>
        </view>
        <view class="form-item">
          <text class="fi-label">运单号</text>
          <input v-model="shipForm.no" class="fi-input" placeholder="请输入运单号" placeholder-style="color:#CBD5E1"/>
        </view>
        <view class="m-btns">
          <view class="m-btn cancel" @click="showShipModal=false"><text>取消</text></view>
          <view class="m-btn confirm" @click="handleShip"><text>确认发货</text></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useFarmerStore } from '@/store/farmer.js'

const farmerStore = useFarmerStore()
const activeTab = ref('all')
const showShipModal = ref(false)
const shippingOrder = ref(null)
const shipForm = reactive({ company: '顺丰速运', no: '' })
const logisticsCos = ['顺丰速运', '京东物流', '中通快递', '圆通速递', '韵达快递', 'EMS']

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待发货' },
  { key: 'shipped', label: '运输中' },
  { key: 'completed', label: '已完成' },
  { key: 'cancelled', label: '已取消' }
]

const quickStats = computed(() => [
  { key:'pending', label:'待发货', count:farmerStore.pendingCount },
  { key:'shipped', label:'运输中', count:farmerStore.orderList.filter(o=>o.status==='shipped').length },
  { key:'completed', label:'已完成', count:farmerStore.orderList.filter(o=>o.status==='completed').length }
])

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return farmerStore.orderList
  return farmerStore.orderList.filter(o => o.status === activeTab.value)
})

function openShipModal(order) { shippingOrder.value = order; shipForm.no = ''; showShipModal.value = true }
function handleShip() {
  if (!shipForm.no.trim()) { uni.showToast({ title: '请输入运单号', icon: 'none' }); return }
  farmerStore.shipOrder(shippingOrder.value.id, { ...shipForm })
  showShipModal.value = false
  uni.showToast({ title: '发货成功！', icon: 'success' })
}
function handleCancel(order) {
  uni.showModal({ title:'取消订单',content:'确认取消该订单?',success(r){if(r.confirm){ farmerStore.cancelOrder(order.id); uni.showToast({title:'已取消',icon:'success'}) }} })
}
function viewLogistics(order) {
  uni.showToast({ title: `${order.logistics?.company}: ${order.logistics?.no}`, icon: 'none', duration: 2500 })
}
function goBack() { uni.navigateBack() }
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.orders-page { min-height: 100vh; background: $bg-base; }
.page-scroll { height: 100vh; }

.page-hero {
  background: linear-gradient(160deg, #B91C1C, #DC2626, #F97316);
  padding: 32rpx 32rpx 20rpx; position: relative; overflow: hidden;
  .hero-bg { position:absolute;inset:0;pointer-events:none; }
  .hb-grid { position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,0.04) 1rpx,transparent 1rpx),linear-gradient(90deg,rgba(255,255,255,0.04) 1rpx,transparent 1rpx);background-size:46rpx 46rpx; }
  .hb-glow { position:absolute;width:200rpx;height:200rpx;background:radial-gradient(circle,rgba(255,255,255,0.1),transparent);top:-30rpx;right:-40rpx; }
  .hero-content { position:relative;z-index:2; }
  .back-btn { font-size: 26rpx; color: rgba(255,255,255,0.7); display: block; margin-bottom: 6rpx; }
  .hero-title { font-size: 40rpx; font-weight: 800; color: #FFF; display: block; }
  .hero-sub { font-size: 24rpx; color: rgba(255,255,255,0.65); display: block; margin-top: 4rpx; }
}

.quick-stats {
  display: flex; gap: 12rpx; margin-top: 20rpx; position: relative; z-index: 2;
  .qs-item {
    flex:1; text-align: center; padding: 16rpx 0;
    background: rgba(255,255,255,0.12); border-radius: 14rpx;
    .qs-num { font-size: 30rpx; font-weight: 800; color: #FFF; display: block; }
    .qs-lbl { font-size: 20rpx; color: rgba(255,255,255,0.6); display: block; }
  }
}

.tab-section {
  display: flex; background: #FFF; padding: 16rpx 24rpx; position: sticky; top: 0; z-index: 20;
  .tab-item {
    flex:1; text-align: center; font-size: 26rpx; color: #64748B; padding: 12rpx 0; position: relative;
    &.active {
      color: #B91C1C; font-weight: 700;
      &::after { content:''; position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:40rpx; height:4rpx; background:linear-gradient(90deg,#DC2626,#F97316); border-radius:2rpx; }
    }
    .tab-badge { display:inline-block; min-width:32rpx;height:32rpx;background:#E74C3C;color:#FFF;font-size:18rpx;border-radius:16rpx;line-height:32rpx;text-align:center;padding:0 8rpx;margin-left:4rpx;vertical-align:middle; }
  }
}

.order-list { padding: 16rpx 24rpx; }
.order-card {
  background: #FFF; border-radius: 18rpx; padding: 20rpx; margin-bottom: 16rpx; box-shadow: $shadow-sm;
  .oc-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14rpx; }
  .oc-no-row { .oc-no{font-size:24rpx;color:#0F172A;font-weight:600;font-family:monospace;display:block;} .oc-time{font-size:20rpx;color:#94A3B8;display:block;margin-top:2rpx;} }
  .oc-status {
    font-size: 20rpx; padding: 4rpx 14rpx; border-radius: 12rpx; font-weight: 600;
    &.s-completed { background:#D1FAE5;color:#059669; }
    &.s-shipped { background:#E3F2FD;color:#0A84FF; }
    &.s-pending { background:#FFF3E0;color:#F97316; }
    &.s-cancelled { background:#FEE2E2;color:#EF4444; }
  }
  .oc-product { display: flex; align-items: center; gap: 14rpx; padding: 12rpx 0; }
  .oc-thumb { width: 80rpx; height: 80rpx; border-radius: 10rpx; flex-shrink: 0; }
  .oc-pinfo { flex: 1; min-width: 0; }
  .oc-pname { font-size: 26rpx; font-weight: 600; color: #0F172A; display: block; }
  .oc-pspec { font-size: 22rpx; color: #94A3B8; display: block; margin-top: 2rpx; }
  .oc-pprice { font-size: 28rpx; font-weight: 700; color: #0F172A; flex-shrink: 0; }
  .oc-divider { height: 1rpx; background: #F2F2F2; margin: 6rpx 0; }
  .oc-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 8rpx; }
  .oc-buyer { flex:1; min-width:0; .oc-bname{font-size:24rpx;color:#334155;font-weight:500;display:block;} .oc-baddr{font-size:20rpx;color:#94A3B8;display:block;max-width:380rpx;} }
  .oc-total { font-size: 24rpx; color: #64748B; flex-shrink: 0; .oc-tval{font-size:32rpx;font-weight:800;color:#E74C3C;} }
  .oc-actions { display: flex; gap: 12rpx; margin-top: 14rpx; }
  .oc-btn {
    flex:1; text-align: center; padding: 16rpx 0; border-radius: 20rpx; font-size: 24rpx; font-weight: 600;
    &.ship { background: linear-gradient(135deg,#DC2626,#F97316); color: #FFF; }
    &.cancel { background: #F5F7F4; color: #64748B; }
    &.info { background: #E3F2FD; color: #0A84FF; }
  }
}

.empty { text-align: center; padding: 80rpx 0; .e-icon{font-size:56rpx;display:block;} .e-txt{font-size:26rpx;color:#94A3B8;display:block;margin-top:12rpx;} }

/* Modal */
.modal-overlay { position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:100;display:flex;align-items:flex-end; }
.modal-card {
  width:100%;background:#FFF;border-radius:32rpx 32rpx 0 0;padding:32rpx 28rpx;
  .m-title { font-size:34rpx;font-weight:800;color:#0F172A;display:block; }
  .m-sub { font-size:24rpx;color:#94A3B8;display:block;margin:6rpx 0 20rpx; }
}
.form-item { margin-bottom: 20rpx; }
.fi-label { font-size: 26rpx; color: #64748B; display: block; margin-bottom: 10rpx; font-weight: 500; }
.fi-input { width:100%;height:76rpx;background:#F5F7F4;border-radius:14rpx;padding:0 20rpx;font-size:26rpx;color:#0F172A;box-sizing:border-box; }
.fi-options { display: flex; flex-wrap: wrap; gap: 12rpx; }
.fi-opt {
  padding: 12rpx 22rpx; background: #F5F7F4; border-radius: 14rpx; font-size: 24rpx; color: #64748B;
  &.active { background: linear-gradient(135deg,#DC2626,#F97316); color: #FFF; font-weight: 600; }
}
.m-btns { display: flex; gap: 16rpx; margin-top: 20rpx; }
.m-btn {
  flex:1; text-align:center; padding:24rpx 0; border-radius:20rpx; font-size:28rpx; font-weight:600;
  &.cancel { background:#F5F7F4;color:#64748B; }
  &.confirm { background:linear-gradient(135deg,#DC2626,#F97316);color:#FFF; }
}
</style>
