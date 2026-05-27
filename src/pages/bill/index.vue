<template>
  <view class="bill-page">
    <!-- 头部时间切换 -->
    <view class="header">
      <text class="nav-btn" @tap="prevMonth">◀</text>
      <text class="month-text">{{ monthText }}</text>
      <text class="nav-btn" @tap="nextMonth">▶</text>
    </view>

    <view class="content">
      <!-- 加载状态 -->
      <view v-if="isLoading" class="loading">
        <text>加载中...</text>
      </view>

      <scroll-view v-else scroll-y class="scroll-view">
        <!-- 概览卡片 -->
        <view class="card overview-card">
          <view class="overview-header">
            <text class="overview-label">{{ friendlyText.monthlyConsumption }}</text>
            <view class="view-all" @tap="goDetail">
              <text class="view-all-text">{{ friendlyText.viewAll }}</text>
              <text class="arrow">›</text>
            </view>
          </view>
          <text class="overview-amount">¥{{ monthTotal.toFixed(2) }}</text>
          <view class="overview-stats">
            <text>{{ friendlyText.dailyAverage }} ¥{{ dailyAverage }}</text>
            <text class="stats-divider">|</text>
            <text>{{ records.length }}{{ friendlyText.records }}</text>
          </view>
        </view>

        <!-- 消费趋势 -->
        <view class="card trend-card">
          <text class="card-title">{{ friendlyText.consumptionTrend }}</text>
          <text class="trend-emoji">📈</text>
          <view class="chart-placeholder">
            <text class="chart-hint">消费趋势图</text>
          </view>
        </view>

        <!-- 分类占比 -->
        <view class="card category-card">
          <text class="card-title">{{ friendlyText.categoryBreakdown }}</text>
          <text class="category-emoji">🥧</text>
          <view class="pie-section">
            <view class="pie-chart">
              <view class="pie-placeholder"></view>
            </view>
            <view class="legend">
              <view class="legend-item">
                <text class="legend-emoji">🍞</text>
                <text class="legend-percent">39%</text>
              </view>
              <view class="legend-item">
                <text class="legend-emoji">👕</text>
                <text class="legend-percent">26%</text>
              </view>
              <view class="legend-item">
                <text class="legend-emoji">📱</text>
                <text class="legend-percent">16%</text>
              </view>
              <view class="legend-item">
                <text class="legend-emoji">📦</text>
                <text class="legend-percent">19%</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 大额消费 TOP3 -->
        <view class="card top-card">
          <text class="card-title">{{ friendlyText.topSpending }} 3</text>
          <view v-if="topRecords.length === 0" class="empty-hint">
            还没有消费记录
          </view>
          <view v-else class="top-list">
            <view v-for="record in topRecords" :key="record.id" class="top-item">
              <text class="top-emoji">{{ getCategoryEmoji(record.categoryId) }}</text>
              <view class="top-info">
                <text class="top-name">{{ record.name }}</text>
                <text v-if="record.storeName" class="top-store">{{ record.storeName }}</text>
              </view>
              <text class="top-price">¥{{ record.price.toFixed(2) }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 底部导航 -->
    <TabBar
      :current-index="2"
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
import { ref, computed } from 'vue'
import { useRecordsStore } from '@/stores/records'
import { useCategoriesStore } from '@/stores/categories'
import { friendlyText, categoryEmojis } from '@/constants'
import TabBar from '@/components/tab-bar.vue'
import FloatMenu from '@/components/float-menu.vue'

const recordsStore = useRecordsStore()
const categoriesStore = useCategoriesStore()

const currentDate = ref(new Date())
const showFloatMenu = ref(false)

const isLoading = computed(() => recordsStore.isLoading)
const records = computed(() => recordsStore.records)
const monthTotal = computed(() => recordsStore.monthTotal)

const monthText = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth() + 1
  return `${year}年${month}月`
})

const dailyAverage = computed(() => {
  const day = currentDate.value.getDate()
  return day > 0 ? (monthTotal.value / day).toFixed(2) : '0.00'
})

const topRecords = computed(() => {
  return [...records.value]
    .sort((a, b) => b.price - a.price)
    .slice(0, 3)
})

function getCategoryEmoji(categoryId?: string) {
  if (!categoryId) return '📦'
  return categoryEmojis[parseInt(categoryId)] || '📦'
}

function prevMonth() {
  const d = new Date(currentDate.value)
  d.setMonth(d.getMonth() - 1)
  currentDate.value = d
  // 重新加载数据
}

function nextMonth() {
  const d = new Date(currentDate.value)
  d.setMonth(d.getMonth() + 1)
  currentDate.value = d
  // 重新加载数据
}

function goDetail() {
  uni.navigateTo({ url: '/pages/bill-detail/index' })
}

function goAddRecord() {
  uni.navigateTo({ url: '/pages/add-record/index' })
}

function goOcrRecord() {
  uni.navigateTo({ url: '/pages/ocr-record/index' })
}
</script>

<style scoped>
.bill-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--background-color);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
}

.nav-btn {
  font-size: 18px;
  color: var(--secondary-text);
  padding: 8px;
}

.month-text {
  font-size: 18px;
  font-weight: 600;
}

.content {
  flex: 1;
  overflow: hidden;
}

.scroll-view {
  height: 100%;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 40px;
  color: var(--secondary-text);
}

.card {
  background-color: var(--card-color);
  border-radius: var(--card-radius);
  padding: 16px;
  margin: 0 16px 12px;
}

.overview-card {
  margin-top: 0;
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.overview-label {
  color: var(--secondary-text);
  font-size: 14px;
}

.view-all {
  display: flex;
  align-items: center;
}

.view-all-text {
  color: var(--primary-color);
  font-size: 12px;
}

.arrow {
  color: var(--primary-color);
  font-size: 12px;
  margin-left: 2px;
}

.overview-amount {
  font-size: 28px;
  font-weight: bold;
  color: var(--primary-text);
}

.overview-stats {
  display: flex;
  gap: 16px;
  margin-top: 8px;
  font-size: 12px;
  color: var(--secondary-text);
}

.stats-divider {
  color: var(--divider-color);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  display: block;
  margin-bottom: 8px;
}

.trend-emoji, .category-emoji {
  font-size: 24px;
}

.chart-placeholder {
  height: 100px;
  background-color: var(--background-color);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
}

.chart-hint {
  color: var(--secondary-text);
  font-size: 12px;
}

.pie-section {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.pie-chart {
  width: 100px;
  height: 100px;
}

.pie-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    var(--category-food) 0deg 140deg,
    var(--category-clothing) 140deg 234deg,
    var(--category-digital) 234deg 292deg,
    var(--category-other) 292deg 360deg
  );
}

.legend {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-left: 24px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.legend-emoji {
  font-size: 16px;
}

.legend-percent {
  font-size: 12px;
  color: var(--secondary-text);
}

.empty-hint {
  text-align: center;
  padding: 20px;
  color: var(--secondary-text);
}

.top-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.top-item {
  display: flex;
  align-items: center;
}

.top-emoji {
  font-size: 20px;
  margin-right: 12px;
}

.top-info {
  flex: 1;
}

.top-name {
  font-size: 14px;
  display: block;
}

.top-store {
  font-size: 12px;
  color: var(--secondary-text);
}

.top-price {
  font-size: 15px;
  font-weight: 600;
}
</style>