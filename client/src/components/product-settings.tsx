import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import type { CampaignData } from "@/lib/types";
import type { Product } from "@shared/schema";

interface ProductSettingsProps {
  data: CampaignData;
  onChange: (updates: Partial<CampaignData>) => void;
}

export default function ProductSettings({ data, onChange }: ProductSettingsProps) {
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const handleProductSelect = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      onChange({
        productId,
        originalPrice: parseFloat(product.originalPrice),
        currentPrice: parseFloat(product.currentPrice),
      });
    }
  };

  const handlePriceChange = (field: "originalPrice" | "currentPrice", value: string) => {
    const numValue = parseFloat(value) || 0;
    onChange({ [field]: numValue });
  };

  const handlePromotionChange = (field: string, value: boolean | number) => {
    onChange({ [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">产品推广设置</CardTitle>
        <p className="text-sm text-gray-600">配置要推广的产品信息和促销活动</p>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">产品选择</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductSelect(product.id)}
                className={`product-card border-2 rounded-lg p-4 cursor-pointer ${
                  data.productId === product.id ? 'selected' : ''
                }`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-md mb-3"
                />
                <h4 className="font-medium text-gray-900 mb-1">{product.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-primary">¥{product.currentPrice}</span>
                  <span className="text-sm text-gray-500 line-through">¥{product.originalPrice}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">价格配置</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="originalPrice">原价</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-2 text-gray-500">¥</span>
                <Input
                  id="originalPrice"
                  type="number"
                  value={data.originalPrice}
                  onChange={(e) => handlePriceChange("originalPrice", e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="currentPrice">现价</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-2 text-gray-500">¥</span>
                <Input
                  id="currentPrice"
                  type="number"
                  value={data.currentPrice}
                  onChange={(e) => handlePriceChange("currentPrice", e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">促销活动配置</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="timeLimitedDiscount"
                    checked={data.hasTimeLimitedDiscount}
                    onCheckedChange={(checked) => handlePromotionChange("hasTimeLimitedDiscount", checked)}
                  />
                  <Label htmlFor="timeLimitedDiscount" className="font-medium">限时折扣</Label>
                </div>
                <p className="text-xs text-gray-500 ml-6">设置限时折扣活动，刺激用户购买</p>
              </div>
              <div className="text-right">
                <Input
                  type="number"
                  value={data.discountPercentage}
                  onChange={(e) => handlePromotionChange("discountPercentage", parseInt(e.target.value) || 0)}
                  className="w-16"
                  disabled={!data.hasTimeLimitedDiscount}
                />
                <span className="text-sm text-gray-600 ml-1">% OFF</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="fullReduction"
                    checked={data.hasFullReduction}
                    onCheckedChange={(checked) => handlePromotionChange("hasFullReduction", checked)}
                  />
                  <Label htmlFor="fullReduction" className="font-medium">满减活动</Label>
                </div>
                <p className="text-xs text-gray-500 ml-6">满一定金额减免部分费用</p>
              </div>
              <div className="text-right flex items-center space-x-2">
                <span className="text-sm text-gray-600">满</span>
                <Input
                  type="number"
                  value={data.fullReductionThreshold}
                  onChange={(e) => handlePromotionChange("fullReductionThreshold", parseFloat(e.target.value) || 0)}
                  className="w-16"
                  disabled={!data.hasFullReduction}
                />
                <span className="text-sm text-gray-600">减</span>
                <Input
                  type="number"
                  value={data.fullReductionAmount}
                  onChange={(e) => handlePromotionChange("fullReductionAmount", parseFloat(e.target.value) || 0)}
                  className="w-16"
                  disabled={!data.hasFullReduction}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
