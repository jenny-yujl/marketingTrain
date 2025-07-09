<template>
  <div class="product-settings">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>商品设置</h3>
          <p>配置推广商品的基本信息和促销策略</p>
        </div>
      </template>

      <el-form :model="formData" label-width="120px" @submit.prevent>
        <!-- 商品选择 -->
        <el-form-item label="选择商品" required>
          <el-select 
            v-model="formData.productId" 
            placeholder="请选择要推广的商品"
            @change="handleProductChange"
            filterable
          >
            <el-option
              v-for="product in products"
              :key="product.id"
              :label="product.name"
              :value="product.id"
            >
              <div class="product-option">
                <span class="product-name">{{ product.name }}</span>
                <span class="product-price">¥{{ product.price }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 商品价格设置 -->
        <div v-if="selectedProduct">
          <el-form-item label="原价">
            <el-input-number
              v-model="formData.originalPrice"
              :min="0"
              :precision="2"
              controls-position="right"
              @change="updateData"
            />
            <span class="price-unit">元</span>
          </el-form-item>

          <el-form-item label="现价">
            <el-input-number
              v-model="formData.currentPrice"
              :min="0"
              :precision="2"
              controls-position="right"
              @change="updateData"
            />
            <span class="price-unit">元</span>
          </el-form-item>
        </div>

        <!-- 限时折扣 -->
        <el-form-item label="限时折扣">
          <el-switch
            v-model="formData.hasTimeLimitedDiscount"
            @change="updateData"
          />
          <span class="switch-label">开启限时折扣活动</span>
        </el-form-item>

        <el-form-item v-if="formData.hasTimeLimitedDiscount" label="折扣比例">
          <el-slider
            v-model="formData.discountPercentage"
            :min="5"
            :max="90"
            :step="5"
            show-stops
            show-input
            @change="updateData"
          />
          <span class="discount-label">%</span>
        </el-form-item>

        <!-- 满减活动 -->
        <el-form-item label="满减活动">
          <el-switch
            v-model="formData.hasFullReduction"
            @change="updateData"
          />
          <span class="switch-label">开启满减优惠</span>
        </el-form-item>

        <div v-if="formData.hasFullReduction">
          <el-form-item label="满减门槛">
            <el-input-number
              v-model="formData.fullReductionThreshold"
              :min="1"
              :precision="2"
              controls-position="right"
              @change="updateData"
            />
            <span class="price-unit">元</span>
          </el-form-item>

          <el-form-item label="减免金额">
            <el-input-number
              v-model="formData.fullReductionAmount"
              :min="1"
              :precision="2"
              controls-position="right"
              @change="updateData"
            />
            <span class="price-unit">元</span>
          </el-form-item>
        </div>

        <!-- 商品预览 -->
        <el-card v-if="selectedProduct" class="product-preview" shadow="never">
          <template #header>
            <span>商品预览</span>
          </template>
          <div class="product-info">
            <div class="product-details">
              <h4>{{ selectedProduct.name }}</h4>
              <p class="product-desc">{{ selectedProduct.description }}</p>
              <div class="price-info">
                <span class="current-price">¥{{ formData.currentPrice }}</span>
                <span v-if="formData.originalPrice > formData.currentPrice" class="original-price">
                  ¥{{ formData.originalPrice }}
                </span>
                <span v-if="discountRate > 0" class="discount-rate">
                  {{ discountRate }}折
                </span>
              </div>
              <div v-if="formData.hasFullReduction" class="promotion-info">
                <el-tag type="danger" size="small">
                  满{{ formData.fullReductionThreshold }}减{{ formData.fullReductionAmount }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-card>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { computed, reactive, ref, watch, onMounted } from 'vue'

export default {
  name: 'ProductSettings',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  emits: ['update'],
  setup(props, { emit }) {
    const products = ref([
      { id: 1, name: '高端智能手机', price: 3999, description: '最新款智能手机，性能强劲' },
      { id: 2, name: '时尚运动鞋', price: 599, description: '舒适透气，适合运动和日常穿着' },
      { id: 3, name: '护肤套装', price: 299, description: '天然成分，温和护肤' },
      { id: 4, name: '咖啡机', price: 1299, description: '专业级咖啡机，在家享受咖啡店品质' },
      { id: 5, name: '蓝牙耳机', price: 199, description: '无线蓝牙耳机，音质清晰' }
    ])

    const formData = reactive({
      productId: props.data.productId || null,
      originalPrice: props.data.originalPrice || 0,
      currentPrice: props.data.currentPrice || 0,
      hasTimeLimitedDiscount: props.data.hasTimeLimitedDiscount || false,
      discountPercentage: props.data.discountPercentage || 0,
      hasFullReduction: props.data.hasFullReduction || false,
      fullReductionThreshold: props.data.fullReductionThreshold || 0,
      fullReductionAmount: props.data.fullReductionAmount || 0
    })

    // 计算属性
    const selectedProduct = computed(() => {
      return products.value.find(p => p.id === formData.productId) || null
    })

    const discountRate = computed(() => {
      if (formData.originalPrice > 0 && formData.currentPrice > 0) {
        return Math.round((formData.currentPrice / formData.originalPrice) * 10)
      }
      return 0
    })

    // 方法
    const handleProductChange = (productId) => {
      const product = products.value.find(p => p.id === productId)
      if (product) {
        formData.originalPrice = product.price
        formData.currentPrice = product.price
      }
      updateData()
    }

    const updateData = () => {
      emit('update', { ...formData })
    }

    // 监听props变化同步到formData
    watch(() => props.data, (newData) => {
      Object.assign(formData, newData)
    }, { deep: true })

    return {
      products,
      formData,
      selectedProduct,
      discountRate,
      handleProductChange,
      updateData
    }
  }
}
</script>

<style scoped>
.product-settings {
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

.product-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-name {
  color: #303133;
}

.product-price {
  color: #f56c6c;
  font-weight: 500;
}

.price-unit, .discount-label {
  margin-left: 8px;
  color: #909399;
}

.switch-label {
  margin-left: 12px;
  color: #606266;
}

.product-preview {
  margin-top: 20px;
}

.product-info {
  display: flex;
  align-items: flex-start;
}

.product-details h4 {
  margin: 0 0 8px 0;
  color: #303133;
}

.product-desc {
  margin: 0 0 12px 0;
  color: #606266;
  font-size: 14px;
}

.price-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.current-price {
  font-size: 18px;
  color: #f56c6c;
  font-weight: 600;
}

.original-price {
  font-size: 14px;
  color: #909399;
  text-decoration: line-through;
}

.discount-rate {
  background: #f56c6c;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
}

.promotion-info {
  margin-top: 8px;
}
</style>