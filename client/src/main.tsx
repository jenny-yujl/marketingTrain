// 临时回退到React，等待Vue配置修复
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';

// 临时简单的React组件
function TemporaryApp() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'system-ui' }}>
      <h1>🚀 巨量千川教学系统 - Vue 3转换中</h1>
      <p>系统正在从React转换到Vue 3框架</p>
      <p>前端: localhost:3000 | 后端: localhost:5000</p>
      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <h3>✅ 已完成的Vue 3组件：</h3>
        <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
          <li>✓ 营销目标设置 (MarketingGoals.vue)</li>
          <li>✓ 推广场景选择 (PromotionScenario.vue)</li>
          <li>✓ 商品设置 (ProductSettings.vue)</li>
          <li>✓ 用户定向 (UserTargeting.vue)</li>
          <li>✓ 预算投放 (BudgetSchedule.vue)</li>
          <li>✓ 数据预览 (DataPreview.vue)</li>
        </ul>
      </div>
      <p style={{ marginTop: '1rem', color: '#666' }}>
        所有Vue组件已创建完成，正在解决配置问题
      </p>
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <TemporaryApp />
  </StrictMode>
);