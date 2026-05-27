import type { ProductRecord, Category, User } from '@/types'

// localStorage keys
const STORAGE_KEYS = {
  RECORDS: 'shopping_records',
  CATEGORIES: 'shopping_categories',
  USERS: 'shopping_users',
  RECORD_ID: 'shopping_record_id',
  CATEGORY_ID: 'shopping_category_id',
  USER_ID: 'shopping_user_id'
}

// 默认分类
const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: '食品', emoji: '🍞', sortOrder: 0, isDefault: true },
  { id: 2, name: '服装', emoji: '👕', sortOrder: 1, isDefault: true },
  { id: 3, name: '数码', emoji: '📱', sortOrder: 2, isDefault: true },
  { id: 4, name: '日用', emoji: '🏠', sortOrder: 3, isDefault: true },
  { id: 5, name: '美妆', emoji: '💄', sortOrder: 4, isDefault: true },
  { id: 6, name: '娱乐', emoji: '🎬', sortOrder: 5, isDefault: true },
  { id: 7, name: '交通', emoji: '🚗', sortOrder: 6, isDefault: true },
  { id: 8, name: '教育', emoji: '📚', sortOrder: 7, isDefault: true },
  { id: 9, name: '医疗', emoji: '🏥', sortOrder: 8, isDefault: true },
  { id: 10, name: '其他', emoji: '📦', sortOrder: 9, isDefault: true }
]

// 初始化 localStorage
function initStorage() {
  if (typeof uni === 'undefined') return

  // 初始化分类
  const categories = uni.getStorageSync(STORAGE_KEYS.CATEGORIES)
  if (!categories) {
    uni.setStorageSync(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES)
    uni.setStorageSync(STORAGE_KEYS.CATEGORY_ID, 11)
  }

  // 初始化ID计数器
  if (!uni.getStorageSync(STORAGE_KEYS.RECORD_ID)) {
    uni.setStorageSync(STORAGE_KEYS.RECORD_ID, 1)
  }
  if (!uni.getStorageSync(STORAGE_KEYS.USER_ID)) {
    uni.setStorageSync(STORAGE_KEYS.USER_ID, 1)
  }
}

// 在小程序和App端初始化
initStorage()

// 记录操作
export async function getRecords(categoryId?: string): Promise<ProductRecord[]> {
  let records: ProductRecord[] = uni.getStorageSync(STORAGE_KEYS.RECORDS) || []

  if (categoryId) {
    records = records.filter(r => r.categoryId === categoryId)
  }

  return records.sort((a, b) => new Date(b.purchaseTime).getTime() - new Date(a.purchaseTime).getTime())
}

export async function addRecord(record: ProductRecord): Promise<number> {
  const records: ProductRecord[] = uni.getStorageSync(STORAGE_KEYS.RECORDS) || []
  let id = uni.getStorageSync(STORAGE_KEYS.RECORD_ID) || 1

  const newRecord = { ...record, id }
  records.push(newRecord)

  uni.setStorageSync(STORAGE_KEYS.RECORDS, records)
  uni.setStorageSync(STORAGE_KEYS.RECORD_ID, id + 1)

  return id
}

export async function updateRecord(record: ProductRecord): Promise<void> {
  const records: ProductRecord[] = uni.getStorageSync(STORAGE_KEYS.RECORDS) || []
  const index = records.findIndex(r => r.id === record.id)

  if (index >= 0) {
    records[index] = record
    uni.setStorageSync(STORAGE_KEYS.RECORDS, records)
  }
}

export async function deleteRecord(id: number): Promise<void> {
  const records: ProductRecord[] = uni.getStorageSync(STORAGE_KEYS.RECORDS) || []
  const filtered = records.filter(r => r.id !== id)
  uni.setStorageSync(STORAGE_KEYS.RECORDS, filtered)
}

// 分类操作
export async function getCategories(): Promise<Category[]> {
  const categories: Category[] = uni.getStorageSync(STORAGE_KEYS.CATEGORIES) || DEFAULT_CATEGORIES
  return categories.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
}

export async function addCategory(category: Category): Promise<number> {
  const categories: Category[] = uni.getStorageSync(STORAGE_KEYS.CATEGORIES) || []
  let id = uni.getStorageSync(STORAGE_KEYS.CATEGORY_ID) || 11

  const newCategory = { ...category, id }
  categories.push(newCategory)

  uni.setStorageSync(STORAGE_KEYS.CATEGORIES, categories)
  uni.setStorageSync(STORAGE_KEYS.CATEGORY_ID, id + 1)

  return id
}

export async function updateCategory(category: Category): Promise<void> {
  const categories: Category[] = uni.getStorageSync(STORAGE_KEYS.CATEGORIES) || []
  const index = categories.findIndex(c => c.id === category.id)

  if (index >= 0) {
    categories[index] = category
    uni.setStorageSync(STORAGE_KEYS.CATEGORIES, categories)
  }
}

export async function deleteCategory(id: number): Promise<void> {
  const categories: Category[] = uni.getStorageSync(STORAGE_KEYS.CATEGORIES) || []
  const filtered = categories.filter(c => c.id !== id)
  uni.setStorageSync(STORAGE_KEYS.CATEGORIES, filtered)
}

// 用户操作
export async function getUser(id: number): Promise<User | null> {
  const users: User[] = uni.getStorageSync(STORAGE_KEYS.USERS) || []
  return users.find(u => u.id === id) || null
}

export async function createUser(user: Partial<User>): Promise<number> {
  const users: User[] = uni.getStorageSync(STORAGE_KEYS.USERS) || []
  let id = uni.getStorageSync(STORAGE_KEYS.USER_ID) || 1

  const newUser = { ...user, id } as User
  users.push(newUser)

  uni.setStorageSync(STORAGE_KEYS.USERS, users)
  uni.setStorageSync(STORAGE_KEYS.USER_ID, id + 1)

  return id
}

export async function updateUser(user: User): Promise<void> {
  const users: User[] = uni.getStorageSync(STORAGE_KEYS.USERS) || []
  const index = users.findIndex(u => u.id === user.id)

  if (index >= 0) {
    users[index] = user
  } else {
    users.push(user)
  }

  uni.setStorageSync(STORAGE_KEYS.USERS, users)
}

// 统计
export async function getRecordCount(): Promise<number> {
  const records: ProductRecord[] = uni.getStorageSync(STORAGE_KEYS.RECORDS) || []
  return records.length
}

export async function getDayCount(): Promise<number> {
  const records: ProductRecord[] = uni.getStorageSync(STORAGE_KEYS.RECORDS) || []
  const dates = new Set(records.map(r => r.purchaseTime.substring(0, 10)))
  return dates.size
}

export async function getTotalAmount(startDate?: Date, endDate?: Date): Promise<number> {
  let records: ProductRecord[] = uni.getStorageSync(STORAGE_KEYS.RECORDS) || []

  if (startDate) {
    records = records.filter(r => new Date(r.purchaseTime) >= startDate)
  }
  if (endDate) {
    records = records.filter(r => new Date(r.purchaseTime) <= endDate)
  }

  return records.reduce((sum, r) => sum + r.price * r.quantity, 0)
}