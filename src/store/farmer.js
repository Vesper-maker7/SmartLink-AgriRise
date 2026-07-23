import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { farmerData, farmerProducts, farmerOrders, farmerStats, farmLogs, traceRecords, statsDashboard } from '@/mock/index.js'

export const useFarmerStore = defineStore('farmer', () => {
  // ========== 农户信息 ==========
  const profile = ref({ ...farmerData })

  // ========== 商品管理 ==========
  const productList = ref(farmerProducts.map(p => ({ ...p })))

  // ========== 订单 ==========
  const orderList = ref(farmerOrders.map(o => ({ ...o, products: o.products.map(pp => ({ ...pp })) })))

  // ========== 农事记录 ==========
  const logList = ref(farmLogs.map(l => ({ ...l })))

  // ========== 溯源 ==========
  const traceList = ref(traceRecords.map(t => ({ ...t })))

  // ========== 统计 ==========
  const stats = ref({ ...farmerStats })
  const dashboard = ref(JSON.parse(JSON.stringify(statsDashboard)))

  // ========== Computed ==========
  const onlineCount = computed(() => productList.value.filter(p => p.status === 'online').length)
  const totalStock = computed(() => productList.value.reduce((s, p) => s + p.stock, 0))
  const pendingOrders = computed(() => orderList.value.filter(o => o.status === 'pending'))
  const pendingCount = computed(() => pendingOrders.value.length)
  const todayNewOrders = computed(() => orderList.value.filter(o => o.status === 'pending').length)

  // 各状态订单
  const ordersByStatus = (status) => orderList.value.filter(o => o.status === status)

  // ========== 商品操作 ==========
  function getProductById(id) {
    return productList.value.find(p => p.id === Number(id)) || null
  }

  function addProduct(data) {
    const newId = Math.max(0, ...productList.value.map(p => p.id)) + 1
    const product = {
      id: newId,
      name: data.name,
      category: data.category || '粮食作物',
      price: Number(data.price) || 0,
      stock: Number(data.stock) || 0,
      sold: 0,
      image: data.image || 'https://via.placeholder.com/200x200/757575/FFFFFF?text=新品',
      images: data.images || [data.image || 'https://via.placeholder.com/600x600/757575/FFFFFF?text=新品'],
      status: data.status || 'offline',
      origin: data.origin || profile.value.address || '',
      spec: data.spec || '',
      shelfLife: data.shelfLife || '',
      desc: data.desc || '',
      traceId: '',
      createTime: new Date().toISOString().slice(0, 10)
    }
    productList.value.unshift(product)
    stats.value.totalProducts = productList.value.length
    uni.showToast({ title: '商品添加成功', icon: 'success' })
    return product
  }

  function updateProduct(id, data) {
    const idx = productList.value.findIndex(p => p.id === Number(id))
    if (idx > -1) {
      productList.value[idx] = { ...productList.value[idx], ...data }
      uni.showToast({ title: '商品更新成功', icon: 'success' })
    }
  }

  function toggleProductStatus(id) {
    const product = getProductById(id)
    if (product) {
      product.status = product.status === 'online' ? 'offline' : 'online'
      const text = product.status === 'online' ? '已上架' : '已下架'
      uni.showToast({ title: text, icon: 'success' })
    }
  }

  function deleteProduct(id) {
    productList.value = productList.value.filter(p => p.id !== Number(id))
    stats.value.totalProducts = productList.value.length
    uni.showToast({ title: '已删除', icon: 'success' })
  }

  // ========== 订单操作 ==========
  function getOrderById(id) {
    return orderList.value.find(o => o.id === id) || null
  }

  function shipOrder(orderId, logisticsData) {
    const order = getOrderById(orderId)
    if (order && order.status === 'pending') {
      order.status = 'shipped'
      order.statusText = '运输中'
      order.shipTime = new Date().toISOString().replace('T', ' ').slice(0, 19)
      order.logistics = {
        company: logisticsData?.company || '顺丰速运',
        no: logisticsData?.no || ('SF' + Date.now().toString(36).toUpperCase())
      }
      // 更新统计
      stats.value.todayOrders = Math.max(0, stats.value.todayOrders - 1)
      uni.showToast({ title: '发货成功', icon: 'success' })
      return true
    }
    uni.showToast({ title: '当前状态不可发货', icon: 'none' })
    return false
  }

  function cancelOrder(orderId) {
    const order = getOrderById(orderId)
    if (order) {
      order.status = 'cancelled'
      order.statusText = '已取消'
      return true
    }
    return false
  }

  // ========== 农事记录操作 ==========
  function addFarmLog(data) {
    const newId = Math.max(0, ...logList.value.map(l => l.id)) + 1
    const log = {
      id: newId,
      date: data.date || new Date().toISOString().slice(0, 10),
      type: data.type || '其他',
      field: data.field || '',
      detail: data.detail || '',
      weather: data.weather || '',
      operator: data.operator || profile.value.name,
      images: data.images || [],
      productId: data.productId || null
    }
    logList.value.unshift(log)
    uni.showToast({ title: '记录添加成功', icon: 'success' })
    return log
  }

  function deleteFarmLog(id) {
    logList.value = logList.value.filter(l => l.id !== Number(id))
    uni.showToast({ title: '记录已删除', icon: 'success' })
  }

  // ========== 溯源操作 ==========
  function getTraceById(id) {
    return traceList.value.find(t => t.id === id) || null
  }

  function addTraceRecord(data) {
    const product = getProductById(data.productId)
    const newId = 'TRC' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(Math.random()).slice(2, 5)
    const record = {
      id: newId,
      productName: product?.name || data.productName,
      productImage: product?.image || '',
      farmName: profile.value.farmName,
      farmerName: profile.value.name,
      origin: product?.origin || '',
      certs: [...profile.value.certifications],
      timeline: [],
      farmLogRefs: []
    }
    traceList.value.push(record)
    if (product) product.traceId = newId
    uni.showToast({ title: '溯源码已生成', icon: 'success' })
    return record
  }

  function addTraceEvent(traceId, event) {
    const trace = getTraceById(traceId)
    if (trace) {
      trace.timeline.push({
        date: new Date().toISOString().slice(0, 10),
        title: event.title,
        detail: event.detail
      })
    }
  }

  // ========== 统计刷新 ==========
  function refreshStats() {
    const pending = orderList.value.filter(o => o.status === 'pending').length
    const todayRevenue = orderList.value
      .filter(o => o.time?.startsWith('2026-07-21') && (o.status === 'completed' || o.status === 'shipped'))
      .reduce((s, o) => s + o.total, 0)
    stats.value = {
      ...stats.value,
      todayOrders: pending,
      todaySales: todayRevenue || stats.value.todaySales,
      totalProducts: productList.value.length
    }
  }

  // ========== 个人资料 ==========
  function updateProfile(data) {
    profile.value = { ...profile.value, ...data }
    uni.showToast({ title: '更新成功', icon: 'success' })
  }

  return {
    profile,
    productList,
    orderList,
    logList,
    traceList,
    stats,
    dashboard,
    onlineCount,
    totalStock,
    pendingOrders,
    pendingCount,
    todayNewOrders,
    ordersByStatus,
    getProductById,
    addProduct,
    updateProduct,
    toggleProductStatus,
    deleteProduct,
    getOrderById,
    shipOrder,
    cancelOrder,
    addFarmLog,
    deleteFarmLog,
    getTraceById,
    addTraceRecord,
    addTraceEvent,
    refreshStats,
    updateProfile
  }
})
