import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI画像生成アプリ',
  description: '最先端のAI技術を使用して、テキストから美しい画像を生成するアプリケーションです。',
  keywords: 'AI, 画像生成, 人工知能, アート, クリエイティブ',
  authors: [{ name: 'AI Image Generator' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}