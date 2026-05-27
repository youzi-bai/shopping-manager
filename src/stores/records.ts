import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ProductRecord } from '@/types'
import { getRecords, addRecord as dbAddRecord, deleteRecord as dbDeleteRecord, getTotalAmount } from '@/utils/db'

export const useRecordsStore = defineStore('records', () => {
  const records = ref<ProductRecord[]>([])
  const isLoading = ref(false)

  // 本月消费总额
  const monthTotal = computed(() => {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    return records.value
      .filter(r => {
        const date = new Date(r.purchaseTime)
        return date >= monthStart && date <= monthEnd
      })
      .reduce((sum, r) => sum + r.price * r.quantity, 0)
  })

  // 上月消费总额
  const lastMonthTotal = computed(() => {
    const now = new Date()
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

    return records.value
      .filter(r => {
        const date = new Date(r.purchaseTime)
        return date >= lastMonthStart && date <= lastMonthEnd
      })
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
      .sort((a, b) => new Date(b.purchaseTime).getTime() - new Date(a.purchaseTime).getTime())
      .slice(0, 8)
  })

  // 按分类筛选记录
  const getRecordsByCategory = (categoryId: string) => {
    return records.value.filter(r => r.categoryId === categoryId)
  }

  // 加载记录
  const loadRecords = async (categoryId?: string) => {
    isLoading.value = true
    try {
      records.value = await getRecords(categoryId)
    } finally {
      isLoading.value = false
    }
  }

  // 添加记录
  const addRecord = async (record: ProductRecord) => {
    await dbAddRecord(record)
    await loadRecords()
  }

  // 删除记录
  const deleteRecord = async (id: number) => {
    await dbDeleteRecord(id)
    await loadRecords()
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
    deleteRecord
  }
})