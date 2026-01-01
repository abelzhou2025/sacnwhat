# 🔐 Vercel 环境变量设置指南

## ⚠️ 当前错误

错误信息: "The configured API key is not valid"

这通常意味着：
1. 环境变量未设置
2. 环境变量名称不正确
3. API 密钥本身无效
4. 需要重新部署才能生效

## 📋 设置环境变量步骤

### 步骤 1: 进入 Vercel Dashboard

1. 访问: https://vercel.com
2. 登录你的账号
3. 进入你的项目（sacnwhat）

### 步骤 2: 添加环境变量

1. 点击 **"Settings"** 标签
2. 点击左侧菜单的 **"Environment Variables"**
3. 点击 **"Add New"** 按钮

### 步骤 3: 填写环境变量

**选项 A: 使用 DeepSeek API**
- **Name**: `DEEPSEEK_API_KEY`
- **Value**: 你的 DeepSeek API 密钥
- **Environment**: 选择所有（Production, Preview, Development）

**选项 B: 使用 Google Gemini API**
- **Name**: `GEMINI_API_KEY`
- **Value**: 你的 Gemini API 密钥
- **Environment**: 选择所有（Production, Preview, Development）

### 步骤 4: 保存并重新部署

1. 点击 **"Save"**
2. **重要**: 环境变量修改后需要重新部署才能生效
3. 点击 **"Deployments"** 标签
4. 找到最新的部署，点击 **"..."** → **"Redeploy"**
5. 或者推送新的代码触发自动部署

## 🔍 验证环境变量

### 方法 1: 查看 Functions 日志

1. 在 Vercel Dashboard → **Functions** 标签
2. 找到 `/api/ocr` 函数
3. 查看日志，应该看到：
   ```
   Environment check: {
     hasDEEPSEEK: true/false,
     hasGEMINI: true/false,
     hasApiKey: true/false
   }
   ```

### 方法 2: 测试 API

在浏览器 Console 中运行：

```javascript
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

## ⚠️ 常见问题

### 问题 1: 环境变量已设置但仍然报错

**原因**: 环境变量修改后需要重新部署

**解决**:
1. 确认环境变量已保存
2. **重新部署项目**（重要！）
3. 等待部署完成后再测试

### 问题 2: 不知道使用哪个环境变量名

**检查**:
- 如果使用 DeepSeek API → 使用 `DEEPSEEK_API_KEY`
- 如果使用 Google Gemini API → 使用 `GEMINI_API_KEY`
- 代码会优先使用 `DEEPSEEK_API_KEY`，如果没有则使用 `GEMINI_API_KEY`

### 问题 3: API 密钥无效

**检查**:
1. 确认 API 密钥是否正确复制（没有多余空格）
2. 确认 API 密钥是否还有效
3. 确认 API 密钥是否有足够的额度

## 📝 检查清单

- [ ] 在 Vercel Dashboard 中设置了环境变量
- [ ] 环境变量名称正确（`DEEPSEEK_API_KEY` 或 `GEMINI_API_KEY`）
- [ ] 环境变量值正确（API 密钥）
- [ ] 选择了所有环境（Production, Preview, Development）
- [ ] **已重新部署项目**（重要！）
- [ ] 等待部署完成
- [ ] 测试 API 功能

## 🔄 重新部署方法

### 方法 1: 手动重新部署

1. Vercel Dashboard → **Deployments**
2. 找到最新部署
3. 点击 **"..."** → **"Redeploy"**
4. 等待完成

### 方法 2: 推送代码触发

```bash
# 做一个小的更改（比如添加注释）
git commit --allow-empty -m "Trigger redeploy for environment variables"
git push
```

## 💡 提示

- 环境变量修改后**必须重新部署**才能生效
- 可以在 Functions 日志中查看环境变量是否正确加载
- 如果还是不行，检查 API 密钥本身是否有效


