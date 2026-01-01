# ⚠️ DeepSeek API 图片 OCR 限制说明

## 问题

DeepSeek API 的 `deepseek-chat` 模型**不支持图片输入**。

错误信息：
```
unknown variant `image_url`, expected `text`
```

这表明 DeepSeek API 的 messages 格式只支持文本，不支持图片。

## 解决方案

### 方案 1: 使用 Gemini API（推荐）

**推荐使用 Google Gemini API**，因为它：
- ✅ 原生支持图片 OCR
- ✅ API 格式简单
- ✅ 性能好

**设置步骤**:
1. 在 Vercel 中设置环境变量 `GEMINI_API_KEY`
2. 不要设置 `DEEPSEEK_API_KEY`（或删除它）
3. 重新部署

### 方案 2: 检查 DeepSeek Vision 模型

如果 DeepSeek 有专门的 Vision 模型：
1. 查看 DeepSeek API 文档
2. 确认是否有支持图片的模型
3. 如果有，更新代码使用正确的模型和格式

### 方案 3: 使用其他 OCR API

如果必须使用 DeepSeek：
- 可能需要先将图片转换为文本描述
- 或者使用其他支持图片的 API

## 当前代码行为

代码已经更新：
- 如果设置了 `DEEPSEEK_API_KEY`，会检测到不支持图片并返回错误提示
- 建议使用 `GEMINI_API_KEY` 进行 OCR

## 推荐配置

在 Vercel 环境变量中：
- ✅ 使用 `GEMINI_API_KEY`（推荐用于 OCR）
- ❌ 不要使用 `DEEPSEEK_API_KEY`（不支持图片 OCR）

## 下一步

1. **在 Vercel 中设置 `GEMINI_API_KEY`**
2. **删除或不要设置 `DEEPSEEK_API_KEY`**
3. **重新部署项目**
4. **测试 OCR 功能**

## 关于 DeepSeek

DeepSeek 主要用于文本对话，图片 OCR 功能可能：
- 不支持
- 需要专门的 Vision 模型
- 需要不同的 API 端点

建议使用 Gemini API 进行 OCR 任务。


