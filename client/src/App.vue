<template>
  <div id="app">
    <Header 
      :progress="progress" 
      @save="handleSave"
      @launch="handleLaunch"
    />
    
    <div class="main-container">
      <StepNavigation 
        :steps="steps" 
        :activeStep="activeStep" 
        @step-change="handleStepChange"
      />
      
      <div class="content-area">
        <component 
          :is="currentComponent" 
          :data="campaignData" 
          @update="handleDataUpdate"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import Header from './components/Header.vue'
import StepNavigation from './components/StepNavigation.vue'
import MarketingGoals from './components/MarketingGoals.vue'
import PromotionScenario from './components/PromotionScenario.vue'
import ProductSettings from './components/ProductSettings.vue'
import UserTargeting from './components/UserTargeting.vue'
import BudgetSchedule from './components/BudgetSchedule.vue'
import DataPreview from './components/DataPreview.vue'

export default {
  name: 'App',
  components: {
    Header,
    StepNavigation,
    MarketingGoals,
    PromotionScenario,
    ProductSettings,
    UserTargeting,
    BudgetSchedule,
    DataPreview
  },
  setup() {
    const activeStep = ref(1)
    
    const steps = [
      { id: 1, name: '营销目标' },
      { id: 2, name: '推广场景' },
      { id: 3, name: '商品设置' },
      { id: 4, name: '用户定向' },
      { id: 5, name: '预算投放' },
      { id: 6, name: '数据预览' }
    ]

    const campaignData = reactive({
      // 营销目标
      name: '',
      marketingGoal: '',
      optimizationTarget: '',
      priority: 'medium',
      
      // 推广场景
      promotionScenario: '',
      placements: [],
      deviceTypes: ['mobile'],
      
      // 商品设置
      productId: null,
      originalPrice: 0,
      currentPrice: 0,
      hasTimeLimitedDiscount: false,
      discountPercentage: 0,
      hasFullReduction: false,
      fullReductionThreshold: 0,
      fullReductionAmount: 0,
      
      // 用户定向
      ageRange: 'all',
      gender: 'all',
      location: 'national',
      interests: [],
      behaviors: [],
      
      // 预算投放
      campaignType: 'live_room',
      startTime: null,
      endTime: null,
      totalBudget: 1000,
      dailyBudget: 100,
      biddingStrategy: 'auto',
      clickBid: 1.5,
      weeklySchedule: [true, true, true, true, true, true, true],
      
      // 状态
      status: 'draft'
    })

    const componentMap = {
      1: 'MarketingGoals',
      2: 'PromotionScenario', 
      3: 'ProductSettings',
      4: 'UserTargeting',
      5: 'BudgetSchedule',
      6: 'DataPreview'
    }

    const currentComponent = computed(() => {
      return componentMap[activeStep.value] || 'MarketingGoals'
    })

    const progress = computed(() => {
      let completedSteps = 0
      
      // 检查每个步骤的完成情况
      if (campaignData.name && campaignData.marketingGoal && campaignData.optimizationTarget) {
        completedSteps++
      }
      if (campaignData.promotionScenario && campaignData.placements.length > 0) {
        completedSteps++
      }
      if (campaignData.productId && campaignData.currentPrice > 0) {
        completedSteps++
      }
      if (campaignData.ageRange || campaignData.interests.length > 0 || campaignData.behaviors.length > 0) {
        completedSteps++
      }
      if (campaignData.totalBudget > 0 && campaignData.dailyBudget > 0) {
        completedSteps++
      }
      
      return Math.round((completedSteps / 5) * 100)
    })

    const handleStepChange = (stepId) => {
      activeStep.value = stepId
    }

    const handleDataUpdate = (updates) => {
      Object.assign(campaignData, updates)
    }

    const handleSave = () => {
      // TODO: 实现保存到后端逻辑
      console.log('保存配置:', campaignData)
    }

    const handleLaunch = () => {
      // TODO: 实现启动推广逻辑
      campaignData.status = 'active'
      console.log('启动推广:', campaignData)
    }

    return {
      activeStep,
      steps,
      campaignData,
      currentComponent,
      progress,
      handleStepChange,
      handleDataUpdate,
      handleSave,
      handleLaunch
    }
  }
}
</script>

<style>
#app {
  min-height: 100vh;
  background: #f5f7fa;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.content-area {
  min-height: 500px;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

/* Element Plus 全局样式调整 */
.el-button {
  border-radius: 6px;
}

.el-card {
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.el-form-item__label {
  font-weight: 500;
}
</style>