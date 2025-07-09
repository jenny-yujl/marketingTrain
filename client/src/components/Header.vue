<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
    <div class="px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">千</span>
          </div>
          <div>
            <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
              巨量千川推广教学系统
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              ByteDance Qianchuan Advertising Platform
            </p>
          </div>
        </div>
        
        <div class="flex items-center space-x-4">
          <!-- 进度条 -->
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-600 dark:text-gray-400">进度:</span>
            <div class="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${progress}%` }"
              ></div>
            </div>
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              {{ Math.round(progress) }}%
            </span>
          </div>
          
          <!-- 保存按钮 -->
          <button
            @click="$emit('save')"
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            保存活动
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  progress: number
}

defineProps<Props>()
defineEmits<{
  save: []
}>()
</script>