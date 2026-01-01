# Cloudflare Pages 创建指南（更新版）

## 🚨 当前情况

Cloudflare 的界面已经更新，**不再明确显示 "Pages" vs "Workers" 的选择**。当你点击 "Create application" 时，会看到 "Ship something new" 页面，有以下几个选项：

- Continue with GitHub
- Connect GitLab
- Start with Hello World!
- Select a template
- Upload your static files

## ✅ 正确的创建步骤

### 步骤 1: 选择 "Continue with GitHub"

1. 点击 **"Continue with GitHub"** 按钮（左上角，有绿色圆点）
2. 这会打开 GitHub 授权页面
3. 授权 Cloudflare 访问你的 GitHub 仓库

### 步骤 2: 选择仓库

授权后，你会看到你的 GitHub 仓库列表：

1. 找到并选择 **`abelzhou2025/sacnwhat`** 仓库
2. 点击仓库名称

### 步骤 3: 配置构建设置（关键步骤）

选择仓库后，Cloudflare 会显示配置页面。**这里的关键是配置正确的设置，让 Cloudflare 识别为 Pages 项目**。

#### 项目名称
- **Project name**: `scanwhat`（或你喜欢的名称）

#### 构建设置（重要！）

**关键点**：如果你看到 **"Build output directory"** 字段，说明这是 Pages 项目配置页面。

配置如下：

- **Framework preset**: 选择 `Vite` 或 `None`
- **Build command**: `npm run build`
- **Build output directory**: `dist` ← **这个字段必须在！**
- **Root directory**: `/` (留空)

#### 分支设置
- **Production branch**: `main`
- **Builds for non-production branches**: 可以启用（用于预览）

### 步骤 4: 如果看到 Workers 配置页面

如果你选择的配置导致显示 Workers 配置页面（有 "Deploy command" 字段，没有 "Build output directory" 字段）：

1. **检查 Framework preset**
   - 尝试选择 `Vite` 或 `None`
   - 不要选择 Workers 相关的框架

2. **检查仓库内容**
   - 确保仓库有 `package.json` 和 `vite.config.ts`
   - 这有助于 Cloudflare 识别为前端项目

3. **如果仍然显示 Workers 配置**
   - 取消创建
   - 重新选择仓库
   - 尝试不同的 Framework preset

## 🔍 如何区分 Pages 和 Workers 配置页面

### Pages 项目配置页面特征：
- ✅ 有 **"Build output directory"** 字段（最重要！）
- ✅ 有 "Build command" 字段
- ✅ **没有** "Deploy command" 字段（或字段可选）
- ✅ **没有** "Path" 字段
- ✅ **没有** "Non-production branch deploy command" 字段

### Workers 项目配置页面特征：
- ❌ **没有** "Build output directory" 字段
- ❌ 有 "Deploy command" 字段（值为 `npx wrangler deploy`）
- ❌ 有 "Non-production branch deploy command" 字段
- ❌ 有 "Path" 字段
- ❌ 标题可能包含 "Worker"

## 📋 完整配置检查清单

创建项目时，确保配置页面显示：

- ✅ **有 "Build output directory" 字段** ← 最重要！
- ✅ Framework preset: `Vite` 或 `None`
- ✅ Build command: `npm run build`
- ✅ Build output directory: `dist`
- ✅ Root directory: `/` (留空)
- ✅ Production branch: `main`
- ❌ **没有** "Deploy command" 字段（或字段可选）
- ❌ **没有** "Path" 字段

## 🐛 如果看不到 "Build output directory" 字段

### 方法 1: 尝试不同的 Framework preset

1. 取消当前创建
2. 重新选择仓库
3. 尝试选择不同的 Framework preset：
   - `Vite`
   - `None`
   - `React`（如果有）
   - 避免选择 Workers 相关的框架

### 方法 2: 检查仓库结构

确保你的仓库包含：
- `package.json` - 包含构建脚本
- `vite.config.ts` - Vite 配置文件
- `index.html` - HTML 入口文件
- `dist/` - 构建输出目录（构建后生成）

### 方法 3: 手动指定为 Pages 项目

如果 Cloudflare 仍然识别为 Workers：

1. **先创建项目**（即使显示为 Workers）
2. **进入项目设置**
3. **检查是否可以转换为 Pages**
   - 在 Settings 中查找 "Convert to Pages" 选项
   - 或者删除项目，重新创建

### 方法 4: 使用 Cloudflare CLI

如果 Web 界面无法创建 Pages 项目，可以使用 CLI：

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录
wrangler login

# 创建 Pages 项目
wrangler pages project create scanwhat
```

然后连接 GitHub 仓库。

## ✅ 验证创建成功

创建 Pages 项目后，你应该看到：

1. ✅ 项目 URL 是 `.pages.dev` 格式（例如：`scanwhat-xxxxx.pages.dev`）
2. ✅ 设置页面有 **"Build output directory"** 字段
3. ✅ 部署成功后，网站显示 "ScanWhat" 应用（不是 "Hello world"）
4. ✅ 可以访问网站并测试功能

## 🔑 环境变量设置

创建 Pages 项目后，设置环境变量：

1. 进入项目 → **Settings** → **Environment variables**
2. 点击 **"Add variable"**
3. 添加：
   - **Variable name**: `GEMINI_API_KEY`
   - **Value**: 你的 Google Gemini API 密钥
   - **Environment**: 选择 **Production** 和 **Preview**
4. 点击 **Save**
5. **重要**：环境变量更改后需要重新部署才能生效

## 📝 重要提示

- Cloudflare 现在可能根据仓库内容和配置**自动判断**项目类型
- **关键标志**：如果配置页面有 **"Build output directory"** 字段，说明是 Pages 项目
- 如果配置页面有 **"Deploy command"** 字段但没有 "Build output directory"，说明是 Workers 项目
- 确保选择正确的 Framework preset（`Vite` 或 `None`）有助于识别为 Pages 项目

## 🆘 如果仍然无法创建 Pages 项目

1. **检查账户类型**
   - 确保你使用的是 Cloudflare 账户（不是 Workers 专用账户）
   - Pages 功能在大多数 Cloudflare 账户中都可用

2. **联系 Cloudflare 支持**
   - 如果确实无法创建 Pages 项目，可能需要联系支持

3. **使用其他平台**
   - 如果 Cloudflare Pages 无法正常工作，可以考虑：
     - **Vercel**（已配置好，可以直接使用）
     - **Netlify**（已配置好，可以直接使用）

