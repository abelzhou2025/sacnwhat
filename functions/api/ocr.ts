// Cloudflare Pages Function for OCR
// This file handles /api/ocr requests

export async function onRequestPost(context: any) {
  const { request, env } = context;

  // 设置 CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const body = await request.json();
    const { base64Image, mimeType } = body;

    if (!base64Image || !mimeType) {
      return new Response(
        JSON.stringify({ error: 'Missing base64Image or mimeType' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // 从环境变量获取 API 密钥
    const deepseekKey = env.DEEPSEEK_API_KEY;
    const geminiKey = env.GEMINI_API_KEY;
    const apiKey = deepseekKey || geminiKey;
    const useDeepSeek = !!deepseekKey;

    // 调试日志（不记录实际密钥）
    console.log('Environment check:', {
      hasDEEPSEEK: !!deepseekKey,
      hasGEMINI: !!geminiKey,
      hasApiKey: !!apiKey,
      usingDeepSeek: useDeepSeek,
    });

    if (!apiKey) {
      console.error('API key not configured');
      return new Response(
        JSON.stringify({
          error:
            'API key not configured. Please set DEEPSEEK_API_KEY or GEMINI_API_KEY in Cloudflare Pages environment variables.',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // 根据使用的 API 选择不同的端点和请求格式
    if (useDeepSeek) {
      // DeepSeek API 目前不支持图片输入
      console.warn(
        'DeepSeek API does not support image input. Recommend using Gemini API for OCR.'
      );
      return new Response(
        JSON.stringify({
          error:
            'DeepSeek API does not support image OCR. Please use GEMINI_API_KEY instead for OCR functionality. Set GEMINI_API_KEY in Cloudflare Pages environment variables and remove DEEPSEEK_API_KEY.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Google Gemini API 配置
    // 使用确认可用的模型 (Gemini 2.0/2.5)
    // 根据之前的诊断，用户 key 支持这些模型
    const modelConfigs = [
      { version: 'v1beta', model: 'gemini-2.0-flash' },       // Primary
      { version: 'v1beta', model: 'gemini-2.5-flash' },       // High performance fallback
      { version: 'v1beta', model: 'gemini-flash-latest' },    // Latest alias
      { version: 'v1beta', model: 'gemini-2.0-flash-lite' },  // Lite version
      { version: 'v1beta', model: 'gemini-2.0-flash-001' },   // Specific version
    ];

    const requestHeaders = {
      'Content-Type': 'application/json',
    };
    const requestBody = {
      contents: [
        {
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
        },
      ],
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
          if (
            data.candidates &&
            data.candidates[0] &&
            data.candidates[0].content
          ) {
            extractedText = data.candidates[0].content.parts
              .map((part: any) => part.text || '')
              .join('');
          }

          // 移除不需要的前缀
          const unwantedPrefixRegex =
            /^(Based on the image provided, here is the text converted (to|into) Markdown( format)?:?|以下是图片中内容的文字转写：)\s*/i;
          extractedText = extractedText.replace(unwantedPrefixRegex, '');

          console.log(`Success with model: ${config.version}/${config.model}`);
          return new Response(JSON.stringify({ text: extractedText }), {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        } else {
            // 记录错误
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
            continue;
        }
      } catch (error: any) {
        console.warn(
          `Model ${config.version}/${config.model} error:`,
          error.message
        );
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
    
    // Diagnostic
     try {
        console.log('Attempting to list available models...');
        // Note: fetch is available globally in Cloudflare Workers/Pages
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
    if (errors.some(e => JSON.stringify(e).includes('not found') || JSON.stringify(e).includes('API key not valid') || JSON.stringify(e).includes('bad request'))) {
         errorMessage += 'Models not found or API Key issue. ';
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

    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: errors, 
      availableModels: availableModels
    }), {
      status: lastError?.status || 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error: any) {
    console.error('Error in OCR function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
}

// 处理 OPTIONS 请求（CORS preflight）
export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

