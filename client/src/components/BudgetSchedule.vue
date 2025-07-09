<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        预算与投放设置
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        配置投放预算、时间和出价策略
      </p>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <div class="space-y-6">
        <!-- 活动类型 -->
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            活动类型
          </label>
          <div class="flex space-x-4">
            <label class="flex items-center">
              <input
                v-model="localData.campaignType"
                @change="updateData"
                type="radio"
                value="continuous"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-900 dark:text-white">长期投放</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="localData.campaignType"
                @change="updateData"
                type="radio"
                value="scheduled"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-900 dark:text-white">定时投放</span>
            </label>
          </div>
        </div>

        <!-- 投放时间 -->
        <div v-if="localData.campaignType === 'scheduled'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              开始时间
            </label>
            <input
              v-model="startTimeString"
              @change="updateStartTime"
              type="datetime-local"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              结束时间
            </label>
            <input
              v-model="endTimeString"
              @change="updateEndTime"
              type="datetime-local"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <!-- 预算设置 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              总预算 (¥)
            </label>
            <input
              v-model.number="localData.totalBudget"
              @input="updateData"
              type="number"
              min="0"
              step="0.01"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              日预算 (¥)
            </label>
            <input
              v-model.number="localData.dailyBudget"
              @input="updateData"
              type="number"
              min="0"
              step="0.01"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <!-- 出价策略 -->
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            出价策略
          </label>
          <select
            v-model="localData.biddingStrategy"
            @change="updateData"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">请选择出价策略</option>
            <option value="auto">自动出价</option>
            <option value="manual">手动出价</option>
            <option value="target_cost">目标成本</option>
            <option value="target_roas">目标ROAS</option>
          </select>
        </div>

        <!-- 手动出价 -->
        <div v-if="localData.biddingStrategy === 'manual'">
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            点击出价 (¥)
          </label>
          <input
            v-model.number="localData.clickBid"
            @input="updateData"
            type="number"
            min="0"
            step="0.01"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <!-- 投放时段 -->
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-3">
            投放时段
          </label>
          <div class="grid grid-cols-7 gap-2">
            <div 
              v-for="(day, index) in weekDays" 
              :key="index"
              class="text-center"
            >
              <label class="block">
                <input
                  v-model="localData.weeklySchedule[index]"
                  @change="updateData"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="block text-xs text-gray-900 dark:text-white mt-1">{{ day }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { CampaignData } from '../lib/types'

interface Props {
  data: CampaignData
}

const props = defineProps<Props>()
const emit = defineEmits<{
  change: [updates: Partial<CampaignData>]
}>()

const localData = ref({ ...props.data })

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

// 时间格式转换
const startTimeString = computed({
  get: () => localData.value.startTime ? new Date(localData.value.startTime).toISOString().slice(0, 16) : '',
  set: (value: string) => {
    localData.value.startTime = value ? new Date(value) : null
    updateData()
  }
})

const endTimeString = computed({
  get: () => localData.value.endTime ? new Date(localData.value.endTime).toISOString().slice(0, 16) : '',
  set: (value: string) => {
    localData.value.endTime = value ? new Date(value) : null
    updateData()
  }
})

const updateStartTime = (event: Event) => {
  const target = event.target as HTMLInputElement
  localData.value.startTime = target.value ? new Date(target.value) : null
  updateData()
}

const updateEndTime = (event: Event) => {
  const target = event.target as HTMLInputElement
  localData.value.endTime = target.value ? new Date(target.value) : null
  updateData()
}

const updateData = () => {
  emit('change', localData.value)
}

watch(() => props.data, (newData) => {
  localData.value = { ...newData }
}, { deep: true })
</script>