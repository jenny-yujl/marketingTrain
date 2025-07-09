import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { CampaignData } from "@/lib/types";

interface BudgetScheduleProps {
  data: CampaignData;
  onChange: (updates: Partial<CampaignData>) => void;
}

const budgetData = [
  { name: "直播推广", value: 60, color: "#1E40AF" },
  { name: "视频推广", value: 30, color: "#7C3AED" },
  { name: "信息流推广", value: 10, color: "#F59E0B" },
];

const weekDays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

export default function BudgetSchedule({ data, onChange }: BudgetScheduleProps) {
  const handleScheduleToggle = (dayIndex: number) => {
    const newSchedule = [...data.weeklySchedule];
    newSchedule[dayIndex] = !newSchedule[dayIndex];
    onChange({ weeklySchedule: newSchedule });
  };

  const formatDateTime = (date: Date | null) => {
    if (!date) return "";
    return date.toISOString().slice(0, 16);
  };

  const parseDateTime = (dateString: string) => {
    return dateString ? new Date(dateString) : null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">排期预算管理</CardTitle>
        <p className="text-sm text-gray-600">设置投放时间和预算分配策略</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Schedule Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">投放时间</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">投放周期</Label>
                <RadioGroup
                  value={data.campaignType}
                  onValueChange={(value) => onChange({ campaignType: value })}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="持续投放" id="continuous" />
                    <Label htmlFor="continuous">持续投放</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="定期投放" id="scheduled" />
                    <Label htmlFor="scheduled">定期投放</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">开始时间</Label>
                  <Input
                    type="datetime-local"
                    value={formatDateTime(data.startTime)}
                    onChange={(e) => onChange({ startTime: parseDateTime(e.target.value) })}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2">结束时间</Label>
                  <Input
                    type="datetime-local"
                    value={formatDateTime(data.endTime)}
                    onChange={(e) => onChange({ endTime: parseDateTime(e.target.value) })}
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">投放时段</Label>
                <div className="grid grid-cols-7 gap-1 text-xs mb-2">
                  {weekDays.map((day, index) => (
                    <div key={day} className="text-center p-1">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {data.weeklySchedule.map((active, index) => (
                    <button
                      key={index}
                      onClick={() => handleScheduleToggle(index)}
                      className={`h-8 rounded transition-colors ${
                        active ? "bg-primary" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Budget Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">预算设置</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">总预算</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">¥</span>
                  <Input
                    type="number"
                    value={data.totalBudget}
                    onChange={(e) => onChange({ totalBudget: parseFloat(e.target.value) || 0 })}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">日预算</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">¥</span>
                  <Input
                    type="number"
                    value={data.dailyBudget}
                    onChange={(e) => onChange({ dailyBudget: parseFloat(e.target.value) || 0 })}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">出价策略</Label>
                <Select
                  value={data.biddingStrategy}
                  onValueChange={(value) => onChange({ biddingStrategy: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="智能出价">智能出价</SelectItem>
                    <SelectItem value="手动出价">手动出价</SelectItem>
                    <SelectItem value="目标成本出价">目标成本出价</SelectItem>
                    <SelectItem value="目标转化出价">目标转化出价</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">单次点击出价</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">¥</span>
                  <Input
                    type="number"
                    step="0.1"
                    value={data.clickBid}
                    onChange={(e) => onChange({ clickBid: parseFloat(e.target.value) || 0 })}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Allocation Chart */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">预算分配预览</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={budgetData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {budgetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {budgetData.map((item) => (
                <div key={item.name} className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    ¥{((data.totalBudget * item.value) / 100).toLocaleString()} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
