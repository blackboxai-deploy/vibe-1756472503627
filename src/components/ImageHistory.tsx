'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GeneratedImage } from './ImageGallery';

interface ImageHistoryProps {
  onSelectImage: (image: GeneratedImage) => void;
  currentImages: GeneratedImage[];
}

export default function ImageHistory({ onSelectImage, currentImages }: ImageHistoryProps) {
  const [historyImages, setHistoryImages] = useState<GeneratedImage[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // ローカルストレージから履歴を読み込み
    const savedHistory = localStorage.getItem('imageHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setHistoryImages(parsedHistory);
      } catch (error) {
        console.error('履歴の読み込みに失敗しました:', error);
      }
    }
  }, []);

  useEffect(() => {
    // 新しい画像が追加された場合、履歴を更新
    if (currentImages.length > 0) {
      const newImages = currentImages.filter(
        (img) => !historyImages.some((histImg) => histImg.id === img.id)
      );
      
      if (newImages.length > 0) {
        const updatedHistory = [...newImages, ...historyImages].slice(0, 50); // 最大50件まで保存
        setHistoryImages(updatedHistory);
        localStorage.setItem('imageHistory', JSON.stringify(updatedHistory));
      }
    }
  }, [currentImages, historyImages]);

  const clearHistory = () => {
    setHistoryImages([]);
    localStorage.removeItem('imageHistory');
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `今日 ${date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `昨日 ${date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">生成履歴</CardTitle>
          <div className="flex gap-2">
            {historyImages.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearHistory}
              >
                クリア
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? '折りたたむ' : '展開'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          {historyImages.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-4">
              履歴がありません
            </p>
          ) : (
            <ScrollArea className="h-80">
              <div className="space-y-2">
                {historyImages.map((image) => (
                  <div
                    key={image.id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => onSelectImage(image)}
                  >
                    <img
                      src={image.url}
                      alt={image.prompt}
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/da95e203-169e-477d-8dcf-373fcd9a6c6d.png';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm line-clamp-2">{image.prompt}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(image.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      )}
    </Card>
  );
}