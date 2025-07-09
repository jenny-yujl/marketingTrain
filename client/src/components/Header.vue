<template>
  <div class="header">
    <el-header>
      <div class="header-content">
        <div class="header-left">
          <h1 class="app-title">
            <el-icon class="title-icon"><Promotion /></el-icon>
            千川广告投放平台
          </h1>
          <div class="progress-info">
            <span class="progress-text">配置进度：</span>
            <el-progress 
              :percentage="progress" 
              :color="progressColor"
              :stroke-width="8"
              class="progress-bar"
            />
            <span class="progress-percentage">{{ progress }}%</span>
          </div>
        </div>
        <div class="header-right">
          <el-button 
            type="primary" 
            :icon="Document"
            @click="handleSave"
            :loading="saveLoading"
            size="large"
          >
            保存配置
          </el-button>
          <el-button 
            type="success" 
            :icon="Promotion"
            @click="handleLaunch"
            :disabled="progress < 100"
            size="large"
          >
            启动推广
          </el-button>
        </div>
      </div>
    </el-header>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { Document, Promotion } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'Header',
  components: {
    Document,
    Promotion
  },
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  emits: ['save', 'launch'],
  setup(props, { emit }) {
    const saveLoading = ref(false)

    const progressColor = computed(() => {
      if (props.progress >= 100) return '#67c23a'
      if (props.progress >= 60) return '#e6a23c'
      return '#409eff'
    })

    const handleSave = async () => {
      saveLoading.value = true
      try {
        emit('save')
        ElMessage.success('配置已保存')
      } catch (error) {
        ElMessage.error('保存失败，请重试')
      } finally {
        setTimeout(() => {
          saveLoading.value = false
        }, 1000)
      }
    }

    const handleLaunch = () => {
      if (props.progress < 100) {
        ElMessage.warning('请完成所有配置步骤后再启动推广')
        return
      }
      emit('launch')
      ElMessage.success('推广计划已启动')
    }

    return {
      saveLoading,
      progressColor,
      handleSave,
      handleLaunch
    }
  }
}
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 30px;
}

.app-title {
  display: flex;
  align-items: center;
  margin: 0;
  color: white;
  font-size: 24px;
  font-weight: 600;
}

.title-icon {
  margin-right: 12px;
  font-size: 28px;
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-text {
  color: white;
  font-size: 14px;
  font-weight: 500;
}

.progress-bar {
  width: 200px;
}

.progress-percentage {
  color: white;
  font-size: 14px;
  font-weight: 600;
  min-width: 40px;
}

.header-right {
  display: flex;
  gap: 12px;
}

:deep(.el-progress-bar__outer) {
  background-color: rgba(255, 255, 255, 0.2);
}

:deep(.el-progress-bar__inner) {
  transition: all 0.3s ease;
}

:deep(.el-button--large) {
  padding: 12px 20px;
  font-size: 14px;
}
</style>