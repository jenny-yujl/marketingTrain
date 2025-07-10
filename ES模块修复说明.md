# ES 模块错误修复说明

## ❌ 错误原因

`ReferenceError: require is not defined in ES module scope`

这个错误发生的原因：
1. 项目的 `package.json` 中设置了 `"type": "module"`
2. 这使整个项目使用 ES 模块标准
3. ES 模块中不能使用 CommonJS 的 `require()` 语法

## ✅ 已修复的文件

### 1. start-local.js
**修复前**:
```javascript
const { spawn } = require('child_process');
const path = require('path');
```

**修复后**:
```javascript
import { spawn } from 'child_process';
import path from 'path';
```

### 2. package-for-local.js
**修复前**:
```javascript
const fs = require('fs');
const path = require('path');
```

**修复后**:
```javascript
import fs from 'fs';
import path from 'path';
```

## 🔧 ES 模块语法对照表

| CommonJS (旧) | ES 模块 (新) |
|---------------|-------------|
| `const fs = require('fs')` | `import fs from 'fs'` |
| `const { spawn } = require('child_process')` | `import { spawn } from 'child_process'` |
| `module.exports = {}` | `export default {}` |
| `exports.fn = () => {}` | `export const fn = () => {}` |

## 🚀 现在可以正常使用

修复后，以下命令应该正常工作：

```bash
# 启动本地开发环境
node start-local.js

# 生成本地部署包
node package-for-local.js
```

## 📋 其他可能需要检查的文件

如果还有其他 `.js` 文件报类似错误，请检查：
1. 是否使用了 `require()` 语法
2. 是否使用了 `module.exports` 或 `exports`
3. 将它们转换为相应的 ES 模块语法

## 💡 预防措施

为避免此类错误，在 ES 模块项目中：
- 始终使用 `import/export` 语法
- 避免混用 CommonJS 和 ES 模块语法
- 新建文件时注意使用正确的模块语法