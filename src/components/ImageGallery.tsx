'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: string;
}

interface ImageGalleryProps {
  images: GeneratedImage[];
  isLoading?: boolean;
}

export default function ImageGallery({ images, isLoading }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  const downloadImage = async (image: GeneratedImage) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-image-${image.id}.png`;
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('画像のダウンロードに失敗しました:', error);
      alert('画像のダウンロードに失敗しました');
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
            <p className="text-center text-muted-foreground">
              AI画像を生成しています...
              <br />
              <span className="text-sm">通常1-3分程度かかります</span>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (images.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-8">
          <div className="text-center text-muted-foreground">
            <p>まだ画像が生成されていません。</p>
            <p className="text-sm mt-2">上のフォームからプロンプトを入力して画像を生成してください。</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={image.url}
                  alt={image.prompt}
                  className="w-full h-64 object-cover cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/7642cc05-d74e-4ffe-a314-f3f9bfa0cce6.png';
                  }}
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadImage(image);
                    }}
                  >
                    ダウンロード
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {image.prompt}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(image.timestamp).toLocaleString('ja-JP')}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>画像プレビュー</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <img
                src={selectedImage.url}
                alt={selectedImage.prompt}
                className="w-full max-h-[60vh] object-contain rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/154eacbb-cd91-4ec8-adb6-2866c2d45ef5.png';
                }}
              />
              <div className="space-y-2">
                <p className="text-sm"><strong>プロンプト:</strong> {selectedImage.prompt}</p>
                <p className="text-sm text-muted-foreground">
                  生成日時: {new Date(selectedImage.timestamp).toLocaleString('ja-JP')}
                </p>
              </div>
              <Button
                onClick={() => downloadImage(selectedImage)}
                className="w-full"
              >
                画像をダウンロード
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}