<template>
  <view class="ocr-page">
    <!-- 导航栏 -->
    <view class="nav-bar">
      <text class="nav-back" @tap="goBack">‹</text>
      <text class="nav-title">记一笔~</text>
      <view class="nav-placeholder"></view>
    </view>

    <!-- 加载状态 -->
    <view v-if="isRecognizing" class="loading-state">
      <view class="loading-icon"></view>
      <text class="loading-text">{{ friendlyText.ocrLoading }}</text>
    </view>

    <!-- 结果状态 -->
    <view v-else-if="hasResult" class="result-state">
      <!-- 成功提示 -->
      <view class="success-tip">
        <text class="tip-icon">🤖</text>
        <text class="tip-text">{{ friendlyText.ocrSuccess }}</text>
      </view>

      <view class="result-form">
        <!-- 商品名 -->
        <view class="result-item">
          <text class="result-label">商品名</text>
          <view class="result-input">
            <input v-model="name" />
            <text class="edit-icon">✏️</text>
          </view>
        </view>

        <!-- 价格 -->
        <view class="result-item">
          <text class="result-label">价格</text>
          <view class="result-input">
            <text class="price-prefix">¥</text>
            <input v-model="price" type="digit" />
            <text class="edit-icon">✏️</text>
          </view>
        </view>

        <!-- 时间 -->
        <view class="result-item">
          <text class="result-label">时间</text>
          <view class="result-input" @tap="showDatePicker">
            <text>{{ formatDate(selectedDate) }}</text>
            <text class="edit-icon">✏️</text>
          </view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="result-actions">
        <view class="retry-btn" @tap="retryOcr">
          <text>{{ friendlyText.retry }}</text>
        </view>
        <view class="save-btn" @tap="handleSave">
          <text>{{ friendlyText.save }}</text>
        </view>
      </view>
    </view>

    <!-- 初始状态 -->
    <view v-else class="init-state">
      <view class="camera-area">
        <text class="camera-icon">📷</text>
        <text class="camera-hint">拍张小票试试~</text>
      </view>

      <view class="action-buttons">
        <view class="action-btn" @tap="takePhoto">
          <text class="action-icon">📷</text>
          <text class="action-text">拍照</text>
        </view>
        <view class="action-btn" @tap="pickFromAlbum">
          <text class="action-icon">🖼️</text>
          <text class="action-text">从相册选</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRecordsStore } from '@/stores/records'
import { friendlyText } from '@/constants'
import type { ProductRecord } from '@/types'

const recordsStore = useRecordsStore()

const isRecognizing = ref(false)
const hasResult = ref(false)
const name = ref('')
const price = ref('')
const selectedDate = ref(new Date())

function goBack() {
  uni.navigateBack()
}

function takePhoto() {
  startOcr()
}

function pickFromAlbum() {
  startOcr()
}

function startOcr() {
  isRecognizing.value = true

  // 模拟OCR识别
  setTimeout(() => {
    isRecognizing.value = false
    hasResult.value = true
    name.value = '卫衣-ZARA'
    price.value = '299.00'
  }, 2000)
}

function retryOcr() {
  hasResult.value = false
  name.value = ''
  price.value = ''
}

function formatDate(date: Date): string {
  const m = (date.getMonth() + 1).toString().padStart(2, '0')
  const d = date.getDate().toString().padStart(2, '0')
  return `${m}-${d}`
}

function showDatePicker() {
  uni.showDatePicker({
    currentDate: selectedDate.value.getTime(),
    success: (res) => {
      selectedDate.value = new Date(res.timestamp)
    }
  })
}

function handleSave() {
  if (!name.value.trim() || !price.value) {
    uni.showToast({ title: '请填写商品信息', icon: 'none' })
    return
  }

  const record: ProductRecord = {
    name: name.value.trim(),
    price: parseFloat(price.value),
    purchaseTime: selectedDate.value.toISOString()
  }

  recordsStore.addRecord(record)

  uni.showToast({
    title: friendlyText.saveSuccess,
    icon: 'success'
  })

  setTimeout(() => {
    goBack()
  }, 1500)
}
</script>

<style scoped>
.ocr-page {
  min-height: 100vh;
  background-color: var(--background-color);
  display: flex;
  flex-direction: column;
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
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

/* 加载状态 */
.loading-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-icon {
  width: 40px;
  height: 40px;
  border: 3px solid var(--divider-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  margin-top: 24px;
  font-size: 16px;
  color: var(--secondary-text);
}

/* 结果状态 */
.result-state {
  flex: 1;
  padding: var(--page-padding);
  display: flex;
  flex-direction: column;
}

.success-tip {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: rgba(168, 230, 207, 0.2);
  border-radius: 12px;
  margin-bottom: 16px;
}

.tip-icon {
  font-size: 20px;
  margin-right: 8px;
}

.tip-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--secondary-color);
}

.result-form {
  flex: 1;
  background-color: var(--card-color);
  border-radius: var(--card-radius);
  padding: 16px;
}

.result-item {
  margin-bottom: 16px;
}

.result-label {
  font-size: 14px;
  color: var(--secondary-text);
  display: block;
  margin-bottom: 8px;
}

.result-input {
  display: flex;
  align-items: center;
  background-color: var(--background-color);
  border-radius: 8px;
  padding: 8px 12px;
}

.result-input input {
  flex: 1;
  font-size: 15px;
}

.price-prefix {
  color: var(--secondary-text);
  margin-right: 4px;
}

.edit-icon {
  font-size: 18px;
  margin-left: 8px;
}

.result-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.retry-btn {
  flex: 1;
  height: 48px;
  border: 1px solid var(--divider-color);
  border-radius: var(--input-radius);
  display: flex;
  align-items: center;
  justify-content: center;
}

.save-btn {
  flex: 2;
  height: 48px;
  background-color: var(--primary-color);
  border-radius: var(--input-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  font-weight: 600;
}

/* 初始状态 */
.init-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: var(--page-padding);
}

.camera-area {
  flex: 1;
  background-color: var(--card-color);
  border-radius: var(--card-radius);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.camera-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.camera-hint {
  font-size: 16px;
  color: var(--secondary-text);
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.action-btn {
  flex: 1;
  height: 48px;
  border: 1px solid var(--divider-color);
  border-radius: var(--input-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.action-icon {
  font-size: 20px;
}

.action-text {
  font-size: 14px;
}
</style>