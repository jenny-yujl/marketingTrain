<template>
  <div class="step-navigation">
    <el-steps :active="activeStep - 1" :space="200" align-center>
      <el-step
        v-for="step in steps"
        :key="step.id"
        :title="step.name"
        :icon="getStepIcon(step.id)"
        class="step-item"
        @click="handleStepClick(step.id)"
      />
    </el-steps>
  </div>
</template>

<script>
import { Target, ShoppingCart, Users, Money, BarChart } from '@element-plus/icons-vue'

export default {
  name: 'StepNavigation',
  components: {
    Target,
    ShoppingCart,
    Users,
    Money,
    BarChart
  },
  props: {
    steps: {
      type: Array,
      required: true
    },
    activeStep: {
      type: Number,
      required: true
    }
  },
  emits: ['step-change'],
  methods: {
    handleStepClick(stepId) {
      this.$emit('step-change', stepId)
    },
    getStepIcon(stepId) {
      const iconMap = {
        1: Target,
        2: ShoppingCart,
        3: Users,
        4: Money,
        5: BarChart
      }
      return iconMap[stepId] || Target
    }
  }
}
</script>

<style scoped>
.step-navigation {
  margin-bottom: 30px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.step-item {
  cursor: pointer;
}

:deep(.el-step__title) {
  font-size: 14px;
  color: #606266;
}

:deep(.el-step__title.is-finish) {
  color: #67c23a;
}

:deep(.el-step__title.is-process) {
  color: #409eff;
  font-weight: 600;
}

:deep(.el-step__icon) {
  font-size: 20px;
}
</style>