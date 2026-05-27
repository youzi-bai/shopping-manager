const BASE_URL = 'http://localhost:8000'

const request = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    },
    ...options
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(error.detail || 'Request failed')
  }
  return response.json()
}

// 用户相关
export const api = {
  // 发送验证码
  sendSms: (phone: string) =>
    request<{ message: string; code: string }>('/users/send-sms', {
      method: 'POST',
      body: JSON.stringify({ phone })
    }),

  // 验证码登录
  login: (phone: string, code: string) =>
    request<{ user: User; token: string }>('/users/login', {
      method: 'POST',
      body: JSON.stringify({ phone, code })
    }),

  // 微信登录
  wxLogin: (code: string) =>
    request<{ user: User; token: string }>(`/users/wx-login?code=${code}`, {
      method: 'POST'
    }),

  // 获取用户信息
  getUser: (userId: number) =>
    request<User>(`/users/${userId}`),

  // 更新用户信息
  updateUser: (userId: number, data: { nickname?: string; avatar_url?: string }) =>
    request<User>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  // 分类
  getCategories: () =>
    request<Category[]>('/categories/'),

  addCategory: (data: Category) =>
    request<Category>('/categories/', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // 记录
  getRecords: (params?: { user_id?: number; category_id?: number }) => {
    const query = new URLSearchParams()
    if (params?.user_id) query.set('user_id', params.user_id.toString())
    if (params?.category_id) query.set('category_id', params.category_id.toString())
    const qs = query.toString()
    return request<Record[]>(`/records/${qs ? '?' + qs : ''}`)
  },

  addRecord: (data: Record) =>
    request<Record>('/records/', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  deleteRecord: (id: number) =>
    request<{ message: string }>(`/records/${id}`, {
      method: 'DELETE'
    }),

  getMonthlyStats: (year: number, month: number, userId?: number) => {
    const query = new URLSearchParams({ year: year.toString(), month: month.toString() })
    if (userId) query.set('user_id', userId.toString())
    return request<{ year: number; month: number; total: number; count: number; by_category: Record<number, number> }>(
      `/records/stats/monthly?${query}`
    )
  }
}

interface User {
  id: number
  phone: string
  nickname: string
  avatar_url: string
  created_at: string
}

interface Category {
  id?: number
  name: string
  emoji: string
  sort_order?: number
  is_default?: boolean
}

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