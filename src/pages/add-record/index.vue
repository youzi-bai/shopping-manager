<template>
  <view class="add-record-page">
    <!-- 导航栏 -->
    <view class="nav-bar">
      <text class="nav-back" @tap="goBack">‹</text>
      <text class="nav-title">记一笔~</text>
      <view class="nav-placeholder"></view>
    </view>

    <scroll-view scroll-y class="form-scroll">
      <view class="form">
        <!-- 商品名称 -->
        <view class="form-item">
          <view class="form-label">
            <text>{{ friendlyText.productName }}</text>
            <text class="required">*</text>
          </view>
          <input
            v-model="form.name"
            class="form-input"
            :placeholder="friendlyText.productName"
          />
        </view>

        <!-- 价格和数量 -->
        <view class="form-row">
          <view class="form-item flex-2">
            <view class="form-label">
              <text>{{ friendlyText.price }}</text>
              <text class="required">*</text>
            </view>
            <input
              v-model="form.price"
              class="form-input"
              type="digit"
              placeholder="¥ "
            />
          </view>
          <view class="form-item flex-1">
            <view class="form-label">
              <text>{{ friendlyText.quantity }}</text>
            </view>
            <input
              v-model="form.quantity"
              class="form-input"
              type="number"
              placeholder="1"
            />
          </view>
        </view>

        <!-- 日期 -->
        <view class="form-item">
          <view class="form-label">
            <text>{{ friendlyText.date }}</text>
            <text class="required">*</text>
          </view>
          <view class="form-input date-input" @tap="showDatePicker">
            <text>{{ formatDisplayDate(selectedDate) }}</text>
            <text class="date-icon">📅</text>
          </view>
        </view>

        <!-- 购买地点 -->
        <view class="form-item">
          <view class="form-label">
            <text>{{ friendlyText.store }}</text>
          </view>
          <input
            v-model="form.storeName"
            class="form-input"
            :placeholder="friendlyText.store"
          />
        </view>

        <!-- 分类 -->
        <view class="form-item">
          <view class="form-label">
            <text>{{ friendlyText.category }}</text>
          </view>
          <scroll-view scroll-x class="emoji-scroll">
            <view class="emoji-list">
              <view
                v-for="cat in categories"
                :key="cat.id"
                class="emoji-item"
                :class="{ selected: form.categoryId === cat.id?.toString() }"
                @tap="selectCategory(cat.id?.toString())"
              >
                <text class="emoji">{{ cat.emoji }}</text>
                <text class="emoji-name">{{ cat.name }}</text>
              </view>
            </view>
          </scroll-view>
        </view>

        <!-- 平台 -->
        <view class="form-item">
          <view class="form-label">
            <text>{{ friendlyText.platform }}</text>
          </view>
          <scroll-view scroll-x class="emoji-scroll">
            <view class="emoji-list">
              <view
                v-for="platform in platforms"
                :key="platform.id"
                class="emoji-item"
                :class="{ selected: form.platformId === platform.id }"
                @tap="selectPlatform(platform.id)"
              >
                <text class="emoji">{{ platform.emoji }}</text>
                <text class="emoji-name">{{ platform.name }}</text>
              </view>
            </view>
          </scroll-view>
        </view>

        <!-- 备注 -->
        <view class="form-item">
          <view class="form-label">
            <text>{{ friendlyText.remark }}</text>
          </view>
          <textarea
            v-model="form.remark"
            class="form-textarea"
            placeholder="备注"
            rows="3"
          />
        </view>
      </view>
    </scroll-view>

    <!-- 保存按钮 -->
    <view class="bottom-area">
      <view class="save-btn" @tap="handleSave">
        <text>{{ friendlyText.save }}</text>
      </view>
    </view>

    <!-- 日期选择器 -->
    <view v-if="showPicker" class="picker-mask" @tap="showPicker = false">
      <view class="picker-content" @tap.stop="() => {}">
        <picker-view
          :value="pickerValue"
          @change="onDateChange"
          class="date-picker"
        >
          <picker-view-column>
            <view v-for="y in years" :key="y" class="picker-item">{{ y }}年</view>
          </picker-view-column>
          <picker-view-column>
            <view v-for="m in months" :key="m" class="picker-item">{{ m }}月</view>
          </picker-view-column>
          <picker-view-column>
            <view v-for="d in days" :key="d" class="picker-item">{{ d }}日</view>
          </picker-view-column>
        </picker-view>
        <view class="picker-confirm" @tap="confirmDate">确定</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRecordsStore } from '@/stores/records'
import { useCategoriesStore } from '@/stores/categories'
import { friendlyText, platformEmojis } from '@/constants'
import type { ProductRecord } from '@/types'

const recordsStore = useRecordsStore()
const categoriesStore = useCategoriesStore()

const showPicker = ref(false)
const selectedDate = ref(new Date())

const form = reactive({
  name: '',
  price: '',
  quantity: '1',
  storeName: '',
  categoryId: '',
  platformId: '',
  remark: ''
})

const categories = computed(() => categoriesStore.categories)

const platforms = [
  { id: 'taobao', name: '淘宝', emoji: '🛒' },
  { id: 'jd', name: '京东', emoji: '📦' },
  { id: 'pinduoduo', name: '拼多多', emoji: '🟡' },
  { id: 'store', name: '线下', emoji: '🏪' },
  { id: 'other', name: '其他', emoji: '🟢' }
]

// 日期选择器数据
const years = computed(() => {
  const y = new Date().getFullYear()
  return Array.from({ length: 10 }, (_, i) => y - 5 + i)
})

const months = computed(() => Array.from({ length: 12 }, (_, i) => i + 1))

const days = computed(() => {
  const y = selectedDate.value.getFullYear()
  const m = selectedDate.value.getMonth() + 1
  return Array.from({ length: new Date(y, m, 0).getDate() }, (_, i) => i + 1)
})

const pickerValue = ref([5, 0, 0])

function formatDisplayDate(date: Date): string {
  const y = date.getFullYear()
  const m = (date.getMonth() + 1).toString().padStart(2, '0')
  const d = date.getDate().toString().padStart(2, '0')
  return `${y}-${m}-${d}`
}

function showDatePicker() {
  showPicker.value = true
  const y = selectedDate.value.getFullYear()
  const m = selectedDate.value.getMonth()
  const d = selectedDate.value.getDate() - 1
  pickerValue.value = [y - new Date().getFullYear() + 5, m, d]
}

function onDateChange(e: any) {
  const [y, m, day] = e.detail.value
  selectedDate.value = new Date(
    new Date().getFullYear() - 5 + y,
    m,
    day + 1
  )
}

function confirmDate() {
  showPicker.value = false
}

function selectCategory(id?: string) {
  form.categoryId = form.categoryId === id ? '' : (id || '')
}

function selectPlatform(id: string) {
  form.platformId = form.platformId === id ? '' : id
}

function handleSave() {
  if (!form.name.trim()) {
    uni.showToast({ title: '请填写商品名称', icon: 'none' })
    return
  }

  if (!form.price || parseFloat(form.price) <= 0) {
    uni.showToast({ title: '请填写有效价格', icon: 'none' })
    return
  }

  const record: ProductRecord = {
    name: form.name.trim(),
    price: parseFloat(form.price),
    quantity: parseInt(form.quantity) || 1,
    purchaseTime: selectedDate.value.toISOString(),
    storeName: form.storeName.trim() || undefined,
    categoryId: form.categoryId || undefined,
    platformId: form.platformId || undefined,
    remark: form.remark.trim() || undefined
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

function goBack() {
  uni.navigateBack()
}
</script>

<style scoped>
.add-record-page {
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
  background-color: var(--background-color);
}

.nav-back {
  font-size: 28px;
  color: var(--primary-text);
}

.nav-title {
  font-size: 18px;
  font-weight: 600;
}

.nav-placeholder {
  width: 28px;
}

.form-scroll {
  flex: 1;
  overflow: hidden;
}

.form {
  padding: var(--page-padding);
}

.form-item {
  margin-bottom: 16px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.flex-1 {
  flex: 1;
}

.flex-2 {
  flex: 2;
}

.form-label {
  font-size: 14px;
  color: var(--secondary-text);
  margin-bottom: 8px;
  display: flex;
}

.required {
  color: var(--warning-color);
}

.form-input {
  background-color: var(--card-color);
  border: 1px solid var(--divider-color);
  border-radius: var(--input-radius);
  padding: 12px 16px;
  font-size: 15px;
}

.date-input {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date-icon {
  font-size: 16px;
}

.form-textarea {
  background-color: var(--card-color);
  border: 1px solid var(--divider-color);
  border-radius: var(--input-radius);
  padding: 12px 16px;
  font-size: 15px;
  width: 100%;
}

.emoji-scroll {
  width: 100%;
}

.emoji-list {
  display: flex;
  gap: 8px;
  padding: 4px 0;
}

.emoji-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: var(--background-color);
  border-radius: 12px;
  border: 2px solid transparent;
  flex-shrink: 0;
}

.emoji-item.selected {
  border-color: var(--primary-color);
  background-color: rgba(255, 138, 128, 0.1);
}

.emoji {
  font-size: 18px;
  margin-right: 4px;
}

.emoji-name {
  font-size: 13px;
  color: var(--secondary-text);
}

.emoji-item.selected .emoji-name {
  color: var(--primary-text);
}

.bottom-area {
  padding: 16px;
  padding-bottom: calc(16px + constant(safe-area-inset-bottom));
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
}

.save-btn {
  height: 52px;
  background-color: var(--primary-color);
  border-radius: var(--button-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  font-weight: 600;
}

/* 日期选择器 */
.picker-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-end;
  z-index: 300;
}

.picker-content {
  width: 100%;
  background-color: var(--card-color);
  border-radius: 16px 16px 0 0;
  padding: 16px;
}

.date-picker {
  height: 200px;
}

.picker-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.picker-confirm {
  text-align: center;
  padding: 12px;
  color: var(--primary-color);
  font-weight: 600;
  font-size: 16px;
}
</style>