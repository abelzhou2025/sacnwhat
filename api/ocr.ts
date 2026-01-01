// Vercel Serverless Function for OCR
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // 设置 CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理 OPTIONS 请求（CORS preflight）
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  // 只允许 POST 请求
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { base64Image, mimeType } = request.body;

    if (!base64Image || !mimeType) {
      return response.status(400).json({ 
        error: 'Missing base64Image or mimeType' 
      });
    }

    // 从环境变量获取 API 密钥
    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const apiKey = deepseekKey || geminiKey;
    const useDeepSeek = !!deepseekKey;
    
    // 调试日志（不记录实际密钥）
    console.log('Environment check:', {
      hasDEEPSEEK: !!deepseekKey,
      hasGEMINI: !!geminiKey,
      hasApiKey: !!apiKey,
      usingDeepSeek: useDeepSeek,
      envKeys: Object.keys(process.env).filter(k => k.includes('API') || k.includes('KEY'))
    });
    
    if (!apiKey) {
      console.error('API key not configured. Available env vars:', Object.keys(process.env).filter(k => k.includes('API') || k.includes('KEY')));
      return response.status(500).json({ 
        error: 'API key not configured. Please set DEEPSEEK_API_KEY or GEMINI_API_KEY in Vercel environment variables.' 
      });
    }

    // 根据使用的 API 选择不同的端点和请求格式
    if (useDeepSeek) {
      // DeepSeek API 目前不支持图片输入
      // 返回错误提示使用 Gemini API
      console.warn('DeepSeek API does not support image input. Recommend using Gemini API for OCR.');
      return response.status(400).json({ 
        error: 'DeepSeek API does not support image OCR. Please use GEMINI_API_KEY instead for OCR functionality. Set GEMINI_API_KEY in Vercel environment variables and remove DEEPSEEK_API_KEY.' 
      });
    }

    // Google Gemini API 配置
    // 只使用 v1beta API，只使用确认可用的模型
    // gemini-1.5-pro 在 v1beta 中不可用，已移除
    // gemini-2.0-flash-exp 是实验性模型，配额限制严格，已移除
    const modelConfigs = [
      { version: 'v1beta', model: 'gemini-1.5-flash' },
      { version: 'v1', model: 'gemini-1.5-flash' },           // Try v1 stable
      { version: 'v1beta', model: 'gemini-1.5-flash-latest' },
      { version: 'v1beta', model: 'gemini-1.5-flash-001' },
      { version: 'v1beta', model: 'gemini-1.5-pro' },
    ];

    const requestHeaders = {
      'Content-Type': 'application/json',
    };
    const requestBody = {
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
    };

    // 尝试每个模型配置，直到成功
    const errors: any[] = [];
    let lastError: any = null;
    
    for (const config of modelConfigs) {
      const apiUrl = `https://generativelanguage.googleapis.com/${config.version}/models/${config.model}:generateContent?key=${apiKey}`;
      
      try {
        console.log(`Trying model: ${config.version}/${config.model}`);
        const apiResponse = await fetch(apiUrl, {
          method: 'POST',
          headers: requestHeaders,
          body: JSON.stringify(requestBody),
        });

        if (apiResponse.ok) {
          // 成功，使用这个响应
          const data = await apiResponse.json();
          
          let extractedText = '';
          if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            extractedText = data.candidates[0].content.parts
              .map((part: any) => part.text || '')
              .join('');
          }

          // 移除不需要的前缀
          const unwantedPrefixRegex = /^(Based on the image provided, here is the text converted (to|into) Markdown( format)?:?|以下是图片中内容的文字转写：)\s*/i;
          extractedText = extractedText.replace(unwantedPrefixRegex, '');

          console.log(`Success with model: ${config.version}/${config.model}`);
          return response.status(200).json({ text: extractedText });
        } else {
          // 记录错误，继续尝试下一个模型
          const errorText = await apiResponse.text();
          console.warn(`Model ${config.version}/${config.model} failed:`, errorText);
          
          let errorJson;
          try {
             errorJson = JSON.parse(errorText);
          } catch (e) {
             errorJson = { message: errorText };
          }

          const errorInfo = {
            model: `${config.version}/${config.model}`,
            status: apiResponse.status,
            error: errorJson
          };
          errors.push(errorInfo);
          lastError = errorInfo;
          // 继续尝试下一个模型
          continue;
        }
      } catch (error: any) {
        console.warn(`Model ${config.version}/${config.model} error:`, error.message);
        const errorInfo = {
            model: `${config.version}/${config.model}`,
            status: 500,
            error: error.message
        };
        errors.push(errorInfo);
        lastError = errorInfo;
        continue;
      }
    }

    // 所有模型都失败了
    console.error('All Gemini models failed.', errors);
    
    // Construct a more helpful error message
    let errorMessage = 'All Gemini API models failed. ';
    let availableModels: string[] = [];
    
    // Diagnostic: Try to list available models to see what the key has access to
    try {
        console.log('Attempting to list available models...');
        const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        if (listResponse.ok) {
            const listData = await listResponse.json();
            if (listData.models) {
                availableModels = listData.models.map((m: any) => m.name.replace('models/', ''));
                console.log('Available models:', availableModels);
            }
        } else {
            console.warn('ListModels failed:', await listResponse.text());
        }
    } catch (e) {
        console.error('ListModels error:', e);
    }
    
    // Check key common issues
    if (errors.some(e => JSON.stringify(e).includes('not found'))) {
        errorMessage += 'Models not found for your API Key. ';
        if (availableModels.length > 0) {
             errorMessage += `Your key has access to: ${availableModels.join(', ')}. Please update the code to use one of these.`;
        } else {
             errorMessage += 'The API Key appears to have NO access to any models. Please ensure "Generative Language API" is enabled in Google Cloud Console or generate a new key in Google AI Studio.';
        }
    } else if (errors.some(e => JSON.stringify(e).includes('quota'))) {
        errorMessage += 'Quota exceeded. Please try again later.';
    } else {
        errorMessage += 'Please check the details below.';
    }

    return response.status(lastError?.status || 500).json({ 
      error: errorMessage,
      details: errors,      // Return full error list for debugging
      availableModels: availableModels // Return what we found
    });
  } catch (error: any) {
    console.error('Error in OCR function:', error);
    return response.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
}

