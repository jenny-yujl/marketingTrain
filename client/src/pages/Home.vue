<template>
  <div class="home-container">
    <!-- 顶部导航栏 -->
    <el-header class="header">
      <div class="header-content">
        <div class="logo">
          <el-icon><Monitor /></el-icon>
          <span>巨量千川教学系统</span>
        </div>
        <div class="header-actions">
          <el-button type="primary" @click="saveCampaign" :loading="saving">
            <el-icon><Document /></el-icon>
            保存推广计划
          </el-button>
        </div>
      </div>
    </el-header>

    <!-- 主体内容 -->
    <el-container>
      <!-- 侧边栏步骤导航 -->
      <el-aside width="300px" class="sidebar">
        <div class="progress-section">
          <h3>配置进度</h3>
          <el-progress :percentage="progress" :color="progressColor" />
          <p class="progress-text">{{ progressText }}</p>
        </div>
        
        <el-menu
          :default-active="currentStep.toString()"
          class="step-menu"
          @select="handleStepSelect"
        >
          <el-menu-item
            v-for="(step, index) in steps"
            :key="index"
            :index="index.toString()"
            :class="{ completed: index < currentStep }"
          >
            <el-icon>
              <Check v-if="index < currentStep" />
              <component v-else :is="step.icon" />
            </el-icon>
            <span>{{ step.name }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主要内容区域 -->
      <el-main class="main-content">
        <div class="step-content">
          <div class="step-header">
            <h1>{{ steps[currentStep].name }}</h1>
            <p>{{ steps[currentStep].description }}</p>
          </div>

          <!-- 根据当前步骤渲染不同组件 -->
          <component
            :is="currentComponent"
            :data="campaignData"
            @update="updateCampaignData"
          />

          <!-- 步骤导航按钮 -->
          <div class="step-actions">
            <el-button
              v-if="currentStep > 0"
              @click="previousStep"
              size="large"
            >
              <el-icon><ArrowLeft /></el-icon>
              上一步
            </el-button>
            
            <el-button
              v-if="currentStep < steps.length - 1"
              type="primary"
              @click="nextStep"
              size="large"
            >
              下一步
              <el-icon><ArrowRight /></el-icon>
            </el-button>
            
            <el-button
              v-if="currentStep === steps.length - 1"
              type="success"
              @click="createCampaign"
              size="large"
              :loading="creating"
            >
              <el-icon><Check /></el-icon>
              创建推广计划
            </el-button>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { ref, computed, reactive, onMounted } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import {
  Monitor,
  Document,
  Check,
  ArrowLeft,
  ArrowRight,
  Target,
  VideoPlay,
  ShoppingBag,
  User,
  Money,
  DataLine
} from '@element-plus/icons-vue'

// 导入步骤组件
import MarketingGoals from '../components/MarketingGoals.vue'
import PromotionScenario from '../components/PromotionScenario.vue'
import ProductSettings from '../components/ProductSettings.vue'
import UserTargeting from '../components/UserTargeting.vue'
import BudgetSchedule from '../components/BudgetSchedule.vue'
import DataPreview from '../components/DataPreview.vue'

export default {
  name: 'Home',
  components: {
    MarketingGoals,
    PromotionScenario,
    ProductSettings,
    UserTargeting,
    BudgetSchedule,
    DataPreview,
    Monitor,
    Document,
    Check,
    ArrowLeft,
    ArrowRight,
    Target,
    VideoPlay,
    ShoppingBag,
    User,
    Money,
    DataLine
  },
  setup() {
    // 当前步骤
    const currentStep = ref(0)
    
    // 保存和创建状态
    const saving = ref(false)
    const creating = ref(false)

    // 步骤定义
    const steps = [
      {
        name: '营销目标',
        description: '选择您的营销目标和优化目标',
        icon: 'Target',
        component: 'MarketingGoals'
      },
      {
        name: '推广场景',
        description: '选择推广场景和投放位置',
        icon: 'VideoPlay',
        component: 'PromotionScenario'
      },
      {
        name: '商品设置',
        description: '配置商品信息和促销策略',
        icon: 'ShoppingBag',
        component: 'ProductSettings'
      },
      {
        name: '用户定向',
        description: '设置目标用户群体和定向条件',
        icon: 'User',
        component: 'UserTargeting'
      },
      {
        name: '预算投放',
        description: '设置预算和投放时间安排',
        icon: 'Money',
        component: 'BudgetSchedule'
      },
      {
        name: '数据预览',
        description: '查看配置总览和预估数据',
        icon: 'DataLine',
        component: 'DataPreview'
      }
    ]

    // 推广计划数据
    const campaignData = reactive({
      name: '',
      marketingGoal: '',
      optimizationTarget: '',
      priority: 'medium',
      promotionScenario: '',
      placements: [],
      deviceTypes: [],
      productId: null,
      originalPrice: 0,
      currentPrice: 0,
      hasTimeLimitedDiscount: false,
      discountPercentage: 0,
      hasFullReduction: false,
      fullReductionThreshold: 0,
      fullReductionAmount: 0,
      ageRange: '',
      gender: '',
      location: '',
      interests: [],
      behaviors: [],
      campaignType: 'live_room',
      startTime: null,
      endTime: null,
      totalBudget: 0,
      dailyBudget: 0,
      biddingStrategy: 'auto',
      clickBid: 0,
      weeklySchedule: [true, true, true, true, true, true, true],
      status: 'draft'
    })

    // 计算属性
    const currentComponent = computed(() => {
      return steps[currentStep.value].component
    })

    const progress = computed(() => {
      return Math.round(((currentStep.value + 1) / steps.length) * 100)
    })

    const progressColor = computed(() => {
      if (progress.value < 30) return '#f56c6c'
      if (progress.value < 70) return '#e6a23c'
      return '#67c23a'
    })

    const progressText = computed(() => {
      return `第 ${currentStep.value + 1} 步，共 ${steps.length} 步`
    })

    // 方法
    const handleStepSelect = (index) => {
      currentStep.value = parseInt(index)
    }

    const nextStep = () => {
      if (currentStep.value < steps.length - 1) {
        currentStep.value++
      }
    }

    const previousStep = () => {
      if (currentStep.value > 0) {
        currentStep.value--
      }
    }

    const updateCampaignData = (updates) => {
      Object.assign(campaignData, updates)
    }

    const saveCampaign = async () => {
      saving.value = true
      try {
        // 这里可以调用API保存数据
        await new Promise(resolve => setTimeout(resolve, 1000))
        ElMessage.success('推广计划已保存')
      } catch (error) {
        ElMessage.error('保存失败，请重试')
      } finally {
        saving.value = false
      }
    }

    const createCampaign = async () => {
      creating.value = true
      try {
        // 这里可以调用API创建推广计划
        await new Promise(resolve => setTimeout(resolve, 2000))
        ElNotification({
          title: '创建成功',
          message: '推广计划已成功创建并开始投放',
          type: 'success',
          duration: 4000
        })
        campaignData.status = 'active'
      } catch (error) {
        ElMessage.error('创建失败，请重试')
      } finally {
        creating.value = false
      }
    }

    // 生命周期
    onMounted(() => {
      ElMessage.info('欢迎使用巨量千川教学系统')
    })

    return {
      currentStep,
      saving,
      creating,
      steps,
      campaignData,
      currentComponent,
      progress,
      progressColor,
      progressText,
      handleStepSelect,
      nextStep,
      previousStep,
      updateCampaignData,
      saveCampaign,
      createCampaign
    }
  }
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.header {
  background: white;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: #409eff;
}

.logo .el-icon {
  margin-right: 8px;
  font-size: 24px;
}

.sidebar {
  background: white;
  border-right: 1px solid #e4e7ed;
  padding: 20px;
}

.progress-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.progress-section h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #303133;
}

.progress-text {
  margin: 10px 0 0 0;
  font-size: 14px;
  color: #606266;
}

.step-menu {
  border: none;
}

.step-menu .el-menu-item {
  height: 50px;
  line-height: 50px;
  margin-bottom: 5px;
  border-radius: 6px;
}

.step-menu .el-menu-item.completed {
  background-color: #f0f9ff;
  color: #409eff;
}

.main-content {
  padding: 30px;
}

.step-content {
  max-width: 800px;
  margin: 0 auto;
}

.step-header {
  margin-bottom: 30px;
  text-align: center;
}

.step-header h1 {
  margin: 0 0 10px 0;
  font-size: 24px;
  color: #303133;
}

.step-header p {
  margin: 0;
  font-size: 16px;
  color: #606266;
}

.step-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #e4e7ed;
}
</style>