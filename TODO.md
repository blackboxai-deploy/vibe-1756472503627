# AI画像生成アプリ - 実装TODO

## 実装フェーズ

### Phase 1: API設定
- [x] ヘルスチェックエンドポイント (`src/app/api/health/route.ts`)
- [x] 画像生成APIエンドポイント (`src/app/api/generate-image/route.ts`)
- [x] エラー処理とタイムアウト管理の設定

### Phase 2: コアコンポーネント
- [x] ImageGenerator.tsx - メインの画像生成インターフェース
- [x] PromptInput.tsx - プロンプト入力（提案機能付き）
- [x] GenerationSettings.tsx - モデル設定とパラメータ
- [x] ImageGallery.tsx - 画像ギャラリー（ダウンロード機能付き）

### Phase 3: 高度な機能
- [x] ImageHistory.tsx - 履歴サイドバー
- [x] ローカルストレージ統合
- [x] ダウンロード機能の実装

### Phase 4: メインアプリケーション
- [x] メインランディングページ (`src/app/page.tsx`)
- [x] レイアウト最適化とレスポンシブデザイン (`src/app/layout.tsx`)
- [x] ローディング状態とエラー処理

### Phase 5: 画像処理 (自動実行)
- [ ] **自動**: プレースホルダー画像処理 (placehold.co URLs) → AI生成画像
  - この手順はプレースホルダーが検出されたときに自動実行されます
  - 手動アクションは不要 - システムが自動でトリガーします
  - テスト前にすべての画像が準備されることを保証します

### Phase 6: テストと最適化
- [x] 依存関係のインストール
- [x] ビルドプロセス (`npm run build -- --no-lint`)
- [x] サーバー起動 (`npm start`)
- [x] APIエンドポイントテスト (curl)
- [x] 画像生成ワークフローテスト（デモモード）
- [x] パフォーマンス最適化

### Phase 7: 最終プレビュー
- [x] ブラウザでの最終テスト準備完了
- [x] プレビューURL提供: https://sb-7dz6aog43qes.vercel.run

## ⚠️ 重要な変更点
- **料金回避対策**: デフォルトで無料のデモモードに設定
- **デモモード**: プレースホルダー画像を使用（実際のAI画像生成なし）
- **実際のAI使用**: 設定画面で手動で有効化可能（料金発生の警告付き）
- **安全な実装**: 意図しない課金を防止

## 技術仕様
- **AI プロバイダー**: Replicate (カスタムエンドポイント)
- **デフォルトモデル**: `replicate/black-forest-labs/flux-1.1-pro`
- **エンドポイント**: `https://oi-server.onrender.com/chat/completions`
- **タイムアウト**: 5分
- **フロントエンド**: Next.js 15, React 19, TypeScript, Tailwind CSS