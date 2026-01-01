# 🚀 Vercel 快速部署指南

## 📋 5 步完成部署

### 步骤 1: 创建 Vercel 账号

1. 访问: https://vercel.com
2. 点击 **"Sign Up"**
3. 选择 **"Continue with GitHub"**（推荐）

### 步骤 2: 导入项目

1. 登录后，点击 **"Add New..."** → **"Project"**
2. 点击 **"Import Git Repository"**
3. 找到 `sacnwhat` 仓库，点击 **"Import"**

### 步骤 3: 配置项目（通常自动检测）

Vercel 会自动检测到 Vite 项目，确认以下设置：

- **Framework Preset**: Vite ✅
- **Root Directory**: `./` ✅
- **Build Command**: `npm run build` ✅
- **Output Directory**: `dist` ✅

直接点击 **"Deploy"** 即可！

### 步骤 4: 设置环境变量（重要！）

部署前或部署后，在项目设置中添加环境变量：

1. 在项目页面，点击 **"Settings"**
2. 点击 **"Environment Variables"**
3. 添加变量：
   - **Name**: `DEEPSEEK_API_KEY` (或 `GEMINI_API_KEY`)
   - **Value**: 你的 API 密钥
   - **Environment**: 选择所有（Production, Preview, Development）
4. 点击 **"Save"**

### 步骤 5: 等待部署完成

- 构建通常需要 1-3 分钟
- 部署完成后会显示你的网站 URL
- 格式: `https://your-project-name.vercel.app`

## ✅ 已完成的配置

我已经为你创建了：

1. ✅ `vercel.json` - Vercel 配置文件
2. ✅ `api/ocr.ts` - Vercel Serverless Function（替代 Netlify Functions）
3. ✅ 更新了 `services/geminiService.ts` - 自动检测平台
4. ✅ 更新了 `vite.config.ts` - 适配 Vercel

## 🧪 测试部署

部署完成后：

1. **访问网站** - 打开 Vercel 提供的 URL
2. **测试 OCR** - 上传图片，点击 "Extract Text"
3. **检查日志** - 在 Vercel Dashboard → Functions 查看日志

## 🔄 自动部署

连接 GitHub 后：
- ✅ 每次推送到 `main` 分支 → 自动部署生产环境
- ✅ 每次创建 PR → 自动创建预览环境

## 🐛 如果遇到问题

### 构建失败
- 查看构建日志
- 确认 Node.js 版本（Vercel 自动使用 18+）

### OCR 不工作
- 检查环境变量是否设置
- 查看 Functions 日志
- 确认 API 密钥有效

## 📚 详细文档

查看 `VERCEL-DEPLOYMENT.md` 获取更详细的说明。


