import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types'
import { getUser, createUser, getRecordCount, getDayCount } from '@/utils/db'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const recordCount = ref(0)
  const dayCount = ref(0)
  const isLoading = ref(false)

  // 加载用户
  const loadUser = async () => {
    isLoading.value = true
    try {
      let userData = await getUser(1)

      if (!userData) {
        // 创建默认用户
        const now = new Date().toISOString()
        await createUser({
          nickname: '摆摆',
          createdAt: now
        })
        userData = await getUser(1)
      }

      user.value = userData || { id: 1, nickname: '摆摆' }

      // 获取统计数据
      recordCount.value = await getRecordCount()
      dayCount.value = await getDayCount()
    } finally {
      isLoading.value = false
    }
  }

  // 更新用户
  const updateUser = async (updatedUser: User) => {
    user.value = updatedUser
    // TODO: 保存到数据库
  }

  // 刷新统计
  const refreshStats = async () => {
    await loadUser()
  }

  return {
    user,
    recordCount,
    dayCount,
    isLoading,
    loadUser,
    updateUser,
    refreshStats
  }
})