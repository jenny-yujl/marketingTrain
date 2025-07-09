import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import type { CampaignData } from "@/lib/types";

interface UserTargetingProps {
  data: CampaignData;
  onChange: (updates: Partial<CampaignData>) => void;
}

const interestOptions = [
  "美妆护肤",
  "数码产品",
  "服装配饰",
  "健康养生",
  "运动健身",
  "家居生活",
];

const behaviorOptions = [
  "经常观看直播",
  "有购买行为",
  "活跃用户",
  "高价值用户",
];

export default function UserTargeting({ data, onChange }: UserTargetingProps) {
  const handleInterestToggle = (interest: string) => {
    const newInterests = data.interests.includes(interest)
      ? data.interests.filter(i => i !== interest)
      : [...data.interests, interest];
    onChange({ interests: newInterests });
  };

  const handleBehaviorToggle = (behavior: string) => {
    const newBehaviors = data.behaviors.includes(behavior)
      ? data.behaviors.filter(b => b !== behavior)
      : [...data.behaviors, behavior];
    onChange({ behaviors: newBehaviors });
  };

  const handleAgeRangeChange = (value: number[]) => {
    onChange({ ageRange: `${value[0]}-${value[1]}` });
  };

  const getAgeRange = () => {
    const [min, max] = data.ageRange.split('-').map(Number);
    return [min || 18, max || 65];
  };

  // Calculate audience metrics
  const coverageCount = 2300000;
  const matchRate = 85;
  const competitionLevel = "中等";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">用户定向设置</CardTitle>
        <p className="text-sm text-gray-600">精准定向目标用户，提升推广效果</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demographics */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">基础信息</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">年龄范围</Label>
                <div className="mt-2">
                  <Slider
                    value={getAgeRange()}
                    onValueChange={handleAgeRangeChange}
                    max={65}
                    min={18}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>18岁</span>
                    <span>{data.ageRange}岁</span>
                    <span>65岁</span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">性别</Label>
                <RadioGroup
                  value={data.gender}
                  onValueChange={(value) => onChange({ gender: value })}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="不限" id="gender-all" />
                    <Label htmlFor="gender-all">不限</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="男性" id="gender-male" />
                    <Label htmlFor="gender-male">男性</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="女性" id="gender-female" />
                    <Label htmlFor="gender-female">女性</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">地域选择</Label>
                <Select value={data.location} onValueChange={(value) => onChange({ location: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="全国">全国</SelectItem>
                    <SelectItem value="一线城市">一线城市</SelectItem>
                    <SelectItem value="二线城市">二线城市</SelectItem>
                    <SelectItem value="三四线城市">三四线城市</SelectItem>
                    <SelectItem value="自定义地区">自定义地区</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">兴趣标签</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">消费兴趣</Label>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => handleInterestToggle(interest)}
                      className={`interest-tag ${
                        data.interests.includes(interest) ? 'selected' : ''
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">行为特征</Label>
                <div className="space-y-2">
                  {behaviorOptions.map((behavior) => (
                    <div key={behavior} className="flex items-center space-x-2">
                      <Checkbox
                        id={behavior}
                        checked={data.behaviors.includes(behavior)}
                        onCheckedChange={() => handleBehaviorToggle(behavior)}
                      />
                      <Label htmlFor={behavior} className="text-sm text-gray-600">
                        {behavior}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Audience Preview */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">受众预览</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {(coverageCount / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-gray-600">预估覆盖人数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{matchRate}%</div>
              <div className="text-sm text-gray-600">匹配度</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{competitionLevel}</div>
              <div className="text-sm text-gray-600">竞争激烈程度</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
