# 🚀 启动服务器指南

## 问题：localhost:8888 无法打开

### 原因
Netlify Dev 服务器没有启动。

### 解决方案

#### 方法 1: 启动 Netlify Dev（推荐，包含 Functions）

1. **确保依赖已安装**
   ```bash
   npm install
   ```

2. **启动 Netlify Dev**
   ```bash
   npm run dev:netlify
   ```

3. **等待启动完成**
   - 你会看到类似这样的输出：
     ```
     ◈ Netlify Dev ◈
     ◈ Server now ready on http://localhost:8888
     ```

4. **打开浏览器**
   - 访问: http://localhost:8888

#### 方法 2: 仅启动前端（快速测试 UI）

如果不需要测试 OCR API，可以只启动前端：

1. **启动 Vite 开发服务器**
   ```bash
   npm run dev
   ```

2. **打开浏览器**
   - 访问: http://localhost:3000

**注意**: 这种方式无法测试 OCR 功能，因为 Functions 不会运行。

## 🔧 常见问题排查

### 问题 1: 端口被占用

如果 8888 端口被占用，Netlify Dev 会自动使用其他端口（如 8889）。

**解决**: 查看终端输出，使用实际显示的端口。

### 问题 2: 命令不存在

如果提示 `netlify: command not found`:

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 或者使用项目本地版本
npx netlify dev
```

### 问题 3: 依赖未安装

```bash
npm install
```

### 问题 4: 环境变量未设置

创建 `.env` 文件（在项目根目录）:

```bash
# 复制示例文件
cp env.example .env

# 编辑 .env 文件，添加你的 API 密钥
DEEPSEEK_API_KEY=your_key_here
# 或
GEMINI_API_KEY=your_key_here
```

## 📋 启动检查清单

- [ ] 已安装 Node.js (18+)
- [ ] 已运行 `npm install`
- [ ] 已创建 `.env` 文件（如果需要测试 OCR）
- [ ] 已运行 `npm run dev:netlify`
- [ ] 终端显示服务器已启动
- [ ] 浏览器可以访问显示的 URL

## 🎯 快速启动命令

```bash
# 1. 安装依赖（首次运行）
npm install

# 2. 启动服务器
npm run dev:netlify

# 3. 打开浏览器访问显示的 URL
```

## 💡 提示

- **开发模式**: 使用 `npm run dev` (端口 3000) - 仅前端
- **完整功能**: 使用 `npm run dev:netlify` (端口 8888) - 包含 Functions
- **查看日志**: 所有操作都会在终端显示
- **停止服务器**: 按 `Ctrl + C`

## 🐛 如果还是无法打开

1. **检查防火墙设置**
2. **检查是否有其他程序占用端口**
3. **查看终端错误信息**
4. **尝试使用其他端口**:
   ```bash
   netlify dev --port 3001
   ```

