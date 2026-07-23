/**
 * AI 智能推荐服务
 * 当前使用 Mock 数据，后续切换 DeepSeek/OpenAI 只需替换 provider 实现
 * 
 * 调用示例：
 *   import { getPersonalizedRecommend } from '@/services/ai/recommend.js'
 *   const list = await getPersonalizedRecommend({ userId: 'u1', preferences: ['水果'] })
 */

import { recommendMock } from '@/mock/ai.js'

// ============ Provider 配置（后续替换为真实 API） ============
const provider = {
  name: 'mock',
  // 切换到 DeepSeek: 取消注释下方，注释 mock 实现
  // name: 'deepseek',
  // baseURL: 'https://api.deepseek.com/v1',
  // apiKey: process.env.DEEPSEEK_API_KEY,
}

/** 模拟网络延迟 */
function delay(ms = 600) {
  return new Promise(r => setTimeout(r, ms + Math.random() * 400))
}

// ============ 公开 API ============

/**
 * 个性化推荐 - 根据用户偏好 / 浏览历史推荐商品
 * @param {Object} options
 * @param {string} options.userId - 用户ID
 * @param {string[]} [options.preferences] - 偏好分类
 * @param {number} [options.limit=6] - 返回数量
 * @returns {Promise<{list: Array, reason: string}>}
 */
export async function getPersonalizedRecommend({ userId, preferences = [], limit = 6 } = {}) {
  if (provider.name === 'mock') {
    await delay()
    return recommendMock.personalized({ preferences, limit })
  }
  // TODO: DeepSeek/OpenAI 实现
  // const res = await fetch(`${provider.baseURL}/chat/completions`, { ... })
}

/**
 * 今日推荐 - 基于时令/热度的每日精选
 * @returns {Promise<{list: Array, date: string, slogan: string}>}
 */
export async function getTodayRecommend() {
  if (provider.name === 'mock') {
    await delay(400)
    return recommendMock.today()
  }
}

/**
 * 时令推荐 - 根据当前季节推荐应季好物
 * @param {string} [season] - 'spring'|'summer'|'autumn'|'winter'，默认自动检测
 * @returns {Promise<{list: Array, season: string, tip: string}>}
 */
export async function getSeasonRecommend(season) {
  if (provider.name === 'mock') {
    await delay(500)
    return recommendMock.season(season)
  }
}

/**
 * 猜你喜欢 - 基于用户行为的协同过滤推荐
 * @param {string} userId
 * @param {number} [limit=6]
 * @returns {Promise<Array>}
 */
export async function getGuessYouLike(userId, limit = 6) {
  if (provider.name === 'mock') {
    await delay(450)
    return recommendMock.guessYouLike({ userId, limit })
  }
}

export default {
  getPersonalizedRecommend,
  getTodayRecommend,
  getSeasonRecommend,
  getGuessYouLike,
}
