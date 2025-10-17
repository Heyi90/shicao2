import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, imageFormat } = await request.json();

    if (!imageBase64) {
      return NextResponse.json(
        { error: '未找到图片数据' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ARK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API Key 未配置' },
        { status: 500 }
      );
    }

    // 构建请求数据
    const requestData = {
      model: "ep-20251017124928-clc8t",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "图片识别"
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/${imageFormat};base64,${imageBase64}`
              }
            }
          ]
        }
      ]
    };

    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `API 请求失败: ${errorText}` },
        { status: response.status }
      );
    }

    const result = await response.json();

    return NextResponse.json(result);

  } catch (error) {
    console.error('图片识别失败:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
