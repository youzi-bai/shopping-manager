<template>
  <view class="record-card" :class="{ 'border-bottom': !isLast }" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
    <view v-if="category" class="category-icon" :style="{ backgroundColor: categoryBgColor }">
      {{ category.emoji }}
    </view>
    <view class="record-content">
      <view class="record-name">{{ record.name }}</view>
      <view class="record-date">{{ formatDate(record.purchaseTime) }}</view>
    </view>
    <view class="record-price">¥{{ record.price.toFixed(2) }}</view>

    <!-- 删除按钮 -->
    <view v-if="showDelete" class="delete-btn" @tap.stop="handleDelete">
      <text>删除</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ProductRecord, Category } from '@/types'
import { categoryColors } from '@/constants'

const props = defineProps<{
  record: ProductRecord
  category?: Category | null
  isLast?: boolean
}>()

const emit = defineEmits<{
  (e: 'delete', id: number): void
}>()

const showDelete = ref(false)
const startX = ref(0)

const categoryBgColor = computed(() => {
  if (!props.category?.id) return 'var(--background-color)'
  return categoryColors[props.category.id.toString()] || 'var(--background-color)'
})

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const recordDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  if (recordDate.getTime() === today.getTime()) {
    return '今天'
  } else if (recordDate.getTime() === yesterday.getTime()) {
    return '昨天'
  } else {
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${month}-${day}`
  }
}

function onTouchStart(e: TouchEvent) {
  startX.value = e.touches[0].clientX
}

function onTouchMove(e: TouchEvent) {
  const currentX = e.touches[0].clientX
  const diff = startX.value - currentX
  if (diff > 50) {
    showDelete.value = true
  } else if (diff < -50) {
    showDelete.value = false
  }
}

function onTouchEnd() {
  // 滑动结束，不需要额外处理
}

function handleDelete() {
  emit('delete', props.record.id!)
  showDelete.value = false
}
</script>

<style scoped>
.record-card {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: var(--card-color);
}

.record-card.border-bottom {
  border-bottom: 1px solid var(--divider-color);
}

.category-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-right: 12px;
  flex-shrink: 0;
}

.record-content {
  flex: 1;
  min-width: 0;
}

.record-name {
  font-size: 15px;
  font-weight: 500;
  color: var(--primary-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.record-date {
  font-size: 12px;
  color: var(--secondary-text);
  margin-top: 2px;
}

.record-price {
  font-size: 16px;
  font-weight: 600;
  color: var(--primary-text);
  flex-shrink: 0;
}

/* 删除按钮 */
.delete-btn {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 80px;
  background-color: var(--warning-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
}

.record-card {
  position: relative;
  overflow: hidden;
}
</style>