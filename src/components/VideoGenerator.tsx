'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface VideoGeneratorProps {
  onVideoGenerated?: (videoUrl: string, prompt: string) => void;
}

const SAMPLE_PROMPTS = [
  '美しいプリンがプルプル揺れる様子、スローモーション',
  '猫がゆっくりとあくびをして、毛がふわふわ揺れる',
  '桜の花びらが風に舞い踊る美しい春の景色',
  '波が砂浜に打ち寄せる穏やかな夕暮れの海辺',
  'コーヒーに牛乳が混ざっていく美しいスローモーション',
  '雲がゆっくりと流れる青い空のタイムラプス',
  '雨滴が水面に落ちて波紋が広がる瞬間',
  'キャンドルの炎が静かに揺れる癒しの映像'
];

export default function VideoGenerator({ onVideoGenerated }: VideoGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateVideo = async (mode: 'text-to-video' | 'image-to-video') => {
    if (!prompt.trim()) return;
    if (mode === 'image-to-video' && !imageUrl.trim()) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedVideo(null);

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          imageUrl: mode === 'image-to-video' ? imageUrl.trim() : undefined
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '動画生成に失敗しました');
      }

      if (data.success && data.videoUrl) {
        setGeneratedVideo(data.videoUrl);
        if (onVideoGenerated) {
          onVideoGenerated(data.videoUrl, prompt);
        }
      } else {
        throw new Error('動画URLが取得できませんでした');
      }
    } catch (error) {
      console.error('動画生成エラー:', error);
      setError(error instanceof Error ? error.message : '動画生成に失敗しました');
    } finally {
      setIsGenerating(false);
    }
  };

  const useSamplePrompt = (samplePrompt: string) => {
    setPrompt(samplePrompt);
  };

  const downloadVideo = async () => {
    if (!generatedVideo) return;

    try {
      const response = await fetch(generatedVideo);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-video-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('動画のダウンロードに失敗しました:', error);
      alert('動画のダウンロードに失敗しました');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">🎬 AI動画生成</CardTitle>
          <p className="text-muted-foreground">
            テキストから動画を生成したり、画像を動画に変換できます
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="text-to-video" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text-to-video">テキスト→動画</TabsTrigger>
              <TabsTrigger value="image-to-video">画像→動画</TabsTrigger>
            </TabsList>
            
            <TabsContent value="text-to-video" className="space-y-4">
              <div>
                <Label htmlFor="text-prompt">動画の説明</Label>
                <Textarea
                  id="text-prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="例: 美しいプリンがプルプル揺れる様子、スローモーション..."
                  className="min-h-[80px]"
                  disabled={isGenerating}
                />
              </div>
              <Button 
                onClick={() => generateVideo('text-to-video')}
                disabled={!prompt.trim() || isGenerating}
                className="w-full"
              >
                {isGenerating ? '動画生成中...' : 'テキストから動画を生成'}
              </Button>
            </TabsContent>
            
            <TabsContent value="image-to-video" className="space-y-4">
              <div>
                <Label htmlFor="image-url">画像URL</Label>
                <Input
                  id="image-url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  disabled={isGenerating}
                />
              </div>
              <div>
                <Label htmlFor="image-prompt">動きの説明</Label>
                <Textarea
                  id="image-prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="この画像をどのように動かしたいか説明してください..."
                  className="min-h-[80px]"
                  disabled={isGenerating}
                />
              </div>
              <Button 
                onClick={() => generateVideo('image-to-video')}
                disabled={!prompt.trim() || !imageUrl.trim() || isGenerating}
                className="w-full"
              >
                {isGenerating ? '動画生成中...' : '画像から動画を生成'}
              </Button>
            </TabsContent>
          </Tabs>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">
                <strong>エラー:</strong> {error}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* サンプルプロンプト */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">サンプルプロンプト</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
            {SAMPLE_PROMPTS.map((samplePrompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-left justify-start h-auto p-3 whitespace-normal"
                onClick={() => useSamplePrompt(samplePrompt)}
                disabled={isGenerating}
              >
                {samplePrompt}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 生成された動画 */}
      {(isGenerating || generatedVideo) && (
        <Card>
          <CardHeader>
            <CardTitle>生成された動画</CardTitle>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
                <p className="text-center text-muted-foreground">
                  AI動画を生成しています...
                  <br />
                  <span className="text-sm">通常2-5分程度かかります</span>
                </p>
              </div>
            ) : generatedVideo ? (
              <div className="space-y-4">
                <video
                  src={generatedVideo}
                  controls
                  className="w-full max-w-2xl mx-auto rounded-lg"
                  onError={(e) => {
                    console.error('動画の読み込みエラー:', e);
                  }}
                >
                  お使いのブラウザは動画再生をサポートしていません。
                </video>
                <div className="flex justify-center space-x-2">
                  <Button onClick={downloadVideo}>
                    動画をダウンロード
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setGeneratedVideo(null)}
                  >
                    クリア
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}