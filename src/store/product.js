import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { products, categories, consumerOrders } from '@/mock/index.js'

export const useProductStore = defineStore('product', () => {
  // ========== 商品相关 ==========
  const productList = ref([...products])
  const categoryList = ref([...categories])
  const activeCategory = ref(1)
  const searchKeyword = ref('')

  // ========== 购物车 ==========
  const cart = ref([])
  // 选中的购物车商品ID集合（用于购物车勾选）
  const selectedCartIds = ref([])

  // ========== 订单 ==========
  const orders = ref([...consumerOrders])
  // 当前待确认订单（下单流程中使用）
  const pendingOrder = ref(null)

  const filteredProducts = computed(() => {
    let list = productList.value
    if (activeCategory.value !== 1) {
      const catName = categoryList.value.find(c => c.id === activeCategory.value)?.name
      if (catName) {
        list = list.filter(p => p.category === catName)
      }
    }
    if (searchKeyword.value) {
      const kw = searchKeyword.value.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(kw) || p.origin.toLowerCase().includes(kw))
    }
    return list
  })

  const cartCount = computed(() => cart.value.length)
  const cartTotal = computed(() => {
    const selected = getSelectedCartItems()
    return selected.reduce((sum, item) => sum + item.price * item.quantity, 0)
  })

  // 是否全选
  const isAllSelected = computed(() => {
    return cart.value.length > 0 && selectedCartIds.value.length === cart.value.length
  })

  function getProductById(id) {
    return productList.value.find(p => p.id === Number(id)) || null
  }

  function setCategory(id) {
    activeCategory.value = id
  }

  function setSearchKeyword(kw) {
    searchKeyword.value = kw
  }

  // ========== 购物车逻辑 ==========
  function addToCart(product, quantity = 1) {
    const exist = cart.value.find(item => item.id === product.id)
    if (exist) {
      exist.quantity += quantity
    } else {
      cart.value.push({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity
      })
      selectedCartIds.value.push(product.id)
    }
    uni.showToast({ title: '已加入购物车', icon: 'success' })
  }

  function removeFromCart(productId) {
    cart.value = cart.value.filter(item => item.id !== productId)
    selectedCartIds.value = selectedCartIds.value.filter(id => id !== productId)
  }

  function updateCartQuantity(productId, quantity) {
    const item = cart.value.find(i => i.id === productId)
    if (item) {
      item.quantity = Math.max(1, quantity)
    }
  }

  function toggleCartSelect(productId) {
    const idx = selectedCartIds.value.indexOf(productId)
    if (idx > -1) {
      selectedCartIds.value.splice(idx, 1)
    } else {
      selectedCartIds.value.push(productId)
    }
  }

  function toggleSelectAll() {
    if (isAllSelected.value) {
      selectedCartIds.value = []
    } else {
      selectedCartIds.value = cart.value.map(item => item.id)
    }
  }

  function getSelectedCartItems() {
    return cart.value.filter(item => selectedCartIds.value.includes(item.id))
  }

  function clearCart() {
    cart.value = []
    selectedCartIds.value = []
  }

  // ========== 订单逻辑 ==========
  function createOrder(orderData) {
    const newOrder = {
      id: 'DD' + Date.now().toString().slice(-10),
      time: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: 'pending',
      statusText: '待付款',
      ...orderData
    }
    orders.value.unshift(newOrder)
    return newOrder
  }

  function setPendingOrder(data) {
    pendingOrder.value = data
  }

  function getOrderById(id) {
    return orders.value.find(o => o.id === id) || null
  }

  function updateOrderStatus(orderId, status, statusText) {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = status
      order.statusText = statusText
    }
  }

  return {
    productList,
    categoryList,
    activeCategory,
    searchKeyword,
    cart,
    selectedCartIds,
    orders,
    pendingOrder,
    filteredProducts,
    cartCount,
    cartTotal,
    isAllSelected,
    getProductById,
    setCategory,
    setSearchKeyword,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    toggleCartSelect,
    toggleSelectAll,
    getSelectedCartItems,
    clearCart,
    createOrder,
    setPendingOrder,
    getOrderById,
    updateOrderStatus
  }
})
