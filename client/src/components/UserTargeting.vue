<template>
  <div class="user-targeting">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>用户定向</h3>
          <p>设置目标用户群体，精准投放提高转化效果</p>
        </div>
      </template>

      <el-form :model="formData" label-width="120px" @submit.prevent>
        <!-- 年龄范围 -->
        <el-form-item label="年龄范围">
          <el-select v-model="formData.ageRange" placeholder="请选择目标年龄段" @change="updateData">
            <el-option label="18-25岁" value="18-25" />
            <el-option label="26-35岁" value="26-35" />
            <el-option label="36-45岁" value="36-45" />
            <el-option label="46-55岁" value="46-55" />
            <el-option label="55岁以上" value="55+" />
            <el-option label="不限" value="all" />
          </el-select>
        </el-form-item>

        <!-- 性别 -->
        <el-form-item label="性别">
          <el-radio-group v-model="formData.gender" @change="updateData">
            <el-radio value="all">不限</el-radio>
            <el-radio value="male">男性</el-radio>
            <el-radio value="female">女性</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 地域范围 -->
        <el-form-item label="地域范围">
          <el-select v-model="formData.location" placeholder="请选择投放地域" @change="updateData">
            <el-option label="全国" value="national" />
            <el-option label="一线城市" value="tier1" />
            <el-option label="二线城市" value="tier2" />
            <el-option label="三线及以下城市" value="tier3" />
            <el-option label="北上广深" value="top4" />
            <el-option label="东部地区" value="east" />
            <el-option label="中部地区" value="central" />
            <el-option label="西部地区" value="west" />
          </el-select>
        </el-form-item>

        <!-- 兴趣标签 -->
        <el-form-item label="兴趣标签">
          <div class="tag-selector">
            <div class="available-tags">
              <h4>可选兴趣（点击添加）：</h4>
              <div class="tag-list">
                <el-tag
                  v-for="tag in availableInterests"
                  :key="tag"
                  class="tag-item"
                  :class="{ selected: formData.interests.includes(tag) }"
                  @click="toggleInterest(tag)"
                  effect="plain"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
            <div v-if="formData.interests.length > 0" class="selected-tags">
              <h4>已选兴趣：</h4>
              <div class="tag-list">
                <el-tag
                  v-for="tag in formData.interests"
                  :key="tag"
                  type="success"
                  closable
                  @close="removeInterest(tag)"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-form-item>

        <!-- 行为标签 -->
        <el-form-item label="行为标签">
          <el-checkbox-group v-model="formData.behaviors" @change="updateData">
            <el-space direction="vertical" size="small">
              <el-checkbox value="frequent_buyer">高频购买用户</el-checkbox>
              <el-checkbox value="brand_loyal">品牌忠诚用户</el-checkbox>
              <el-checkbox value="price_sensitive">价格敏感用户</el-checkbox>
              <el-checkbox value="early_adopter">新品尝鲜用户</el-checkbox>
              <el-checkbox value="social_active">社交活跃用户</el-checkbox>
              <el-checkbox value="content_creator">内容创作者</el-checkbox>
            </el-space>
          </el-checkbox-group>
        </el-form-item>

        <!-- 定向预览 -->
        <el-card class="targeting-preview" shadow="never">
          <template #header>
            <span>定向预览</span>
          </template>
          <div class="preview-content">
            <div class="audience-size">
              <div class="size-indicator">
                <el-progress
                  type="circle"
                  :percentage="audiencePercentage"
                  :color="audienceColor"
                  :width="80"
                />
              </div>
              <div class="size-info">
                <h4>预估覆盖人群</h4>
                <p class="audience-count">{{ estimatedAudience }}</p>
                <p class="audience-desc">{{ audienceDescription }}</p>
              </div>
            </div>
            <div class="targeting-summary">
              <h4>定向总结</h4>
              <ul>
                <li v-if="formData.ageRange && formData.ageRange !== 'all'">
                  年龄：{{ getAgeRangeText(formData.ageRange) }}
                </li>
                <li v-if="formData.gender && formData.gender !== 'all'">
                  性别：{{ getGenderText(formData.gender) }}
                </li>
                <li v-if="formData.location && formData.location !== 'national'">
                  地域：{{ getLocationText(formData.location) }}
                </li>
                <li v-if="formData.interests.length > 0">
                  兴趣：{{ formData.interests.join('、') }}
                </li>
                <li v-if="formData.behaviors.length > 0">
                  行为：{{ getBehaviorText(formData.behaviors) }}
                </li>
              </ul>
            </div>
          </div>
        </el-card>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { computed, reactive, watch } from 'vue'

export default {
  name: 'UserTargeting',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  emits: ['update'],
  setup(props, { emit }) {
    const formData = reactive({
      ageRange: props.data.ageRange || 'all',
      gender: props.data.gender || 'all',
      location: props.data.location || 'national',
      interests: props.data.interests || [],
      behaviors: props.data.behaviors || []
    })

    const availableInterests = [
      '时尚美妆', '数码科技', '美食料理', '健身运动',
      '旅游出行', '家居生活', '母婴亲子', '教育培训',
      '汽车', '游戏娱乐', '音乐', '电影',
      '读书', '摄影', '宠物', '投资理财'
    ]

    // 计算属性
    const audiencePercentage = computed(() => {
      let percentage = 100
      
      // 根据各种定向条件减少覆盖面
      if (formData.ageRange && formData.ageRange !== 'all') percentage *= 0.3
      if (formData.gender && formData.gender !== 'all') percentage *= 0.5
      if (formData.location && formData.location !== 'national') percentage *= 0.2
      if (formData.interests.length > 0) percentage *= Math.max(0.1, 1 - formData.interests.length * 0.1)
      if (formData.behaviors.length > 0) percentage *= Math.max(0.1, 1 - formData.behaviors.length * 0.05)
      
      return Math.max(5, Math.round(percentage))
    })

    const estimatedAudience = computed(() => {
      const base = 50000000 // 5千万基础用户
      const actual = Math.round(base * (audiencePercentage.value / 100))
      if (actual >= 10000000) return `${Math.round(actual / 10000000)}千万`
      if (actual >= 10000) return `${Math.round(actual / 10000)}万`
      return `${actual}`
    })

    const audienceColor = computed(() => {
      if (audiencePercentage.value > 50) return '#67c23a'
      if (audiencePercentage.value > 20) return '#e6a23c'
      return '#f56c6c'
    })

    const audienceDescription = computed(() => {
      if (audiencePercentage.value > 50) return '覆盖面较广，适合品牌曝光'
      if (audiencePercentage.value > 20) return '覆盖面中等，平衡曝光与精准'
      return '覆盖面精准，适合转化优化'
    })

    // 方法
    const toggleInterest = (interest) => {
      const index = formData.interests.indexOf(interest)
      if (index > -1) {
        formData.interests.splice(index, 1)
      } else {
        formData.interests.push(interest)
      }
      updateData()
    }

    const removeInterest = (interest) => {
      const index = formData.interests.indexOf(interest)
      if (index > -1) {
        formData.interests.splice(index, 1)
        updateData()
      }
    }

    const getAgeRangeText = (range) => {
      const map = {
        '18-25': '18-25岁',
        '26-35': '26-35岁',
        '36-45': '36-45岁',
        '46-55': '46-55岁',
        '55+': '55岁以上'
      }
      return map[range] || range
    }

    const getGenderText = (gender) => {
      const map = { male: '男性', female: '女性' }
      return map[gender] || gender
    }

    const getLocationText = (location) => {
      const map = {
        tier1: '一线城市',
        tier2: '二线城市',
        tier3: '三线及以下城市',
        top4: '北上广深',
        east: '东部地区',
        central: '中部地区',
        west: '西部地区'
      }
      return map[location] || location
    }

    const getBehaviorText = (behaviors) => {
      const map = {
        frequent_buyer: '高频购买',
        brand_loyal: '品牌忠诚',
        price_sensitive: '价格敏感',
        early_adopter: '新品尝鲜',
        social_active: '社交活跃',
        content_creator: '内容创作'
      }
      return behaviors.map(b => map[b] || b).join('、')
    }

    const updateData = () => {
      emit('update', { ...formData })
    }

    // 监听props变化同步到formData
    watch(() => props.data, (newData) => {
      Object.assign(formData, newData)
    }, { deep: true })

    return {
      formData,
      availableInterests,
      audiencePercentage,
      estimatedAudience,
      audienceColor,
      audienceDescription,
      toggleInterest,
      removeInterest,
      getAgeRangeText,
      getGenderText,
      getLocationText,
      getBehaviorText,
      updateData
    }
  }
}
</script>

<style scoped>
.user-targeting {
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

.tag-selector {
  width: 100%;
}

.available-tags, .selected-tags {
  margin-bottom: 16px;
}

.available-tags h4, .selected-tags h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #606266;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  cursor: pointer;
  transition: all 0.3s;
}

.tag-item:hover {
  opacity: 0.8;
}

.tag-item.selected {
  background-color: #409eff;
  color: white;
  border-color: #409eff;
}

.targeting-preview {
  margin-top: 20px;
}

.preview-content {
  display: flex;
  gap: 30px;
}

.audience-size {
  display: flex;
  align-items: center;
  gap: 15px;
}

.size-info h4 {
  margin: 0 0 8px 0;
  color: #303133;
}

.audience-count {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #409eff;
}

.audience-desc {
  margin: 0;
  font-size: 12px;
  color: #909399;
}

.targeting-summary {
  flex: 1;
}

.targeting-summary h4 {
  margin: 0 0 12px 0;
  color: #303133;
}

.targeting-summary ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.targeting-summary li {
  margin-bottom: 8px;
  color: #606266;
  font-size: 14px;
}

.targeting-summary li:before {
  content: '•';
  color: #409eff;
  margin-right: 8px;
}
</style>