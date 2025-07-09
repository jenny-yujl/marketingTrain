<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        数据预览
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        查看活动配置总结和预估效果数据
      </p>
    </div>

    <!-- 活动配置总结 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        活动配置总结
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">活动名称:</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ data.name || '未设置' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">营销目标:</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ getMarketingGoalLabel(data.marketingGoal) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">推广场景:</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ getPromotionScenarioLabel(data.promotionScenario) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">总预算:</span>
            <span class="font-medium text-gray-900 dark:text-white">¥{{ data.totalBudget || 0 }}</span>
          </div>
        </div>
        
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">日预算:</span>
            <span class="font-medium text-gray-900 dark:text-white">¥{{ data.dailyBudget || 0 }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">目标用户:</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ getTargetAudience() }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">投放位置:</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ data.placements.length }}个位置</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">活动状态:</span>
            <span :class="[
              'px-2 py-1 rounded-full text-xs font-medium',
              data.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            ]">
              {{ getStatusLabel(data.status) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 预估效果数据 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        预估效果数据
      </h3>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {{ estimatedData.impressions.toLocaleString() }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">预估曝光</div>
        </div>
        
        <div class="text-center p-4 bg-green-50 dark:bg-green-900 rounded-lg">
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">
            {{ estimatedData.clicks.toLocaleString() }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">预估点击</div>
        </div>
        
        <div class="text-center p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
          <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
            ¥{{ estimatedData.cpc.toFixed(2) }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">预估CPC</div>
        </div>
        
        <div class="text-center p-4 bg-orange-50 dark:bg-orange-900 rounded-lg">
          <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {{ (estimatedData.ctr * 100).toFixed(2) }}%
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">预估CTR</div>
        </div>
      </div>
    </div>

    <!-- 优化建议 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        优化建议
      </h3>
      
      <div class="space-y-3">
        <div v-for="suggestion in suggestions" :key="suggestion.type" class="flex items-start space-x-3">
          <div :class="[
            'w-2 h-2 rounded-full mt-2',
            suggestion.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
          ]"></div>
          <p class="text-sm text-gray-700 dark:text-gray-300">{{ suggestion.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CampaignData } from '../lib/types'

interface Props {
  data: CampaignData
}

const props = defineProps<Props>()

// 预估数据计算
const estimatedData = computed(() => {
  const dailyBudget = props.data.dailyBudget || 0
  const estimatedCpc = 2.5 // 预估CPC
  const estimatedCtr = 0.015 // 预估CTR
  
  const clicks = Math.round(dailyBudget / estimatedCpc)
  const impressions = Math.round(clicks / estimatedCtr)
  
  return {
    impressions,
    clicks,
    cpc: estimatedCpc,
    ctr: estimatedCtr
  }
})

// 优化建议
const suggestions = computed(() => {
  const suggestions = []
  
  if (!props.data.name) {
    suggestions.push({ type: 'warning', text: '建议设置一个明确的活动名称' })
  }
  
  if (props.data.dailyBudget < 100) {
    suggestions.push({ type: 'info', text: '建议日预算不低于100元以获得更好的投放效果' })
  }
  
  if (props.data.placements.length < 2) {
    suggestions.push({ type: 'info', text: '建议选择多个投放位置以扩大覆盖面' })
  }
  
  if (!props.data.ageRange) {
    suggestions.push({ type: 'warning', text: '建议设置目标年龄范围以提高投放精准度' })
  }
  
  return suggestions
})

const getMarketingGoalLabel = (goal: string) => {
  const labels: Record<string, string> = {
    'brand_exposure': '品牌曝光',
    'lead_generation': '获客转化',
    'live_commerce': '直播带货'
  }
  return labels[goal] || '未设置'
}

const getPromotionScenarioLabel = (scenario: string) => {
  const labels: Record<string, string> = {
    'live_room': '直播间推广',
    'video_content': '视频内容',
    'feed_promotion': 'Feed流推广'
  }
  return labels[scenario] || '未设置'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'draft': '草稿',
    'active': '投放中',
    'paused': '已暂停',
    'completed': '已完成'
  }
  return labels[status] || '未知'
}

const getTargetAudience = () => {
  const parts = []
  if (props.data.ageRange) parts.push(props.data.ageRange)
  if (props.data.gender) parts.push(props.data.gender === 'male' ? '男性' : '女性')
  if (props.data.location) parts.push(props.data.location)
  return parts.length > 0 ? parts.join(', ') : '未设置'
}
</script>