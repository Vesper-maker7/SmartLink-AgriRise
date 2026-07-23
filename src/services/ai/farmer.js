/**
 * AI 农户助手服务
 * 为农户提供种植建议、市场分析、病虫害预警等智能服务。
 * 当前 Mock，后续对接 DeepSeek/OpenAI
 *
 * 调用示例：
 *   import { getFarmingAdvice } from '@/services/ai/farmer.js'
 *   const advice = await getFarmingAdvice('小麦', '河南')
 */

import { farmerMock } from '@/mock/ai.js'

const provider = { name: 'mock' }

function delay(ms = 600) {
  return new Promise(r => setTimeout(r, ms + Math.random() * 400))
}

// ============ 公开 API ============

/**
 * 种植建议 - 基于作物+产地生成种植指导
 * @param {string} crop - 作物名称
 * @param {string} region - 产地
 * @param {Object} [options] - { soilType, season, farmSize }
 * @returns {Promise<{advice: string, schedule: Array, tips: string[], risks: string[]}>}
 */
export async function getFarmingAdvice(crop, region, options = {}) {
  if (provider.name === 'mock') {
    await delay(800)
    return farmerMock.farmingAdvice(crop, region, options)
  }
}

/**
 * 病虫害预警 - 基于地区+季节的病虫害风险预测
 * @param {string} region
 * @returns {Promise<{riskLevel: string, warnings: Array, prevention: Array}>}
 */
export async function getPestWarning(region) {
  if (provider.name === 'mock') {
    await delay(500)
    return farmerMock.pestWarning(region)
  }
}

/**
 * 市场行情分析 - 分析某类农产品的市场价格趋势
 * @param {string} product - 产品名称/分类
 * @returns {Promise<{trend: string, avgPrice: number, range: number[], suggestion: string}>}
 */
export async function getMarketAnalysis(product) {
  if (provider.name === 'mock') {
    await delay(700)
    return farmerMock.marketAnalysis(product)
  }
}

/**
 * AI 商品描述生成 - 为农产品自动生成营销文案
 * @param {Object} product - { name, category, origin, features }
 * @returns {Promise<{title: string, description: string, tags: string[]}>}
 */
export async function generateProductDesc(product) {
  if (provider.name === 'mock') {
    await delay(600)
    return farmerMock.productDesc(product)
  }
}

/**
 * 产量预测 - 基于历史数据+天气预测产量
 * @param {string} crop
 * @param {Object} farmData - { area, history, soilQuality }
 * @returns {Promise<{prediction: number, confidence: number, factors: Array, advice: string}>}
 */
export async function getYieldPrediction(crop, farmData) {
  if (provider.name === 'mock') {
    await delay(750)
    return farmerMock.yieldPrediction(crop, farmData)
  }
}

/**
 * 智能排产 - AI 根据作物周期生成种植日历
 * @param {string[]} crops - 作物列表
 * @param {string} region
 * @returns {Promise<{calendar: Array, conflicts: string[], suggestions: string[]}>}
 */
export async function generateSchedule(crops, region) {
  if (provider.name === 'mock') {
    await delay(650)
    return farmerMock.schedule(crops, region)
  }
}

export default {
  getFarmingAdvice,
  getPestWarning,
  getMarketAnalysis,
  generateProductDesc,
  getYieldPrediction,
  generateSchedule,
}
