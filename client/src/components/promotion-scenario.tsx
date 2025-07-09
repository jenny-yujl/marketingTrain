import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Video, Play, Rss } from "lucide-react";
import type { CampaignData } from "@/lib/types";

interface PromotionScenarioProps {
  data: CampaignData;
  onChange: (updates: Partial<CampaignData>) => void;
}

const scenarios = [
  {
    id: "live-room",
    name: "直播间推广",
    description: "在直播间内展示推广内容，提升直播间人气和转化",
    icon: Video,
    iconColor: "bg-red-500",
    recommendation: "95%",
    estimatedExposure: "50万+",
    estimatedClick: "2万+",
  },
  {
    id: "video-promotion",
    name: "视频推广",
    description: "通过短视频内容推广，提升品牌曝光和用户互动",
    icon: Play,
    iconColor: "bg-blue-500",
    recommendation: "88%",
    estimatedExposure: "30万+",
    estimatedClick: "1.5万+",
  },
  {
    id: "feed-promotion",
    name: "信息流推广",
    description: "在信息流中自然展示推广内容，提升用户体验",
    icon: Rss,
    iconColor: "bg-green-500",
    recommendation: "82%",
    estimatedExposure: "40万+",
    estimatedClick: "1.8万+",
  },
];

const placements = [
  { id: "recommend", name: "推荐页面", description: "高曝光" },
  { id: "live", name: "直播页面", description: "高转化" },
  { id: "search", name: "搜索页面", description: "精准流量" },
];

const deviceTypes = [
  { id: "mobile", name: "移动端", traffic: "85%流量" },
  { id: "desktop", name: "桌面端", traffic: "15%流量" },
];

export default function PromotionScenario({ data, onChange }: PromotionScenarioProps) {
  const handleScenarioSelect = (scenarioId: string) => {
    onChange({ promotionScenario: scenarioId });
  };

  const handlePlacementChange = (placementId: string, checked: boolean) => {
    const newPlacements = checked
      ? [...data.placements, placementId]
      : data.placements.filter(p => p !== placementId);
    onChange({ placements: newPlacements });
  };

  const handleDeviceTypeChange = (deviceId: string, checked: boolean) => {
    const newDeviceTypes = checked
      ? [...data.deviceTypes, deviceId]
      : data.deviceTypes.filter(d => d !== deviceId);
    onChange({ deviceTypes: newDeviceTypes });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">推广场景配置</CardTitle>
        <p className="text-sm text-gray-600">选择适合您业务的推广场景，不同场景有不同的展示效果</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((scenario) => {
            const Icon = scenario.icon;
            const isSelected = data.promotionScenario === scenario.id;
            
            return (
              <div
                key={scenario.id}
                onClick={() => handleScenarioSelect(scenario.id)}
                className={`scenario-card border-2 rounded-lg p-4 cursor-pointer ${
                  isSelected ? 'selected' : ''
                }`}
              >
                <div className="flex items-center mb-3">
                  <div className={`w-10 h-10 ${scenario.iconColor} rounded-lg flex items-center justify-center mr-3`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{scenario.name}</h3>
                    <p className="text-xs text-gray-500">推荐度: {scenario.recommendation}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                <div className="text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>预估曝光: {scenario.estimatedExposure}</span>
                    <span>预估点击: {scenario.estimatedClick}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">投放位置设置</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">推广位置</label>
              <div className="space-y-2">
                {placements.map((placement) => (
                  <div key={placement.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={placement.id}
                        checked={data.placements.includes(placement.id)}
                        onCheckedChange={(checked) => handlePlacementChange(placement.id, checked as boolean)}
                      />
                      <label
                        htmlFor={placement.id}
                        className="text-sm text-gray-600 cursor-pointer"
                      >
                        {placement.name}
                      </label>
                    </div>
                    <span className="text-xs text-gray-500">{placement.description}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">设备类型</label>
              <div className="space-y-2">
                {deviceTypes.map((device) => (
                  <div key={device.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={device.id}
                        checked={data.deviceTypes.includes(device.id)}
                        onCheckedChange={(checked) => handleDeviceTypeChange(device.id, checked as boolean)}
                      />
                      <label
                        htmlFor={device.id}
                        className="text-sm text-gray-600 cursor-pointer"
                      >
                        {device.name}
                      </label>
                    </div>
                    <span className="text-xs text-gray-500">{device.traffic}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
