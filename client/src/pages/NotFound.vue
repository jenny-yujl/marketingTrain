<template>
  <div class="not-found">
    <el-result
      icon="warning"
      title="404"
      sub-title="抱歉，您访问的页面不存在"
    >
      <template #extra>
        <el-button type="primary" @click="goHome">
          <el-icon><House /></el-icon>
          返回首页
        </el-button>
      </template>
    </el-result>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { House } from '@element-plus/icons-vue'

export default {
  name: 'NotFound',
  components: {
    House
  },
  setup() {
    const router = useRouter()
    
    const goHome = () => {
      router.push('/')
    }
    
    return {
      goHome
    }
  }
}
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}
</style>