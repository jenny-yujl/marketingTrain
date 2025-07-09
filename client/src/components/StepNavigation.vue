<template>
  <nav class="p-6">
    <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      配置步骤
    </h2>
    
    <ul class="space-y-2">
      <li v-for="step in steps" :key="step.id">
        <button
          @click="$emit('stepChange', step.id)"
          :class="[
            'w-full text-left px-4 py-3 rounded-lg transition-colors',
            activeStep === step.id
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-l-4 border-blue-600'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          ]"
        >
          <div class="flex items-center space-x-3">
            <div 
              :class="[
                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                activeStep === step.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
              ]"
            >
              {{ step.id }}
            </div>
            <span class="font-medium">{{ step.name }}</span>
          </div>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
interface Step {
  id: number
  name: string
}

interface Props {
  steps: Step[]
  activeStep: number
}

defineProps<Props>()
defineEmits<{
  stepChange: [stepId: number]
}>()
</script>