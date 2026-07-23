import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { aiChatApi, getWelcomeMessage } from '@/services/ai-api.js'

const HISTORY_KEY = 'ai_chat_history'

/**
 * 聊天状态管理
 * — 管理两个聊天Tab的消息、打字状态、历史持久化
 */
export const useChatStore = defineStore('chat', () => {
  // ========== 状态 ==========
  const currentTab = ref('advisor') // 'advisor' | 'nutrition'
  const isTyping = ref(false)

  // 消息存储
  const advisorMessages = ref([])
  const nutritionMessages = ref([])

  // ========== 计算属性 ==========
  const currentMessages = computed(() =>
    currentTab.value === 'advisor' ? advisorMessages.value : nutritionMessages.value
  )

  const hasMessages = computed(() => currentMessages.value.length > 0)

  // ========== 初始化 ==========
  function init() {
    // 尝试从本地存储还原历史
    try {
      const saved = uni.getStorageSync(HISTORY_KEY)
      if (saved) {
        const data = JSON.parse(saved)
        if (data.advisor?.length) advisorMessages.value = data.advisor
        if (data.nutrition?.length) nutritionMessages.value = data.nutrition
      }
    } catch (e) {
      // 忽略解析错误
    }

    // 没有历史则展示欢迎语
    if (advisorMessages.value.length === 0) {
      advisorMessages.value.push(getWelcomeMessage('advisor'))
    }
    if (nutritionMessages.value.length === 0) {
      nutritionMessages.value.push(getWelcomeMessage('nutrition'))
    }
  }

  // ========== 持久化 ==========
  function persistHistory() {
    uni.setStorageSync(HISTORY_KEY, JSON.stringify({
      advisor: advisorMessages.value.slice(-50),   // 最多保留50条
      nutrition: nutritionMessages.value.slice(-50)
    }))
  }

  // ========== 切换Tab ==========
  function switchTab(tab) {
    currentTab.value = tab
  }

  // ========== 发送消息 ==========
  async function sendMessage(text) {
    if (!text?.trim() || isTyping.value) return

    const msgList = currentTab.value === 'advisor' ? advisorMessages : nutritionMessages

    // 添加用户消息
    msgList.value.push({
      role: 'user',
      text: text.trim(),
      timestamp: Date.now()
    })
    persistHistory()

    // 进入打字状态
    isTyping.value = true

    try {
      const response = await aiChatApi(text, currentTab.value)
      msgList.value.push(response)
      persistHistory()
    } catch (err) {
      msgList.value.push({
        role: 'ai',
        text: '抱歉，网络开小差了～请稍后重试 😥',
        timestamp: Date.now()
      })
    } finally {
      isTyping.value = false
    }
  }

  // ========== 清空历史 ==========
  function clearHistory(tab) {
    if (tab) {
      // 清空指定tab
      if (tab === 'advisor') {
        advisorMessages.value = [getWelcomeMessage('advisor')]
      } else {
        nutritionMessages.value = [getWelcomeMessage('nutrition')]
      }
    } else {
      // 清空全部
      advisorMessages.value = [getWelcomeMessage('advisor')]
      nutritionMessages.value = [getWelcomeMessage('nutrition')]
    }
    persistHistory()
  }

  // ========== 重新生成 ==========
  async function regenerate() {
    const msgList = currentTab.value === 'advisor' ? advisorMessages : nutritionMessages

    // 找到最后一条用户消息
    const lastUserIdx = [...msgList.value].reverse().findIndex(m => m.role === 'user')
    if (lastUserIdx === -1) return

    const actualIdx = msgList.value.length - 1 - lastUserIdx
    const lastUserMsg = msgList.value[actualIdx]

    // 移除最后一条AI回复
    if (msgList.value[msgList.value.length - 1]?.role === 'ai') {
      msgList.value.pop()
    }

    isTyping.value = true
    try {
      const response = await aiChatApi(lastUserMsg.text, currentTab.value)
      msgList.value.push(response)
      persistHistory()
    } catch (err) {
      msgList.value.push({
        role: 'ai',
        text: '抱歉，重新生成失败，请稍后重试 😥',
        timestamp: Date.now()
      })
    } finally {
      isTyping.value = false
    }
  }

  return {
    currentTab,
    isTyping,
    advisorMessages,
    nutritionMessages,
    currentMessages,
    hasMessages,
    init,
    switchTab,
    sendMessage,
    clearHistory,
    regenerate,
    persistHistory
  }
})
