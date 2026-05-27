<template>
  <view class="float-menu" @tap="handleClose">
    <view class="float-content" @tap.stop="() => {}">
      <view class="float-title">记一笔~</view>
      <view class="float-options">
        <view class="float-option" @tap="handleManual">
          <view class="option-icon">✏️</view>
          <view class="option-text">手动</view>
        </view>
        <view class="float-option" @tap="handleOcr">
          <view class="option-icon">📷</view>
          <view class="option-text">拍照</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'manual'): void
  (e: 'ocr'): void
}>()

function handleClose() {
  emit('close')
}

function handleManual() {
  emit('manual')
  emit('close')
}

function handleOcr() {
  emit('ocr')
  emit('close')
}
</script>

<style scoped>
.float-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.float-content {
  background-color: var(--card-color);
  border-radius: 24px;
  padding: 24px 32px 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.float-title {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-text);
  margin-bottom: 20px;
}

.float-options {
  display: flex;
  gap: 40px;
}

.float-option {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.option-icon {
  width: 64px;
  height: 64px;
  background-color: var(--background-color);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin-bottom: 8px;
}

.option-text {
  font-size: 14px;
  color: var(--primary-text);
}
</style>