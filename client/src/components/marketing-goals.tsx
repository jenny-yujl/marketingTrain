import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Users, ShoppingCart, Check } from "lucide-react";
import type { CampaignData } from "@/lib/types";

interface MarketingGoalsProps {
  data: CampaignData;
  onChange: (updates: Partial<CampaignData>) => void;
}

const goals = [
  {
    id: "brand-exposure",
    name: "品牌曝光",
    description: "提升品牌知名度和曝光度，扩大品牌影响力",
    icon: Eye,
    recommendation: "★★★★☆",
    bgColor: "bg-blue-50",
    iconColor: "bg-primary",
  },
  {
    id: "lead-generation",
    name: "引流获客",
    description: "吸引潜在客户关注，增加粉丝数量和互动",
    icon: Users,
    recommendation: "★★★★★",
    bgColor: "bg-purple-50",
    iconColor: "bg-secondary",
  },
  {
    id: "live-commerce",
    name: "直播带货",
    description: "直播销售产品，提升转化率和GMV",
    icon: ShoppingCart,
    recommendation: "★★★★★",
    bgColor: "bg-orange-50",
    iconColor: "bg-accent",
  },
];

export default function MarketingGoals({ data, onChange }: MarketingGoalsProps) {
  const handleGoalSelect = (goalId: string) => {
    onChange({ marketingGoal: goalId });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">营销目标设置</CardTitle>
        <p className="text-sm text-gray-600">请选择您的营销目标，这将影响后续的推广策略和参数设置</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goals.map((goal) => {
            const Icon = goal.icon;
            const isSelected = data.marketingGoal === goal.id;
            
            return (
              <div
                key={goal.id}
                onClick={() => handleGoalSelect(goal.id)}
                className={`marketing-goal-card border-2 rounded-lg p-4 cursor-pointer ${
                  isSelected ? 'selected' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 ${goal.iconColor} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-primary' : 'bg-gray-200'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{goal.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                <div className="text-xs text-primary">推荐指数: {goal.recommendation}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">高级选项</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">优化目标</label>
              <Select
                value={data.optimizationTarget}
                onValueChange={(value) => onChange({ optimizationTarget: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择优化目标" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="展示量优化">展示量优化</SelectItem>
                  <SelectItem value="点击率优化">点击率优化</SelectItem>
                  <SelectItem value="转化率优化">转化率优化</SelectItem>
                  <SelectItem value="成本优化">成本优化</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">投放优先级</label>
              <Select
                value={data.priority}
                onValueChange={(value) => onChange({ priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择投放优先级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="均匀投放">均匀投放</SelectItem>
                  <SelectItem value="尽快投放">尽快投放</SelectItem>
                  <SelectItem value="成本优先">成本优先</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
