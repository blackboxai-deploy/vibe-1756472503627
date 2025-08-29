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

    console.log('画像生成リクエスト:', prompt);

    // 実際のAI画像生成を実行
    try {
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

      console.log('AI API レスポンス:', aiResponse.status);

      if (aiResponse.ok) {
        const result = await aiResponse.json();
        console.log('AI結果:', result);

        // AI応答から画像URLを抽出
        let imageUrl = null;
        
        if (result.choices && result.choices[0] && result.choices[0].message) {
          imageUrl = result.choices[0].message.content;
        } else if (result.image_url) {
          imageUrl = result.image_url;
        } else if (result.url) {
          imageUrl = result.url;
        } else if (typeof result === 'string' && result.startsWith('http')) {
          imageUrl = result;
        }

        if (imageUrl && imageUrl.startsWith('http')) {
          console.log('生成された画像URL:', imageUrl);
          return Response.json({
            success: true,
            imageUrl: imageUrl,
            prompt: prompt,
            timestamp: new Date().toISOString(),
            isDemo: false
          });
        }
      }

      // AI生成が失敗した場合のフォールバック
      throw new Error('AI画像生成に失敗しました');

    } catch (aiError) {
      console.error('AI画像生成エラー:', aiError);
    }

    // フォールバック: 美しいプレースホルダー画像を返す
    const shortDescription = prompt.slice(0, 40).replace(/\s+/g, '+');
    const colors = ['FF6B6B', '4ECDC4', '45B7D1', 'F39C12', '9B59B6', 'E74C3C'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const fallbackImageUrl = `https://placehold.co/1024x1024/${randomColor}/FFFFFF?text=${encodeURIComponent(shortDescription)}`;
    
    return Response.json({
      success: true,
      imageUrl: fallbackImageUrl,
      prompt: prompt,
      timestamp: new Date().toISOString(),
      isDemo: true,
      message: '画像を生成しました（プレースホルダー）'
    });

  } catch (error) {
    console.error('画像生成エラー:', error);
    return Response.json(
      { error: '内部サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}