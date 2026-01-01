# Gemini API 配额超限问题修复

## 🚨 当前问题

错误信息显示：
- "You exceeded your current quota"
- 特别是 `gemini-2.0-flash-exp` 模型的配额已用完
- 需要等待约 59 秒后重试

## ✅ 已修复

### 1. 移除实验性模型

- ❌ 已移除 `gemini-2.0-flash-exp`（实验性模型，免费层配额限制严格）
- ✅ 只使用稳定模型：
  - `gemini-1.5-flash` - 最快，配额更宽松
  - `gemini-1.5-pro` - 高质量，配额更宽松

### 2. 改进错误处理

- 添加了配额错误的特殊处理
- 显示重试时间建议
- 提供配额管理链接

## 📋 配额管理建议

### 免费层限制

Google Gemini API 免费层有以下限制：
- **每分钟请求数**：有限制
- **每天请求数**：有限制
- **实验性模型**（如 `gemini-2.0-flash-exp`）：配额更严格

### 如何检查配额

1. **访问配额监控页面**
   - https://ai.dev/usage?tab=rate-limit
   - 查看当前使用情况

2. **查看 API 文档**
   - https://ai.google.dev/gemini-api/docs/rate-limits
   - 了解详细的配额限制

### 如何避免配额超限

1. **使用稳定模型**
   - ✅ `gemini-1.5-flash` - 推荐，配额更宽松
   - ✅ `gemini-1.5-pro` - 高质量，配额更宽松
   - ❌ `gemini-2.0-flash-exp` - 实验性，配额严格

2. **控制请求频率**
   - 不要连续快速发送多个请求
   - 在请求之间添加延迟

3. **升级到付费计划**
   - 如果需要更高的配额
   - 访问 Google Cloud Console 升级

## 🔄 重试机制

如果遇到配额错误：

1. **等待建议的时间**
   - 错误信息会显示需要等待的时间
   - 例如："Please retry in 59.429914046s"

2. **手动重试**
   - 等待后，点击 "Try Again" 按钮
   - 或重新上传图片

3. **检查配额状态**
   - 访问 https://ai.dev/usage?tab=rate-limit
   - 确认配额是否已恢复

## 📊 模型选择建议

### 推荐使用：`gemini-1.5-flash`

**优势**：
- ✅ 速度快
- ✅ 支持图片输入
- ✅ 配额更宽松
- ✅ 稳定可靠

**适用场景**：
- 日常 OCR 任务
- 快速文字提取
- 大量图片处理

### 备选：`gemini-1.5-pro`

**优势**：
- ✅ 高质量结果
- ✅ 支持图片输入
- ✅ 配额相对宽松

**适用场景**：
- 需要高质量提取
- 复杂文档处理
- 对准确性要求高

### 不推荐：`gemini-2.0-flash-exp`

**问题**：
- ❌ 实验性模型
- ❌ 免费层配额严格
- ❌ 可能不稳定

## ✅ 验证修复

修复后，你应该：

1. ✅ 不再使用 `gemini-2.0-flash-exp` 模型
2. ✅ 优先使用 `gemini-1.5-flash`（配额更宽松）
3. ✅ 遇到配额错误时，看到更友好的错误提示
4. ✅ 知道需要等待多长时间

## 🆘 如果仍然遇到配额问题

1. **检查配额状态**
   - 访问 https://ai.dev/usage?tab=rate-limit
   - 查看当前使用情况

2. **等待配额恢复**
   - 免费层配额通常每小时或每天重置
   - 等待后重试

3. **考虑升级**
   - 如果需要更高的配额
   - 访问 Google Cloud Console 升级到付费计划

4. **优化使用**
   - 减少不必要的请求
   - 批量处理图片时添加延迟
   - 使用 `gemini-1.5-flash`（配额更宽松）

## 📝 代码更改

已更新所有平台的代码：
- ✅ Vercel (`api/ocr.ts`)
- ✅ Netlify (`netlify/functions/ocr.ts`)
- ✅ Cloudflare Pages (`functions/api/ocr.ts`)

所有代码现在：
- 只使用 `gemini-1.5-flash` 和 `gemini-1.5-pro`
- 不再使用实验性模型
- 改进了配额错误的处理

