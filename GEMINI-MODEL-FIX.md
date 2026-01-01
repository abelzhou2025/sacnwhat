# Gemini API 模型可用性修复

## 🚨 当前问题

错误信息显示：
- `models/gemini-1.5-pro is not found for API version v1beta`

这说明 `gemini-1.5-pro` 在 v1beta API 中不可用。

## ✅ 已修复

### 只使用确认可用的模型

已移除所有不可用的模型，只保留确认可用的：
- ✅ `v1beta/gemini-1.5-flash` - 确认可用，支持图片，推荐使用

### 已移除的模型

- ❌ `gemini-1.5-pro` - 在 v1beta 中不可用
- ❌ `gemini-pro` - 在 v1beta 中不可用
- ❌ `gemini-2.0-flash-exp` - 实验性模型，配额限制严格

## 📋 模型可用性说明

### v1beta API 可用模型

根据 Google Gemini API 文档，v1beta API 中可用的模型包括：
- ✅ `gemini-1.5-flash` - 快速模型，支持图片输入
- ✅ `gemini-1.5-pro` - 在某些情况下可用，但可能受限制
- ❌ `gemini-pro` - 旧版本，可能已弃用
- ❌ `gemini-2.0-flash-exp` - 实验性，配额限制严格

### 为什么只使用 gemini-1.5-flash？

1. **确认可用**：在 v1beta API 中稳定可用
2. **支持图片**：完全支持图片输入，适合 OCR
3. **速度快**：快速响应，适合实时应用
4. **配额宽松**：相比实验性模型，配额限制更宽松
5. **稳定可靠**：不是实验性模型，更稳定

## 🔍 如何检查可用模型

如果你想查看所有可用的模型，可以调用 ListModels API：

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY"
```

这会返回所有可用的模型列表。

## ✅ 验证修复

修复后，你应该：

1. ✅ 只使用 `v1beta/gemini-1.5-flash` 模型
2. ✅ 不再出现 "model is not found" 错误
3. ✅ 能够成功提取文字
4. ✅ 响应速度快

## 🆘 如果仍然有问题

如果 `gemini-1.5-flash` 也不可用，可能的原因：

1. **API 密钥权限问题**
   - 检查 API 密钥是否有正确的权限
   - 确认启用了 "Generative Language API"

2. **API 密钥配额问题**
   - 检查配额是否已用完
   - 访问 https://ai.dev/usage?tab=rate-limit

3. **API 版本问题**
   - 尝试使用 `v1` API（但支持的模型更少）
   - 或检查是否有其他可用的 API 版本

## 📝 代码更改

已更新所有平台的代码：
- ✅ Vercel (`api/ocr.ts`)
- ✅ Netlify (`netlify/functions/ocr.ts`)
- ✅ Cloudflare Pages (`functions/api/ocr.ts`)

所有代码现在：
- 只使用 `v1beta/gemini-1.5-flash`
- 不再尝试其他可能不可用的模型
- 简化了模型选择逻辑

## 💡 未来改进

如果将来需要支持更多模型，可以：

1. **检查模型可用性**
   - 调用 ListModels API 获取可用模型列表
   - 动态选择可用的模型

2. **添加模型回退**
   - 如果主要模型失败，尝试其他模型
   - 但需要先确认哪些模型真正可用

3. **使用 v1 API**
   - 如果 v1beta 不可用，可以尝试 v1 API
   - 但 v1 API 支持的模型更少

