import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Category } from '@/types'
import { getCategories, addCategory as dbAddCategory } from '@/utils/db'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<Category[]>([])
  const selectedCategoryId = ref<string | null>(null)
  const isLoading = ref(false)

  // 预设分类
  const defaultCategories: Category[] = [
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

  // 初始化预设分类
  const initDefaultCategories = () => {
    if (categories.value.length === 0) {
      categories.value = [...defaultCategories]
      if (!selectedCategoryId.value && categories.value.length > 0) {
        selectedCategoryId.value = categories.value[0].id?.toString() || null
      }
    }
  }

  // 选中的分类
  const selectedCategory = computed(() => {
    if (!selectedCategoryId.value) return null
    return categories.value.find(c => c.id?.toString() === selectedCategoryId.value) || null
  })

  // 加载分类
  const loadCategories = async () => {
    isLoading.value = true
    try {
      categories.value = await getCategories()
      initDefaultCategories()
      if (!selectedCategoryId.value && categories.value.length > 0) {
        selectedCategoryId.value = categories.value[0].id?.toString() || null
      }
    } finally {
      isLoading.value = false
    }
  }

  // 添加分类
  const addCategory = async (category: Category) => {
    await dbAddCategory(category)
    await loadCategories()
  }

  // 选择分类
  const selectCategory = (categoryId: string | null) => {
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