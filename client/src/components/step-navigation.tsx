import { CircleHelp } from "lucide-react";

interface Step {
  id: number;
  name: string;
}

interface StepNavigationProps {
  steps: Step[];
  activeStep: number;
  onStepChange: (stepId: number) => void;
}

export default function StepNavigation({ steps, activeStep, onStepChange }: StepNavigationProps) {
  return (
    <div className="w-64 flex-shrink-0">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">配置步骤</h2>
        </div>
        <nav className="p-2">
          <div className="space-y-1">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => onStepChange(step.id)}
                className={`step-item w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeStep === step.id ? 'active' : ''
                } ${step.id < activeStep ? 'completed' : ''}`}
              >
                <div className={`step-number w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3`}>
                  {step.id + 1}
                </div>
                {step.name}
              </button>
            ))}
          </div>
        </nav>
      </div>

      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <CircleHelp className="w-5 h-5 text-primary mr-2" />
          <h3 className="text-sm font-medium text-gray-900">操作指导</h3>
        </div>
        <p className="text-sm text-gray-600">
          {activeStep === 0 && "选择您的营销目标，系统将根据您的选择推荐最适合的推广策略和参数设置。"}
          {activeStep === 1 && "选择适合您业务的推广场景，不同场景有不同的展示效果和用户覆盖。"}
          {activeStep === 2 && "配置要推广的产品信息，设置价格和促销活动来吸引用户。"}
          {activeStep === 3 && "精准定向目标用户群体，提升推广效果和转化率。"}
          {activeStep === 4 && "合理安排投放时间和预算分配，最大化推广效果。"}
          {activeStep === 5 && "查看基于当前配置的预估效果和关键指标分析。"}
        </p>
      </div>
    </div>
  );
}
