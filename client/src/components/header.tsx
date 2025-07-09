import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface HeaderProps {
  progress: number;
  onSave: () => void;
}

export default function Header({ progress, onSave }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">巨量千川直播推广教学系统</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              学习进度: {Math.round(progress)}%
            </div>
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <Button onClick={onSave} className="bg-primary hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              保存配置
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
