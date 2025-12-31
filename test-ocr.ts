/**
 * 测试 OCR Function 的脚本
 * 可以在 Cursor 中直接运行来测试 OCR 功能
 * 
 * 使用方法:
 * 1. 确保已安装依赖: npm install
 * 2. 设置环境变量: 创建 .env 文件并添加 DEEPSEEK_API_KEY 或 GEMINI_API_KEY
 * 3. 运行: npx tsx test-ocr.ts
 * 或者在 Cursor 中右键选择 "Run Code"
 */

import { readFileSync } from 'fs';
import { join } from 'path';

// 模拟 Netlify Function 的 event 对象
interface MockEvent {
  httpMethod: string;
  body: string | null;
}

// 模拟 handler 函数（从 ocr.ts 复制核心逻辑）
async function testOCRFunction(base64Image: string, mimeType: string) {
  // 从环境变量获取 API 密钥
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('API key not configured. Set DEEPSEEK_API_KEY or GEMINI_API_KEY in environment variables.');
  }

  console.log('🔑 API Key exists:', !!apiKey);
  console.log('📝 MIME Type:', mimeType);
  console.log('📏 Base64 length:', base64Image.length);
  console.log('🚀 Calling OCR API...\n');

  // 调用 OCR API
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: 'Convert the document in the image to markdown, preserving the original text and structure as accurately as possible.',
          },
        ],
      }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API call failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  
  // 提取文本
  let extractedText = '';
  if (data.candidates && data.candidates[0] && data.candidates[0].content) {
    extractedText = data.candidates[0].content.parts
      .map((part: any) => part.text || '')
      .join('');
  }

  // 移除不需要的前缀
  const unwantedPrefixRegex = /^(Based on the image provided, here is the text converted (to|into) Markdown( format)?:?|以下是图片中内容的文字转写：)\s*/i;
  extractedText = extractedText.replace(unwantedPrefixRegex, '');

  return extractedText;
}

// 主测试函数
async function main() {
  console.log('🧪 OCR Function 测试\n');
  console.log('='.repeat(50));

  // 检查环境变量
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ 错误: 未找到 API 密钥');
    console.log('\n请创建 .env 文件并添加以下内容之一:');
    console.log('  DEEPSEEK_API_KEY=your_key_here');
    console.log('  或');
    console.log('  GEMINI_API_KEY=your_key_here');
    console.log('\n或者直接在终端设置:');
    console.log('  export DEEPSEEK_API_KEY=your_key_here');
    process.exit(1);
  }

  // 检查是否有测试图片
  const testImagePath = process.argv[2];
  
  if (!testImagePath) {
    console.log('📋 使用方法:');
    console.log('  npx tsx test-ocr.ts <图片路径>');
    console.log('\n示例:');
    console.log('  npx tsx test-ocr.ts ./test-image.jpg');
    console.log('\n或者提供一个 base64 字符串作为第二个参数:');
    console.log('  npx tsx test-ocr.ts base64 <base64_string>');
    process.exit(1);
  }

  try {
    let base64Image: string;
    let mimeType: string;

    if (process.argv[2] === 'base64' && process.argv[3]) {
      // 直接使用提供的 base64 字符串
      base64Image = process.argv[3];
      mimeType = 'image/jpeg'; // 默认，可以根据需要修改
      console.log('📸 使用提供的 base64 字符串\n');
    } else {
      // 读取图片文件
      const imagePath = join(process.cwd(), testImagePath);
      console.log('📸 读取图片:', imagePath);
      
      const imageBuffer = readFileSync(imagePath);
      base64Image = imageBuffer.toString('base64');
      
      // 根据文件扩展名确定 MIME 类型
      const ext = testImagePath.toLowerCase().split('.').pop();
      const mimeTypes: Record<string, string> = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp',
      };
      mimeType = mimeTypes[ext || ''] || 'image/jpeg';
    }

    console.log('⏳ 正在处理...\n');
    
    const startTime = Date.now();
    const result = await testOCRFunction(base64Image, mimeType);
    const duration = Date.now() - startTime;

    console.log('='.repeat(50));
    console.log('✅ 成功!\n');
    console.log('⏱️  耗时:', duration, 'ms');
    console.log('📝 提取的文本:');
    console.log('-'.repeat(50));
    console.log(result);
    console.log('-'.repeat(50));
    console.log('\n✨ 测试完成!');

  } catch (error: any) {
    console.error('\n❌ 测试失败:');
    console.error(error.message);
    if (error.stack) {
      console.error('\n堆栈跟踪:');
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// 运行测试
main();

