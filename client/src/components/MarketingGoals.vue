<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        营销目标设置
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        选择您的营销目标，系统将根据目标推荐最适合的推广策略
      </p>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <div class="space-y-6">
        <!-- 活动名称 -->
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            活动名称
          </label>
          <input
            v-model="localData.name"
            @input="updateData"
            type="text"
            placeholder="请输入活动名称"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <!-- 营销目标 -->
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-4">
            营销目标
          </label>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              v-for="goal in marketingGoals" 
              :key="goal.value"
              @click="selectGoal(goal.value)"
              :class="[
                'p-4 border rounded-lg cursor-pointer transition-all',
                localData.marketingGoal === goal.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
              ]"
            >
              <div class="text-center">
                <div class="text-2xl mb-2">{{ goal.icon }}</div>
                <h3 class="font-medium text-gray-900 dark:text-white">{{ goal.label }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {{ goal.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 优化目标 -->
        <div v-if="localData.marketingGoal">
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            优化目标
          </label>
          <select
            v-model="localData.optimizationTarget"
            @change="updateData"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">请选择优化目标</option>
            <option value="clicks">点击量</option>
            <option value="conversions">转化量</option>
            <option value="impressions">曝光量</option>
            <option value="engagement">互动量</option>
          </select>
        </div>

        <!-- 投放优先级 -->
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            投放优先级
          </label>
          <div class="flex space-x-4">
            <label v-for="priority in priorities" :key="priority.value" class="flex items-center">
              <input
                v-model="localData.priority"
                @change="updateData"
                type="radio"
                :value="priority.value"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-900 dark:text-white">{{ priority.label }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { CampaignData } from '../lib/types'

interface Props {
  data: CampaignData
}

const props = defineProps<Props>()
const emit = defineEmits<{
  change: [updates: Partial<CampaignData>]
}>()

const localData = ref({ ...props.data })

const marketingGoals = [
  {
    value: 'brand_exposure',
    label: '品牌曝光',
    icon: '🎯',
    description: '提升品牌知名度和曝光度'
  },
  {
    value: 'lead_generation',
    label: '获客转化',
    icon: '📈',
    description: '获取潜在客户和提升转化'
  },
  {
    value: 'live_commerce',
    label: '直播带货',
    icon: '📺',
    description: '推广直播间商品销售'
  }
]

const priorities = [
  { value: 'low', label: '低' },
  { value: 'medium', label: '中' },
  { value: 'high', label: '高' }
]

const selectGoal = (goal: string) => {
  localData.value.marketingGoal = goal
  updateData()
}

const updateData = () => {
  emit('change', localData.value)
}

watch(() => props.data, (newData) => {
  localData.value = { ...newData }
}, { deep: true })
</script>