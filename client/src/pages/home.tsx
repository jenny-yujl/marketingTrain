import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import StepNavigation from "@/components/step-navigation";
import MarketingGoals from "@/components/marketing-goals";
import PromotionScenario from "@/components/promotion-scenario";
import ProductSettings from "@/components/product-settings";
import UserTargeting from "@/components/user-targeting";
import BudgetSchedule from "@/components/budget-schedule";
import DataPreview from "@/components/data-preview";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { CampaignData } from "@/lib/types";

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);
  const [editingCampaignId, setEditingCampaignId] = useState<number | null>(null);
  const [campaignData, setCampaignData] = useState<CampaignData>({
    name: "新推广计划",
    marketingGoal: "",
    optimizationTarget: "展示量优化",
    priority: "均匀投放",
    promotionScenario: "",
    placements: [],
    deviceTypes: [],
    productId: null,
    originalPrice: 0,
    currentPrice: 0,
    hasTimeLimitedDiscount: false,
    discountPercentage: 0,
    hasFullReduction: false,
    fullReductionThreshold: 0,
    fullReductionAmount: 0,
    ageRange: "18-35",
    gender: "不限",
    location: "全国",
    interests: [],
    behaviors: [],
    campaignType: "持续投放",
    startTime: null,
    endTime: null,
    totalBudget: 10000,
    dailyBudget: 500,
    biddingStrategy: "智能出价",
    clickBid: 1.5,
    weeklySchedule: [true, true, true, true, true, true, true],
    status: "draft",
  });

  const { toast } = useToast();

  const { data: campaigns = [] } = useQuery({
    queryKey: ["/api/campaigns"],
  });

  // 加载现有活动进行编辑
  const loadCampaignForEdit = (campaignId: number) => {
    const campaign = campaigns.find((c: any) => c.id === campaignId);
    if (campaign) {
      setEditingCampaignId(campaignId);
      setCampaignData({
        name: campaign.name || "",
        marketingGoal: campaign.marketingGoal || "",
        optimizationTarget: campaign.optimizationTarget || "",
        priority: campaign.priority || "",
        promotionScenario: campaign.promotionScenario || "",
        placements: campaign.placements || [],
        deviceTypes: campaign.deviceTypes || [],
        productId: campaign.productId || null,
        originalPrice: campaign.originalPrice || 0,
        currentPrice: campaign.currentPrice || 0,
        hasTimeLimitedDiscount: campaign.hasTimeLimitedDiscount || false,
        discountPercentage: campaign.discountPercentage || 0,
        hasFullReduction: campaign.hasFullReduction || false,
        fullReductionThreshold: campaign.fullReductionThreshold || 0,
        fullReductionAmount: campaign.fullReductionAmount || 0,
        ageRange: campaign.ageRange || "",
        gender: campaign.gender || "",
        location: campaign.location || "",
        interests: campaign.interests || [],
        behaviors: campaign.behaviors || [],
        campaignType: campaign.campaignType || "",
        startTime: campaign.startTime ? new Date(campaign.startTime) : null,
        endTime: campaign.endTime ? new Date(campaign.endTime) : null,
        totalBudget: campaign.totalBudget || 0,
        dailyBudget: campaign.dailyBudget || 0,
        biddingStrategy: campaign.biddingStrategy || "",
        clickBid: campaign.clickBid || 0,
        weeklySchedule: campaign.weeklySchedule || [],
        status: campaign.status || "draft",
      });
      setActiveStep(0); // 回到第一步
      toast({
        title: "加载成功",
        description: `正在编辑活动: ${campaign.name}`,
      });
    }
  };

  // 创建新活动
  const createNewCampaign = () => {
    setEditingCampaignId(null);
    setCampaignData({
      name: "新推广计划",
      marketingGoal: "",
      optimizationTarget: "展示量优化",
      priority: "均匀投放",
      promotionScenario: "",
      placements: [],
      deviceTypes: [],
      productId: null,
      originalPrice: 0,
      currentPrice: 0,
      hasTimeLimitedDiscount: false,
      discountPercentage: 0,
      hasFullReduction: false,
      fullReductionThreshold: 0,
      fullReductionAmount: 0,
      ageRange: "18-35",
      gender: "不限",
      location: "全国",
      interests: [],
      behaviors: [],
      campaignType: "持续投放",
      startTime: null,
      endTime: null,
      totalBudget: 10000,
      dailyBudget: 500,
      biddingStrategy: "智能出价",
      clickBid: 1.5,
      weeklySchedule: [true, true, true, true, true, true, true],
      status: "draft",
    });
    setActiveStep(0);
  };

  const steps = [
    { id: 0, name: "营销目标设置", component: MarketingGoals },
    { id: 1, name: "推广场景配置", component: PromotionScenario },
    { id: 2, name: "产品推广设置", component: ProductSettings },
    { id: 3, name: "用户定向设置", component: UserTargeting },
    { id: 4, name: "排期预算管理", component: BudgetSchedule },
    { id: 5, name: "数据预览", component: DataPreview },
  ];

  const handleStepChange = (stepId: number) => {
    setActiveStep(stepId);
  };

  const handleDataChange = (updates: Partial<CampaignData>) => {
    setCampaignData(prev => ({ ...prev, ...updates }));
  };

  const handleSaveDraft = async () => {
    try {
      if (editingCampaignId) {
        // 更新现有活动
        await apiRequest("PUT", `/api/campaigns/${editingCampaignId}`, {
          ...campaignData,
          status: "draft",
        });
        toast({
          title: "更新成功",
          description: "活动已更新",
        });
      } else {
        // 创建新活动
        const response = await apiRequest("POST", "/api/campaigns", {
          ...campaignData,
          status: "draft",
        });
        setEditingCampaignId(response.id);
        toast({
          title: "保存成功",
          description: "草稿已保存",
        });
      }
    } catch (error) {
      toast({
        title: editingCampaignId ? "更新失败" : "保存失败",
        description: "请检查网络连接后重试",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingCampaignId) {
        // 更新现有活动并提交
        await apiRequest("PUT", `/api/campaigns/${editingCampaignId}`, {
          ...campaignData,
          status: "submitted",
        });
        toast({
          title: "提交成功",
          description: "推广计划已更新并提交",
        });
      } else {
        // 创建新活动并提交
        const response = await apiRequest("POST", "/api/campaigns", {
          ...campaignData,
          status: "submitted",
        });
        setEditingCampaignId(response.id);
        toast({
          title: "提交成功",
          description: "推广计划已提交",
        });
      }
    } catch (error) {
      toast({
        title: "提交失败",
        description: "请检查所有必填信息后重试",
        variant: "destructive",
      });
    }
  };

  const CurrentStepComponent = steps[activeStep].component;
  const completedSteps = activeStep;
  const progress = ((completedSteps + 1) / steps.length) * 100;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header 
        progress={progress} 
        onSave={handleSaveDraft}
        editingMode={editingCampaignId !== null}
        campaignName={campaignData.name}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <StepNavigation
            steps={steps}
            activeStep={activeStep}
            onStepChange={handleStepChange}
          />
          
          <div className="flex-1">
            <CurrentStepComponent
              data={campaignData}
              onChange={handleDataChange}
            />
            
            <div className="mt-8 flex justify-between">
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={createNewCampaign}
                  disabled={!editingCampaignId}
                >
                  创建新活动
                </Button>
                {campaigns.length > 0 && (
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md"
                    onChange={(e) => {
                      const campaignId = parseInt(e.target.value);
                      if (campaignId) loadCampaignForEdit(campaignId);
                    }}
                    value={editingCampaignId || ""}
                  >
                    <option value="">选择已有活动...</option>
                    {campaigns.map((campaign: any) => (
                      <option key={campaign.id} value={campaign.id}>
                        {campaign.name} ({campaign.status})
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                >
                  {editingCampaignId ? "更新草稿" : "保存草稿"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    toast({
                      title: "预览效果",
                      description: "预览功能正在开发中",
                    });
                  }}
                >
                  预览效果
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!campaignData.marketingGoal || !campaignData.promotionScenario}
                >
                  {editingCampaignId ? "更新并提交" : "提交配置"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
