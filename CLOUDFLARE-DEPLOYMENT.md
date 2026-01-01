# Cloudflare Pages 部署指南

## 部署步骤

### 1. 在 Cloudflare Dashboard 中创建项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Pages** 部分
3. 点击 **Create a project**
4. 选择 **Connect to Git**，连接你的 GitHub 仓库

### 2. 配置构建设置

在 Cloudflare Pages 项目设置中配置：

- **Framework preset**: `Vite`
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (项目根目录)

### 3. 配置环境变量

在 Cloudflare Pages 项目设置中，进入 **Settings** → **Environment variables**，添加：

- `GEMINI_API_KEY`: 你的 Google Gemini API 密钥
- 或者 `DEEPSEEK_API_KEY`: 你的 DeepSeek API 密钥（注意：DeepSeek 不支持图片 OCR，建议使用 Gemini）

### 4. 部署

Cloudflare Pages 会自动：
1. 检测到新的提交时触发构建
2. 构建完成后自动部署
3. 识别 `functions/` 目录中的 Pages Functions

## 项目结构

```
scanwhat/
├── functions/
│   └── api/
│       └── ocr.ts          # Cloudflare Pages Function (处理 /api/ocr)
├── dist/                   # 构建输出目录（自动生成）
├── wrangler.toml          # Cloudflare 配置文件
└── ...
```

## API 路由

Cloudflare Pages Functions 使用文件路径作为路由：
- `functions/api/ocr.ts` → 处理 `/api/ocr` 请求
- 支持 `onRequestPost` 处理 POST 请求
- 支持 `onRequestOptions` 处理 CORS preflight

## 注意事项

1. **环境变量**: 必须在 Cloudflare Pages Dashboard 中设置，不能直接在代码中使用
2. **Functions 目录**: Cloudflare Pages 会自动识别 `functions/` 目录
3. **CORS**: Functions 中已配置 CORS headers
4. **API 密钥**: 使用 `env.GEMINI_API_KEY` 或 `env.DEEPSEEK_API_KEY` 访问环境变量

## 故障排除

### 构建失败

如果构建失败，检查：
- Node.js 版本（Cloudflare 使用 Node.js 18+）
- 依赖安装是否成功
- 构建命令是否正确

### API 路由不工作

如果 `/api/ocr` 返回 404：
- 确认 `functions/api/ocr.ts` 文件存在
- 检查文件导出是否正确（`onRequestPost`, `onRequestOptions`）
- 查看 Cloudflare Pages 的 Functions 日志

### API 密钥错误

如果收到 API 密钥相关错误：
- 确认在 Cloudflare Pages Dashboard 中设置了环境变量
- 变量名必须完全匹配：`GEMINI_API_KEY` 或 `DEEPSEEK_API_KEY`
- 重新部署以应用环境变量更改

## 本地开发

使用 Cloudflare Pages 本地开发：

```bash
# 安装 Wrangler CLI
npm install -g wrangler

# 启动本地开发服务器
npx wrangler pages dev dist --functions functions
```

## 与 Vercel/Netlify 的区别

- **Vercel**: 使用 `api/` 目录，导出默认函数
- **Netlify**: 使用 `netlify/functions/` 目录，导出 `handler` 函数
- **Cloudflare Pages**: 使用 `functions/` 目录，导出 `onRequest*` 函数

代码已自动适配所有平台，前端会自动检测平台并使用正确的 API 路径。

