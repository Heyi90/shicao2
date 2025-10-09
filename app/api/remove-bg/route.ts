import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image_file') as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: '未找到图片文件' },
        { status: 400 }
      );
    }

    // 创建新的 FormData 发送给 remove.bg API
    const apiFormData = new FormData();
    apiFormData.append('image_file', imageFile);
    apiFormData.append('size', 'auto');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-API-Key': 'FWtjGmySCBwCsjkiGGprj69b',
      },
      body: apiFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `API 请求失败: ${errorText}` },
        { status: response.status }
      );
    }

    const imageBlob = await response.blob();

    // 返回处理后的图片
    return new NextResponse(imageBlob, {
      headers: {
        'Content-Type': 'image/png',
      },
    });

  } catch (error) {
    console.error('去背景处理失败:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
