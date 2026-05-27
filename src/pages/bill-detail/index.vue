<template>
  <view class="detail-page">
    <!-- 导航栏 -->
    <view class="nav-bar">
      <text class="nav-back" @tap="goBack">‹</text>
      <text class="nav-title">{{ currentMonth }}月消费明细</text>
      <view class="nav-placeholder"></view>
    </view>

    <!-- 分类筛选 -->
    <view class="category-filter">
      <scroll-view scroll-x>
        <view class="filter-list">
          <view
            class="filter-item"
            :class="{ active: selectedCategoryId === null }"
            @tap="selectCategory(null)"
          >
            <text>全部</text>
          </view>
          <view
            v-for="cat in categories"
            :key="cat.id"
            class="filter-item"
            :class="{ active: selectedCategoryId === cat.id?.toString() }"
            @tap="selectCategory(cat.id?.toString())"
          >
            <text>{{ cat.emoji }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 记录列表 -->
    <view class="content">
      <view v-if="filteredRecords.length === 0" class="empty-state">
        <text>{{ friendlyText.emptyBill }}</text>
      </view>

      <view v-else class="record-groups">
        <view v-for="(group, dateKey) in groupedRecords" :key="dateKey" class="date-group">
          <view class="date-header">
            <text class="date-label">{{ formatDateLabel(dateKey) }}</text>
          </view>
          <view class="date-records">
            <view
              v-for="(record, index) in group"
              :key="record.id"
              class="record-item"
              :class="{ 'border-bottom': index < group.length - 1 }"
            >
              <view v-if="getCategory(record.categoryId)" class="record-icon" :style="{ backgroundColor: getCategoryBg(record.categoryId) }">
                <text>{{ getCategory(record.categoryId)?.emoji }}</text>
              </view>
              <view class="record-info">
                <text class="record-name">{{ record.name }}</text>
              </view>
              <text class="record-price">¥{{ record.price.toFixed(2) }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRecordsStore } from '@/stores/records'
import { useCategoriesStore } from '@/stores/categories'
import { friendlyText, categoryColors, categoryEmojis } from '@/constants'
import type { ProductRecord } from '@/types'

const recordsStore = useRecordsStore()
const categoriesStore = useCategoriesStore()

const selectedCategoryId = ref<string | null>(null)

const currentMonth = new Date().getMonth() + 1

const categories = computed(() => categoriesStore.categories)

const filteredRecords = computed(() => {
  if (!selectedCategoryId.value) return recordsStore.records
  return recordsStore.records.filter(r => r.categoryId === selectedCategoryId.value)
})

const groupedRecords = computed(() => {
  const groups: Record<string, ProductRecord[]> = {}
  const sorted = [...filteredRecords.value].sort(
    (a, b) => new Date(b.purchaseTime).getTime() - new Date(a.purchaseTime).getTime()
  )

  for (const record of sorted) {
    const dateKey = record.purchaseTime.substring(0, 10)
    if (!groups[dateKey]) groups[dateKey] = []
    groups[dateKey].push(record)
  }

  return groups
})

function getCategory(categoryId?: string) {
  if (!categoryId) return null
  return categories.value.find(c => c.id?.toString() === categoryId) || null
}

function getCategoryBg(categoryId?: string) {
  if (!categoryId) return 'var(--background-color)'
  return categoryColors[categoryId] || 'var(--background-color)'
}

function selectCategory(id: string | null) {
  selectedCategoryId.value = id
}

function formatDateLabel(dateKey: string): string {
  const date = new Date(dateKey)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const recordDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  if (recordDate.getTime() === today.getTime()) {
    return '今天'
  } else if (recordDate.getTime() === yesterday.getTime()) {
    return '昨天'
  } else {
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }
}

function goBack() {
  uni.navigateBack()
}
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background-color: var(--background-color);
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: var(--background-color);
}

.nav-back {
  font-size: 28px;
}

.nav-title {
  font-size: 18px;
  font-weight: 600;
}

.nav-placeholder {
  width: 28px;
}

.category-filter {
  background-color: var(--card-color);
  border-bottom: 0.5px solid var(--divider-color);
  padding: 12px 0;
}

.filter-list {
  display: flex;
  gap: 8px;
  padding: 0 12px;
}

.filter-item {
  padding: 6px 12px;
  background-color: var(--background-color);
  border-radius: 18px;
  font-size: 13px;
  color: var(--secondary-text);
  flex-shrink: 0;
}

.filter-item.active {
  background-color: var(--primary-color);
  color: white;
}

.content {
  padding: 0 16px;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: var(--secondary-text);
}

.record-groups {
  padding-top: 12px;
}

.date-group {
  margin-bottom: 16px;
}

.date-header {
  padding: 8px 0;
}

.date-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--secondary-text);
}

.date-records {
  background-color: var(--card-color);
  border-radius: 12px;
  overflow: hidden;
}

.record-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
}

.record-item.border-bottom {
  border-bottom: 0.5px solid var(--divider-color);
}

.record-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  margin-right: 10px;
  flex-shrink: 0;
}

.record-info {
  flex: 1;
}

.record-name {
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.record-price {
  font-size: 14px;
  font-weight: 500;
  flex-shrink: 0;
}
</style>