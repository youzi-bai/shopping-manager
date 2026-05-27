import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/utils/api'

export const useUserStore = defineStore('user', () => {
  const user = ref<{ id: number; phone: string; nickname: string; avatar_url: string } | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)

  // 检查登录状态
  const checkLogin = () => {
    const savedToken = uni.getStorageSync('token')
    const savedUser = uni.getStorageSync('user')
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = savedUser
      return true
    }
    return false
  }

  // 发送验证码
  const sendSms = async (phone: string) => {
    const res = await api.sendSms(phone)
    return res.code // 测试用，返回验证码
  }

  // 验证码登录
  const login = async (phone: string, code: string) => {
    isLoading.value = true
    try {
      const res = await api.login(phone, code)
      user.value = res.user
      token.value = res.token
      uni.setStorageSync('token', res.token)
      uni.setStorageSync('user', res.user)
    } finally {
      isLoading.value = false
    }
  }

  // 微信登录
  const wxLogin = async (code: string) => {
    isLoading.value = true
    try {
      const res = await api.wxLogin(code)
      user.value = res.user
      token.value = res.token
      uni.setStorageSync('token', res.token)
      uni.setStorageSync('user', res.user)
    } finally {
      isLoading.value = false
    }
  }

  // 更新用户信息
  const updateUser = async (data: { nickname?: string; avatar_url?: string }) => {
    if (!user.value) return
    const updated = await api.updateUser(user.value.id, data)
    user.value = updated
    uni.setStorageSync('user', updated)
  }

  // 登出
  const logout = () => {
    user.value = null
    token.value = null
    uni.removeStorageSync('token')
    uni.removeStorageSync('user')
  }

  return {
    user,
    token,
    isLoading,
    checkLogin,
    sendSms,
    login,
    wxLogin,
    updateUser,
    logout
  }
})