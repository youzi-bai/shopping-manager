<template>
  <view class="categories-page">
    <!-- 左侧分类菜单 -->
    <view class="left-menu">
      <scroll-view scroll-y class="menu-scroll">
        <view
          v-for="category in categories"
          :key="category.id"
          class="menu-item"
          :class="{ active: selectedCategoryId === category.id?.toString() }"
          @tap="selectCategory(category.id?.toString())"
        >
          <text class="menu-emoji">{{ category.emoji }}</text>
          <text class="menu-name">{{ category.name }}</text>
        </view>
      </scroll-view>
      <view class="add-btn" @tap="showAddDialog = true">
        <text class="add-icon">+</text>
        <text class="add-text">添加</text>
      </view>
    </view>

    <!-- 右侧记录列表 -->
    <view class="right-content">
      <scroll-view v-if="categoryRecords.length > 0" scroll-y class="records-scroll">
        <view class="records-list">
          <view
            v-for="record in categoryRecords"
            :key="record.id"
            class="record-item"
          >
            <text class="record-name">{{ record.name }}</text>
            <text class="record-price">¥{{ record.price.toFixed(2) }}</text>
          </view>
        </view>
      </scroll-view>
      <view v-else class="empty-state">
        <text>{{ friendlyText.emptyCategory }}</text>
      </view>

      <!-- 底部统计 -->
      <view class="bottom-stats">
        <text class="stats-count">{{ categoryRecords.length }}笔</text>
        <text class="stats-amount">共¥{{ totalAmount.toFixed(2) }}</text>
      </view>
    </view>

    <!-- 底部导航 -->
    <TabBar :current-index="1" @change="() => {}" @add="showFloatMenu = true" />

    <!-- 浮动菜单 -->
    <FloatMenu
      v-if="showFloatMenu"
      @close="showFloatMenu = false"
      @manual="goAddRecord"
      @ocr="goOcrRecord"
    />

    <!-- 添加分类弹窗 -->
    <view v-if="showAddDialog" class="dialog-mask" @tap="showAddDialog = false">
      <view class="dialog" @tap.stop="() => {}">
        <text class="dialog-title">添加分类</text>
        <input v-model="newCategoryName" class="dialog-input" placeholder="分类名称" />
        <view class="emoji-grid">
          <view
            v-for="emoji in emojiOptions"
            :key="emoji"
            class="emoji-item"
            :class="{ selected: selectedEmoji === emoji }"
            @tap="selectedEmoji = emoji"
          >
            <text>{{ emoji }}</text>
          </view>
        </view>
        <view class="dialog-actions">
          <text class="dialog-cancel" @tap="showAddDialog = false">取消</text>
          <text class="dialog-confirm" @tap="confirmAddCategory">添加</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRecordsStore } from '@/stores/records'
import { useCategoriesStore } from '@/stores/categories'
import { friendlyText } from '@/constants'
import TabBar from '@/components/tab-bar.vue'
import FloatMenu from '@/components/float-menu.vue'

const recordsStore = useRecordsStore()
const categoriesStore = useCategoriesStore()

const showFloatMenu = ref(false)
const showAddDialog = ref(false)
const newCategoryName = ref('')
const selectedEmoji = ref('📦')

const emojiOptions = ['🍞', '👕', '📱', '🏠', '💄', '🎬', '🚗', '📚', '🏥', '📦']

const categories = computed(() => categoriesStore.categories)
const selectedCategoryId = computed(() => categoriesStore.selectedCategoryId)

const categoryRecords = computed(() => {
  if (!selectedCategoryId.value) return []
  return recordsStore.getRecordsByCategory(selectedCategoryId.value)
})

const totalAmount = computed(() => {
  return categoryRecords.value.reduce((sum, r) => sum + r.price * r.quantity, 0)
})

function selectCategory(id?: string) {
  categoriesStore.selectCategory(id || null)
}

function confirmAddCategory() {
  if (newCategoryName.value.trim()) {
    categoriesStore.addCategory({
      name: newCategoryName.value.trim(),
      emoji: selectedEmoji.value,
      sortOrder: categories.value.length
    })
  }
  showAddDialog.value = false
}

function goAddRecord() {
  uni.navigateTo({ url: '/pages/add-record/index' })
}

function goOcrRecord() {
  uni.navigateTo({ url: '/pages/ocr-record/index' })
}
</script>

<style scoped>
.categories-page {
  display: flex;
  height: 100vh;
  background-color: var(--background-color);
}

.left-menu {
  width: 100px;
  background-color: var(--card-color);
  display: flex;
  flex-direction: column;
  border-right: 0.5px solid var(--divider-color);
  height: 100%;
  padding-bottom: 70px;
  box-sizing: border-box;
}

.menu-scroll {
  flex: 1;
  overflow-y: auto;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 0;
  border-left: 3px solid transparent;
}

.menu-item.active {
  background-color: var(--background-color);
  border-left-color: var(--primary-color);
}

.menu-emoji {
  font-size: 24px;
  margin-bottom: 4px;
}

.menu-name {
  font-size: 12px;
  color: var(--secondary-text);
}

.menu-item.active .menu-name {
  color: var(--primary-color);
  font-weight: 600;
}

.add-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 0;
  border-top: 0.5px solid var(--divider-color);
  flex-shrink: 0;
}

.add-icon {
  font-size: 24px;
  color: var(--secondary-text);
}

.add-text {
  font-size: 12px;
  color: var(--secondary-text);
  margin-top: 4px;
}

.right-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-bottom: 70px;
}

.records-scroll {
  flex: 1;
  overflow: hidden;
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--secondary-text);
}

.records-list {
  margin: 12px 16px;
  background-color: var(--card-color);
  border-radius: 12px;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 0.5px solid var(--divider-color);
}

.record-item:last-child {
  border-bottom: none;
}

.record-name {
  font-size: 15px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.record-price {
  font-size: 15px;
  font-weight: 500;
}

.bottom-stats {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  background-color: var(--card-color);
  border-top: 0.5px solid var(--divider-color);
}

.stats-count {
  color: var(--secondary-text);
}

.stats-amount {
  font-weight: 600;
  color: var(--primary-text);
}

/* 弹窗样式 */
.dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
}

.dialog {
  width: 280px;
  background-color: var(--card-color);
  border-radius: 16px;
  padding: 20px;
}

.dialog-title {
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  display: block;
  margin-bottom: 16px;
}

.dialog-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--divider-color);
  border-radius: 8px;
  margin-bottom: 16px;
}

.emoji-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.emoji-item {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border-radius: 8px;
}

.emoji-item.selected {
  background-color: rgba(255, 138, 128, 0.2);
  border: 1px solid var(--primary-color);
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.dialog-cancel {
  color: var(--secondary-text);
}

.dialog-confirm {
  color: var(--primary-color);
  font-weight: 500;
}
</style>