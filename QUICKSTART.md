# 快速开始 (Quick Start)

## 🚀 立即开始调试

### 步骤 1: 安装依赖

```bash
npm install
```

### 步骤 2: 设置环境变量

创建 `.env` 文件（复制 `env.example`）:

```bash
cp env.example .env
```

编辑 `.env` 文件，填入你的 API 密钥:

```
DEEPSEEK_API_KEY=your_actual_api_key_here
```

或者使用 Gemini API:

```
GEMINI_API_KEY=your_actual_api_key_here
```

### 步骤 3: 启动开发服务器

**选项 A: 仅前端 (快速，但 Functions 需要部署才能测试)**
```bash
npm run dev
```
打开 http://localhost:3000

**选项 B: 完整本地环境 (推荐，可以测试 Functions)**
```bash
npm run dev:netlify
```
打开显示的 URL (通常是 http://localhost:8888)

### 步骤 4: 在 Cursor 中调试

1. **打开文件**: 在 Cursor 中打开 `App.tsx` 或 `netlify/functions/ocr.ts`
2. **设置断点**: 点击行号左侧设置断点
3. **开始调试**: 
   - 按 `F5` 
   - 或点击左侧调试图标
   - 选择 "Debug Vite Dev Server" 或 "Debug Netlify Functions"
4. **触发断点**: 在浏览器中操作应用，断点会自动触发

## 📝 调试技巧

### 查看日志

- **前端日志**: 打开浏览器开发者工具 (F12) → Console
- **Functions 日志**: 查看 Cursor 的 Debug Console 或终端输出

### 测试 API

在浏览器 Console 中测试:

```javascript
// 测试 OCR Function
fetch('/.netlify/functions/ocr', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    base64Image: 'your_base64_string',
    mimeType: 'image/jpeg'
  })
})
.then(r => r.json())
.then(console.log)
```

### 常见问题

**Q: Function 返回 500 错误**
- ✅ 检查 `.env` 文件是否存在
- ✅ 确认 API 密钥已正确设置
- ✅ 查看终端中的错误日志

**Q: CORS 错误**
- ✅ 确保使用 `npm run dev:netlify` 而不是 `npm run dev`
- ✅ 检查 `ocr.ts` 中的 CORS headers

**Q: 断点不触发**
- ✅ 确认选择了正确的调试配置
- ✅ 检查代码是否已保存
- ✅ 尝试重新启动调试会话

## 📚 更多信息

- 详细调试指南: 查看 `DEBUG.md`
- 部署说明: 查看 `README.md` 和 `DEPLOYMENT.md`

## 🎯 下一步

1. ✅ 安装依赖
2. ✅ 设置环境变量
3. ✅ 启动开发服务器
4. ✅ 设置断点并开始调试
5. ✅ 测试功能

Happy Debugging! 🎉

