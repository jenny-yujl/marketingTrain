<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        推广场景选择
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        选择最适合您产品的推广场景和投放位置
      </p>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <div class="space-y-6">
        <!-- 推广场景 -->
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-4">
            推广场景
          </label>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              v-for="scenario in scenarios" 
              :key="scenario.value"
              @click="selectScenario(scenario.value)"
              :class="[
                'p-4 border rounded-lg cursor-pointer transition-all',
                localData.promotionScenario === scenario.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
              ]"
            >
              <div class="text-center">
                <div class="text-2xl mb-2">{{ scenario.icon }}</div>
                <h3 class="font-medium text-gray-900 dark:text-white">{{ scenario.label }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {{ scenario.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 投放位置 -->
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-3">
            投放位置
          </label>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <label 
              v-for="placement in placements" 
              :key="placement.value"
              class="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            >
              <input
                v-model="localData.placements"
                @change="updateData"
                type="checkbox"
                :value="placement.value"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-900 dark:text-white">{{ placement.label }}</span>
            </label>
          </div>
        </div>

        <!-- 设备类型 -->
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-3">
            设备类型
          </label>
          <div class="flex space-x-4">
            <label 
              v-for="device in deviceTypes" 
              :key="device.value"
              class="flex items-center"
            >
              <input
                v-model="localData.deviceTypes"
                @change="updateData"
                type="checkbox"
                :value="device.value"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-900 dark:text-white">{{ device.label }}</span>
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

const scenarios = [
  {
    value: 'live_room',
    label: '直播间推广',
    icon: '🎥',
    description: '推广直播间，提升观看人数'
  },
  {
    value: 'video_content',
    label: '视频内容',
    icon: '📹',
    description: '推广短视频内容'
  },
  {
    value: 'feed_promotion',
    label: 'Feed流推广',
    icon: '📱',
    description: '在信息流中展示广告'
  }
]

const placements = [
  { value: 'feed', label: '信息流' },
  { value: 'search', label: '搜索结果' },
  { value: 'live_room', label: '直播间' },
  { value: 'video_detail', label: '视频详情页' },
  { value: 'comment', label: '评论区' },
  { value: 'profile', label: '个人主页' }
]

const deviceTypes = [
  { value: 'mobile', label: '手机' },
  { value: 'tablet', label: '平板' },
  { value: 'desktop', label: '电脑' }
]

const selectScenario = (scenario: string) => {
  localData.value.promotionScenario = scenario
  updateData()
}

const updateData = () => {
  emit('change', localData.value)
}

watch(() => props.data, (newData) => {
  localData.value = { ...newData }
}, { deep: true })
</script>