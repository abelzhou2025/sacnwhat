# Cloudflare Pages 手动上传部署指南

## 🚨 当前情况

你看到了 "Upload and deploy" 页面，这是 Cloudflare Pages 的手动上传选项。虽然可以这样做，但**不是最佳实践**，因为：
- ❌ 需要每次手动构建和上传
- ❌ 无法自动部署（Git 提交不会触发部署）
- ❌ 无法使用 Pages Functions（`functions/` 目录）

## ✅ 手动上传部署步骤

### 步骤 1: 本地构建项目

在你的本地项目目录中：

```bash
# 确保在项目根目录
cd /Users/abel/Desktop/scanwhat

# 安装依赖（如果还没安装）
npm install

# 构建项目
npm run build
```

构建成功后，会生成 `dist/` 目录，包含：
- `index.html`
- `assets/` 目录（包含编译后的 JS 和 CSS）

### 步骤 2: 上传 dist 目录

1. **在 Cloudflare 的 "Upload and deploy" 页面**
2. **拖拽 `dist` 文件夹**到上传区域
   - 或者点击上传区域，选择 `dist` 文件夹
3. **等待上传完成**

### 步骤 3: 配置项目设置

上传后，Cloudflare 会显示项目配置页面：

- **Project name**: `scanwhat`（或你喜欢的名称）
- **其他设置**: 通常可以保持默认

### 步骤 4: 部署

1. 点击 **"Deploy"** 或 **"Save and Deploy"**
2. Cloudflare 会自动部署你的文件
3. 你会获得一个 `.pages.dev` 域名

## ⚠️ 重要限制

### 手动上传的限制：

1. **无法使用 Pages Functions**
   - `functions/api/ocr.ts` 不会工作
   - API 路由 `/api/ocr` 无法使用
   - 需要其他方式处理 API 调用

2. **无法自动部署**
   - 每次代码更新都需要：
     - 本地构建
     - 手动上传
     - 重新部署

3. **环境变量设置**
   - 虽然可以设置环境变量
   - 但 Functions 无法使用（因为没有 Functions）

## 🔧 替代方案：使用 Vercel 或 Netlify

由于 Cloudflare Pages 的创建过程比较复杂，建议使用已经配置好的平台：

### 选项 1: 使用 Vercel（推荐）

你的项目已经配置好 Vercel：

1. **访问** https://vercel.com/
2. **登录**（使用 GitHub 账户）
3. **导入项目**
   - 选择 `abelzhou2025/sacnwhat` 仓库
   - Vercel 会自动检测配置
4. **设置环境变量**
   - 添加 `GEMINI_API_KEY`
5. **部署**
   - Vercel 会自动部署
   - 获得 `.vercel.app` 域名

**优势**：
- ✅ 自动部署（Git 提交触发）
- ✅ 支持 API 路由（`api/ocr.ts`）
- ✅ 环境变量支持
- ✅ 简单易用

### 选项 2: 使用 Netlify

你的项目也已经配置好 Netlify：

1. **访问** https://www.netlify.com/
2. **登录**（使用 GitHub 账户）
3. **导入项目**
   - 选择 `abelzhou2025/sacnwhat` 仓库
   - Netlify 会自动检测 `netlify.toml` 配置
4. **设置环境变量**
   - 添加 `GEMINI_API_KEY`
5. **部署**
   - Netlify 会自动部署
   - 获得 `.netlify.app` 域名

**优势**：
- ✅ 自动部署（Git 提交触发）
- ✅ 支持 Netlify Functions（`netlify/functions/ocr.ts`）
- ✅ 环境变量支持
- ✅ 简单易用

## 📋 手动上传 vs Git 连接对比

| 特性 | 手动上传 | Git 连接 |
|------|---------|---------|
| 自动部署 | ❌ | ✅ |
| Pages Functions | ❌ | ✅ |
| 环境变量 | ✅ | ✅ |
| 更新流程 | 手动构建+上传 | 自动 |
| 适合场景 | 一次性部署 | 持续开发 |

## ✅ 推荐方案

### 最佳方案：使用 Vercel

1. **简单易用**：配置已经完成
2. **自动部署**：Git 提交自动触发
3. **API 支持**：`api/ocr.ts` 可以直接使用
4. **免费额度**：足够个人项目使用

### 如果必须使用 Cloudflare Pages

1. **尝试通过 Git 连接创建**
   - 选择 "Continue with GitHub"
   - 选择 `Vite` 作为 Framework preset
   - 确保看到 "Build output directory" 字段

2. **如果 Git 连接失败**
   - 使用手动上传作为临时方案
   - 但注意无法使用 Functions

## 🔑 环境变量设置（手动上传）

即使手动上传，也可以设置环境变量：

1. 进入项目 → **Settings** → **Environment variables**
2. 添加 `GEMINI_API_KEY`
3. **注意**：由于没有 Functions，环境变量可能无法在 API 中使用

## 📝 总结

- ✅ **可以**手动上传 `dist/` 目录部署
- ⚠️ **但**无法使用 Pages Functions（API 路由不工作）
- ⚠️ **需要**每次手动构建和上传
- 💡 **推荐**：使用 Vercel 或 Netlify（已配置好，更简单）

## 🚀 快速开始（Vercel）

如果你想快速部署，使用 Vercel：

1. 访问 https://vercel.com/
2. 点击 "Add New Project"
3. 选择 `abelzhou2025/sacnwhat` 仓库
4. 点击 "Deploy"
5. 在项目设置中添加 `GEMINI_API_KEY` 环境变量
6. 完成！网站会自动部署

Vercel 会自动：
- ✅ 检测 Vite 配置
- ✅ 运行 `npm run build`
- ✅ 部署到 `.vercel.app` 域名
- ✅ 支持 `api/ocr.ts` API 路由

