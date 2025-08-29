'use client';

import { useState } from 'react';
import PromptInput from './PromptInput';
import GenerationSettings from './GenerationSettings';
import ImageGallery, { GeneratedImage } from './ImageGallery';
import ImageHistory from './ImageHistory';

const DEFAULT_SYSTEM_PROMPT = '高品質で美しい画像を生成してください。アーティスティックで視覚的に魅力的な画像を作成し、プロンプトの詳細を正確に反映してください。';

export default function ImageGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [imageStyle, setImageStyle] = useState('photorealistic');
  const [useRealAI, setUseRealAI] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async (prompt: string) => {
    setIsGenerating(true);
    setError(null);

    try {
      // スタイルをプロンプトに統合
      const enhancedPrompt = `${prompt}, ${getStyleDescription(imageStyle)}`;
      
      const apiEndpoint = useRealAI ? '/api/generate-image' : '/api/generate-image-demo';
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: enhancedPrompt,
          systemPrompt: systemPrompt,
          useRealAI: useRealAI
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '画像生成に失敗しました');
      }

      if (data.success && data.imageUrl) {
        const newImage: GeneratedImage = {
          id: Date.now().toString(),
          url: data.imageUrl,
          prompt: prompt,
          timestamp: data.timestamp || new Date().toISOString()
        };

        setImages(prevImages => [newImage, ...prevImages]);
      } else {
        throw new Error('画像URLが取得できませんでした');
      }
    } catch (error) {
      console.error('画像生成エラー:', error);
      setError(error instanceof Error ? error.message : '画像生成に失敗しました');
    } finally {
      setIsGenerating(false);
    }
  };

  const getStyleDescription = (style: string): string => {
    const styleMap: Record<string, string> = {
      photorealistic: 'photorealistic, high quality, detailed, professional photography',
      artistic: 'artistic, creative, expressive, masterpiece quality',
      anime: 'anime style, manga style, colorful, detailed anime art',
      oil_painting: 'oil painting style, classical art, rich textures, painterly',
      watercolor: 'watercolor painting, soft colors, flowing, artistic medium',
      digital_art: 'digital art, modern, clean, high resolution, digital painting',
      sketch: 'pencil sketch, line art, artistic drawing, detailed sketch',
      cyberpunk: 'cyberpunk style, neon lights, futuristic, high tech, sci-fi'
    };
    return styleMap[style] || styleMap.photorealistic;
  };

  const handleSelectFromHistory = (image: GeneratedImage) => {
    // 履歴から選択された画像をギャラリーの先頭に追加
    setImages(prevImages => {
      const exists = prevImages.some(img => img.id === image.id);
      if (!exists) {
        return [image, ...prevImages];
      }
      return prevImages;
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* サイドバー */}
        <div className="lg:col-span-1 space-y-4">
          <GenerationSettings
            systemPrompt={systemPrompt}
            onSystemPromptChange={setSystemPrompt}
            imageStyle={imageStyle}
            onImageStyleChange={setImageStyle}
            useRealAI={useRealAI}
            onUseRealAIChange={setUseRealAI}
          />
          <ImageHistory
            onSelectImage={handleSelectFromHistory}
            currentImages={images}
          />
        </div>

        {/* メインコンテンツ */}
        <div className="lg:col-span-3 space-y-6">
          <PromptInput onGenerate={generateImage} isGenerating={isGenerating} />
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">
                <strong>エラー:</strong> {error}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">生成された画像</h2>
            <ImageGallery images={images} isLoading={isGenerating} />
          </div>
        </div>
      </div>
    </div>
  );
}