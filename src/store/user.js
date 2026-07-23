import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userData, addressList, couponList } from '@/mock/index.js'

export const useUserStore = defineStore('user', () => {
  const identity = ref(null) // 'consumer' | 'farmer'
  const userInfo = ref({ ...userData })
  const isLoggedIn = ref(false)

  // 地址和优惠券使用可变的浅拷贝
  const addresses = ref(addressList.map(a => ({ ...a })))
  const coupons = ref(couponList.map(c => ({ ...c })))

  const isConsumer = computed(() => identity.value === 'consumer')
  const isFarmer = computed(() => identity.value === 'farmer')

  // 默认地址
  const defaultAddress = computed(() => addresses.value.find(a => a.isDefault) || addresses.value[0] || null)

  // 可用优惠券
  const availableCoupons = computed(() => coupons.value.filter(c => c.status === 'available'))

  function setIdentity(val) {
    identity.value = val
    uni.setStorageSync('identity', val)
  }

  function loadIdentity() {
    const saved = uni.getStorageSync('identity')
    if (saved) {
      identity.value = saved
      isLoggedIn.value = true
      return true
    }
    return false
  }

  function logout() {
    identity.value = null
    isLoggedIn.value = false
    uni.removeStorageSync('identity')
  }

  function addToFavorites(productId) {
    if (!userInfo.value.favorites) {
      userInfo.value.favorites = []
    }
    if (!userInfo.value.favorites.includes(productId)) {
      userInfo.value.favorites.push(productId)
    }
  }

  function removeFromFavorites(productId) {
    if (userInfo.value.favorites) {
      const idx = userInfo.value.favorites.indexOf(productId)
      if (idx > -1) userInfo.value.favorites.splice(idx, 1)
    }
  }

  function isFavorite(productId) {
    return userInfo.value.favorites?.includes(productId) || false
  }

  // ========== 地址管理 ==========
  function getAddressById(id) {
    return addresses.value.find(a => a.id === id) || null
  }

  function addAddress(addr) {
    const newId = Math.max(0, ...addresses.value.map(a => a.id)) + 1
    addresses.value.push({ id: newId, ...addr })
  }

  function updateAddress(id, data) {
    const idx = addresses.value.findIndex(a => a.id === id)
    if (idx > -1) {
      addresses.value[idx] = { ...addresses.value[idx], ...data }
    }
  }

  function removeAddress(id) {
    addresses.value = addresses.value.filter(a => a.id !== id)
  }

  function setDefaultAddress(id) {
    addresses.value.forEach(a => {
      a.isDefault = (a.id === id)
    })
  }

  // ========== 优惠券 ==========
  function useCoupon(id) {
    const coupon = coupons.value.find(c => c.id === id)
    if (coupon) {
      coupon.status = 'used'
    }
  }

  function getBestCoupon(amount) {
    const available = coupons.value
      .filter(c => c.status === 'available' && amount >= c.threshold)
      .sort((a, b) => {
        const aVal = a.type === 'percent' ? amount * a.discount : a.discount
        const bVal = b.type === 'percent' ? amount * b.discount : b.discount
        return bVal - aVal
      })
    return available[0] || null
  }

  return {
    identity,
    userInfo,
    isLoggedIn,
    isConsumer,
    isFarmer,
    addresses,
    coupons,
    defaultAddress,
    availableCoupons,
    setIdentity,
    loadIdentity,
    logout,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getAddressById,
    addAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress,
    useCoupon,
    getBestCoupon
  }
})
