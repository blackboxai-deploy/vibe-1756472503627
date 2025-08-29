'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

const SAMPLE_PROMPTS = [
  '美しい夕焼けの海辺で波が砂浜に打ち寄せる風景',
  'サイバーパンクな都市の夜景、ネオンライトが輝く未来的な街並み',
  '森の中の小さな木造の家、暖かい光が窓から漏れる',
  '宇宙から見た地球、青い海と白い雲が美しく輝く',
  '桜の花びらが舞い散る春の公園、穏やかな午後の光景',
  'ファンタジーな城、雲の上に浮かぶ神秘的な建物',
  '猫がひなたぼっこをしている窓辺、暖かい自然光',
  '雪山の頂上から見る壮大な景色、澄んだ青空'
];

export default function PromptInput({ onGenerate, isGenerating }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt.trim());
    }
  };

  const useSamplePrompt = (samplePrompt: string) => {
    setPrompt(samplePrompt);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">AI画像生成</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium mb-2">
              画像の説明を入力してください
            </label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="例: 美しい夕焼けの海辺で波が砂浜に打ち寄せる風景..."
              className="min-h-[100px] resize-none"
              disabled={isGenerating}
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={!prompt.trim() || isGenerating}
            className="w-full"
          >
            {isGenerating ? '画像生成中...' : '画像を生成'}
          </Button>
        </form>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            サンプルプロンプト
          </h3>
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
        </div>
      </CardContent>
    </Card>
  );
}