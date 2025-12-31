# 调试指南 (Debug Guide)

## 本地调试设置

### 方法 1: 仅前端调试 (推荐用于快速开发)

只运行前端，Functions 需要部署到 Netlify 才能测试：

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 打开浏览器
# http://localhost:3000
```

**注意**: 这种方式下，Netlify Functions 不会在本地运行，需要部署到 Netlify 才能测试 OCR 功能。

### 方法 2: 完整本地调试 (推荐用于测试 Functions)

使用 Netlify Dev 在本地运行整个应用，包括 Functions：

```bash
# 1. 安装 Netlify CLI (如果还没有)
npm install -g netlify-cli
# 或者使用项目本地版本
npm install

# 2. 创建 .env 文件 (在项目根目录)
# 添加你的 API 密钥:
DEEPSEEK_API_KEY=your_key_here
# 或者
GEMINI_API_KEY=your_key_here

# 3. 启动 Netlify Dev
npm run dev:netlify

# 4. 打开浏览器
# Netlify Dev 会显示本地 URL，通常是 http://localhost:8888
```

**优势**:
- ✅ 可以在本地测试 Netlify Functions
- ✅ 支持热重载
- ✅ 可以设置断点调试
- ✅ 环境变量从 `.env` 文件读取

## 在 Cursor/VS Code 中调试

### 调试前端代码

1. 打开 `App.tsx` 或任何 React 组件
2. 设置断点 (点击行号左侧)
3. 按 `F5` 或点击 "Run and Debug"
4. 选择 "Debug Vite Dev Server"
5. 在浏览器中操作，断点会触发

### 调试 Netlify Functions

1. 打开 `netlify/functions/ocr.ts`
2. 设置断点
3. 按 `F5` 或点击 "Run and Debug"
4. 选择 "Debug Netlify Functions (with Netlify Dev)"
5. 在前端触发 OCR 请求，断点会触发

## 调试技巧

### 1. 查看 Console 日志

**前端日志**:
- 打开浏览器开发者工具 (F12)
- 查看 Console 标签
- 查看 Network 标签了解 API 调用

**Functions 日志**:
- 在终端中查看 Netlify Dev 的输出
- 或者在 Cursor 的 Debug Console 中查看

### 2. 测试 API 调用

使用 curl 或 Postman 测试 Function:

```bash
# 测试 OCR Function
curl -X POST http://localhost:8888/.netlify/functions/ocr \
  -H "Content-Type: application/json" \
  -d '{
    "base64Image": "your_base64_string_here",
    "mimeType": "image/jpeg"
  }'
```

### 3. 检查环境变量

在 `ocr.ts` 中添加日志:

```typescript
console.log('API Key exists:', !!apiKey);
console.log('Request body:', { base64Image: base64Image?.substring(0, 50) + '...', mimeType });
```

### 4. 常见问题排查

**问题**: Function 返回 500 错误
- ✅ 检查 `.env` 文件是否存在且包含 API 密钥
- ✅ 检查 API 密钥是否正确
- ✅ 查看终端中的错误日志

**问题**: CORS 错误
- ✅ 确保 Function 返回正确的 CORS headers
- ✅ 检查 `ocr.ts` 中的 headers 配置

**问题**: 图片上传失败
- ✅ 检查图片大小 (建议压缩)
- ✅ 检查 base64 编码是否正确
- ✅ 查看浏览器 Network 标签中的请求详情

## 调试 Checklist

- [ ] 环境变量已设置 (`.env` 文件)
- [ ] 依赖已安装 (`npm install`)
- [ ] Netlify CLI 已安装 (`npm install -g netlify-cli` 或使用项目版本)
- [ ] 断点已设置
- [ ] 浏览器开发者工具已打开
- [ ] 终端日志可见

## 有用的命令

```bash
# 查看 Netlify Functions 日志
netlify functions:list

# 本地测试单个 Function
netlify functions:invoke ocr

# 查看环境变量
netlify env:list

# 构建项目
npm run build

# 预览构建结果
npm run preview
```

## 调试示例

### 在 `ocr.ts` 中添加详细日志:

```typescript
export const handler: Handler = async (event, context) => {
  console.log('=== OCR Function Called ===');
  console.log('Method:', event.httpMethod);
  console.log('Body length:', event.body?.length);
  
  try {
    const { base64Image, mimeType } = JSON.parse(event.body || '{}');
    console.log('MIME Type:', mimeType);
    console.log('Base64 length:', base64Image?.length);
    
    // ... rest of the code
  } catch (error) {
    console.error('Error details:', error);
    throw error;
  }
};
```

### 在 `App.tsx` 中添加错误处理:

```typescript
try {
  const resultText = await extractTextFromImage(pureBase64, mimeType);
  console.log('Extracted text length:', resultText.length);
} catch (err) {
  console.error('Extraction error:', err);
  console.error('Error details:', {
    message: err.message,
    stack: err.stack
  });
}
```

## 下一步

如果遇到问题:
1. 检查终端日志
2. 检查浏览器 Console
3. 检查 Network 请求
4. 验证环境变量
5. 查看 Netlify Functions 文档: https://docs.netlify.com/functions/overview/

