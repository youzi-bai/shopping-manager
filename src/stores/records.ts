import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/utils/api'
import { useUserStore } from './user'

export const useRecordsStore = defineStore('records', () => {
  const records = ref<Record[]>([])
  const isLoading = ref(false)

  // 本月消费总额
  const monthTotal = computed(() => {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    return records.value
      .filter(r => new Date(r.purchase_time!) >= monthStart && new Date(r.purchase_time!) <= monthEnd)
      .reduce((sum, r) => sum + r.price * r.quantity, 0)
  })

  // 上月消费总额
  const lastMonthTotal = computed(() => {
    const now = new Date()
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

    return records.value
      .filter(r => new Date(r.purchase_time!) >= lastMonthStart && new Date(r.purchase_time!) <= lastMonthEnd)
      .reduce((sum, r) => sum + r.price * r.quantity, 0)
  })

  // 环比变化
  const monthChange = computed(() => {
    if (lastMonthTotal.value === 0) return 0
    return ((monthTotal.value - lastMonthTotal.value) / lastMonthTotal.value) * 100
  })

  // 最近记录
  const recentRecords = computed(() => {
    return [...records.value]
      .sort((a, b) => new Date(b.purchase_time!).getTime() - new Date(a.purchase_time!).getTime())
      .slice(0, 8)
  })

  // 按分类筛选记录
  const getRecordsByCategory = (categoryId: number) => {
    return records.value.filter(r => r.category_id === categoryId)
  }

  // 加载记录
  const loadRecords = async (categoryId?: number) => {
    isLoading.value = true
    try {
      const userStore = useUserStore()
      records.value = await api.getRecords({
        user_id: userStore.user?.id,
        category_id: categoryId
      })
    } finally {
      isLoading.value = false
    }
  }

  // 添加记录
  const addRecord = async (record: Omit<Record, 'id' | 'created_at'>) => {
    const userStore = useUserStore()
    const newRecord = await api.addRecord({
      ...record,
      user_id: userStore.user!.id,
      purchase_time: record.purchase_time || new Date().toISOString()
    })
    records.value.unshift(newRecord)
  }

  // 删除记录
  const deleteRecord = async (id: number) => {
    await api.deleteRecord(id)
    records.value = records.value.filter(r => r.id !== id)
  }

  // 获取月度统计
  const getMonthlyStats = async (year: number, month: number) => {
    const userStore = useUserStore()
    return api.getMonthlyStats(year, month, userStore.user?.id)
  }

  return {
    records,
    isLoading,
    monthTotal,
    lastMonthTotal,
    monthChange,
    recentRecords,
    getRecordsByCategory,
    loadRecords,
    addRecord,
    deleteRecord,
    getMonthlyStats
  }
})

interface Record {
  id?: number
  name: string
  price: number
  quantity: number
  purchase_time?: string
  store_name?: string
  category_id?: number
  platform_id?: string
  remark?: string
  user_id: number
  created_at?: string
}