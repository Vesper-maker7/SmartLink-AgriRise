<template>
  <view class="farm-log-page">
    <scroll-view scroll-y class="page-scroll" :show-scrollbar="false">
      <view class="page-hero safe-area-top">
        <view class="hero-bg"><view class="hb-grid"></view><view class="hb-glow"></view></view>
        <view class="hero-content">
          <text class="back-btn" @click="goBack">← 返回</text>
          <text class="hero-title">农事记录</text>
          <text class="hero-sub">共{{ farmerStore.logList.length }}条 · 科学管理 · 全程追溯</text>
        </view>
      </view>

      <view class="filter-bar">
        <scroll-view scroll-x class="filter-scroll" :show-scrollbar="false">
          <text :class="['f-chip', logFilter==='all'&&'active']" @click="logFilter='all'">全部</text>
          <text v-for="type in logTypes" :key="type" :class="['f-chip', logFilter===type&&'active']" @click="logFilter=type">{{ type }}</text>
        </scroll-view>
        <view class="add-btn" @click="openAddModal"><text>+</text></view>
      </view>

      <view class="timeline">
        <view v-for="(log, idx) in filteredLogs" :key="log.id" class="tl-item anim-fade-in" :class="'anim-delay-' + (idx%5+1)">
          <view class="tl-left">
            <view class="tl-dot" :style="{ background: typeColor(log.type) }"><view class="tl-dot-glow" :style="{ background: typeColor(log.type) }"></view></view>
            <view v-if="idx < filteredLogs.length-1" class="tl-line"></view>
          </view>
          <view class="tl-card">
            <view class="tlc-head">
              <text class="tlc-type">{{ log.type }}</text>
              <view class="tlc-meta">
                <text class="tlc-date">{{ log.date }}</text>
                <text class="tlc-weather">{{ log.weather }}</text>
              </view>
            </view>
            <text class="tlc-field">{{ log.field }}</text>
            <text class="tlc-detail">{{ log.detail }}</text>
            <view class="tlc-bottom">
              <text class="tlc-operator">👤 {{ log.operator }}</text>
              <view class="tlc-delete" @click="handleDelete(log)">
                <text>删除</text>
              </view>
            </view>
          </view>
        </view>
        <view v-if="filteredLogs.length===0" class="empty">
          <text class="e-icon">🌱</text><text class="e-txt">暂无记录，点击+添加</text>
        </view>
      </view>
      <view style="height:40rpx;"></view>
    </scroll-view>

    <!-- 添加弹窗 -->
    <view v-if="showAddModal" class="modal-overlay" @click="showAddModal=false">
      <view class="modal-card" @click.stop>
        <text class="m-title">添加农事记录</text>
        <scroll-view scroll-y class="m-body">
          <view class="form-item">
            <text class="fi-label">农事类型</text>
            <view class="fi-chips">
              <text v-for="t in logTypes" :key="t" :class="['fi-chip', addForm.type===t&&'active']" @click="addForm.type=t">{{ t }}</text>
            </view>
          </view>
          <view class="form-item"><text class="fi-label">地块</text><input v-model="addForm.field" class="fi-input" placeholder="如：A区水田"/></view>
          <view class="form-row">
            <view class="form-item half"><text class="fi-label">日期</text><input v-model="addForm.date" class="fi-input"/></view>
            <view class="form-item half"><text class="fi-label">天气</text><input v-model="addForm.weather" class="fi-input" placeholder="晴 28℃"/></view>
          </view>
          <view class="form-item"><text class="fi-label">操作人</text><input v-model="addForm.operator" class="fi-input"/></view>
          <view class="form-item"><text class="fi-label">详细描述</text><textarea v-model="addForm.detail" class="fi-textarea"/></view>
        </scroll-view>
        <view class="m-btns">
          <view class="m-btn cancel" @click="showAddModal=false"><text>取消</text></view>
          <view class="m-btn confirm" @click="handleAdd"><text>保存</text></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useFarmerStore } from '@/store/farmer.js'

const farmerStore = useFarmerStore()
const logFilter = ref('all')
const showAddModal = ref(false)

const logTypes = ['施肥','除草','灌溉','播种','采收','病虫害','检测','其他']

const filteredLogs = computed(() => {
  if (logFilter.value === 'all') return farmerStore.logList
  return farmerStore.logList.filter(l => l.type === logFilter.value)
})

const addForm = reactive({ type:'施肥', field:'', date:new Date().toISOString().slice(0,10), weather:'晴 25℃', operator:'张学农', detail:'' })

const colors = { '施肥':'#10B981','除草':'#F59E0B','灌溉':'#0A84FF','播种':'#8BC34A','采收':'#FF9800','病虫害':'#E74C3C','检测':'#7C3AED','其他':'#64748B' }
function typeColor(t) { return colors[t] || '#94A3B8' }

function openAddModal() { showAddModal.value = true }
function handleAdd() {
  if (!addForm.type || !addForm.field) { uni.showToast({title:'请填写必要信息',icon:'none'}); return }
  farmerStore.addFarmLog({ type:addForm.type, field:addForm.field, date:addForm.date, weather:addForm.weather, operator:addForm.operator, detail:addForm.detail, images:[], productId:null })
  showAddModal.value = false
  uni.showToast({ title: '已添加', icon: 'success' })
  Object.assign(addForm, { type:'施肥',field:'',date:new Date().toISOString().slice(0,10),weather:'晴 25℃',operator:'张学农',detail:'' })
}
function handleDelete(log) {
  uni.showModal({ title:'删除',content:'确认删除?',success(r){if(r.confirm) farmerStore.deleteFarmLog(log.id)} })
}
function goBack() { uni.navigateBack() }
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.farm-log-page { min-height:100vh; background:$bg-base; }
.page-scroll { height:100vh; }

.page-hero {
  background: linear-gradient(160deg, #1E3A5F, #1E40AF, #3B82F6);
  padding:32rpx 32rpx 28rpx; position:relative; overflow:hidden;
  .hero-bg{position:absolute;inset:0;pointer-events:none;}
  .hb-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,0.03) 1rpx,transparent 1rpx),linear-gradient(90deg,rgba(255,255,255,0.03) 1rpx,transparent 1rpx);background-size:46rpx 46rpx;}
  .hb-glow{position:absolute;width:200rpx;height:200rpx;background:radial-gradient(circle,rgba(59,130,246,0.15),transparent);top:-30rpx;right:-40rpx;}
  .hero-content{position:relative;z-index:2;}
  .back-btn{font-size:26rpx;color:rgba(255,255,255,0.7);display:block;margin-bottom:6rpx;}
  .hero-title{font-size:40rpx;font-weight:800;color:#FFF;display:block;letter-spacing:2rpx;}
  .hero-sub{font-size:24rpx;color:rgba(255,255,255,0.6);display:block;margin-top:4rpx;}
}

.filter-bar { display:flex;align-items:center;padding:16rpx 20rpx;background:#FFF;position:sticky;top:0;z-index:20; }
.filter-scroll { white-space:nowrap;flex:1; }
.f-chip { display:inline-block;padding:12rpx 22rpx;margin-right:12rpx;background:#F5F7F4;border-radius:24rpx;font-size:24rpx;color:#64748B;transition:all 0.25s; &.active{background:linear-gradient(135deg,#1E40AF,#3B82F6);color:#FFF;font-weight:600;box-shadow:0 4rpx 16rpx rgba(30,64,175,0.25);} }
.add-btn { width:56rpx;height:56rpx;background:$ai-gradient;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:$shadow-glow-cyan;flex-shrink:0; text{font-size:34rpx;color:#FFF;font-weight:600;} }

.timeline { padding:20rpx 32rpx; }
.tl-item { display:flex;position:relative;padding-bottom:16rpx; }
.tl-left { display:flex;flex-direction:column;align-items:center;margin-right:20rpx;flex-shrink:0; }
.tl-dot { width:20rpx;height:20rpx;border-radius:50%;margin-top:8rpx;position:relative;z-index:2; .tl-dot-glow{position:absolute;inset:-5rpx;border-radius:50%;opacity:0.3;animation:ai-dot-pulse 2.5s ease-in-out infinite;} }
.tl-line { flex:1;width:2rpx;background:linear-gradient(180deg,#CBD5E1,transparent);margin-top:4rpx; }

.tl-card {
  flex:1;background:#FFF;border-radius:16rpx;padding:20rpx;box-shadow:$shadow-sm;margin-bottom:16rpx;
  .tlc-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:8rpx;}
  .tlc-type{font-size:26rpx;font-weight:700;color:#0F172A;}
  .tlc-meta{display:flex;gap:12rpx;}
  .tlc-date{font-size:22rpx;color:#94A3B8;}
  .tlc-weather{font-size:22rpx;color:#64748B;}
  .tlc-field{font-size:24rpx;color:#1E40AF;display:block;margin-bottom:6rpx;font-weight:500;}
  .tlc-detail{font-size:24rpx;color:#64748B;display:block;line-height:1.5;margin-bottom:12rpx;}
  .tlc-bottom{display:flex;justify-content:space-between;align-items:center;}
  .tlc-operator{font-size:22rpx;color:#94A3B8;}
  .tlc-delete{font-size:22rpx;color:#EF4444;padding:4rpx 12rpx;background:#FEE2E2;border-radius:8rpx;}
}

.empty{text-align:center;padding:80rpx 0; .e-icon{font-size:56rpx;display:block;} .e-txt{font-size:26rpx;color:#94A3B8;display:block;margin-top:12rpx;}}

.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:100;display:flex;align-items:flex-end;}
.modal-card{width:100%;max-height:80vh;background:#FFF;border-radius:32rpx 32rpx 0 0;padding:32rpx 28rpx;}
.m-title{font-size:34rpx;font-weight:800;color:#0F172A;display:block;margin-bottom:20rpx;}
.m-body{max-height:55vh;}
.form-item{margin-bottom:20rpx; &.half{width:calc(50% - 8rpx);} }
.form-row{display:flex;gap:16rpx;}
.fi-label{font-size:26rpx;color:#64748B;display:block;margin-bottom:10rpx;font-weight:500;}
.fi-input{width:100%;height:76rpx;background:#F5F7F4;border-radius:14rpx;padding:0 20rpx;font-size:26rpx;color:#0F172A;box-sizing:border-box;}
.fi-textarea{width:100%;height:140rpx;background:#F5F7F4;border-radius:14rpx;padding:16rpx 20rpx;font-size:26rpx;color:#0F172A;box-sizing:border-box;}
.fi-chips{display:flex;flex-wrap:wrap;gap:10rpx;}
.fi-chip{padding:12rpx 20rpx;background:#F5F7F4;border-radius:14rpx;font-size:24rpx;color:#64748B;transition:all 0.2s; &.active{background:linear-gradient(135deg,#1E40AF,#3B82F6);color:#FFF;font-weight:600;} }
.m-btns{display:flex;gap:16rpx;margin-top:20rpx;}
.m-btn{flex:1;text-align:center;padding:24rpx 0;border-radius:20rpx;font-size:28rpx;font-weight:600; &.cancel{background:#F5F7F4;color:#64748B;} &.confirm{background:linear-gradient(135deg,#1E40AF,#3B82F6);color:#FFF;} }
</style>
