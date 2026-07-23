/**
 * AI 能力层 Mock 数据
 * 为 5 大 AI 服务提供模拟数据，后续切换 DeepSeek/OpenAI 后可直接替换
 */

// ============================================================
// 推荐服务 Mock
// ============================================================
export const recommendMock = {
  personalized({ preferences = [], limit = 6 }) {
    const all = [
      { id: 'prod_apple_aksu', name: '阿克苏冰糖心苹果', category: '水果', origin: '新疆阿克苏', price: 42, score: 4.9, seasonal: true, tag: '时令鲜果' },
      { id: 'prod_goji_ningxia', name: '宁夏有机枸杞', category: '干货', origin: '宁夏中卫', price: 68, score: 4.8, seasonal: false, tag: '养生佳品' },
      { id: 'prod_rice_wuchang', name: '五常有机大米', category: '粮油', origin: '黑龙江五常', price: 59, score: 4.9, seasonal: false, tag: '地理标志' },
      { id: 'prod_tea_puer', name: '云南古树普洱', category: '茶叶', origin: '云南西双版纳', price: 128, score: 4.7, seasonal: false, tag: '年份陈茶' },
      { id: 'prod_orange_gannan', name: '赣南脐橙', category: '水果', origin: '江西赣州', price: 35, score: 4.6, seasonal: true, tag: '国家地理标志' },
      { id: 'prod_yam_henan', name: '铁棍山药', category: '蔬菜', origin: '河南焦作', price: 45, score: 4.8, seasonal: false, tag: '药食同源' },
      { id: 'prod_tea_maojian', name: '信阳毛尖', category: '茶叶', origin: '河南信阳', price: 88, score: 4.7, seasonal: false, tag: '十大名茶' },
      { id: 'prod_grape_xinjiang', name: '新疆葡萄干', category: '干货', origin: '新疆吐鲁番', price: 35, score: 4.5, seasonal: false, tag: '自然晾晒' },
      { id: 'prod_mushroom_dongbei', name: '东北有机黑木耳', category: '干货', origin: '吉林长白山', price: 55, score: 4.6, seasonal: false, tag: '有机认证' },
      { id: 'prod_bean_sichuan', name: '郫县豆瓣酱', category: '调料', origin: '四川成都', price: 25, score: 4.4, seasonal: false, tag: '非遗工艺' },
    ]
    const sorted = preferences.length
      ? [...all].sort((a, b) => {
          const aMatch = preferences.some(p => a.category === p || a.tag?.includes(p)) ? 1 : 0
          const bMatch = preferences.some(p => b.category === p || b.tag?.includes(p)) ? 1 : 0
          return bMatch - aMatch || b.score - a.score
        })
      : all
    return { list: sorted.slice(0, limit), reason: preferences.length ? '根据您的口味偏好智能匹配' : '综合评分精选推荐' }
  },

  today() {
    return {
      date: new Date().toLocaleDateString('zh-CN'),
      slogan: '今日鲜选，从源头到餐桌',
      list: [
        { id: 'prod_apple_aksu', name: '阿克苏冰糖心苹果', price: 42, origin: '新疆', emoji: '🍎', tag: '必买', score: 4.9 },
        { id: 'prod_rice_wuchang', name: '五常有机大米', price: 59, origin: '黑龙江', emoji: '🍚', tag: '精选', score: 4.9 },
        { id: 'prod_goji_ningxia', name: '宁夏有机枸杞', price: 68, origin: '宁夏', emoji: '🫐', tag: '养生', score: 4.8 },
        { id: 'prod_orange_gannan', name: '赣南脐橙', price: 35, origin: '江西', emoji: '🍊', tag: '时令', score: 4.6 },
      ],
    }
  },

  season(season) {
    const now = season || 'summer'
    const data = {
      spring: { list: [
        { id: 'prod_tea_maojian', name: '明前信阳毛尖', emoji: '🍵', tag: '春茶' },
        { id: 'prod_mushroom_dongbei', name: '长白山春木耳', emoji: '🍄', tag: '头茬' },
      ], tip: '春季宜清补，温润养肝' },
      summer: { list: [
        { id: 'prod_apple_aksu', name: '阿克苏苹果', emoji: '🍎', tag: '消暑' },
        { id: 'prod_orange_gannan', name: '赣南脐橙', emoji: '🍊', tag: '维C' },
      ], tip: '夏季宜清淡，多补水补维C' },
      autumn: { list: [
        { id: 'prod_yam_henan', name: '铁棍山药', emoji: '🥔', tag: '润燥' },
        { id: 'prod_goji_ningxia', name: '宁夏枸杞', emoji: '🫐', tag: '进补' },
      ], tip: '秋季宜润燥，滋阴养肺' },
      winter: { list: [
        { id: 'prod_rice_wuchang', name: '五常大米', emoji: '🍚', tag: '囤粮' },
        { id: 'prod_mutton_tan', name: '滩羊肉', emoji: '🥩', tag: '暖身' },
      ], tip: '冬季宜温补，御寒养藏' },
    }
    return { ...data[now], season: now }
  },

  guessYouLike({ limit = 6 }) {
    const items = [
      { id: 'prod_date_litchi', name: '荔枝干', price: 38, emoji: '🍬' },
      { id: 'prod_fungus_silver', name: '古田银耳', price: 42, emoji: '🌸' },
      { id: 'prod_tea_dahongpao', name: '武夷山大红袍', price: 198, emoji: '🍂' },
      { id: 'prod_sanqi_yunnan', name: '文山三七粉', price: 158, emoji: '💊' },
      { id: 'prod_tea_tibet', name: '雅安藏茶', price: 88, emoji: '🫖' },
      { id: 'prod_grape_xinjiang', name: '新疆葡萄干', price: 35, emoji: '🍇' },
      { id: 'prod_chenpi_xinhui', name: '新会陈皮', price: 128, emoji: '🍊' },
    ]
    return items.sort(() => Math.random() - 0.5).slice(0, limit)
  },
}

// ============================================================
// 营养分析 Mock
// ============================================================
export const nutritionMock = {
  productData: {
    prod_apple_aksu: { name: '阿克苏冰糖心苹果', nutrients: [
      { name: '碳水化合物', value: '13.8g/100g', level: '中' },
      { name: '膳食纤维', value: '2.4g/100g', level: '高' },
      { name: '维生素C', value: '4mg/100g', level: '中' },
      { name: '钾', value: '107mg/100g', level: '中' },
      { name: '多酚', value: '丰富', level: '高' },
    ], calories: 52, score: 9.2, tags: ['低热量', '高纤维', '天然抗氧化','含冰糖心'] },
    prod_rice_wuchang: { name: '五常有机大米', nutrients: [
      { name: '碳水化合物', value: '77.9g/100g', level: '高' },
      { name: '蛋白质', value: '7.4g/100g', level: '中' },
      { name: '脂肪', value: '0.8g/100g', level: '低' },
      { name: '维生素B1', value: '0.11mg/100g', level: '中' },
    ], calories: 346, score: 8.8, tags: ['优质碳水', '低脂', '无添加','东北黑土'] },
    prod_goji_ningxia: { name: '宁夏有机枸杞', nutrients: [
      { name: '枸杞多糖', value: '≥3.0g/100g', level: '高' },
      { name: 'β-胡萝卜素', value: '9.75mg/100g', level: '极高' },
      { name: '玉米黄质', value: '60mg/100g', level: '极高' },
      { name: '铁', value: '6.8mg/100g', level: '高' },
    ], calories: 349, score: 9.5, tags: ['护眼明目', '增强免疫', '抗氧化','有机认证'] },
    prod_orange_gannan: { name: '赣南脐橙', nutrients: [
      { name: '维生素C', value: '33mg/100g', level: '极高' },
      { name: '膳食纤维', value: '2.4g/100g', level: '中' },
      { name: '叶酸', value: '30μg/100g', level: '中' },
    ], calories: 47, score: 8.5, tags: ['维C之王', '低GI', '补水'] },
    prod_yam_henan: { name: '铁棍山药', nutrients: [
      { name: '黏蛋白', value: '丰富', level: '极高' },
      { name: '淀粉', value: '16g/100g', level: '中' },
      { name: '钾', value: '213mg/100g', level: '高' },
    ], calories: 57, score: 9.0, tags: ['健脾养胃', '药食同源', '低糖'] },
    prod_mutton_tan: { name: '宁夏滩羊肉', nutrients: [
      { name: '蛋白质', value: '19.0g/100g', level: '高' },
      { name: '铁', value: '3.3mg/100g', level: '高' },
      { name: '锌', value: '6.1mg/100g', level: '极高' },
    ], calories: 203, score: 9.1, tags: ['高蛋白', '滋补', '低胆固醇'] },
  },

  analyze(productId) {
    const data = this.productData[productId]
    if (!data) return { nutrients: [], calories: 0, score: 0, tags: [], summary: '暂无营养数据' }
    return { ...data, summary: `AI分析：${data.name}营养综合评分 ${data.score}/10，${data.tags.slice(0,2).join('、')}` }
  },

  healthAdvice(profile) {
    const { allergies = [], preferences = [] } = profile || {}
    return {
      advice: '根据您的健康档案，建议多摄入高纤维、低GI的天然食材，每日至少摄入5种颜色的蔬果。',
      recommendProducts: [
        { id: 'prod_goji_ningxia', name: '宁夏枸杞', reason: '富含抗氧化物质' },
        { id: 'prod_yam_henan', name: '铁棍山药', reason: '健脾养胃助消化' },
      ],
      warnings: allergies.map(a => `注意避免含${a}的食品`),
    }
  },

  compare(productIds) {
    const items = productIds.map(id => this.productData[id]).filter(Boolean)
    return {
      comparison: items.map(i => ({ name: i.name, calories: i.calories, score: i.score })),
      best: items.sort((a, b) => b.score - a.score)[0]?.name || '--',
      conclusion: '综合评分最高',
    }
  },

  dietarySafety(productId, profile) {
    return { safe: true, warnings: [], recommendation: '该商品符合您的饮食要求，可放心选购。' }
  },
}

// ============================================================
// 菜谱推荐 Mock
// ============================================================
export const recipeMock = {
  recipes: {
    recipe_puer_milk: { id: 'recipe_puer_milk', title: '普洱奶茶', time: '15分钟', difficulty: '简单', emoji: '🫖', ingredients: ['普洱茶10g','牛奶200ml','冰糖适量'], steps: ['1.煮茶出汤','2.倒入牛奶','3.搅拌即可'], tips: '选用古树普洱，口感更醇厚', nutritionPerServing: '约180kcal' },
    recipe_goji_soup: { id: 'recipe_goji_soup', title: '枸杞银耳羹', time: '40分钟', difficulty: '简单', emoji: '🥣', ingredients: ['宁夏枸杞20g','古田银耳15g','冰糖适量','红枣5颗'], steps: ['1.银耳泡发撕小朵','2.加水炖30分钟','3.加枸杞红枣煮10分钟'], tips: '银耳炖出胶质口感最佳', nutritionPerServing: '约120kcal' },
    recipe_mutton_stew: { id: 'recipe_mutton_stew', title: '清炖滩羊肉', time: '2小时', difficulty: '中等', emoji: '🍲', ingredients: ['滩羊肉500g','白萝卜1根','姜片','枸杞','香菜'], steps: ['1.羊肉焯水去膻','2.冷水下锅炖1.5h','3.加白萝卜炖30分钟','4.撒枸杞香菜出锅'], tips: '汤清味鲜，冬季暖身首选', nutritionPerServing: '约320kcal' },
    recipe_salad: { id: 'recipe_salad', title: '冰糖心苹果沙拉', time: '10分钟', difficulty: '简单', emoji: '🥗', ingredients: ['阿克苏苹果2个','酸奶100g','蜂蜜适量','核桃碎少许'], steps: ['1.苹果切块','2.淋酸奶和蜂蜜','3.撒核桃碎'], tips: '冷藏30分钟更爽口', nutritionPerSending: '约160kcal' },
    recipe_rice_bowl: { id: 'recipe_rice_bowl', title: '五常米饭配菜', time: '30分钟', difficulty: '简单', emoji: '🍱', ingredients: ['五常大米1杯','时蔬','鸡蛋'], steps: ['1.洗米浸泡15分钟','2.电饭煲正常煮','3.搭配清炒时蔬'], tips: '米水比例1:1.1最佳', nutritionPerServing: '约400kcal' },
    recipe_orange_juice: { id: 'recipe_orange_juice', title: '鲜榨脐橙汁', time: '5分钟', difficulty: '简单', emoji: '🧃', ingredients: ['赣南脐橙4个'], steps: ['1.脐橙去皮','2.榨汁即可'], tips: '现榨现饮，维C不流失', nutritionPerServing: '约120kcal' },
  },
  byProductMap: {
    prod_tea_puer: ['recipe_puer_milk'],
    prod_goji_ningxia: ['recipe_goji_soup'],
    prod_mutton_tan: ['recipe_mutton_stew'],
    prod_apple_aksu: ['recipe_salad'],
    prod_rice_wuchang: ['recipe_rice_bowl'],
    prod_orange_gannan: ['recipe_orange_juice'],
  },

  byProduct(productId, limit = 3) {
    const ids = this.byProductMap[productId] || Object.keys(this.recipes).slice(0, limit)
    const recipes = ids.map(id => this.recipes[id]).filter(Boolean).slice(0, limit)
    return { recipes, productName: '所选食材', tip: recipes.length ? '以下菜谱由AI智能推荐' : '暂无推荐菜谱' }
  },

  seasonal(season = 'summer') {
    const map = {
      spring: ['recipe_salad', 'recipe_orange_juice'],
      summer: ['recipe_salad', 'recipe_orange_juice'],
      autumn: ['recipe_goji_soup', 'recipe_rice_bowl'],
      winter: ['recipe_mutton_stew', 'recipe_goji_soup'],
    }
    return (map[season] || map.summer).map(id => this.recipes[id]).filter(Boolean)
  },

  detail(recipeId) {
    return this.recipes[recipeId] || null
  },

  smartCombo(productIds) {
    return {
      combos: [
        { name: '一荤一素', recipes: [this.recipes.recipe_mutton_stew, this.recipes.recipe_salad] },
        { name: '主食+甜点', recipes: [this.recipes.recipe_rice_bowl, this.recipes.recipe_goji_soup] },
      ],
      totalCalories: 480,
      tip: 'AI已为您均衡搭配，营养全面',
    }
  },
}

// ============================================================
// 溯源分析 Mock
// ============================================================
export const traceMock = {
  analyze(traceId) {
    return {
      score: 96,
      completeness: 100,
      events: 8,
      summary: '溯源链条完整，从育种到运输全程记录，区块链哈希校验通过。所有环节均有农户操作签名和检测报告。',
      risks: [],
    }
  },

  verify(code) {
    return {
      valid: true,
      product: { name: '阿克苏冰糖心苹果', origin: '新疆阿克苏', farmer: '张学农' },
      records: [
        { stage: '育种', date: '2025-03-01', detail: '选用优质矮化砧木' },
        { stage: '种植', date: '2025-03-15', detail: '有机肥基施，滴灌安装' },
        { stage: '施肥', date: '2025-05-20', detail: '追施有机液肥' },
        { stage: '采摘', date: '2025-10-10', detail: '人工采摘，分级筛选' },
        { stage: '运输', date: '2025-10-12', detail: '冷链运输 -18°C' },
      ],
      blockchainHash: '0x8a3f...7d2e',
    }
  },

  report(traceId) {
    return {
      title: '阿克苏苹果溯源报告',
      summary: '本产品溯源链条完整，区块链存证，100%可追溯。',
      timeline: [
        { date: '2025-03-01', event: '育种选苗', detail: '天山农场3号果园，矮化密植技术', icon: '🌱' },
        { date: '2025-04-10', event: '定植施肥', detail: '有机肥300kg/亩，滴灌系统运行正常', icon: '💧' },
        { date: '2025-06-15', event: '套袋管理', detail: '果袋覆盖率100%，防虫防药残', icon: '🛡️' },
        { date: '2025-08-20', event: '拆袋上色', detail: '昼夜温差>12°C，冰糖心形成关键期', icon: '☀️' },
        { date: '2025-10-10', event: '采摘分选', detail: '单果≥80mm，糖度≥16%，冷链预冷', icon: '🧺' },
      ],
      farmInfo: { name: '天山农场', area: '1200亩', altitude: '1100m', annualSunshine: '2800h' },
      certInfo: ['绿色食品认证', '地理标志产品', '有机转换认证'],
    }
  },

  regionQuality(region) {
    const data = {
      '新疆': { score: 95, factors: ['日照2800h+/年','昼夜温差大','雪水灌溉','沙质土壤'], summary: '气候条件极为优越，苹果糖度平均高出同类2-3°Bx。' },
      '黑龙江': { score: 90, factors: ['黑土有机质含量高','温差大','水源纯净'], summary: '世界三大黑土带，有机质含量高达3%-5%。' },
      '云南': { score: 92, factors: ['高海拔1800m','云雾多','红壤'], summary: '高海拔赋予茶叶独特香气和内含物。' },
    }
    return data[region] || { score: 80, factors: ['条件良好'], summary: '产量稳定，品质中上。' }
  },
}

// ============================================================
// 农户助手 Mock
// ============================================================
export const farmerMock = {
  farmingAdvice(crop, region, options = {}) {
    const base = {
      advice: `【${region}地区${crop}种植方案】基于本地历史气候数据（年均温12°C，无霜期210天），推荐以下方案：`,
      schedule: [
        { phase: '播种/定植', period: '3月下旬-4月上旬', key: '地温稳定在10°C以上' },
        { phase: '生长期管理', period: '5-7月', key: '及时追肥，注意排水防涝' },
        { phase: '病虫害防治', period: '全季', key: '预防为主，生物防治优先' },
        { phase: '采收', period: '9-10月', key: '选择晴朗天气，分批采收' },
      ],
      tips: ['建议轮作，避免连作障碍', '倡导减量施用化肥，推广有机肥'],
      risks: ['注意防范倒春寒', '7-8月关注暴雨预警'],
    }
    return base
  },

  pestWarning(region) {
    return {
      riskLevel: '低',
      warnings: [
        { pest: '蚜虫', level: '低', period: '5-6月', prevention: '黄板诱杀 + 瓢虫生物防治' },
        { pest: '霜霉病', level: '中', period: '6-7月多雨季', prevention: '合理修剪通风，必要时低毒杀菌剂' },
      ],
      prevention: ['定期巡田，早发现早处理', '优先使用物理和生物防治手段'],
    }
  },

  marketAnalysis(product) {
    return {
      trend: '稳中有升',
      trendIcon: '📈',
      avgPrice: 45,
      range: [35, 55],
      comparison: '较上月↑8.5%',
      suggestion: '当前处于市场需求上升期，建议适当增加供应量，关注电商渠道价格波动。',
      forecast: '未来1个月预计需求增长12%，价格有望上涨5%-8%。',
    }
  },

  productDesc(product) {
    const { name, category, origin, features = '' } = product
    return {
      title: `【产地直发】${origin}正宗${name}`,
      description: `来自${origin}的优质${category}，${features || '自然生长，品质保证'}。全程溯源，从田间到餐桌，每一口都是自然的馈赠。`,
      tags: ['产地直发', '品质溯源', '绿色生态', '新鲜直达'],
    }
  },

  yieldPrediction(crop, farmData) {
    return {
      prediction: 8500,
      unit: 'kg/亩',
      confidence: 92,
      factors: [
        { name: '土壤肥力', impact: '积极', score: 8.5 },
        { name: '灌溉条件', impact: '积极', score: 9.0 },
        { name: '气候预测', impact: '中性', score: 7.0 },
        { name: '病虫害风险', impact: '低风险', score: 8.8 },
      ],
      advice: '基于当前条件，亩产预测为8500kg/亩，置信度92%。建议加强后期水肥管理，可提升5%-8%。',
    }
  },

  schedule(crops, region) {
    return {
      calendar: [
        { month: '3月', tasks: ['整地施肥', '播种育苗'] },
        { month: '4月', tasks: ['定植移栽', '滴灌铺设'] },
        { month: '5月', tasks: ['追肥', '除草'] },
        { month: '6-7月', tasks: ['病虫害防治', '灌溉管理'] },
        { month: '8月', tasks: ['追肥增产', '疏果'] },
        { month: '9-10月', tasks: ['采收', '分级包装'] },
        { month: '11-2月', tasks: ['冬季修剪', '清园消毒'] },
      ],
      conflicts: crops.length > 2 ? ['多种作物采收期可能重叠，建议合理规划人力'] : [],
      suggestions: ['建议采用套种模式提高土地利用率', '采收期提前预约冷链物流，避免滞销'],
    }
  },
}
