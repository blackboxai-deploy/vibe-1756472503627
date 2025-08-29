'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface GenerationSettingsProps {
  systemPrompt: string;
  onSystemPromptChange: (prompt: string) => void;
  imageStyle: string;
  onImageStyleChange: (style: string) => void;
  useRealAI: boolean;
  onUseRealAIChange: (use: boolean) => void;
}

const IMAGE_STYLES = [
  { value: 'photorealistic', label: 'フォトリアリスティック' },
  { value: 'artistic', label: 'アート風' },
  { value: 'anime', label: 'アニメ風' },
  { value: 'oil_painting', label: '油絵風' },
  { value: 'watercolor', label: '水彩画風' },
  { value: 'digital_art', label: 'デジタルアート' },
  { value: 'sketch', label: 'スケッチ風' },
  { value: 'cyberpunk', label: 'サイバーパンク' }
];

const DEFAULT_SYSTEM_PROMPT = '高品質で美しい画像を生成してください。アーティスティックで視覚的に魅力的な画像を作成し、プロンプトの詳細を正確に反映してください。';

export default function GenerationSettings({
  systemPrompt,
  onSystemPromptChange,
  imageStyle,
  onImageStyleChange,
  useRealAI,
  onUseRealAIChange
}: GenerationSettingsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const resetToDefault = () => {
    onSystemPromptChange(DEFAULT_SYSTEM_PROMPT);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">生成設定</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '折りたたむ' : '展開'}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>実際のAI画像生成を使用</Label>
                <p className="text-xs text-muted-foreground">
                  オフ: デモモード（無料）<br />
                  オン: 実際のAI生成（料金が発生します）
                </p>
              </div>
              <Switch
                checked={useRealAI}
                onCheckedChange={onUseRealAIChange}
              />
            </div>
            
            {useRealAI && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertDescription className="text-orange-800">
                  ⚠️ 実際のAI画像生成は料金が発生します。1回の生成で約$0.05-$0.15の費用がかかる可能性があります。
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image-style">画像スタイル</Label>
            <Select value={imageStyle} onValueChange={onImageStyleChange}>
              <SelectTrigger>
                <SelectValue placeholder="スタイルを選択" />
              </SelectTrigger>
              <SelectContent>
                {IMAGE_STYLES.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="system-prompt">システムプロンプト</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={resetToDefault}
              >
                デフォルトに戻す
              </Button>
            </div>
            <Textarea
              id="system-prompt"
              value={systemPrompt}
              onChange={(e) => onSystemPromptChange(e.target.value)}
              placeholder="AIの画像生成動作を指定してください..."
              className="min-h-[80px] resize-none text-sm"
            />
            <p className="text-xs text-muted-foreground">
              システムプロンプトは、AIがどのように画像を生成するかを制御します。
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}