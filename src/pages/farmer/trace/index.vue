<template>
  <view class="trace-page">
    <scroll-view scroll-y class="page-scroll" :show-scrollbar="false">
      <view class="page-hero safe-area-top">
        <view class="hero-bg"><view class="hb-grid"></view><view class="hb-glow"></view></view>
        <view class="hero-content">
          <text class="back-btn" @click="goBack">← 返回</text>
          <text class="hero-title">溯源管理</text>
          <text class="hero-sub">区块链存证 · 一物一码 · 全链路透明</text>
        </view>
        <view class="chain-stats">
          <view class="cs-item">
            <text class="cs-val">{{ farmerStore.traceList.length }}</text>
            <text class="cs-lbl">溯源码</text>
          </view>
          <view class="cs-item">
            <text class="cs-val">{{ totalEvents }}</text>
            <text class="cs-lbl">溯源事件</text>
          </view>
          <view class="cs-item">
            <text class="cs-val">100%</text>
            <text class="cs-lbl">上链率</text>
          </view>
        </view>
      </view>

      <!-- 生成溯源码 -->
      <view class="section-card">
        <view class="sc-head">
          <view class="sh-icon">🔗</view>
          <text class="sh-title">生成溯源码</text>
        </view>
        <text class="sc-desc">选择商品生成区块链溯源码，消费者扫码查看全链路溯源信息。</text>
        <view class="gen-form">
          <picker :range="productOptions" :value="genIdx" @change="e=>genIdx=e.detail.value">
            <view class="picker-box">{{ productOptions[genIdx]?.name || '请选择商品' }}</view>
          </picker>
          <view class="gen-btn" @click="generateTrace">生成溯源码</view>
        </view>
      </view>

      <!-- 已有溯源码 -->
      <view v-if="farmerStore.traceList.length > 0" class="section-card">
        <view class="sc-head">
          <view class="sh-icon">📋</view>
          <text class="sh-title">已有溯源码</text>
          <text class="sh-sub">{{ farmerStore.traceList.length }}个商品</text>
        </view>
        <view v-for="trace in farmerStore.traceList" :key="trace.id" class="trace-card">
          <view class="tc-top">
            <image v-if="trace.productImage" :src="trace.productImage" mode="aspectFill" class="tc-thumb" />
            <view class="tc-info">
              <text class="tc-name">{{ trace.productName }}</text>
              <text class="tc-code">{{ trace.id }}</text>
              <view class="tc-certs">
                <text v-for="c in trace.certs" :key="c" class="tc-cert">{{ c }}</text>
              </view>
            </view>
            <view class="tc-qr" @click="viewQr(trace)">QR</view>
          </view>
          <!-- 时间线 -->
          <view class="tc-timeline">
            <view v-for="(event, ei) in trace.timeline" :key="ei" class="tct-event">
              <view class="tct-dot"></view>
              <view v-if="ei < trace.timeline.length-1" class="tct-line"></view>
              <view class="tct-content">
                <view class="tct-header">
                  <text class="tct-title">{{ event.title }}</text>
                  <text class="tct-date">{{ event.date }}</text>
                </view>
                <text class="tct-detail">{{ event.detail }}</text>
              </view>
            </view>
          </view>
          <view class="tc-footer">
            <text class="tc-chain">上链哈希: 0x{{ trace.id.slice(-8) }}...a1b2</text>
            <view class="tc-add-event" @click="openEventModal(trace)">
              <text>+ 添加事件</text>
            </view>
          </view>
        </view>
      </view>

      <view style="height:40rpx;"></view>
    </scroll-view>

    <!-- 添加事件弹窗 -->
    <view v-if="showEventModal" class="modal-overlay" @click="showEventModal=false">
      <view class="modal-card" @click.stop>
        <text class="m-title">添加溯源事件</text>
        <view class="form-item"><text class="fi-label">事件标题</text><input v-model="eventForm.title" class="fi-input" placeholder="如：施肥"/></view>
        <view class="form-item"><text class="fi-label">事件详情</text><textarea v-model="eventForm.detail" class="fi-textarea" placeholder="如：施用有机肥，每亩150kg"/></view>
        <view class="m-btns">
          <view class="m-btn cancel" @click="showEventModal=false"><text>取消</text></view>
          <view class="m-btn confirm" @click="handleAddEvent"><text>添加</text></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useFarmerStore } from '@/store/farmer.js'

const farmerStore = useFarmerStore()
const genIdx = ref(0)
const showEventModal = ref(false)
const curTraceId = ref('')
const eventForm = reactive({ title: '', detail: '' })

const productOptions = computed(() => [{ name: '请选择商品' }, ...farmerStore.productList.map(p => ({ name: p.name, id: p.id }))])
const totalEvents = computed(() => farmerStore.traceList.reduce((s, t) => s + (t.timeline?.length || 0), 0))

function generateTrace() {
  const product = productOptions.value[genIdx.value]
  if (!product.id) { uni.showToast({ title: '请选择商品', icon: 'none' }); return }
  farmerStore.addTraceRecord(product.id, product.name, product.image || 'https://via.placeholder.com/200x200/4CAF50/FFFFFF?text=商品')
  genIdx.value = 0
  uni.showToast({ title: '溯源码已生成!', icon: 'success' })
}
function viewQr(trace) { uni.showToast({ title: `溯源码: ${trace.id}`, icon: 'none', duration: 2000 }) }
function openEventModal(trace) { curTraceId.value = trace.id; eventForm.title = ''; eventForm.detail = ''; showEventModal.value = true }
function handleAddEvent() {
  if (!eventForm.title.trim()) { uni.showToast({ title: '请输入标题', icon: 'none' }); return }
  farmerStore.addTraceEvent(curTraceId.value, { title: eventForm.title, detail: eventForm.detail, date: new Date().toISOString().slice(0,10) })
  showEventModal.value = false
  uni.showToast({ title: '事件已添加', icon: 'success' })
}
function goBack() { uni.navigateBack() }
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.trace-page { min-height:100vh; background:$bg-base; }
.page-scroll { height:100vh; }

.page-hero {
  background: linear-gradient(160deg, #3B0764, #6D28D9, #8B5CF6);
  padding:32rpx 32rpx 20rpx; position:relative; overflow:hidden;
  .hero-bg{position:absolute;inset:0;pointer-events:none;}
  .hb-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,0.03) 1rpx,transparent 1rpx),linear-gradient(90deg,rgba(255,255,255,0.03) 1rpx,transparent 1rpx);background-size:46rpx 46rpx;}
  .hb-glow{position:absolute;width:200rpx;height:200rpx;background:radial-gradient(circle,rgba(139,92,246,0.15),transparent);top:-30rpx;right:-40rpx;}
  .hero-content{position:relative;z-index:2;}
  .back-btn{font-size:26rpx;color:rgba(255,255,255,0.7);display:block;margin-bottom:6rpx;}
  .hero-title{font-size:40rpx;font-weight:800;color:#FFF;display:block;letter-spacing:2rpx;}
  .hero-sub{font-size:24rpx;color:rgba(255,255,255,0.6);display:block;margin-top:4rpx;}
}

.chain-stats { display:flex;gap:12rpx;margin-top:20rpx;position:relative;z-index:2; }
.cs-item { flex:1;text-align:center;padding:16rpx 0;background:rgba(255,255,255,0.1);border-radius:14rpx; .cs-val{font-size:30rpx;font-weight:800;color:#FFF;display:block;} .cs-lbl{font-size:20rpx;color:rgba(255,255,255,0.55);display:block;} }

.section-card { background:#FFF;border-radius:18rpx;margin:16rpx 24rpx;padding:24rpx;box-shadow:$shadow-sm; }
.sc-head { display:flex;align-items:center;gap:10rpx;margin-bottom:10rpx; }
.sh-icon { font-size:32rpx; }
.sh-title { font-size:28rpx;font-weight:700;color:#0F172A; }
.sh-sub { font-size:22rpx;color:#94A3B8;margin-left:auto; }
.sc-desc { font-size:24rpx;color:#94A3B8;display:block;margin-bottom:16rpx;line-height:1.5; }

.gen-form { display:flex;gap:12rpx;align-items:center; }
.picker-box {
  height:76rpx;background:#F5F7F4;border-radius:14rpx;padding:0 24rpx;
  display:flex;align-items:center;font-size:26rpx;color:#0F172A;min-width:300rpx;
}
.gen-btn {
  height:72rpx;padding:0 32rpx;background:linear-gradient(135deg,#6D28D9,#8B5CF6);
  border-radius:18rpx;display:flex;align-items:center;color:#FFF;font-size:26rpx;font-weight:600;
  box-shadow:0 4rpx 16rpx rgba(109,40,217,0.25);white-space:nowrap;
}

.trace-card {
  border:1rpx solid #E8EDE8;border-radius:16rpx;padding:20rpx;margin-top:16rpx;
  background:linear-gradient(135deg,#FBF5FF,#FFF);
}
.tc-top { display:flex;align-items:center;gap:14rpx;margin-bottom:16rpx; }
.tc-thumb { width:72rpx;height:72rpx;border-radius:12rpx;flex-shrink:0; }
.tc-info { flex:1;min-width:0; .tc-name{font-size:26rpx;font-weight:700;color:#0F172A;display:block;} .tc-code{font-size:20rpx;color:#94A3B8;font-family:monospace;display:block;} }
.tc-certs { display:flex;gap:6rpx;margin-top:4rpx; .tc-cert{font-size:18rpx;color:#7C3AED;background:rgba(124,58,237,0.08);padding:2rpx 8rpx;border-radius:6rpx;} }
.tc-qr {
  width:64rpx;height:64rpx;background:linear-gradient(135deg,#6D28D9,#8B5CF6);border-radius:14rpx;
  display:flex;align-items:center;justify-content:center;font-size:20rpx;color:#FFF;font-weight:800;flex-shrink:0;
}

.tc-timeline { padding-left:10rpx; }
.tct-event { display:flex;position:relative;padding-bottom:8rpx; &:last-child{padding-bottom:0;} }
.tct-dot { width:12rpx;height:12rpx;border-radius:50%;background:#7C3AED;margin-top:6rpx;flex-shrink:0;position:relative;z-index:2; }
.tct-line { position:absolute;left:5rpx;top:20rpx;bottom:0;width:1.5rpx;background:linear-gradient(180deg,#7C3AED,#E8EDE8); }
.tct-content { flex:1;padding-left:16rpx;padding-bottom:12rpx; }
.tct-header { display:flex;justify-content:space-between;align-items:center;margin-bottom:4rpx; }
.tct-title { font-size:24rpx;font-weight:700;color:#0F172A; }
.tct-date { font-size:20rpx;color:#94A3B8; }
.tct-detail { font-size:22rpx;color:#64748B;line-height:1.5;display:block; }

.tc-footer { display:flex;justify-content:space-between;align-items:center;margin-top:12rpx;padding-top:12rpx;border-top:1rpx dashed #E8EDE8; }
.tc-chain { font-size:20rpx;color:#94A3B8;font-family:monospace; }
.tc-add-event text { font-size:22rpx;color:#7C3AED;font-weight:600;padding:6rpx 14rpx;background:rgba(124,58,237,0.08);border-radius:10rpx; }

.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:100;display:flex;align-items:flex-end;}
.modal-card{width:100%;background:#FFF;border-radius:32rpx 32rpx 0 0;padding:32rpx 28rpx;}
.m-title{font-size:34rpx;font-weight:800;color:#0F172A;display:block;margin-bottom:20rpx;}
.form-item{margin-bottom:20rpx;}
.fi-label{font-size:26rpx;color:#64748B;display:block;margin-bottom:10rpx;font-weight:500;}
.fi-input{width:100%;height:76rpx;background:#F5F7F4;border-radius:14rpx;padding:0 20rpx;font-size:26rpx;color:#0F172A;box-sizing:border-box;}
.fi-textarea{width:100%;height:140rpx;background:#F5F7F4;border-radius:14rpx;padding:16rpx 20rpx;font-size:26rpx;color:#0F172A;box-sizing:border-box;}
.m-btns{display:flex;gap:16rpx;margin-top:20rpx;}
.m-btn{flex:1;text-align:center;padding:24rpx 0;border-radius:20rpx;font-size:28rpx;font-weight:600; &.cancel{background:#F5F7F4;color:#64748B;} &.confirm{background:linear-gradient(135deg,#6D28D9,#8B5CF6);color:#FFF;} }
</style>
