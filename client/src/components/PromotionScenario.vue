<template>
  <div class="promotion-scenario">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>推广场景选择</h3>
          <p>选择最适合您业务的推广场景和投放位置</p>
        </div>
      </template>

      <el-form :model="formData" label-width="120px" @submit.prevent>
        <!-- 推广场景 -->
        <el-form-item label="推广场景" required>
          <el-radio-group v-model="formData.promotionScenario" @change="updateData">
            <el-space direction="vertical" size="large">
              <el-radio value="live_room">
                <div class="scenario-option">
                  <div class="scenario-title">
                    <el-icon><VideoPlay /></el-icon>
                    直播间推广
                  </div>
                  <div class="scenario-description">在直播间内推广商品，提高直播间人气和转化</div>
                </div>
              </el-radio>
              <el-radio value="video_feed">
                <div class="scenario-option">
                  <div class="scenario-title">
                    <el-icon><Film /></el-icon>
                    视频信息流
                  </div>
                  <div class="scenario-description">在信息流中投放视频广告，覆盖更广泛的用户群体</div>
                </div>
              </el-radio>
              <el-radio value="search_ads">
                <div class="scenario-option">
                  <div class="scenario-title">
                    <el-icon><Search /></el-icon>
                    搜索广告
                  </div>
                  <div class="scenario-description">在用户搜索相关关键词时展示广告</div>
                </div>
              </el-radio>
            </el-space>
          </el-radio-group>
        </el-form-item>

        <!-- 投放位置 -->
        <el-form-item label="投放位置">
          <el-checkbox-group v-model="formData.placements" @change="updateData">
            <el-space direction="vertical" size="small">
              <el-checkbox value="homepage_feed">首页信息流</el-checkbox>
              <el-checkbox value="video_detail">视频详情页</el-checkbox>
              <el-checkbox value="live_room_feed">直播间推荐</el-checkbox>
              <el-checkbox value="search_results">搜索结果页</el-checkbox>
              <el-checkbox value="profile_page">个人主页</el-checkbox>
            </el-space>
          </el-checkbox-group>
        </el-form-item>

        <!-- 设备类型 -->
        <el-form-item label="设备类型">
          <el-checkbox-group v-model="formData.deviceTypes" @change="updateData">
            <el-checkbox value="mobile">手机</el-checkbox>
            <el-checkbox value="tablet">平板</el-checkbox>
            <el-checkbox value="desktop">桌面端</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 推广方式说明 -->
        <el-alert
          v-if="scenarioDescription"
          :title="scenarioDescription.title"
          :description="scenarioDescription.description"
          type="success"
          show-icon
          :closable="false"
        />
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { computed, reactive, watch } from 'vue'
import { VideoPlay, Film, Search } from '@element-plus/icons-vue'

export default {
  name: 'PromotionScenario',
  components: {
    VideoPlay,
    Film,
    Search
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  emits: ['update'],
  setup(props, { emit }) {
    const formData = reactive({
      promotionScenario: props.data.promotionScenario || '',
      placements: props.data.placements || [],
      deviceTypes: props.data.deviceTypes || ['mobile']
    })

    // 根据选择的场景显示说明
    const scenarioDescription = computed(() => {
      const descriptions = {
        live_room: {
          title: '直播间推广模式',
          description: '通过直播间内的商品卡片、主播推荐等方式进行推广，具有强互动性和高转化率'
        },
        video_feed: {
          title: '视频信息流模式',
          description: '在用户浏览视频时穿插展示广告内容，覆盖面广，适合品牌曝光'
        },
        search_ads: {
          title: '搜索广告模式',
          description: '基于用户搜索意图进行精准投放，具有高相关性和转化潜力'
        }
      }
      return descriptions[formData.promotionScenario] || null
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
      scenarioDescription,
      updateData
    }
  }
}
</script>

<style scoped>
.promotion-scenario {
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

.scenario-option {
  margin-left: 8px;
}

.scenario-title {
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.scenario-title .el-icon {
  margin-right: 8px;
  color: #409eff;
}

.scenario-description {
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