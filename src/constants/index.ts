// 分类颜色映射
export const categoryColors: Record<string, string> = {
  '1': 'var(--category-food)',
  '2': 'var(--category-clothing)',
  '3': 'var(--category-digital)',
  '4': 'var(--category-daily)',
  '5': 'var(--category-beauty)',
  '6': 'var(--category-entertainment)',
  '7': 'var(--category-transport)',
  '8': 'var(--category-education)',
  '9': 'var(--category-medical)',
  '10': 'var(--category-other)'
}

// 分类 emoji 映射
export const categoryEmojis: Record<number, string> = {
  1: '🍞',
  2: '👕',
  3: '📱',
  4: '🏠',
  5: '💄',
  6: '🎬',
  7: '🚗',
  8: '📚',
  9: '🏥',
  10: '📦'
}

// 平台 emoji 映射
export const platformEmojis: Record<string, string> = {
  'taobao': '🛒',
  'jd': '📦',
  'pinduoduo': '🟡',
  'store': '🏪',
  'other': '🟢'
}

// 友好文案
export const friendlyText: Record<string, string> = {
  productName: '买了啥~',
  price: '多少钱呀~',
  quantity: '数量',
  date: '啥时候买的~',
  store: '哪儿买的~',
  category: '分类',
  platform: '平台',
  remark: '备注',
  save: '保存✨',
  saveSuccess: '记好啦~',
  delete: '删除',
  deleteConfirm: '确定要删除吗？',
  deleted: '已删除',
  emptyHome: '还没有记录，记第一笔吧~',
  emptyCategory: '这个分类还是空的~',
  emptyBill: '数据太少啦，多记几笔就能看到趋势了~',
  ocrLoading: 'AI正在看小票...',
  ocrSuccess: '识别好啦~',
  retry: '重新识别',
  monthlyConsumption: '本月消费',
  vsLastMonth: '较上月',
  dailyAverage: '日均',
  records: '笔',
  viewAll: '查看全部',
  topSpending: '大额消费 TOP',
  consumptionTrend: '消费趋势',
  categoryBreakdown: '分类占比',
  budgetSetup: '预算设置',
  reminderSetup: '提醒设置',
  cloudSync: '云端同步',
  dataExport: '数据导出',
  securitySetup: '安全设置',
  themeSetup: '主题设置',
  about: '关于',
  helpFeedback: '帮助与反馈'
}