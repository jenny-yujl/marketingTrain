<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Header 
      :progress="progress" 
      @save="handleSave" 
    />
    
    <div class="flex">
      <!-- 左侧导航 -->
      <div class="w-80 bg-white dark:bg-gray-800 shadow-sm">
        <StepNavigation 
          :steps="steps"
          :activeStep="activeStep"
          @step-change="handleStepChange"
        />
      </div>
      
      <!-- 主要内容区域 -->
      <div class="flex-1 p-6">
        <div class="max-w-4xl mx-auto">
          <!-- 动态组件渲染 -->
          <component 
            :is="currentStepComponent"
            :data="campaignData"
            @change="handleDataChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import Header from '../components/Header.vue'
import StepNavigation from '../components/StepNavigation.vue'
import MarketingGoals from '../components/MarketingGoals.vue'
import PromotionScenario from '../components/PromotionScenario.vue'
import ProductSettings from '../components/ProductSettings.vue'
import UserTargeting from '../components/UserTargeting.vue'
import BudgetSchedule from '../components/BudgetSchedule.vue'
import DataPreview from '../components/DataPreview.vue'

import type { CampaignData } from '../lib/types'

// 步骤配置
const steps = [
  { id: 1, name: '营销目标' },
  { id: 2, name: '推广场景' },
  { id: 3, name: '商品设置' },
  { id: 4, name: '定向设置' },
  { id: 5, name: '预算投放' },
  { id: 6, name: '数据预览' }
]

// 响应式数据
const activeStep = ref(1)
const campaignData = ref<CampaignData>({
  name: '',
  marketingGoal: '',
  optimizationTarget: '',
  priority: '',
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
  campaignType: '',
  startTime: null,
  endTime: null,
  totalBudget: 0,
  dailyBudget: 0,
  biddingStrategy: '',
  clickBid: 0,
  weeklySchedule: [false, false, false, false, false, false, false],
  status: 'draft'
})

// 计算当前步骤组件
const currentStepComponent = computed(() => {
  const componentMap: Record<number, any> = {
    1: MarketingGoals,
    2: PromotionScenario,
    3: ProductSettings,
    4: UserTargeting,
    5: BudgetSchedule,
    6: DataPreview
  }
  return componentMap[activeStep.value]
})

// 计算进度
const progress = computed(() => {
  return (activeStep.value / steps.length) * 100
})

// 获取活动数据
const { data: campaigns, isLoading, error } = useQuery({
  queryKey: ['campaigns'],
  queryFn: async () => {
    const response = await fetch('/api/campaigns')
    if (!response.ok) {
      throw new Error('Failed to fetch campaigns')
    }
    return response.json()
  }
})

// 事件处理
const handleStepChange = (stepId: number) => {
  activeStep.value = stepId
}

const handleDataChange = (updates: Partial<CampaignData>) => {
  campaignData.value = { ...campaignData.value, ...updates }
}

const handleSave = async () => {
  try {
    const response = await fetch('/api/campaigns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(campaignData.value),
    })
    
    if (!response.ok) {
      throw new Error('保存失败')
    }
    
    console.log('活动保存成功')
  } catch (error) {
    console.error('保存活动时出错:', error)
  }
}

onMounted(() => {
  console.log('巨量千川教学系统已启动 - Vue 3版本')
})
</script>