import { fileURLToPath } from 'url';
import path from 'path';

// 兼容性解决方案：为 import.meta.dirname 提供回退
export function getDirname(importMetaUrl: string): string {
  try {
    // 如果 import.meta.dirname 可用，使用它
    if (typeof import.meta.dirname !== 'undefined') {
      return import.meta.dirname;
    }
  } catch (error) {
    // 如果不可用，使用 fileURLToPath 作为回退
  }
  
  // 回退方案：从 import.meta.url 手动计算目录
  return path.dirname(fileURLToPath(importMetaUrl));
}