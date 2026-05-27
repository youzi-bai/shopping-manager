<template>
  <view class="mine-page">
    <!-- 用户信息头部 -->
    <view class="user-header" @tap="goEditProfile">
      <view class="avatar">
        <text class="avatar-icon">🐻</text>
      </view>
      <view class="user-info">
        <view class="nickname-row">
          <text class="nickname">{{ user?.nickname || '摆摆' }}</text>
          <text class="arrow">›</text>
        </view>
        <text class="stats">已记账{{ dayCount }}天 · {{ recordCount }}笔</text>
      </view>
    </view>

    <!-- 菜单列表 -->
    <view class="menu-section">
      <view
        v-for="(menu, index) in menuItems"
        :key="menu.label"
        class="menu-item"
        :class="{ 'border-bottom': index !== menuItems.length - 1 }"
        @tap="menu.action"
      >
        <text class="menu-emoji">{{ menu.emoji }}</text>
        <text class="menu-label">{{ menu.label }}</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <!-- 底部导航 -->
    <TabBar
      :current-index="3"
      @change="handleTabChange"
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
import { useUserStore } from '@/stores/user'
import { friendlyText } from '@/constants'
import TabBar from '@/components/tab-bar.vue'
import FloatMenu from '@/components/float-menu.vue'

const userStore = useUserStore()

const showFloatMenu = ref(false)

const user = computed(() => userStore.user)
const recordCount = computed(() => userStore.recordCount)
const dayCount = computed(() => userStore.dayCount)

const menuItems = [
  { emoji: '💰', label: friendlyText.budgetSetup, action: () => {} },
  { emoji: '🔔', label: friendlyText.reminderSetup, action: () => {} },
  { emoji: '☁️', label: friendlyText.cloudSync, action: () => {} },
  { emoji: '📤', label: friendlyText.dataExport, action: () => {} },
  { emoji: '🔐', label: friendlyText.securitySetup, action: () => {} },
  { emoji: '🎨', label: friendlyText.themeSetup, action: () => {} },
  { emoji: 'ℹ️', label: friendlyText.about, action: () => {} },
  { emoji: '💬', label: friendlyText.helpFeedback, action: () => {} }
]

function handleTabChange(index: number) {
  // tab切换处理
}

function goEditProfile() {
  uni.navigateTo({ url: '/pages/edit-profile/index' })
}

function goAddRecord() {
  uni.navigateTo({ url: '/pages/add-record/index' })
}

function goOcrRecord() {
  uni.navigateTo({ url: '/pages/ocr-record/index' })
}

onMounted(() => {
  userStore.loadUser()
})
</script>

<style scoped>
.mine-page {
  min-height: 100vh;
  background-color: var(--background-color);
  padding-bottom: 80px;
}

.user-header {
  display: flex;
  align-items: center;
  padding: var(--page-padding);
  background-color: var(--card-color);
  margin-bottom: 16px;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: rgba(255, 138, 128, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-icon {
  font-size: 32px;
}

.user-info {
  flex: 1;
  margin-left: 16px;
}

.nickname-row {
  display: flex;
  align-items: center;
}

.nickname {
  font-size: 20px;
  font-weight: 600;
}

.arrow {
  font-size: 20px;
  color: var(--secondary-text);
  margin-left: 8px;
}

.stats {
  font-size: 12px;
  color: var(--secondary-text);
  margin-top: 4px;
  display: block;
}

.menu-section {
  margin: 0 16px;
  background-color: var(--card-color);
  border-radius: var(--card-radius);
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
}

.menu-item.border-bottom {
  border-bottom: 0.5px solid var(--divider-color);
}

.menu-emoji {
  font-size: 20px;
  margin-right: 12px;
}

.menu-label {
  flex: 1;
  font-size: 15px;
}

.menu-arrow {
  font-size: 20px;
  color: var(--secondary-text);
}
</style>