# Vercel Gemini API 故障排除指南

## 🚨 常见问题

如果 Gemini API 一直显示不成功，可能的原因：

1. ❌ 环境变量未设置或设置错误
2. ❌ API 密钥格式不正确
3. ❌ 环境变量修改后未重新部署
4. ❌ API 密钥无效或已过期
5. ❌ Vercel Functions 日志中的错误

## ✅ 完整检查步骤

### 步骤 1: 检查环境变量设置

1. **进入 Vercel Dashboard**
   - 访问 https://vercel.com
   - 登录你的账号
   - 进入你的项目（`sacnwhat` 或 `scanwhat`）

2. **检查环境变量**
   - 点击 **"Settings"** 标签
   - 点击左侧菜单的 **"Environment Variables"**
   - 查找 `GEMINI_API_KEY`

3. **如果环境变量不存在**
   - 点击 **"Add New"**
   - **Name**: `GEMINI_API_KEY`
   - **Value**: 你的 Gemini API 密钥
   - **Environment**: 选择所有（Production, Preview, Development）
   - 点击 **"Save"**

### 步骤 2: 验证 API 密钥格式

Gemini API 密钥格式：
- ✅ 通常是一个长字符串，例如：`AIzaSy...`（以 `AIza` 开头）
- ✅ 没有前缀（不需要 `sk-` 或其他前缀）
- ✅ 没有多余的空格或换行符

**检查方法**：
1. 复制 API 密钥
2. 粘贴到文本编辑器
3. 检查是否有前后空格
4. 确保是单行文本

### 步骤 3: 重新部署项目（重要！）

**环境变量修改后必须重新部署才能生效！**

#### 方法 1: 手动重新部署
1. Vercel Dashboard → **"Deployments"** 标签
2. 找到最新的部署
3. 点击 **"..."** → **"Redeploy"**
4. 等待部署完成（通常 1-2 分钟）

#### 方法 2: 推送代码触发部署
```bash
# 在项目目录中
cd /Users/abel/Desktop/scanwhat

# 做一个小的更改触发重新部署
git commit --allow-empty -m "Trigger redeploy for environment variables"
git push
```

### 步骤 4: 检查 Vercel Functions 日志

1. **进入 Functions 日志**
   - Vercel Dashboard → **"Functions"** 标签
   - 找到 `/api/ocr` 函数
   - 点击查看日志

2. **查看日志内容**
   应该看到类似这样的日志：
   ```
   Environment check: {
     hasDEEPSEEK: false,
     hasGEMINI: true,
     hasApiKey: true,
     usingDeepSeek: false
   }
   ```

3. **如果看到错误**
   - 复制错误信息
   - 根据错误信息进行修复

### 步骤 5: 测试 API 端点

在浏览器 Console 中运行：

```javascript
// 测试 API 端点
fetch('/api/ocr', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    base64Image: 'test',
    mimeType: 'image/jpeg'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

**预期结果**：
- 如果环境变量未设置：`{ error: 'API key not configured...' }`
- 如果 API 密钥无效：`{ error: 'API call failed...' }`
- 如果格式错误：`{ error: 'Missing base64Image or mimeType' }`

## 🔍 常见错误和解决方案

### 错误 1: "API key not configured"

**原因**：环境变量未设置或未重新部署

**解决**：
1. 确认环境变量已设置（步骤 1）
2. **重新部署项目**（步骤 3）
3. 等待部署完成后再测试

### 错误 2: "The configured API key is not valid"

**原因**：API 密钥无效或格式错误

**解决**：
1. 检查 API 密钥格式（步骤 2）
2. 确认 API 密钥是否正确复制
3. 在 Google AI Studio 中验证 API 密钥是否有效
   - 访问 https://aistudio.google.com/
   - 检查 API 密钥是否可用

### 错误 3: "API call failed: 400"

**原因**：请求格式错误或 API 密钥权限不足

**解决**：
1. 检查 Functions 日志中的详细错误
2. 确认 API 密钥有正确的权限
3. 检查 Gemini API 是否支持图片输入

### 错误 4: "API call failed: 403"

**原因**：API 密钥权限不足或已过期

**解决**：
1. 在 Google Cloud Console 中检查 API 密钥权限
2. 确保启用了 "Generative Language API"
3. 检查 API 密钥是否已过期

### 错误 5: "API call failed: 429"

**原因**：API 调用次数超限

**解决**：
1. 检查 API 配额
2. 等待一段时间后重试
3. 考虑升级 API 配额

## 📋 完整检查清单

- [ ] 在 Vercel Dashboard 中设置了 `GEMINI_API_KEY` 环境变量
- [ ] 环境变量名称正确（`GEMINI_API_KEY`，不是 `GEMINI_API` 或其他）
- [ ] 环境变量值正确（API 密钥，没有多余空格）
- [ ] 选择了所有环境（Production, Preview, Development）
- [ ] **已重新部署项目**（重要！）
- [ ] 等待部署完成（1-2 分钟）
- [ ] 检查 Functions 日志，确认环境变量已加载
- [ ] 测试 API 端点
- [ ] 在 Google AI Studio 中验证 API 密钥有效

## 🔑 获取 Gemini API 密钥

如果还没有 API 密钥：

1. **访问 Google AI Studio**
   - https://aistudio.google.com/

2. **获取 API 密钥**
   - 点击 "Get API key"
   - 创建新项目或选择现有项目
   - 复制 API 密钥

3. **在 Vercel 中设置**
   - 按照步骤 1 设置环境变量

## 🧪 本地测试 API 密钥

在设置到 Vercel 之前，可以先在本地测试：

```bash
# 在项目目录中
cd /Users/abel/Desktop/scanwhat

# 设置环境变量（临时）
export GEMINI_API_KEY=your_api_key_here

# 运行测试脚本
npm run test:ocr
```

如果本地测试成功，说明 API 密钥有效，问题可能在 Vercel 配置。

## 📝 调试技巧

### 1. 查看详细日志

在 `api/ocr.ts` 中已经有详细的日志输出。查看 Vercel Functions 日志可以看到：
- 环境变量是否加载
- API 调用是否成功
- 错误详情

### 2. 测试不同的模型

代码已经实现了模型回退机制，会自动尝试多个模型：
- `v1beta/gemini-pro`
- `v1beta/gemini-1.5-pro`
- `v1beta/gemini-1.5-flash`
- `v1/gemini-pro`
- `v1/gemini-1.5-pro`

如果某个模型失败，会自动尝试下一个。

### 3. 检查网络请求

在浏览器开发者工具中：
1. 打开 **Network** 标签
2. 上传图片测试 OCR
3. 查看 `/api/ocr` 请求
4. 检查请求和响应内容

## ✅ 验证修复

修复后，你应该能够：

1. ✅ 上传图片
2. ✅ 成功提取文字
3. ✅ 看到提取的文字内容
4. ✅ 没有错误提示

## 🆘 如果仍然不工作

1. **检查 Functions 日志**
   - 复制完整的错误信息
   - 查看是否有其他错误

2. **验证 API 密钥**
   - 在 Google AI Studio 中测试 API 密钥
   - 确认 API 密钥有效

3. **检查 Vercel 项目设置**
   - 确认项目已正确部署
   - 确认 Functions 已启用

4. **联系支持**
   - 如果问题仍然存在，可以提供：
     - Functions 日志
     - 错误信息
     - API 密钥格式（不包含实际密钥）

