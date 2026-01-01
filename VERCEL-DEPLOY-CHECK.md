# Vercel 部署检查清单

## 🚨 当前问题

1. `/api/ocr` 返回 404 - Vercel 可能还没有部署新代码
2. `gemini-pro` 模型不可用 - 已从代码中移除

## ✅ 立即检查步骤

### 1. 检查 Vercel 部署状态

1. **进入 Vercel Dashboard**
   - 访问 https://vercel.com
   - 登录你的账号
   - 进入项目 `sacnwhat` 或 `scanwhat`

2. **查看部署状态**
   - 点击 **"Deployments"** 标签
   - 查看最新部署：
     - ✅ 状态应该是 "Ready"（绿色）
     - ✅ 部署时间应该是最新的（刚刚推送代码后）
     - ❌ 如果状态是 "Building" 或 "Error"，需要等待或修复

3. **检查构建日志**
   - 点击最新部署
   - 查看构建日志
   - 确认没有错误

### 2. 检查 Functions

1. **进入 Functions 页面**
   - Vercel Dashboard → **"Functions"** 标签
   - 应该能看到 `/api/ocr` 函数

2. **如果看不到 `/api/ocr`**
   - 说明部署有问题
   - 需要重新部署

### 3. 手动触发重新部署

如果最新部署不是刚刚推送的代码：

1. **方法 1: 手动重新部署**
   - Vercel Dashboard → **Deployments**
   - 找到最新部署
   - 点击 **"..."** → **"Redeploy"**
   - 等待部署完成（1-2 分钟）

2. **方法 2: 推送空提交**
   ```bash
   git commit --allow-empty -m "Trigger Vercel redeploy"
   git push
   ```

### 4. 验证 API 路由

部署完成后，在浏览器 Console 中测试：

```javascript
fetch('/api/ocr', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    base64Image: 'test',
    mimeType: 'image/jpeg'
  })
})
.then(r => {
  console.log('Status:', r.status);
  console.log('URL:', r.url);
  return r.json();
})
.then(console.log)
.catch(console.error)
```

**预期结果**：
- ✅ 如果返回 200 或 400：说明 API 路由正常
- ❌ 如果返回 404：说明需要重新部署或检查路由配置

## 🔍 故障排除

### 问题 1: API 返回 404

**可能原因**：
1. Vercel 还没有部署新代码
2. 文件路径不正确
3. Vercel 配置问题

**解决**：
1. 确认 `api/ocr.ts` 文件存在
2. 确认文件在项目根目录的 `api/` 文件夹中
3. 手动触发重新部署
4. 等待部署完成

### 问题 2: 模型不可用错误

**已修复**：
- ✅ 移除了 `gemini-pro` 模型（在 v1beta 中不可用）
- ✅ 只使用 `gemini-1.5-flash` 和 `gemini-1.5-pro`
- ✅ 只使用 `v1beta` API

**验证**：
- 部署后，错误应该消失
- 应该能成功提取文字

### 问题 3: 部署一直失败

**检查**：
1. 查看构建日志中的错误信息
2. 确认 `package.json` 中的依赖正确
3. 确认 TypeScript 编译没有错误

## 📋 完整检查清单

- [ ] 代码已推送到 GitHub
- [ ] Vercel 已检测到新提交
- [ ] Vercel 部署成功（状态为 "Ready"）
- [ ] Functions 中能看到 `/api/ocr`
- [ ] 环境变量 `GEMINI_API_KEY` 已设置
- [ ] 清除浏览器缓存
- [ ] 测试 API 端点（不再返回 404）
- [ ] 上传图片测试 OCR（不再有模型错误）

## 🎯 预期结果

修复后，你应该能够：

1. ✅ API 端点 `/api/ocr` 不再返回 404
2. ✅ 不再出现 "models/gemini-pro is not found" 错误
3. ✅ 上传图片后能成功提取文字
4. ✅ Functions 日志显示使用 `v1beta/gemini-1.5-flash` 或 `v1beta/gemini-1.5-pro`

## ⏱️ 等待时间

- Vercel 自动部署：通常 1-2 分钟
- 手动重新部署：通常 1-2 分钟
- 部署完成后，清除浏览器缓存并刷新页面

## 🆘 如果问题仍然存在

1. **提供以下信息**：
   - Vercel 部署状态截图
   - Functions 列表截图
   - 浏览器 Console 的完整错误信息

2. **检查 Vercel 项目设置**：
   - Settings → General
   - 确认项目配置正确

3. **尝试重新连接 GitHub**：
   - Settings → Git
   - 断开并重新连接仓库

