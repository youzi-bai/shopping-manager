import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/utils/api'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<Category[]>([])
  const selectedCategoryId = ref<number | null>(null)
  const isLoading = ref(false)

  // 默认分类
  const defaultCategories: Category[] = [
    { id: 1, name: '食品', emoji: '🍞', sort_order: 0, is_default: true },
    { id: 2, name: '服装', emoji: '👕', sort_order: 1, is_default: true },
    { id: 3, name: '数码', emoji: '📱', sort_order: 2, is_default: true },
    { id: 4, name: '日用', emoji: '🏠', sort_order: 3, is_default: true },
    { id: 5, name: '美妆', emoji: '💄', sort_order: 4, is_default: true },
    { id: 6, name: '娱乐', emoji: '🎬', sort_order: 5, is_default: true },
    { id: 7, name: '交通', emoji: '🚗', sort_order: 6, is_default: true },
    { id: 8, name: '教育', emoji: '📚', sort_order: 7, is_default: true },
    { id: 9, name: '医疗', emoji: '🏥', sort_order: 8, is_default: true },
    { id: 10, name: '其他', emoji: '📦', sort_order: 9, is_default: true }
  ]

  // 选中的分类
  const selectedCategory = computed(() => {
    if (!selectedCategoryId.value) return null
    return categories.value.find(c => c.id === selectedCategoryId.value) || null
  })

  // 加载分类
  const loadCategories = async () => {
    isLoading.value = true
    try {
      const data = await api.getCategories()
      if (data && data.length > 0) {
        categories.value = data
      } else {
        // 初始化默认分类
        for (const cat of defaultCategories) {
          await api.addCategory(cat)
        }
        categories.value = defaultCategories
      }
      if (!selectedCategoryId.value && categories.value.length > 0) {
        selectedCategoryId.value = categories.value[0].id!
      }
    } finally {
      isLoading.value = false
    }
  }

  // 添加分类
  const addCategory = async (category: Omit<Category, 'id'>) => {
    const newCat = await api.addCategory(category as Category)
    categories.value.push(newCat)
  }

  // 选择分类
  const selectCategory = (categoryId: number | null) => {
    selectedCategoryId.value = categoryId
  }

  return {
    categories,
    selectedCategoryId,
    selectedCategory,
    isLoading,
    loadCategories,
    addCategory,
    selectCategory
  }
})

interface Category {
  id?: number
  name: string
  emoji: string
  sort_order?: number
  is_default?: boolean
}