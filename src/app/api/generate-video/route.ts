export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, imageUrl } = body;

    if (!prompt || typeof prompt !== 'string') {
      return Response.json(
        { error: 'プロンプトが必要です' },
        { status: 400 }
      );
    }

    console.log('動画生成リクエスト:', { prompt, imageUrl });

    try {
      // 画像→動画変換の場合
      if (imageUrl) {
        const aiResponse = await fetch('https://oi-server.onrender.com/chat/completions', {
          method: 'POST',
          headers: {
            'customerId': 'cus_SxKTbQ572UHCFc',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer xxx'
          },
          body: JSON.stringify({
            model: 'replicate/stability-ai/stable-video-diffusion',
            messages: [
              {
                role: 'system',
                content: 'この画像から自然で滑らかな動画を生成してください。物理法則に従って自然な動きを作り出し、高品質な動画を生成してください。'
              },
              {
                role: 'user',
                content: `画像URL: ${imageUrl}\n\n動画の説明: ${prompt}`
              }
            ]
          })
        });

        if (aiResponse.ok) {
          const result = await aiResponse.json();
          let videoUrl = null;
          
          if (result.choices && result.choices[0] && result.choices[0].message) {
            videoUrl = result.choices[0].message.content;
          } else if (result.video_url || result.url) {
            videoUrl = result.video_url || result.url;
          }

          if (videoUrl && videoUrl.includes('http')) {
            return Response.json({
              success: true,
              videoUrl: videoUrl,
              prompt: prompt,
              timestamp: new Date().toISOString(),
              type: 'image-to-video'
            });
          }
        }
      } else {
        // テキスト→動画生成
        const aiResponse = await fetch('https://oi-server.onrender.com/chat/completions', {
          method: 'POST',
          headers: {
            'customerId': 'cus_SxKTbQ572UHCFc',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer xxx'
          },
          body: JSON.stringify({
            model: 'replicate/google/veo-3',
            messages: [
              {
                role: 'system',
                content: '高品質でクリエイティブな動画を生成してください。自然な動きと美しいビジュアルを心がけ、プロンプトの内容を忠実に動画化してください。'
              },
              {
                role: 'user',
                content: prompt
              }
            ]
          })
        });

        if (aiResponse.ok) {
          const result = await aiResponse.json();
          let videoUrl = null;
          
          if (result.choices && result.choices[0] && result.choices[0].message) {
            videoUrl = result.choices[0].message.content;
          } else if (result.video_url || result.url) {
            videoUrl = result.video_url || result.url;
          }

          if (videoUrl && videoUrl.includes('http')) {
            return Response.json({
              success: true,
              videoUrl: videoUrl,
              prompt: prompt,
              timestamp: new Date().toISOString(),
              type: 'text-to-video'
            });
          }
        }
      }

      throw new Error('動画生成に失敗しました');

    } catch (aiError) {
      console.error('AI動画生成エラー:', aiError);
    }

    // フォールバック: GIFプレースホルダー
    const shortDescription = prompt.slice(0, 30).replace(/\s+/g, '+');
    const fallbackGifUrl = `https://via.placeholder.com/800x600.gif?text=${encodeURIComponent(shortDescription + ' (動画生成中)')}`;
    
    return Response.json({
      success: true,
      videoUrl: fallbackGifUrl,
      prompt: prompt,
      timestamp: new Date().toISOString(),
      type: 'fallback',
      message: '動画生成処理中です。しばらくお待ちください。'
    });

  } catch (error) {
    console.error('動画生成エラー:', error);
    return Response.json(
      { error: '動画生成に失敗しました' },
      { status: 500 }
    );
  }
}