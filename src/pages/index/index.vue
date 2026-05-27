<template>
  <view class="home-page">
    <!-- 头部消费概览 -->
    <view class="header">
      <text class="header-label">{{ friendlyText.monthlyConsumption }}</text>
      <view class="header-amount-row">
        <text class="header-amount">¥{{ monthTotal.toFixed(2) }}</text>
        <view v-if="changeText" class="change-badge" :class="{ down: isDown }">
          {{ friendlyText.vsLastMonth }} {{ changeText }}
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="isLoading" class="loading">
      <text>加载中...</text>
    </view>

    <!-- 空状态 -->
    <view v-else-if="recentRecords.length === 0" class="empty-state">
      <text class="empty-icon">📝</text>
      <text class="empty-text">{{ friendlyText.emptyHome }}</text>
    </view>

    <!-- 记录列表 -->
    <scroll-view v-else scroll-y class="records-scroll">
      <view class="records-list">
        <RecordCard
          v-for="(record, index) in recentRecords"
          :key="record.id"
          :record="record"
          :category="getCategory(record.categoryId)"
          :is-last="index === recentRecords.length - 1"
          @delete="handleDelete(record.id!)"
        />
      </view>
    </scroll-view>

    <!-- 删除确认弹窗 -->
    <ConfirmDialog
      v-if="showDeleteConfirm"
      @cancel="showDeleteConfirm = false"
      @confirm="confirmDelete"
    />

    <!-- 底部导航 -->
    <TabBar
      :current-index="0"
      @change="() => {}"
      @add="showFloatMenu = true"
    />

    <!-- 浮动菜单 -->
    <FloatMenu
      v-if="showFloatMenu"
      @close="showFloatMenu = false"
      @manual="goAddRecord"
      @ocr="goOcrRecord"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRecordsStore } from '@/stores/records'
import { useCategoriesStore } from '@/stores/categories'
import { friendlyText } from '@/constants'
import TabBar from '@/components/tab-bar.vue'
import FloatMenu from '@/components/float-menu.vue'
import RecordCard from '@/components/record-card.vue'
import ConfirmDialog from '@/components/confirm-dialog.vue'

const recordsStore = useRecordsStore()
const categoriesStore = useCategoriesStore()

const showFloatMenu = ref(false)
const showDeleteConfirm = ref(false)
const pendingDeleteId = ref<number | null>(null)

const isLoading = computed(() => recordsStore.isLoading)
const monthTotal = computed(() => recordsStore.monthTotal)
const recentRecords = computed(() => recordsStore.recentRecords)

const isDown = computed(() => recordsStore.monthChange < 0)
const changeText = computed(() => {
  if (recordsStore.lastMonthTotal === 0) return ''
  const change = Math.abs(recordsStore.monthChange)
  return `${change.toFixed(0)}%`
})

function getCategory(categoryId?: string) {
  if (!categoryId) return null
  return categoriesStore.categories.find(c => c.id?.toString() === categoryId) || null
}

function handleDelete(id: number) {
  pendingDeleteId.value = id
  showDeleteConfirm.value = true
}

function confirmDelete() {
  if (pendingDeleteId.value) {
    recordsStore.deleteRecord(pendingDeleteId.value)
  }
  showDeleteConfirm.value = false
  pendingDeleteId.value = null
}

function goAddRecord() {
  uni.navigateTo({ url: '/pages/add-record/index' })
}

function goOcrRecord() {
  uni.navigateTo({ url: '/pages/ocr-record/index' })
}

onMounted(() => {
  recordsStore.loadRecords()
  categoriesStore.loadCategories()
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background-color: var(--background-color);
  padding-bottom: 80px;
}

.header {
  padding: var(--page-padding);
}

.header-label {
  font-size: 14px;
  color: var(--secondary-text);
}

.header-amount-row {
  display: flex;
  align-items: flex-end;
  margin-top: 4px;
}

.header-amount {
  font-size: 32px;
  font-weight: bold;
  color: var(--primary-text);
}

.change-badge {
  margin-left: 12px;
  padding: 2px 8px;
  background-color: rgba(255, 107, 107, 0.2);
  border-radius: 8px;
  font-size: 12px;
  color: var(--warning-color);
  font-weight: 500;
  margin-bottom: 4px;
}

.change-badge.down {
  background-color: rgba(168, 230, 207, 0.2);
  color: var(--secondary-color);
}

.loading {
  display: flex;
  justify-content: center;
  padding: 40px;
  color: var(--secondary-text);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 100px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  color: var(--secondary-text);
}

.records-scroll {
  position: fixed;
  top: 120px;
  left: 0;
  right: 0;
  bottom: 70px;
}

.records-list {
  margin: 0 var(--page-padding);
  border-radius: var(--card-radius);
  overflow: hidden;
  background-color: var(--card-color);
}
</style>