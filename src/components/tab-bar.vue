<template>
  <div class="tab-bar">
    <div
      v-for="(item, index) in tabItems"
      :key="index"
      class="tab-item"
      :class="{ active: getActiveState(index) }"
      @click="handleClick(index)"
    >
      <span class="tab-icon">{{ item.isAdd ? '+' : item.icon }}</span>
      <span class="tab-text">{{ item.isAdd ? '记一笔' : item.text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentIndex: number
}>()

const emit = defineEmits<{
  (e: 'change', index: number): void
  (e: 'add'): void
}>()

const tabItems = [
  { icon: '🏠', text: '首页', path: '/pages/index/index', isAdd: false },
  { icon: '📁', text: '分类', path: '/pages/categories/index', isAdd: false },
  { icon: '+', text: '记一笔', path: '', isAdd: true },
  { icon: '📊', text: '账单', path: '/pages/bill/index', isAdd: false },
  { icon: '👤', text: '我的', path: '/pages/mine/index', isAdd: false }
]

function getActiveState(index: number): boolean {
  const item = tabItems[index]
  if (item.isAdd) return false

  // currentIndex: 0=首页, 1=分类, 2=账单, 3=我的
  // tabItems: 0=首页, 1=分类, 2=记一笔, 3=账单, 4=我的
  // 当 tabIndex > 2 时，actualIndex = tabIndex - 1
  const actualIndex = index > 2 ? index - 1 : index

  return actualIndex === props.currentIndex
}

function handleClick(index: number) {
  const item = tabItems[index]

  if (item.isAdd) {
    emit('add')
  } else {
    emit('change', index)
    uni.reLaunch({ url: item.path })
  }
}
</script>

<style scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 8px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex: 1;
  height: 100%;
}

.tab-icon {
  font-size: 22px;
  margin-bottom: 2px;
}

.tab-text {
  font-size: 10px;
  color: #999999;
}

.tab-item.active .tab-text {
  color: #FF8A80;
}

.tab-item:nth-child(3) .tab-icon {
  width: 44px;
  height: 44px;
  background-color: #FF8A80;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  font-weight: 400;
  box-shadow: 0 4px 12px rgba(255, 138, 128, 0.4);
  margin-top: -10px;
}

.tab-item:nth-child(3) .tab-text {
  color: #FF8A80;
  margin-top: -2px;
}

.tab-item:nth-child(3) {
  margin-top: -8px;
}
</style>