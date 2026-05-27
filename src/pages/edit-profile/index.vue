<template>
  <view class="edit-profile-page">
    <!-- 导航栏 -->
    <view class="nav-bar">
      <text class="nav-back" @tap="goBack">‹</text>
      <text class="nav-title">编辑资料</text>
      <view class="nav-placeholder"></view>
    </view>

    <view class="content">
      <!-- 头像 -->
      <view class="avatar-section">
        <view class="avatar">
          <text class="avatar-icon">🐻</text>
        </view>
        <text class="change-avatar">更换头像</text>
      </view>

      <!-- 昵称 -->
      <view class="form-item">
        <text class="form-label">昵称</text>
        <input
          v-model="nickname"
          class="form-input"
          placeholder="请输入昵称"
        />
      </view>

      <!-- 保存按钮 -->
      <view class="save-btn" :class="{ loading: isLoading }" @tap="handleSave">
        <text v-if="!isLoading">保存</text>
        <text v-else>保存中...</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const nickname = ref('')
const isLoading = ref(false)

onMounted(() => {
  if (userStore.user?.nickname) {
    nickname.value = userStore.user.nickname
  }
})

function handleSave() {
  if (!nickname.value.trim()) {
    uni.showToast({ title: '请输入昵称', icon: 'none' })
    return
  }

  isLoading.value = true

  setTimeout(() => {
    userStore.updateUser({
      ...userStore.user,
      nickname: nickname.value.trim()
    } as any)

    isLoading.value = false

    uni.showToast({
      title: '保存成功~',
      icon: 'success'
    })

    setTimeout(() => {
      goBack()
    }, 1500)
  }, 500)
}

function goBack() {
  uni.navigateBack()
}
</script>

<style scoped>
.edit-profile-page {
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
  color: var(--primary-text);
}

.nav-title {
  font-size: 18px;
  font-weight: 600;
}

.nav-placeholder {
  width: 28px;
}

.content {
  padding: var(--page-padding);
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: rgba(255, 138, 128, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-icon {
  font-size: 48px;
}

.change-avatar {
  margin-top: 12px;
  color: var(--primary-color);
  font-size: 14px;
}

.form-item {
  margin-bottom: 16px;
}

.form-label {
  font-size: 14px;
  color: var(--secondary-text);
  margin-bottom: 8px;
  display: block;
}

.form-input {
  background-color: var(--card-color);
  border: 1px solid var(--divider-color);
  border-radius: var(--input-radius);
  padding: 12px 16px;
  font-size: 15px;
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
  margin-top: 32px;
}

.save-btn.loading {
  opacity: 0.7;
}
</style>