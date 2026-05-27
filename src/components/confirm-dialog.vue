<template>
  <view class="confirm-dialog" @tap="handleCancel">
    <view class="dialog-content" @tap.stop="() => {}">
      <text class="dialog-title">确定要删除吗？</text>
      <text class="dialog-message">删除后无法恢复哦~</text>
      <view class="dialog-actions">
        <text class="dialog-btn cancel" @tap="handleCancel">取消</text>
        <text class="dialog-btn confirm" @tap="handleConfirm">确定</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'confirm'): void
}>()

function handleCancel() {
  emit('cancel')
}

function handleConfirm() {
  emit('confirm')
}
</script>

<style scoped>
.confirm-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 400;
}

.dialog-content {
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
  margin-bottom: 8px;
}

.dialog-message {
  font-size: 14px;
  color: var(--secondary-text);
  text-align: center;
  display: block;
  margin-bottom: 20px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.dialog-btn {
  font-size: 14px;
  padding: 8px 16px;
}

.dialog-btn.cancel {
  color: var(--secondary-text);
}

.dialog-btn.confirm {
  color: var(--primary-color);
  font-weight: 500;
}
</style>