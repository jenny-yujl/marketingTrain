import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Eye, MousePointer, TrendingUp, Coins } from "lucide-react";
import type { CampaignData } from "@/lib/types";

interface DataPreviewProps {
  data: CampaignData;
  onChange: (updates: Partial<CampaignData>) => void;
}

const performanceData = [
  { day: "第1天", exposure: 320000, clicks: 9600 },
  { day: "第2天", exposure: 450000, clicks: 13500 },
  { day: "第3天", exposure: 380000, clicks: 11400 },
  { day: "第4天", exposure: 520000, clicks: 15600 },
  { day: "第5天", exposure: 480000, clicks: 14400 },
  { day: "第6天", exposure: 610000, clicks: 18300 },
  { day: "第7天", exposure: 590000, clicks: 17700 },
];

const ageDistribution = [
  { age: "18-25岁", percentage: 35 },
  { age: "26-35岁", percentage: 45 },
  { age: "36-45岁", percentage: 20 },
];

const costAnalysis = [
  { metric: "单次曝光成本", value: "¥0.004" },
  { metric: "单次点击成本", value: "¥0.15" },
  { metric: "单次转化成本", value: "¥4.69" },
  { metric: "获客成本", value: "¥12.50" },
];

export default function DataPreview({ data }: DataPreviewProps) {
  const keyMetrics = [
    {
      title: "预估曝光量",
      value: "2.3M",
      icon: Eye,
      color: "text-primary",
      bgColor: "bg-blue-50",
      iconBg: "bg-primary",
    },
    {
      title: "预估点击量",
      value: "68.5K",
      icon: MousePointer,
      color: "text-success",
      bgColor: "bg-green-50",
      iconBg: "bg-success",
    },
    {
      title: "预估转化率",
      value: "3.2%",
      icon: TrendingUp,
      color: "text-secondary",
      bgColor: "bg-purple-50",
      iconBg: "bg-secondary",
    },
    {
      title: "预估ROI",
      value: "2.8x",
      icon: Coins,
      color: "text-accent",
      bgColor: "bg-orange-50",
      iconBg: "bg-accent",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">数据预览</CardTitle>
        <p className="text-sm text-gray-600">基于当前配置预估的推广效果和数据分析</p>
      </CardHeader>
      <CardContent>
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {keyMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.title} className={`${metric.bgColor} rounded-lg p-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{metric.title}</p>
                    <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                  </div>
                  <div className={`w-10 h-10 ${metric.iconBg} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Performance Chart */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">推广效果趋势</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="exposure"
                    stroke="#1E40AF"
                    strokeWidth={2}
                    name="曝光量"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="clicks"
                    stroke="#10B981"
                    strokeWidth={2}
                    name="点击量"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Audience Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">受众分析</h3>
            <div className="space-y-3">
              {ageDistribution.map((item) => (
                <div key={item.age} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.age}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">成本分析</h3>
            <div className="space-y-3">
              {costAnalysis.map((item) => (
                <div key={item.metric} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.metric}</span>
                  <span className="text-sm font-medium text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
