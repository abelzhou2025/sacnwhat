/**
 * 简单的测试服务器
 * 用于在浏览器中打开 test-browser.html 并测试 OCR 功能
 * 
 * 使用方法:
 *   node test-server.js
 *   或
 *   npm run test:browser
 * 
 * 然后在浏览器中打开 http://localhost:3001/test-browser.html
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './test-browser.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - File Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`, 'utf-8');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log('🚀 测试服务器已启动!');
  console.log(`📱 打开浏览器访问: http://localhost:${PORT}/test-browser.html`);
  console.log(`\n💡 提示:`);
  console.log(`   - 确保已设置环境变量 (DEEPSEEK_API_KEY 或 GEMINI_API_KEY)`);
  console.log(`   - 如果使用本地 Netlify Dev，请先运行: npm run dev:netlify`);
  console.log(`   - 然后在测试页面中选择"本地开发"模式`);
  console.log(`\n按 Ctrl+C 停止服务器\n`);
});

