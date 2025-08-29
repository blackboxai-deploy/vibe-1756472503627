export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, systemPrompt } = body;

    if (!prompt || typeof prompt !== 'string') {
      return Response.json(
        { error: 'プロンプトが必要です' },
        { status: 400 }
      );
    }

    // カスタムエンドポイント経由でReplicate AI画像生成APIを呼び出し
    const aiResponse = await fetch('https://oi-server.onrender.com/chat/completions', {
      method: 'POST',
      headers: {
        'customerId': 'cus_SxKTbQ572UHCFc',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx'
      },
      body: JSON.stringify({
        model: 'replicate/black-forest-labs/flux-1.1-pro',
        messages: [
          {
            role: 'system',
            content: systemPrompt || '高品質で美しい画像を生成してください。アーティスティックで視覚的に魅力的な画像を作成し、プロンプトの詳細を正確に反映してください。'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    // 5分のタイムアウトを設定
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5 * 60 * 1000);

    if (!aiResponse.ok) {
      clearTimeout(timeoutId);
      const errorText = await aiResponse.text();
      console.error('AI API Error:', errorText);
      return Response.json(
        { error: '画像生成に失敗しました' },
        { status: 500 }
      );
    }

    const result = await aiResponse.json();
    clearTimeout(timeoutId);

    // AI応答から画像URLを抽出
    const imageUrl = result.choices?.[0]?.message?.content || result.image_url || result.url;

    if (!imageUrl) {
      return Response.json(
        { error: '画像URLの取得に失敗しました' },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      imageUrl: imageUrl,
      prompt: prompt,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('画像生成エラー:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return Response.json(
          { error: '画像生成がタイムアウトしました（5分制限）' },
          { status: 408 }
        );
      }
    }
    
    return Response.json(
      { error: '内部サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}