/**
 * AI 能力层状态管理 (Pinia Store)
 * 统一管理 5 大 AI 服务的状态和缓存
 *
 * 页面中使用：
 *   import { useAiStore } from '@/store/ai.js'
 *   const aiStore = useAiStore()
 *   const result = await aiStore.getRecommendations({ preferences: ['水果'] })
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as recommendService from '@/services/ai/recommend.js'
import * as nutritionService from '@/services/ai/nutrition.js'
import * as recipeService from '@/services/ai/recipe.js'
import * as traceService from '@/services/ai/trace.js'
import * as farmerService from '@/services/ai/farmer.js'

export const useAiStore = defineStore('ai', () => {
  // ========== 通用状态 ==========
  const loading = ref(false)
  const loadingMap = ref({})       // { key: true/false } 细粒度加载状态
  const error = ref(null)
  const lastUpdate = ref(null)

  // ========== 推荐状态 ==========
  const personalizedList = ref([])
  const todayRecommendList = ref([])
  const seasonRecommendList = ref([])
  const guessYouLikeList = ref([])
  const recommendReason = ref('')

  // ========== 营养状态 ==========
  const nutritionCache = ref({})   // { [productId]: report }
  const healthAdvice = ref(null)

  // ========== 菜谱状态 ==========
  const recipeCache = ref({})      // { [productId]: { recipes, tip } }
  const recipeDetail = ref(null)

  // ========== 溯源状态 ==========
  const traceReport = ref(null)
  const traceVerification = ref(null)
  const regionQualityCache = ref({})

  // ========== 农户 AI 状态 ==========
  const farmingAdviceCache = ref({})
  const pestWarningCache = ref({})
  const marketAnalysisCache = ref({})

  // ========== 计算属性 ==========
  const isOnline = computed(() => true)  // 后续可检测网络状态
  const hasRecommendations = computed(() => personalizedList.value.length > 0)

  // ========== 单例加载控制 ==========
  const pendingRequests = {}
  function dedupe(key, fn) {
    if (pendingRequests[key]) return pendingRequests[key]
    pendingRequests[key] = fn().finally(() => { delete pendingRequests[key] })
    return pendingRequests[key]
  }

  // ============ 推荐 Actions ============

  /** 获取个性化推荐 */
  async function getRecommendations({ userId, preferences, limit } = {}) {
    const key = 'recommend_personalized'
    return dedupe(key, async () => {
      setLoading(key, true)
      try {
        const res = await recommendService.getPersonalizedRecommend({ userId, preferences, limit })
        personalizedList.value = res.list
        recommendReason.value = res.reason
        return res
      } catch (e) { error.value = e.message; throw e }
      finally { setLoading(key, false); lastUpdate.value = Date.now() }
    })
  }

  /** 获取今日推荐 */
  async function fetchTodayRecommend() {
    const key = 'recommend_today'
    return dedupe(key, async () => {
      setLoading(key, true)
      try {
        const res = await recommendService.getTodayRecommend()
        todayRecommendList.value = res.list
        return res
      } finally { setLoading(key, false) }
    })
  }

  /** 获取时令推荐 */
  async function fetchSeasonRecommend(season) {
    const key = 'recommend_season'
    return dedupe(key, async () => {
      setLoading(key, true)
      try {
        const res = await recommendService.getSeasonRecommend(season)
        seasonRecommendList.value = res.list
        return res
      } finally { setLoading(key, false) }
    })
  }

  /** 获取猜你喜欢 */
  async function fetchGuessYouLike(userId, limit) {
    const res = await recommendService.getGuessYouLike(userId, limit)
    guessYouLikeList.value = res
    return res
  }

  // ============ 营养 Actions ============

  /** 分析商品营养（带缓存） */
  async function analyzeProductNutrition(productId) {
    if (nutritionCache.value[productId]) return nutritionCache.value[productId]
    const key = `nutrition_${productId}`
    return dedupe(key, async () => {
      setLoading(key, true)
      try {
        const res = await nutritionService.analyzeNutrition(productId)
        nutritionCache.value[productId] = res
        return res
      } finally { setLoading(key, false) }
    })
  }

  /** 获取健康建议 */
  async function fetchHealthAdvice(userProfile) {
    const res = await nutritionService.getHealthAdvice(userProfile)
    healthAdvice.value = res
    return res
  }

  /** 对比商品营养 */
  async function compareProducts(productIds) {
    return await nutritionService.compareNutrition(productIds)
  }

  /** 饮食安全检测 */
  async function checkSafety(productId, userProfile) {
    return await nutritionService.checkDietarySafety(productId, userProfile)
  }

  // ============ 菜谱 Actions ============

  /** 根据商品获取菜谱（带缓存） */
  async function getRecipesForProduct(productId, limit) {
    if (recipeCache.value[productId]) return recipeCache.value[productId]
    const key = `recipe_${productId}`
    return dedupe(key, async () => {
      setLoading(key, true)
      try {
        const res = await recipeService.getRecipesByProduct(productId, limit)
        recipeCache.value[productId] = res
        return res
      } finally { setLoading(key, false) }
    })
  }

  /** 获取时令菜谱 */
  async function fetchSeasonalRecipes(season) {
    return await recipeService.getSeasonalRecipes(season)
  }

  /** 获取菜谱详情 */
  async function getRecipeDetailInfo(recipeId) {
    const res = await recipeService.getRecipeDetail(recipeId)
    recipeDetail.value = res
    return res
  }

  /** 智能搭配 */
  async function getSmartCombos(productIds) {
    return await recipeService.getSmartCombo(productIds)
  }

  // ============ 溯源 Actions ============

  /** 分析溯源 */
  async function analyzeTraceInfo(traceId) {
    const key = `trace_${traceId}`
    return dedupe(key, async () => {
      setLoading(key, true)
      try {
        const res = await traceService.analyzeTrace(traceId)
        traceReport.value = res
        return res
      } finally { setLoading(key, false) }
    })
  }

  /** 验证溯源码 */
  async function verifyCode(code) {
    const res = await traceService.verifyTraceCode(code)
    traceVerification.value = res
    return res
  }

  /** 生成溯源报告 */
  async function generateReport(traceId) {
    return await traceService.generateTraceReport(traceId)
  }

  /** 产地品质评估（带缓存） */
  async function evaluateRegion(region) {
    if (regionQualityCache.value[region]) return regionQualityCache.value[region]
    const res = await traceService.evaluateRegionQuality(region)
    regionQualityCache.value[region] = res
    return res
  }

  // ============ 农户 AI Actions ============

  /** 获取种植建议（带缓存） */
  async function getFarmingAdvice(crop, region, options) {
    const cacheKey = `advice_${crop}_${region}`
    if (farmingAdviceCache.value[cacheKey]) return farmingAdviceCache.value[cacheKey]
    setLoading('farming', true)
    try {
      const res = await farmerService.getFarmingAdvice(crop, region, options)
      farmingAdviceCache.value[cacheKey] = res
      return res
    } finally { setLoading('farming', false) }
  }

  /** 病虫害预警（带缓存） */
  async function getPestWarnings(region) {
    if (pestWarningCache.value[region]) return pestWarningCache.value[region]
    const res = await farmerService.getPestWarning(region)
    pestWarningCache.value[region] = res
    return res
  }

  /** 市场分析（带缓存） */
  async function getMarketData(product) {
    if (marketAnalysisCache.value[product]) return marketAnalysisCache.value[product]
    setLoading('market', true)
    try {
      const res = await farmerService.getMarketAnalysis(product)
      marketAnalysisCache.value[product] = res
      return res
    } finally { setLoading('market', false) }
  }

  /** AI生成商品描述 */
  async function genProductDesc(product) {
    return await farmerService.generateProductDesc(product)
  }

  /** 产量预测 */
  async function predictYield(crop, farmData) {
    return await farmerService.getYieldPrediction(crop, farmData)
  }

  /** 智能排产 */
  async function genSchedule(crops, region) {
    return await farmerService.generateSchedule(crops, region)
  }

  // ========== 工具方法 ==========
  function setLoading(key, val) {
    loadingMap.value[key] = val
    loading.value = Object.values(loadingMap.value).some(Boolean)
  }

  function clearCache() {
    nutritionCache.value = {}
    recipeCache.value = {}
    regionQualityCache.value = {}
    farmingAdviceCache.value = {}
    pestWarningCache.value = {}
    marketAnalysisCache.value = {}
  }

  function reset() {
    loading.value = false
    loadingMap.value = {}
    error.value = null
    personalizedList.value = []
    todayRecommendList.value = []
    seasonRecommendList.value = []
    guessYouLikeList.value = []
    healthAdvice.value = null
    traceReport.value = null
    traceVerification.value = null
    clearCache()
  }

  return {
    // 状态
    loading, loadingMap, error, lastUpdate,
    personalizedList, todayRecommendList, seasonRecommendList, guessYouLikeList, recommendReason,
    nutritionCache, healthAdvice,
    recipeCache, recipeDetail,
    traceReport, traceVerification, regionQualityCache,
    farmingAdviceCache, pestWarningCache, marketAnalysisCache,
    // 计算属性
    isOnline, hasRecommendations,
    // 推荐
    getRecommendations, fetchTodayRecommend, fetchSeasonRecommend, fetchGuessYouLike,
    // 营养
    analyzeProductNutrition, fetchHealthAdvice, compareProducts, checkSafety,
    // 菜谱
    getRecipesForProduct, fetchSeasonalRecipes, getRecipeDetailInfo, getSmartCombos,
    // 溯源
    analyzeTraceInfo, verifyCode, generateReport, evaluateRegion,
    // 农户
    getFarmingAdvice, getPestWarnings, getMarketData, genProductDesc, predictYield, genSchedule,
    // 工具
    clearCache, reset,
  }
})
