<template>
  <div class="data-preview">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>数据预览</h3>
          <p>查看推广计划配置总览和预估效果数据</p>
        </div>
      </template>

      <!-- 配置总览 -->
      <div class="configuration-summary">
        <h4>📋 配置总览</h4>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="summary-section">
              <h5>基本信息</h5>
              <div class="summary-item">
                <span class="label">推广计划：</span>
                <span class="value">{{ data.name || '未设置' }}</span>
              </div>
              <div class="summary-item">
                <span class="label">营销目标：</span>
                <span class="value">{{ getMarketingGoalText(data.marketingGoal) }}</span>
              </div>
              <div class="summary-item">
                <span class="label">推广场景：</span>
                <span class="value">{{ getPromotionScenarioText(data.promotionScenario) }}</span>
              </div>
              <div class="summary-item">
                <span class="label">优化目标：</span>
                <span class="value">{{ getOptimizationTargetText(data.optimizationTarget) }}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="summary-section">
              <h5>预算设置</h5>
              <div class="summary-item">
                <span class="label">总预算：</span>
                <span class="value highlight">¥{{ data.totalBudget?.toLocaleString() || '0' }}</span>
              </div>
              <div class="summary-item">
                <span class="label">日预算：</span>
                <span class="value">¥{{ data.dailyBudget?.toLocaleString() || '0' }}</span>
              </div>
              <div class="summary-item">
                <span class="label">出价策略：</span>
                <span class="value">{{ data.biddingStrategy === 'auto' ? '智能出价' : '手动出价' }}</span>
              </div>
              <div v-if="data.biddingStrategy === 'manual'" class="summary-item">
                <span class="label">点击出价：</span>
                <span class="value">¥{{ data.clickBid || '0' }</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 定向设置 -->
      <div class="targeting-summary">
        <h4>🎯 定向设置</h4>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="summary-section">
              <h5>用户画像</h5>
              <div class="summary-item">
                <span class="label">年龄范围：</span>
                <span class="value">{{ getAgeRangeText(data.ageRange) }}</span>
              </div>
              <div class="summary-item">
                <span class="label">性别：</span>
                <span class="value">{{ getGenderText(data.gender) }}</span>
              </div>
              <div class="summary-item">
                <span class="label">地域：</span>
                <span class="value">{{ getLocationText(data.location) }}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="summary-section">
              <h5>兴趣行为</h5>
              <div class="summary-item">
                <span class="label">兴趣标签：</span>
                <div class="tags-container">
                  <el-tag
                    v-for="interest in data.interests"
                    :key="interest"
                    size="small"
                    type="info"
                  >
                    {{ interest }}
                  </el-tag>
                  <span v-if="!data.interests?.length" class="value">未设置</span>
                </div>
              </div>
              <div class="summary-item">
                <span class="label">行为标签：</span>
                <div class="tags-container">
                  <el-tag
                    v-for="behavior in data.behaviors"
                    :key="behavior"
                    size="small"
                    type="warning"
                  >
                    {{ getBehaviorName(behavior) }}
                  </el-tag>
                  <span v-if="!data.behaviors?.length" class="value">未设置</span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 预估效果 -->
      <div class="performance-estimation">
        <h4>📊 预估效果</h4>
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="metric-card">
              <div class="metric-icon exposure">📱</div>
              <div class="metric-content">
                <div class="metric-value">{{ estimatedMetrics.impressions }}</div>
                <div class="metric-label">预估曝光</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="metric-card">
              <div class="metric-icon clicks">👆</div>
              <div class="metric-content">
                <div class="metric-value">{{ estimatedMetrics.clicks }}</div>
                <div class="metric-label">预估点击</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="metric-card">
              <div class="metric-icon ctr">📈</div>
              <div class="metric-content">
                <div class="metric-value">{{ estimatedMetrics.ctr }}%</div>
                <div class="metric-label">点击率</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="metric-card">
              <div class="metric-icon cost">💰</div>
              <div class="metric-content">
                <div class="metric-value">¥{{ estimatedMetrics.avgCost }}</div>
                <div class="metric-label">平均点击成本</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 风险提示 -->
      <div v-if="riskWarnings.length > 0" class="risk-warnings">
        <h4>⚠️ 优化建议</h4>
        <el-alert
          v-for="(warning, index) in riskWarnings"
          :key="index"
          :title="warning.title"
          :description="warning.description"
          :type="warning.type"
          show-icon
          :closable="false"
          class="warning-item"
        />
      </div>

      <!-- 操作建议 -->
      <div class="recommendations">
        <h4>💡 操作建议</h4>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="recommendation-card">
              <h5>预算优化</h5>
              <ul>
                <li>建议初期设置较低日预算，观察效果后调整</li>
                <li>根据不同时段表现，优化投放时间</li>
                <li>定期检查预算消耗速度和转化效果</li>
              </ul>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="recommendation-card">
              <h5>定向优化</h5>
              <ul>
                <li>可以先使用宽泛定向，后续根据数据收窄</li>
                <li>关注不同定向条件的转化表现</li>
                <li>适时调整兴趣和行为标签</li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'DataPreview',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    // 预估指标计算
    const estimatedMetrics = computed(() => {
      const budget = props.data.totalBudget || 1000
      const avgCPM = 15 // 每千次曝光成本
      const avgCTR = 2.5 // 平均点击率
      
      const impressions = Math.round((budget / avgCPM) * 1000)
      const clicks = Math.round(impressions * (avgCTR / 100))
      const avgCost = clicks > 0 ? (budget / clicks).toFixed(2) : '0.00'
      
      return {
        impressions: impressions >= 10000 ? `${Math.round(impressions / 10000)}万` : impressions.toLocaleString(),
        clicks: clicks.toLocaleString(),
        ctr: avgCTR.toFixed(1),
        avgCost
      }
    })

    // 风险警告
    const riskWarnings = computed(() => {
      const warnings = []
      
      if (!props.data.name) {
        warnings.push({
          title: '推广计划名称未设置',
          description: '建议设置一个清晰的推广计划名称，便于后续管理',
          type: 'warning'
        })
      }
      
      if (!props.data.marketingGoal) {
        warnings.push({
          title: '营销目标未选择',
          description: '选择明确的营销目标有助于系统优化投放策略',
          type: 'error'
        })
      }
      
      if (props.data.totalBudget && props.data.dailyBudget) {
        const ratio = props.data.dailyBudget / props.data.totalBudget
        if (ratio > 0.5) {
          warnings.push({
            title: '日预算设置过高',
            description: '日预算占总预算比例较高，可能导致预算快速消耗完毕',
            type: 'warning'
          })
        }
      }
      
      if (props.data.interests?.length === 0 && props.data.behaviors?.length === 0) {
        warnings.push({
          title: '定向设置过于宽泛',
          description: '建议添加一些兴趣或行为标签，提高投放精准度',
          type: 'info'
        })
      }
      
      return warnings
    })

    // 文本转换方法
    const getMarketingGoalText = (goal) => {
      const map = {
        brand_exposure: '品牌曝光',
        lead_generation: '线索收集',
        live_commerce: '直播带货',
        app_promotion: '应用推广'
      }
      return map[goal] || '未设置'
    }

    const getPromotionScenarioText = (scenario) => {
      const map = {
        live_room: '直播间推广',
        video_feed: '视频信息流',
        search_ads: '搜索广告'
      }
      return map[scenario] || '未设置'
    }

    const getOptimizationTargetText = (target) => {
      const map = {
        impressions: '曝光量',
        clicks: '点击量',
        conversions: '转化量',
        cost_control: '成本控制'
      }
      return map[target] || '未设置'
    }

    const getAgeRangeText = (range) => {
      const map = {
        '18-25': '18-25岁',
        '26-35': '26-35岁',
        '36-45': '36-45岁',
        '46-55': '46-55岁',
        '55+': '55岁以上',
        'all': '不限'
      }
      return map[range] || '不限'
    }

    const getGenderText = (gender) => {
      const map = {
        male: '男性',
        female: '女性',
        all: '不限'
      }
      return map[gender] || '不限'
    }

    const getLocationText = (location) => {
      const map = {
        national: '全国',
        tier1: '一线城市',
        tier2: '二线城市',
        tier3: '三线及以下城市',
        top4: '北上广深',
        east: '东部地区',
        central: '中部地区',
        west: '西部地区'
      }
      return map[location] || '全国'
    }

    const getBehaviorName = (behavior) => {
      const map = {
        frequent_buyer: '高频购买',
        brand_loyal: '品牌忠诚',
        price_sensitive: '价格敏感',
        early_adopter: '新品尝鲜',
        social_active: '社交活跃',
        content_creator: '内容创作'
      }
      return map[behavior] || behavior
    }

    return {
      estimatedMetrics,
      riskWarnings,
      getMarketingGoalText,
      getPromotionScenarioText,
      getOptimizationTargetText,
      getAgeRangeText,
      getGenderText,
      getLocationText,
      getBehaviorName
    }
  }
}
</script>

<style scoped>
.data-preview {
  max-width: 800px;
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

.configuration-summary,
.targeting-summary,
.performance-estimation,
.risk-warnings,
.recommendations {
  margin-bottom: 30px;
}

.configuration-summary h4,
.targeting-summary h4,
.performance-estimation h4,
.risk-warnings h4,
.recommendations h4 {
  margin: 0 0 20px 0;
  font-size: 16px;
  color: #303133;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 8px;
}

.summary-section {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 16px;
}

.summary-section h5 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #606266;
  font-weight: 600;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.summary-item .label {
  color: #606266;
}

.summary-item .value {
  color: #303133;
  font-weight: 500;
}

.summary-item .value.highlight {
  color: #f56c6c;
  font-weight: 600;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
}

.metric-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  transition: all 0.3s;
}

.metric-card:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.metric-icon {
  font-size: 24px;
  margin-right: 12px;
}

.metric-content {
  flex: 1;
}

.metric-value {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.metric-label {
  font-size: 12px;
  color: #909399;
}

.warning-item {
  margin-bottom: 12px;
}

.recommendation-card {
  padding: 16px;
  background: #f0f9ff;
  border-radius: 6px;
  border-left: 4px solid #409eff;
}

.recommendation-card h5 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 14px;
}

.recommendation-card ul {
  margin: 0;
  padding-left: 16px;
  color: #606266;
  font-size: 13px;
}

.recommendation-card li {
  margin-bottom: 6px;
  line-height: 1.4;
}
</style>