<template>
  <div class="marketing-goals">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>营销目标设置</h3>
          <p>选择您的营销目标，系统将为您推荐最佳的优化策略</p>
        </div>
      </template>

      <el-form :model="formData" label-width="120px" @submit.prevent>
        <!-- 推广计划名称 -->
        <el-form-item label="推广计划名称" required>
          <el-input
            v-model="formData.name"
            placeholder="请输入推广计划名称"
            maxlength="50"
            show-word-limit
            @input="updateData"
          />
        </el-form-item>

        <!-- 营销目标 -->
        <el-form-item label="营销目标" required>
          <el-radio-group v-model="formData.marketingGoal" @change="updateData">
            <el-space direction="vertical" size="large">
              <el-radio value="brand_exposure">
                <div class="goal-option">
                  <div class="goal-title">品牌曝光</div>
                  <div class="goal-description">提升品牌知名度，扩大品牌影响力</div>
                </div>
              </el-radio>
              <el-radio value="lead_generation">
                <div class="goal-option">
                  <div class="goal-title">线索收集</div>
                  <div class="goal-description">获取潜在客户信息，建立客户池</div>
                </div>
              </el-radio>
              <el-radio value="live_commerce">
                <div class="goal-option">
                  <div class="goal-title">直播带货</div>
                  <div class="goal-description">通过直播推广商品，提高转化率</div>
                </div>
              </el-radio>
              <el-radio value="app_promotion">
                <div class="goal-option">
                  <div class="goal-title">应用推广</div>
                  <div class="goal-description">推广移动应用，增加下载量</div>
                </div>
              </el-radio>
            </el-space>
          </el-radio-group>
        </el-form-item>

        <!-- 优化目标 -->
        <el-form-item label="优化目标" required>
          <el-select v-model="formData.optimizationTarget" placeholder="请选择优化目标" @change="updateData">
            <el-option label="曝光量" value="impressions" />
            <el-option label="点击量" value="clicks" />
            <el-option label="转化量" value="conversions" />
            <el-option label="成本控制" value="cost_control" />
          </el-select>
        </el-form-item>

        <!-- 推广优先级 -->
        <el-form-item label="推广优先级">
          <el-radio-group v-model="formData.priority" @change="updateData">
            <el-radio value="high">高优先级</el-radio>
            <el-radio value="medium">中优先级</el-radio>
            <el-radio value="low">低优先级</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 目标说明 -->
        <el-alert
          v-if="targetDescription"
          :title="targetDescription.title"
          :description="targetDescription.description"
          type="info"
          show-icon
          :closable="false"
        />
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { computed, reactive, watch } from 'vue'

export default {
  name: 'MarketingGoals',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  emits: ['update'],
  setup(props, { emit }) {
    const formData = reactive({
      name: props.data.name || '',
      marketingGoal: props.data.marketingGoal || '',
      optimizationTarget: props.data.optimizationTarget || '',
      priority: props.data.priority || 'medium'
    })

    // 根据选择的目标显示说明
    const targetDescription = computed(() => {
      const descriptions = {
        brand_exposure: {
          title: '品牌曝光目标',
          description: '将重点优化曝光量和品牌知名度指标，适合新品发布或品牌推广活动'
        },
        lead_generation: {
          title: '线索收集目标',
          description: '将优化潜在客户获取成本，适合B2B业务或需要客户信息的场景'
        },
        live_commerce: {
          title: '直播带货目标',
          description: '将优化观看人数和购买转化，适合电商直播和产品销售'
        },
        app_promotion: {
          title: '应用推广目标',
          description: '将优化应用下载量和激活率，适合移动应用推广'
        }
      }
      return descriptions[formData.marketingGoal] || null
    })

    const updateData = () => {
      emit('update', { ...formData })
    }

    // 监听props变化同步到formData
    watch(() => props.data, (newData) => {
      Object.assign(formData, newData)
    }, { deep: true })

    return {
      formData,
      targetDescription,
      updateData
    }
  }
}
</script>

<style scoped>
.marketing-goals {
  max-width: 600px;
  margin: 0 auto;
}

.card-header h3 {
  margin: 0 0 8px 0;
  color: #303133;
}

.card-header p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.goal-option {
  margin-left: 8px;
}

.goal-title {
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.goal-description {
  color: #909399;
  font-size: 12px;
}

.el-form-item {
  margin-bottom: 24px;
}

.el-alert {
  margin-top: 16px;
}
</style>