<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        商品设置
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        配置推广商品信息和优惠策略
      </p>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <div class="space-y-6">
        <!-- 商品选择 -->
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            选择商品
          </label>
          <select
            v-model="localData.productId"
            @change="updateData"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option :value="null">请选择商品</option>
            <option v-for="product in products" :key="product.id" :value="product.id">
              {{ product.name }} - ¥{{ product.price }}
            </option>
          </select>
        </div>

        <!-- 价格设置 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              原价 (¥)
            </label>
            <input
              v-model.number="localData.originalPrice"
              @input="updateData"
              type="number"
              min="0"
              step="0.01"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              现价 (¥)
            </label>
            <input
              v-model.number="localData.currentPrice"
              @input="updateData"
              type="number"
              min="0"
              step="0.01"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <!-- 限时折扣 -->
        <div class="space-y-4">
          <div class="flex items-center">
            <input
              v-model="localData.hasTimeLimitedDiscount"
              @change="updateData"
              type="checkbox"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label class="ml-2 text-sm font-medium text-gray-900 dark:text-white">
              启用限时折扣
            </label>
          </div>
          
          <div v-if="localData.hasTimeLimitedDiscount">
            <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              折扣比例 (%)
            </label>
            <input
              v-model.number="localData.discountPercentage"
              @input="updateData"
              type="number"
              min="0"
              max="100"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <!-- 满减优惠 -->
        <div class="space-y-4">
          <div class="flex items-center">
            <input
              v-model="localData.hasFullReduction"
              @change="updateData"
              type="checkbox"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label class="ml-2 text-sm font-medium text-gray-900 dark:text-white">
              启用满减优惠
            </label>
          </div>
          
          <div v-if="localData.hasFullReduction" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                满减门槛 (¥)
              </label>
              <input
                v-model.number="localData.fullReductionThreshold"
                @input="updateData"
                type="number"
                min="0"
                step="0.01"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                减免金额 (¥)
              </label>
              <input
                v-model.number="localData.fullReductionAmount"
                @input="updateData"
                type="number"
                min="0"
                step="0.01"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import type { CampaignData } from '../lib/types'

interface Props {
  data: CampaignData
}

const props = defineProps<Props>()
const emit = defineEmits<{
  change: [updates: Partial<CampaignData>]
}>()

const localData = ref({ ...props.data })

// 获取商品列表
const { data: products } = useQuery({
  queryKey: ['products'],
  queryFn: async () => {
    const response = await fetch('/api/products')
    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }
    return response.json()
  }
})

const updateData = () => {
  emit('change', localData.value)
}

watch(() => props.data, (newData) => {
  localData.value = { ...newData }
}, { deep: true })
</script>