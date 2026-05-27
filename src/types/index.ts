// 商品记录
export interface ProductRecord {
  id?: number
  name: string
  price: number
  quantity: number
  purchaseTime: string
  storeName?: string
  categoryId?: string
  platformId?: string
  remark?: string
  userId?: number
  imageUrl?: string
}

// 分类
export interface Category {
  id?: number
  name: string
  emoji: string
  sortOrder?: number
  isDefault?: boolean
  userId?: number
}

// 平台
export interface Platform {
  id?: number
  name: string
  emoji: string
  sortOrder?: number
  isDefault?: boolean
}

// 用户
export interface User {
  id?: number
  nickname?: string
  avatarUrl?: string
  createdAt?: string
}

// 预算
export interface Budget {
  id?: number
  userId: number
  month: string
  totalBudget?: number
  categoryId?: number
  amount: number
  alertThreshold?: number
}