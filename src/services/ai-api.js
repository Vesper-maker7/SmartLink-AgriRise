/**
 * AI API 服务层
 * — 封装所有AI对话请求，当前为Mock模拟
 * — 预留微信云开发/云函数接口调用位置
 */

// ==================== Mock 知识库 ====================

const advisorResponses = [
  {
    keywords: ['吃什么', '推荐', '今天', '今晚'],
    text: '🌿 为您智能推荐今日菜单：\n\n🥗 **时令推荐一**：清蒸鲈鱼 + 上汤娃娃菜\n搭配：五常有机大米饭\n\n🍲 **养生推荐二**：山药枸杞炖排骨\n搭配：糙米饭 + 凉拌木耳\n\n🌽 **轻食推荐三**：藜麦虾仁沙拉\n搭配：蒸红薯 + 水果\n\n💡 这些食材在商城都有产地直发的哦～',
    cards: [
      { id: 2, name: '五常有机大米5kg', price: 89, image: 'https://via.placeholder.com/200x200/4CAF50/FFFFFF?text=五常大米' },
      { id: 4, name: '宁夏中宁枸杞500g', price: 45, image: 'https://via.placeholder.com/200x200/FF6B35/FFFFFF?text=枸杞' }
    ]
  },
  {
    keywords: ['肠胃', '消化', '胃', '拉肚子'],
    text: '肠胃敏感的话，为您精选温和食材：\n\n🍠 **天山有机雪莲果** — 富含菊粉和益生元，天然调节肠道菌群\n🍚 **有机小米** — 暖胃必备，熬粥最佳\n🍄 **长白山猴头菇** — 传统护胃菌类\n\n⚠️ 暂时避免生冷、辛辣和油腻食物哦~\n\n为您推荐以下商品：',
    cards: [
      { id: 1, name: '天山有机雪莲果', price: 68, image: 'https://via.placeholder.com/200x200/2D8B3E/FFFFFF?text=雪莲果' },
      { id: 8, name: '山西有机小米2kg', price: 35, image: 'https://via.placeholder.com/200x200/F9A825/FFFFFF?text=小米' }
    ]
  },
  {
    keywords: ['送礼', '礼品', '礼物', '送人'],
    text: '🎁 送礼推荐——品质与心意兼备：\n\n🫖 **云南普洱茶饼** — 357g古树春茶，传承经典\n🥩 **金华火腿礼盒** — 正宗五年陈腿，送礼体面\n🐝 **秦岭野生蜂蜜礼盒** — 纯天然0添加\n🍊 **赣南脐橙精品箱** — 皮薄汁多，新鲜直发\n\n以上商品均支持礼品包装和贺卡定制，点击卡片查看更多～',
    cards: [
      { id: 5, name: '云南普洱茶饼357g', price: 298, image: 'https://via.placeholder.com/200x200/795548/FFFFFF?text=普洱茶' },
      { id: 7, name: '赣南脐橙5斤装', price: 39, image: 'https://via.placeholder.com/200x200/FF9800/FFFFFF?text=脐橙' }
    ]
  },
  {
    keywords: ['水果', '鲜果', '当季'],
    text: '🍎 当季鲜果推荐（产地直发，48h到家）：\n\n🍑 **蜜桃** — 7月正当季，甜度18°+\n🍇 **夏黑葡萄** — 无籽爆汁\n🍈 **哈密瓜** — 新疆直发，甜到心里\n🍉 **麒麟西瓜** — 皮薄肉脆\n\n吃当季水果，营养最丰富！您偏爱哪种口味？',
    cards: [
      { id: 1, name: '天山有机雪莲果', price: 68, image: 'https://via.placeholder.com/200x200/2D8B3E/FFFFFF?text=雪莲果' },
      { id: 7, name: '赣南脐橙5斤装', price: 39, image: 'https://via.placeholder.com/200x200/FF9800/FFFFFF?text=脐橙' }
    ]
  },
  {
    keywords: ['养生', '春季', '夏季', '秋季', '冬季', '季节'],
    text: '🍂 四季养生之道——顺时而食：\n\n🌸 **春养肝**：多吃绿色蔬菜，推荐枸杞叶、荠菜\n☀️ **夏养心**：清淡为主，推荐苦瓜、绿豆、莲子\n🍁 **秋养肺**：滋润首选，推荐雪梨、银耳、百合\n❄️ **冬养肾**：温补为宜，推荐羊肉、核桃、黑豆\n\n您目前正处夏季，清热解暑的农产品已为您准备好：',
    cards: [
      { id: 6, name: '长白山野生黑木耳', price: 52, image: 'https://via.placeholder.com/200x200/5D4037/FFFFFF?text=黑木耳' },
      { id: 3, name: '有机初榨橄榄油', price: 128, image: 'https://via.placeholder.com/200x200/8BC34A/FFFFFF?text=橄榄油' }
    ]
  }
]

const nutritionResponses = [
  {
    keywords: ['枸杞', '宁夏'],
    text: '📊 **枸杞营养全解析**（每100g 干枸杞）\n\n━━━━━━━━━━━━━━━━\n🔥 热量：258 kcal\n💪 蛋白质：14.0 g\n🧈 脂肪：1.5 g\n🌾 碳水：64.0 g\n💎 膳食纤维：16.0 g\n━━━━━━━━━━━━━━━━\n\n**关键活性成分：**\n• 枸杞多糖（LBP）— 免疫调节\n• 玉米黄质 — 视网膜保护\n• 甜菜碱 — 肝脏保护\n\n**每日推荐摄入：** 15-20g\n**最佳食用方式：** 泡水/煮粥/直接嚼食\n\n⚠️ 正在服用抗凝血药物者请咨询医生',
    nutritionCard: {
      title: '宁夏中宁枸杞',
      nutrients: [
        { name: '维生素C', value: '48mg', daily: '80%' },
        { name: '铁', value: '6.8mg', daily: '38%' },
        { name: '锌', value: '1.5mg', daily: '14%' },
        { name: '钙', value: '60mg', daily: '8%' },
        { name: '枸杞多糖', value: '3.2g', daily: '—' }
      ],
      productId: 4,
      grade: 'A级推荐'
    }
  },
  {
    keywords: ['热量', '卡路里', '发胖', '减肥', '瘦'],
    text: '⚖️ **常见农产品热量对比**（每100g可食部）\n\n🍎 苹果：52 kcal ← 低卡\n🍌 香蕉：93 kcal ← 适中\n🥑 牛油果：160 kcal ← 高卡但优质脂肪\n🍚 米饭：116 kcal（煮熟）\n🥩 瘦猪肉：143 kcal\n🥜 核桃：654 kcal ← 能量炸弹！\n\n💡 **AI建议**：减肥期间可多用山药、魔芋等低GI食材替代主食，商城有机专区有售。',
    cards: [
      { id: 3, name: '有机初榨橄榄油', price: 128, image: 'https://via.placeholder.com/200x200/8BC34A/FFFFFF?text=橄榄油' },
      { id: 6, name: '长白山野生黑木耳', price: 52, image: 'https://via.placeholder.com/200x200/5D4037/FFFFFF?text=黑木耳' }
    ]
  },
  {
    keywords: ['蛋白', '肌肉', '健身'],
    text: '💪 **高蛋白农产品推荐**\n\n🫘 大豆（干）：36g/100g — 植物蛋白之王\n🌰 花生：25g/100g\n🥚 鸡蛋：13g/100g\n🐟 虾仁：18g/100g\n🐔 鸡胸肉：24g/100g（非农产品，对比参考）\n\n📌 植物蛋白+动物蛋白搭配食用，吸收率更高。商城健身专区已上线高蛋白农产组合。',
    cards: [
      { id: 5, name: '云南普洱茶饼357g', price: 298, image: 'https://via.placeholder.com/200x200/795548/FFFFFF?text=普洱茶' }
    ]
  },
  {
    keywords: ['维C', '维生', '免疫力', '感冒'],
    text: '🛡️ **高维C农产品排行榜**（每100g）\n\n🥝 猕猴桃：62mg ← 补C冠军\n🍓 草莓：47mg\n🍊 脐橙：33mg\n🥬 西兰花：89mg ← 蔬菜之首！\n🌶️ 辣椒：144mg ← 意想不到的冠军\n\n💡 成人每日维C推荐量：100mg\n一个猕猴桃+一份西兰花就够啦！',
    nutritionCard: {
      title: '维C摄入对比',
      nutrients: [
        { name: '猕猴桃', value: '62mg/100g', daily: '62%' },
        { name: '赣南脐橙', value: '33mg/100g', daily: '33%' },
        { name: '西兰花', value: '89mg/100g', daily: '89%' },
        { name: '番茄', value: '19mg/100g', daily: '19%' }
      ],
      grade: '建议与肉类同食提高吸收'
    }
  },
  {
    keywords: ['糖尿', '血糖', '糖'],
    text: '🩸 **低GI农产品推荐**（糖尿病患者友好）\n\n🌾 燕麦：GI值 55\n🍠 山药：GI值 51\n🥦 西兰花：GI值 <15\n🍄 木耳：GI值 <15\n🍚 糙米：GI值 56（替代白米饭）\n\n🚫 避免：糯米饭(GI 87)、土豆泥(GI 87)、西瓜(GI 72)\n\n⚠️ 本建议仅供参考，请遵医嘱制定饮食计划。',
    cards: [
      { id: 6, name: '长白山野生黑木耳', price: 52, image: 'https://via.placeholder.com/200x200/5D4037/FFFFFF?text=黑木耳' },
      { id: 8, name: '山西有机小米2kg', price: 35, image: 'https://via.placeholder.com/200x200/F9A825/FFFFFF?text=小米' }
    ]
  }
]

// 兜底回复
const fallbackAdvisor = {
  text: '好的，我理解您的需求～🍃\n\n作为您的AI饮食顾问，我可以帮您：\n• 根据口味偏好推荐农产品\n• 根据健康需求搭配食材\n• 推荐当季时令鲜品\n• 提供烹饪建议\n\n您不妨告诉我具体想了解的方向，比如"今天吃什么"、"肠胃不好推荐什么"？'
}

const fallbackNutrition = {
  text: '感谢您的咨询～🌿\n\n我可以从以下维度为您分析：\n• 营养成分解析（热量/蛋白/维矿）\n• 食物搭配建议\n• 特定人群膳食指南\n• 应季食材营养对比\n\n请告诉我您想查询的具体食物或营养素，比如"枸杞的营养价值"？'
}

// ==================== Mock AI API ====================

/**
 * 模拟AI响应延迟
 */
function delay(ms = 1200) {
  return new Promise(resolve => setTimeout(resolve, ms + Math.random() * 600))
}

/**
 * 关键词匹配 + 返回结构化响应
 */
function matchResponse(input, store) {
  const lower = input.toLowerCase()
  const matched = store.find(item =>
    item.keywords.some(kw => lower.includes(kw))
  )
  return matched || null
}

/**
 * 核心API：发送消息获取AI回复
 * @param {string} message - 用户输入
 * @param {'advisor'|'nutrition'} mode - 对话模式
 * @returns {Promise<Object>} AI回复对象
 *
 * 预留微信云开发调用位置：
 *   const res = await wx.cloud.callFunction({ name: 'aiChat', data: { message, mode } })
 */
export async function aiChatApi(message, mode = 'advisor') {
  const store = mode === 'advisor' ? advisorResponses : nutritionResponses
  const fallback = mode === 'advisor' ? fallbackAdvisor : fallbackNutrition
  const matched = matchResponse(message, store)

  await delay()

  if (matched) {
    const result = {
      role: 'ai',
      text: matched.text,
      timestamp: Date.now()
    }
    if (matched.cards) result.cards = matched.cards
    if (matched.nutritionCard) result.nutritionCard = matched.nutritionCard
    return result
  }

  return {
    role: 'ai',
    text: fallback.text,
    timestamp: Date.now()
  }
}

/**
 * 获取欢迎语
 */
export function getWelcomeMessage(mode) {
  if (mode === 'advisor') {
    return {
      role: 'ai',
      text: '您好！我是您的AI饮食顾问小兴 🍃\n我可以根据您的健康档案和口味偏好，为您推荐最适合的农产品和饮食方案。\n\n请告诉我您今天想了解什么？比如：\n· 想吃什么类型的食物？\n· 有什么健康需求？\n· 想了解某个产地的特色农产品？',
      timestamp: Date.now()
    }
  }
  return {
    role: 'ai',
    text: '您好！我是AI营养师小链 🌿\n我可以帮您分析食物的营养成分，制定个性化膳食计划。\n\n您可以：\n· 查询任意食物的营养数据\n· 获取每日膳食搭配建议\n· 了解特定营养素的摄入建议',
    timestamp: Date.now()
  }
}

/**
 * 获取快捷问题列表
 */
export function getQuickQuestions(mode) {
  if (mode === 'advisor') {
    return [
      { text: '今天吃什么好？', icon: '🍽️' },
      { text: '推荐有机水果', icon: '🍎' },
      { text: '什么对肠胃好？', icon: '💊' },
      { text: '夏季养生吃什么？', icon: '☀️' },
      { text: '适合送礼的农产品', icon: '🎁' }
    ]
  }
  return [
    { text: '枸杞的营养价值', icon: '🔬' },
    { text: '大米的热量', icon: '⚖️' },
    { text: '糖尿病人饮食建议', icon: '🩸' },
    { text: '维C每天摄入量', icon: '🛡️' },
    { text: '高蛋白食物有哪些', icon: '💪' }
  ]
}

export default {
  aiChatApi,
  getWelcomeMessage,
  getQuickQuestions
}
