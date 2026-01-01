# 🔧 API 设置最终指南

## ⚠️ 重要发现

**DeepSeek API 不支持图片 OCR！**

错误信息显示 DeepSeek API 的 messages 格式不支持 `image_url`，只支持文本。

## ✅ 解决方案：使用 Gemini API

### 在 Vercel 中设置

1. **进入 Vercel Dashboard**
   - 你的项目 → **Settings** → **Environment Variables**

2. **删除或不要设置 `DEEPSEEK_API_KEY`**
   - 如果已设置，可以删除它

3. **设置 `GEMINI_API_KEY`**
   - **Name**: `GEMINI_API_KEY`
   - **Value**: 你的 Google Gemini API 密钥
   - **Environment**: 选择所有环境
   - 点击 **Save**

4. **重新部署**
   - **Deployments** → 最新部署 → **"..."** → **"Redeploy"**
   - 等待部署完成

## 📋 为什么使用 Gemini API？

- ✅ **原生支持图片 OCR**
- ✅ **API 格式简单**
- ✅ **性能好，准确度高**
- ✅ **免费额度充足**

## 🔄 代码已更新

代码已经更新为：
- 如果设置了 `DEEPSEEK_API_KEY`，会返回错误提示使用 Gemini
- 如果设置了 `GEMINI_API_KEY`，会正常使用 Gemini API 进行 OCR

## ✅ 验证

设置完成后：
1. 等待部署完成
2. 访问网站
3. 上传图片测试 OCR
4. 应该可以正常提取文本

## 💡 提示

- **不要同时设置两个 API 密钥**（如果设置了 DeepSeek，会优先使用但会报错）
- **只设置 `GEMINI_API_KEY`** 即可
- **确保重新部署**才能生效


