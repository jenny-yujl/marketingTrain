<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        用户定向设置
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        精准定向目标用户群体，提升广告投放效果
      </p>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <div class="space-y-6">
        <!-- 年龄范围 -->
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            年龄范围
          </label>
          <select
            v-model="localData.ageRange"
            @change="updateData"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">请选择年龄范围</option>
            <option value="18-25">18-25岁</option>
            <option value="26-35">26-35岁</option>
            <option value="36-45">36-45岁</option>
            <option value="46-55">46-55岁</option>
            <option value="55+">55岁以上</option>
          </select>
        </div>

        <!-- 性别 -->
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            性别
          </label>
          <div class="flex space-x-4">
            <label class="flex items-center">
              <input
                v-model="localData.gender"
                @change="updateData"
                type="radio"
                value=""
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-900 dark:text-white">不限</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="localData.gender"
                @change="updateData"
                type="radio"
                value="male"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-900 dark:text-white">男性</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="localData.gender"
                @change="updateData"
                type="radio"
                value="female"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-900 dark:text-white">女性</span>
            </label>
          </div>
        </div>

        <!-- 地理位置 -->
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            地理位置
          </label>
          <select
            v-model="localData.location"
            @change="updateData"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">不限地区</option>
            <option value="beijing">北京</option>
            <option value="shanghai">上海</option>
            <option value="guangzhou">广州</option>
            <option value="shenzhen">深圳</option>
            <option value="hangzhou">杭州</option>
            <option value="tier1">一线城市</option>
            <option value="tier2">二线城市</option>
            <option value="tier3">三线城市</option>
          </select>
        </div>

        <!-- 兴趣标签 -->
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-3">
            兴趣标签
          </label>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <label 
              v-for="interest in availableInterests" 
              :key="interest"
              class="flex items-center p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            >
              <input
                v-model="localData.interests"
                @change="updateData"
                type="checkbox"
                :value="interest"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-900 dark:text-white">{{ interest }}</span>
            </label>
          </div>
        </div>

        <!-- 行为特征 -->
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-3">
            行为特征
          </label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label 
              v-for="behavior in availableBehaviors" 
              :key="behavior"
              class="flex items-center p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            >
              <input
                v-model="localData.behaviors"
                @change="updateData"
                type="checkbox"
                :value="behavior"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-900 dark:text-white">{{ behavior }}</span>
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

const availableInterests = [
  '时尚服装', '美妆护肤', '数码科技', '家居用品',
  '运动健身', '旅游出行', '美食餐饮', '母婴亲子',
  '教育培训', '金融理财', '汽车', '房产装修'
]

const availableBehaviors = [
  '经常网购', '喜欢直播', '关注优惠', '冲动消费',
  '品质导向', '价格敏感', '社交分享', '评价参考'
]

const updateData = () => {
  emit('change', localData.value)
}

watch(() => props.data, (newData) => {
  localData.value = { ...newData }
}, { deep: true })
</script>