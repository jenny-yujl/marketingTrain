import React, { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Target, ShoppingCart, Users, DollarSign, BarChart3, Save, Play } from 'lucide-react'

// 步骤配置
const steps = [
  { id: 1, name: '营销目标', icon: Target },
  { id: 2, name: '推广场景', icon: ShoppingCart },
  { id: 3, name: '商品设置', icon: ShoppingCart },
  { id: 4, name: '用户定向', icon: Users },
  { id: 5, name: '预算投放', icon: DollarSign },
  { id: 6, name: '数据预览', icon: BarChart3 }
]

// 营销目标组件
const MarketingGoals = ({ data, onChange }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>营销目标设置</CardTitle>
        <CardDescription>设置推广计划的基本信息和营销目标</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">推广计划名称</Label>
          <Input 
            id="name"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="请输入推广计划名称"
          />
        </div>
        
        <div className="space-y-3">
          <Label>营销目标</Label>
          <RadioGroup 
            value={data.marketingGoal} 
            onValueChange={(value) => onChange({ marketingGoal: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="brand_exposure" id="brand_exposure" />
              <Label htmlFor="brand_exposure">品牌曝光</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="lead_generation" id="lead_generation" />
              <Label htmlFor="lead_generation">线索收集</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="live_commerce" id="live_commerce" />
              <Label htmlFor="live_commerce">直播带货</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="app_promotion" id="app_promotion" />
              <Label htmlFor="app_promotion">应用推广</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>优化目标</Label>
          <Select value={data.optimizationTarget} onValueChange={(value) => onChange({ optimizationTarget: value })}>
            <SelectTrigger>
              <SelectValue placeholder="选择优化目标" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="impressions">曝光量</SelectItem>
              <SelectItem value="clicks">点击量</SelectItem>
              <SelectItem value="conversions">转化量</SelectItem>
              <SelectItem value="cost_control">成本控制</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}

// 推广场景组件  
const PromotionScenario = ({ data, onChange }) => {
  const handlePlacementChange = (placement, checked) => {
    const newPlacements = checked 
      ? [...(data.placements || []), placement]
      : (data.placements || []).filter(p => p !== placement)
    onChange({ placements: newPlacements })
  }

  const handleDeviceChange = (device, checked) => {
    const newDevices = checked 
      ? [...(data.deviceTypes || []), device]
      : (data.deviceTypes || []).filter(d => d !== device)
    onChange({ deviceTypes: newDevices })
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>推广场景设置</CardTitle>
        <CardDescription>选择推广场景和投放位置</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>推广场景</Label>
          <RadioGroup 
            value={data.promotionScenario}
            onValueChange={(value) => onChange({ promotionScenario: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="live_room" id="live_room" />
              <Label htmlFor="live_room">直播间推广</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="video_feed" id="video_feed" />
              <Label htmlFor="video_feed">视频信息流</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="search_ads" id="search_ads" />
              <Label htmlFor="search_ads">搜索广告</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>投放位置</Label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'homepage_feed', label: '首页信息流' },
              { value: 'live_room_feed', label: '直播间信息流' },
              { value: 'search_results', label: '搜索结果页' },
              { value: 'video_detail', label: '视频详情页' }
            ].map((item) => (
              <div key={item.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={item.value}
                  checked={(data.placements || []).includes(item.value)}
                  onCheckedChange={(checked) => handlePlacementChange(item.value, checked)}
                />
                <Label htmlFor={item.value}>{item.label}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>设备类型</Label>
          <div className="flex gap-6">
            {[
              { value: 'mobile', label: '手机' },
              { value: 'tablet', label: '平板' },
              { value: 'desktop', label: '桌面' }
            ].map((item) => (
              <div key={item.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={item.value}
                  checked={(data.deviceTypes || []).includes(item.value)}
                  onCheckedChange={(checked) => handleDeviceChange(item.value, checked)}
                />
                <Label htmlFor={item.value}>{item.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// 商品设置组件
const ProductSettings = ({ data, onChange }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>商品设置</CardTitle>
        <CardDescription>选择推广商品并设置价格信息</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>商品选择</Label>
          <Select value={data.productId?.toString()} onValueChange={(value) => onChange({ productId: parseInt(value) })}>
            <SelectTrigger>
              <SelectValue placeholder="选择推广商品" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">时尚连衣裙 - 春季新款</SelectItem>
              <SelectItem value="2">智能手机壳 - 防摔透明</SelectItem>
              <SelectItem value="3">运动鞋 - 透气跑步鞋</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="originalPrice">原价</Label>
            <div className="flex">
              <Input 
                id="originalPrice"
                type="number"
                value={data.originalPrice}
                onChange={(e) => onChange({ originalPrice: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                className="rounded-r-none"
              />
              <div className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r-md text-sm text-gray-600">元</div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentPrice">现价</Label>
            <div className="flex">
              <Input 
                id="currentPrice"
                type="number"
                value={data.currentPrice}
                onChange={(e) => onChange({ currentPrice: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                className="rounded-r-none"
              />
              <div className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r-md text-sm text-gray-600">元</div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="hasDiscount"
            checked={data.hasTimeLimitedDiscount}
            onCheckedChange={(checked) => onChange({ hasTimeLimitedDiscount: checked })}
          />
          <Label htmlFor="hasDiscount">限时折扣</Label>
        </div>

        {data.hasTimeLimitedDiscount && (
          <div className="space-y-2">
            <Label htmlFor="discountPercentage">折扣比例</Label>
            <div className="flex w-32">
              <Input 
                id="discountPercentage"
                type="number"
                value={data.discountPercentage}
                onChange={(e) => onChange({ discountPercentage: parseInt(e.target.value) || 0 })}
                min={1}
                max={99}
                placeholder="0"
                className="rounded-r-none"
              />
              <div className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r-md text-sm text-gray-600">%</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// 用户定向组件
const UserTargeting = ({ data, onChange }) => {
  const handleInterestChange = (interest, checked) => {
    const newInterests = checked 
      ? [...(data.interests || []), interest]
      : (data.interests || []).filter(i => i !== interest)
    onChange({ interests: newInterests })
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>用户定向设置</CardTitle>
        <CardDescription>设置目标用户群体的定向条件</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>年龄范围</Label>
          <Select value={data.ageRange} onValueChange={(value) => onChange({ ageRange: value })}>
            <SelectTrigger>
              <SelectValue placeholder="选择年龄范围" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">不限</SelectItem>
              <SelectItem value="18-25">18-25岁</SelectItem>
              <SelectItem value="26-35">26-35岁</SelectItem>
              <SelectItem value="36-45">36-45岁</SelectItem>
              <SelectItem value="46-55">46-55岁</SelectItem>
              <SelectItem value="55+">55岁以上</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>性别</Label>
          <RadioGroup 
            value={data.gender}
            onValueChange={(value) => onChange({ gender: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="gender_all" />
              <Label htmlFor="gender_all">不限</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="gender_male" />
              <Label htmlFor="gender_male">男性</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="gender_female" />
              <Label htmlFor="gender_female">女性</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>地域</Label>
          <Select value={data.location} onValueChange={(value) => onChange({ location: value })}>
            <SelectTrigger>
              <SelectValue placeholder="选择地域范围" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="national">全国</SelectItem>
              <SelectItem value="tier1">一线城市</SelectItem>
              <SelectItem value="tier2">二线城市</SelectItem>
              <SelectItem value="tier3">三线及以下城市</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>兴趣标签</Label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'fashion', label: '时尚潮流' },
              { value: 'technology', label: '科技数码' },
              { value: 'sports', label: '运动健身' },
              { value: 'beauty', label: '美妆护肤' },
              { value: 'food', label: '美食料理' },
              { value: 'travel', label: '旅游出行' }
            ].map((item) => (
              <div key={item.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={item.value}
                  checked={(data.interests || []).includes(item.value)}
                  onCheckedChange={(checked) => handleInterestChange(item.value, checked)}
                />
                <Label htmlFor={item.value}>{item.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// 预算投放组件
const BudgetSchedule = ({ data, onChange }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>预算投放设置</CardTitle>
        <CardDescription>设置预算分配和投放策略</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>推广类型</Label>
          <RadioGroup 
            value={data.campaignType}
            onValueChange={(value) => onChange({ campaignType: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="live_room" id="live_room_campaign" />
              <Label htmlFor="live_room_campaign">直播间推广</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="video_content" id="video_content" />
              <Label htmlFor="video_content">视频内容推广</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="brand_campaign" id="brand_campaign" />
              <Label htmlFor="brand_campaign">品牌活动推广</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalBudget">总预算</Label>
            <div className="flex">
              <Input 
                id="totalBudget"
                type="number"
                value={data.totalBudget}
                onChange={(e) => onChange({ totalBudget: parseInt(e.target.value) || 0 })}
                min={100}
                placeholder="1000"
                className="rounded-r-none"
              />
              <div className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r-md text-sm text-gray-600">元</div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dailyBudget">日预算</Label>
            <div className="flex">
              <Input 
                id="dailyBudget"
                type="number"
                value={data.dailyBudget}
                onChange={(e) => onChange({ dailyBudget: parseInt(e.target.value) || 0 })}
                min={50}
                placeholder="100"
                className="rounded-r-none"
              />
              <div className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r-md text-sm text-gray-600">元</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label>出价策略</Label>
          <RadioGroup 
            value={data.biddingStrategy}
            onValueChange={(value) => onChange({ biddingStrategy: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="auto" id="auto_bid" />
              <Label htmlFor="auto_bid">智能出价</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="manual" id="manual_bid" />
              <Label htmlFor="manual_bid">手动出价</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  )
}

// 数据预览组件
const DataPreview = ({ data }) => {
  const estimatedMetrics = {
    impressions: Math.round((data.totalBudget / 15) * 1000),
    clicks: Math.round((data.totalBudget / 15) * 1000 * 0.025),
    ctr: '2.5',
    avgCost: (data.totalBudget / Math.round((data.totalBudget / 15) * 1000 * 0.025)).toFixed(2)
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>数据预览</CardTitle>
        <CardDescription>查看推广配置摘要和预估效果</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold mb-4">📋 配置总览</h4>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <p><strong>推广计划：</strong>{data.name || '未设置'}</p>
              <p><strong>营销目标：</strong>{data.marketingGoal || '未设置'}</p>
              <p><strong>总预算：</strong>¥{data.totalBudget?.toLocaleString() || '0'}</p>
            </div>
            <div className="space-y-2">
              <p><strong>日预算：</strong>¥{data.dailyBudget?.toLocaleString() || '0'}</p>
              <p><strong>出价策略：</strong>{data.biddingStrategy === 'auto' ? '智能出价' : '手动出价'}</p>
              <p><strong>投放位置：</strong>{data.placements?.length || 0}个</p>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="text-lg font-semibold mb-4">📊 预估效果</h4>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {estimatedMetrics.impressions >= 10000 ? `${Math.round(estimatedMetrics.impressions / 10000)}万` : estimatedMetrics.impressions.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">预估曝光</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{estimatedMetrics.clicks.toLocaleString()}</div>
              <div className="text-sm text-gray-600">预估点击</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{estimatedMetrics.ctr}%</div>
              <div className="text-sm text-gray-600">点击率</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">¥{estimatedMetrics.avgCost}</div>
              <div className="text-sm text-gray-600">平均点击成本</div>
            </div>
          </div>
        </div>

        {(!data.name || !data.marketingGoal) && (
          <Alert>
            <AlertDescription>
              配置不完整：请完善推广计划名称和营销目标设置
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

// 主应用组件
const App = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [campaignData, setCampaignData] = useState({
    // 营销目标
    name: '',
    marketingGoal: '',
    optimizationTarget: '',
    priority: 'medium',
    
    // 推广场景
    promotionScenario: '',
    placements: [],
    deviceTypes: ['mobile'],
    
    // 商品设置
    productId: null,
    originalPrice: 0,
    currentPrice: 0,
    hasTimeLimitedDiscount: false,
    discountPercentage: 0,
    
    // 用户定向
    ageRange: 'all',
    gender: 'all',
    location: 'national',
    interests: [],
    behaviors: [],
    
    // 预算投放
    campaignType: 'live_room',
    startTime: null,
    endTime: null,
    totalBudget: 1000,
    dailyBudget: 100,
    biddingStrategy: 'auto',
    clickBid: 1.5,
    
    // 状态
    status: 'draft'
  })

  const handleDataUpdate = useCallback((updates) => {
    setCampaignData(prev => ({ ...prev, ...updates }))
  }, [])

  const calculateProgress = () => {
    let completedSteps = 0
    
    if (campaignData.name && campaignData.marketingGoal && campaignData.optimizationTarget) {
      completedSteps++
    }
    if (campaignData.promotionScenario && campaignData.placements.length > 0) {
      completedSteps++
    }
    if (campaignData.productId && campaignData.currentPrice > 0) {
      completedSteps++
    }
    if (campaignData.ageRange || campaignData.interests.length > 0) {
      completedSteps++
    }
    if (campaignData.totalBudget > 0 && campaignData.dailyBudget > 0) {
      completedSteps++
    }
    
    return Math.round((completedSteps / 5) * 100)
  }

  const renderStepContent = () => {
    const components = [
      <MarketingGoals data={campaignData} onChange={handleDataUpdate} />,
      <PromotionScenario data={campaignData} onChange={handleDataUpdate} />,
      <ProductSettings data={campaignData} onChange={handleDataUpdate} />,
      <UserTargeting data={campaignData} onChange={handleDataUpdate} />,
      <BudgetSchedule data={campaignData} onChange={handleDataUpdate} />,
      <DataPreview data={campaignData} />
    ]
    
    return components[activeStep] || components[0]
  }

  const progress = calculateProgress()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-white" />
                <h1 className="text-2xl font-bold text-white">千川广告投放平台</h1>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white text-sm">配置进度：</span>
                <Progress value={progress} className="w-48" />
                <span className="text-white text-sm font-semibold">{progress}%</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="secondary"
                onClick={() => console.log('保存配置:', campaignData)}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <Save className="h-4 w-4 mr-2" />
                保存配置
              </Button>
              <Button 
                disabled={progress < 100}
                onClick={() => console.log('启动推广:', campaignData)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Play className="h-4 w-4 mr-2" />
                启动推广
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto p-6">
        {/* 步骤导航 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => {
                const IconComponent = step.icon
                return (
                  <div 
                    key={step.id}
                    className={`flex flex-col items-center cursor-pointer ${
                      index === activeStep ? 'text-indigo-600' : index < activeStep ? 'text-green-600' : 'text-gray-400'
                    }`}
                    onClick={() => setActiveStep(index)}
                  >
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center mb-2 border-2
                      ${index === activeStep ? 'bg-indigo-100 border-indigo-600' : 
                        index < activeStep ? 'bg-green-100 border-green-600' : 'bg-gray-100 border-gray-300'}
                    `}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-medium">{step.name}</span>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-0.5 mt-6 absolute translate-x-12 ${
                        index < activeStep ? 'bg-green-600' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* 步骤内容 */}
        <div className="min-h-96">
          {renderStepContent()}
        </div>

        {/* 底部导航按钮 */}
        <div className="flex justify-center gap-4 mt-6">
          <Button 
            variant="outline"
            disabled={activeStep === 0}
            onClick={() => setActiveStep(activeStep - 1)}
          >
            上一步
          </Button>
          <Button 
            disabled={activeStep === steps.length - 1}
            onClick={() => setActiveStep(activeStep + 1)}
          >
            下一步
          </Button>
        </div>
      </div>
    </div>
  )
}

export default App