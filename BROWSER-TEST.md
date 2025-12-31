# 🌐 浏览器测试指南

## 快速开始

### 方法 1: 直接打开 HTML 文件 (最简单)

1. **打开文件**
   - 在文件浏览器中找到 `test-browser.html`
   - 双击打开（会在默认浏览器中打开）

2. **配置 API 端点**
   - 如果使用本地开发，将端点改为: `http://localhost:8888/.netlify/functions/ocr`
   - 如果使用生产环境，保持默认: `/.netlify/functions/ocr`

3. **测试**
   - 选择一张图片
   - 点击"开始测试 OCR"
   - 查看结果

### 方法 2: 使用测试服务器 (推荐)

1. **启动测试服务器**
   ```bash
   npm run test:browser
   ```

2. **打开浏览器**
   - 访问: http://localhost:3001/test-browser.html

3. **测试功能**
   - 上传图片
   - 查看提取的文本
   - 检查浏览器 Console (F12) 查看详细日志

### 方法 3: 使用 Netlify Dev (完整功能)

1. **启动 Netlify Dev**
   ```bash
   npm run dev:netlify
   ```

2. **打开测试页面**
   - 访问: http://localhost:8888/test-browser.html
   - 或者直接打开文件，将端点设置为: `http://localhost:8888/.netlify/functions/ocr`

3. **测试**
   - 选择图片
   - 点击测试按钮
   - 查看结果

## 功能说明

### 📸 上传图片
- 支持所有常见图片格式 (JPG, PNG, GIF, WebP 等)
- 可以拍照（移动设备）
- 实时预览

### ⚙️ 配置选项
- **API 端点**: 可以自定义 Function URL
- **测试模式**: 
  - 本地开发: `http://localhost:8888/.netlify/functions/ocr`
  - 生产环境: `/.netlify/functions/ocr`

### 📊 测试结果
- **提取的文本**: 可编辑的文本区域
- **处理时间**: API 调用耗时
- **文本长度**: 提取的字符数
- **复制功能**: 一键复制文本

### 🔍 调试信息
- 打开浏览器 Console (F12) 查看详细日志
- 包括:
  - 图片信息
  - API 调用状态
  - 响应时间
  - 错误详情

## 使用场景

### 场景 1: 快速测试 API
1. 打开 `test-browser.html`
2. 选择测试图片
3. 修改 API 端点为你的 Function URL
4. 点击测试
5. 查看结果

### 场景 2: 本地开发调试
1. 运行 `npm run dev:netlify`
2. 打开 `test-browser.html`
3. 设置端点为 `http://localhost:8888/.netlify/functions/ocr`
4. 测试并查看 Console 日志

### 场景 3: 生产环境测试
1. 部署到 Netlify
2. 打开 `https://your-site.netlify.app/test-browser.html`
3. 使用默认端点测试

## 常见问题

### Q: CORS 错误
**A**: 确保使用正确的端点:
- 本地开发: `http://localhost:8888/.netlify/functions/ocr`
- 生产环境: `/.netlify/functions/ocr`

### Q: 404 错误
**A**: 
- 检查 Function 是否已部署
- 确认端点 URL 正确
- 查看 Netlify Functions 日志

### Q: API 密钥错误
**A**: 
- 确保在 Netlify 环境变量中设置了 `DEEPSEEK_API_KEY` 或 `GEMINI_API_KEY`
- 本地开发时，确保 `.env` 文件存在

### Q: 图片太大
**A**: 
- 测试页面会自动处理 base64 编码
- 如果图片太大，建议先压缩
- 查看 Console 了解图片大小

## 调试技巧

### 查看网络请求
1. 打开浏览器开发者工具 (F12)
2. 切换到 Network 标签
3. 点击测试按钮
4. 查看 `/ocr` 请求的详情

### 查看 Console 日志
- 所有操作都会在 Console 中记录
- 包括图片信息、API 调用、响应时间等

### 测试不同的图片
- 尝试不同类型的图片:
  - 手写文字
  - 打印文档
  - 截图
  - 照片

## 下一步

- 查看 `DEBUG.md` 了解详细调试方法
- 查看 `TEST.md` 了解命令行测试
- 查看 `README.md` 了解完整项目说明

