<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useRecordsStore } from '@/stores/records'
import { useCategoriesStore } from '@/stores/categories'
import { useUserStore } from '@/stores/user'

onLaunch(() => {
  console.log('App Launch')

  // 初始化加载数据
  const recordsStore = useRecordsStore()
  const categoriesStore = useCategoriesStore()
  const userStore = useUserStore()

  recordsStore.loadRecords()
  categoriesStore.loadCategories()
  userStore.loadUser()
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style>
@import '@/styles/common.css';
</style>