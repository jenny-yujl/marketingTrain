<template>
  <div class="budget-schedule">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>预算投放</h3>
          <p>设置推广预算和投放时间安排</p>
        </div>
      </template>

      <el-form :model="formData" label-width="120px" @submit.prevent>
        <!-- 推广类型 -->
        <el-form-item label="推广类型">
          <el-radio-group v-model="formData.campaignType" @change="updateData">
            <el-radio value="live_room">直播间推广</el-radio>
            <el-radio value="video_content">视频内容推广</el-radio>
            <el-radio value="brand_campaign">品牌活动推广</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 投放时间 -->
        <el-form-item label="投放时间">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD HH:mm"
            @change="handleDateChange"
          />
        </el-form-item>

        <!-- 预算设置 -->
        <el-form-item label="总预算">
          <el-input-number
            v-model="formData.totalBudget"
            :min="100"
            :max="1000000"
            :step="100"
            controls-position="right"
            @change="updateData"
          />
          <span class="price-unit">元</span>
        </el-form-item>

        <el-form-item label="日预算">
          <el-input-number
            v-model="formData.dailyBudget"
            :min="50"
            :max="dailyBudgetMax"
            :step="50"
            controls-position="right"
            @change="updateData"
          />
          <span class="price-unit">元</span>
          <div class="budget-tip">
            建议日预算不超过总预算的{{ dailyBudgetPercentage }}%
          </div>
        </el-form-item>

        <!-- 出价策略 -->
        <el-form-item label="出价策略">
          <el-radio-group v-model="formData.biddingStrategy" @change="updateData">
            <el-space direction="vertical" size="large">
              <el-radio value="auto">
                <div class="strategy-option">
                  <div class="strategy-title">智能出价</div>
                  <div class="strategy-description">系统自动优化出价，推荐新手使用</div>
                </div>
              </el-radio>
              <el-radio value="manual">
                <div class="strategy-option">
                  <div class="strategy-title">手动出价</div>
                  <div class="strategy-description">手动设置点击出价，适合有经验的用户</div>
                </div>
              </el-radio>
            </el-space>
          </el-radio-group>
        </el-form-item>

        <!-- 手动出价设置 -->
        <el-form-item v-if="formData.biddingStrategy === 'manual'" label="点击出价">
          <el-input-number
            v-model="formData.clickBid"
            :min="0.1"
            :max="100"
            :step="0.1"
            :precision="2"
            controls-position="right"
            @change="updateData"
          />
          <span class="price-unit">元</span>
          <div class="bid-tip">
            建议出价范围：{{ suggestedBidRange }}
          </div>
        </el-form-item>

        <!-- 投放时段 -->
        <el-form-item label="投放时段">
          <div class="schedule-container">
            <h4>选择一周中的投放日期：</h4>
            <div class="weekly-schedule">
              <el-checkbox
                v-for="(day, index) in weekDays"
                :key="index"
                v-model="formData.weeklySchedule[index]"
                @change="updateData"
                class="day-checkbox"
              >
                {{ day }}
              </el-checkbox>
            </div>
            <div class="schedule-summary">
              已选择 {{ selectedDaysCount }} 天投放
            </div>
          </div>
        </el-form-item>

        <!-- 预算预览 -->
        <el-card class="budget-preview" shadow="never">
          <template #header>
            <span>预算预览</span>
          </template>
          <div class="preview-content">
            <div class="budget-stats">
              <div class="stat-item">
                <div class="stat-label">总预算</div>
                <div class="stat-value">¥{{ formData.totalBudget.toLocaleString() }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">日预算</div>
                <div class="stat-value">¥{{ formData.dailyBudget.toLocaleString() }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">预计投放天数</div>
                <div class="stat-value">{{ estimatedDays }}天</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">预计曝光</div>
                <div class="stat-value">{{ estimatedImpressions }}</div>
              </div>
            </div>
            
            <div class="budget-chart">
              <h4>预算分配</h4>
              <el-progress
                :percentage="budgetUtilization"
                :color="budgetColor"
                :show-text="false"
              />
              <div class="chart-labels">
                <span>已分配: {{ budgetUtilization }}%</span>
                <span>剩余: {{ 100 - budgetUtilization }}%</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { computed, reactive, ref, watch } from 'vue'

export default {
  name: 'BudgetSchedule',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  emits: ['update'],
  setup(props, { emit }) {
    const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    
    const formData = reactive({
      campaignType: props.data.campaignType || 'live_room',
      startTime: props.data.startTime || null,
      endTime: props.data.endTime || null,
      totalBudget: props.data.totalBudget || 1000,
      dailyBudget: props.data.dailyBudget || 100,
      biddingStrategy: props.data.biddingStrategy || 'auto',
      clickBid: props.data.clickBid || 1.5,
      weeklySchedule: props.data.weeklySchedule || [true, true, true, true, true, true, true]
    })

    const dateRange = ref([formData.startTime, formData.endTime])

    // 计算属性
    const dailyBudgetMax = computed(() => {
      return Math.floor(formData.totalBudget * 0.3)
    })

    const dailyBudgetPercentage = computed(() => {
      return Math.round((formData.dailyBudget / formData.totalBudget) * 100)
    })

    const selectedDaysCount = computed(() => {
      return formData.weeklySchedule.filter(day => day).length
    })

    const estimatedDays = computed(() => {
      if (formData.dailyBudget > 0) {
        return Math.ceil(formData.totalBudget / formData.dailyBudget)
      }
      return 0
    })

    const estimatedImpressions = computed(() => {
      const avgCPM = 15 // 假设每千次曝光成本15元
      const impressions = Math.round((formData.totalBudget / avgCPM) * 1000)
      if (impressions >= 10000) return `${Math.round(impressions / 10000)}万`
      return impressions.toLocaleString()
    })

    const budgetUtilization = computed(() => {
      return Math.min(100, Math.round((formData.dailyBudget * estimatedDays.value / formData.totalBudget) * 100))
    })

    const budgetColor = computed(() => {
      if (budgetUtilization.value > 90) return '#f56c6c'
      if (budgetUtilization.value > 70) return '#e6a23c'
      return '#67c23a'
    })

    const suggestedBidRange = computed(() => {
      // 根据推广类型建议出价范围
      const ranges = {
        live_room: '1.0-3.0元',
        video_content: '0.8-2.5元',
        brand_campaign: '1.5-4.0元'
      }
      return ranges[formData.campaignType] || '1.0-3.0元'
    })

    // 方法
    const handleDateChange = (dates) => {
      if (dates && dates.length === 2) {
        formData.startTime = dates[0]
        formData.endTime = dates[1]
      } else {
        formData.startTime = null
        formData.endTime = null
      }
      updateData()
    }

    const updateData = () => {
      emit('update', { ...formData })
    }

    // 监听props变化同步到formData
    watch(() => props.data, (newData) => {
      Object.assign(formData, newData)
      dateRange.value = [newData.startTime, newData.endTime]
    }, { deep: true })

    return {
      weekDays,
      formData,
      dateRange,
      dailyBudgetMax,
      dailyBudgetPercentage,
      selectedDaysCount,
      estimatedDays,
      estimatedImpressions,
      budgetUtilization,
      budgetColor,
      suggestedBidRange,
      handleDateChange,
      updateData
    }
  }
}
</script>

<style scoped>
.budget-schedule {
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

.price-unit {
  margin-left: 8px;
  color: #909399;
}

.budget-tip, .bid-tip {
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
}

.strategy-option {
  margin-left: 8px;
}

.strategy-title {
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.strategy-description {
  color: #909399;
  font-size: 12px;
}

.schedule-container h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #606266;
}

.weekly-schedule {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
}

.day-checkbox {
  min-width: 60px;
}

.schedule-summary {
  font-size: 14px;
  color: #409eff;
  font-weight: 500;
}

.budget-preview {
  margin-top: 20px;
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.budget-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-item {
  text-align: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.stat-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.budget-chart h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #606266;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}
</style>