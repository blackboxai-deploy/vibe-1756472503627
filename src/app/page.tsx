'use client';

import { useState } from 'react';
import ImageGenerator from '@/components/ImageGenerator';
import VideoGenerator from '@/components/VideoGenerator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            🎨 AI創作プラットフォーム 🎬
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            最先端のAI技術で画像・動画を生成！プリンのたゆんたゆんも作れちゃう！
            テキストで説明するだけで、プロ品質のコンテンツを瞬時に生成できます。
          </p>
        </div>
        
        <div className="container mx-auto px-4 max-w-6xl">
          <Tabs defaultValue="images" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="images" className="text-lg">
                🎨 画像生成
              </TabsTrigger>
              <TabsTrigger value="videos" className="text-lg">
                🎬 動画生成
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="images">
              <ImageGenerator />
            </TabsContent>
            
            <TabsContent value="videos">
              <VideoGenerator />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}