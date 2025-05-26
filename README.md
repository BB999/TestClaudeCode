# Hello World Web Application

[![CI/CD Pipeline](https://github.com/BB999/TestClaudeCode/actions/workflows/ci.yml/badge.svg)](https://github.com/BB999/TestClaudeCode/actions/workflows/ci.yml)

シンプルなHello Worldを表示するWebアプリケーション

## 🎯 プロジェクト概要

このプロジェクトは、基本的なWebアプリケーション開発スキルの習得とモダンなWeb開発の流れを理解することを目的としています。

## ✨ 機能

- **Hello World表示**: ブラウザでHello Worldを表示
- **リアルタイム日時**: 現在の日時を1秒ごとに更新
- **レスポンシブデザイン**: モバイル、タブレット、デスクトップに対応
- **アニメーション効果**: スムーズなフェードインとパルス効果
- **アクセシビリティ**: スクリーンリーダー対応とキーボード操作サポート

## 🛠 技術スタック

- **HTML5**: セマンティックマークアップ
- **CSS3**: グラデーション背景、アニメーション、レスポンシブデザイン
- **JavaScript (ES6+)**: クラスベースアーキテクチャ
- **Jest**: テストフレームワーク
- **GitHub Actions**: CI/CDパイプライン

## 🚀 クイックスタート

### 前提条件

- Node.js 18.0.0以上
- npm

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/BB999/TestClaudeCode.git
cd TestClaudeCode

# 依存関係をインストール
npm install
```

### 開発サーバーの起動

```bash
# 開発サーバーを起動（ポート8080）
npm start
```

ブラウザで `http://localhost:8080` にアクセスしてアプリケーションを確認できます。

## 🧪 テスト

### テストの実行

```bash
# 全てのテストを実行
npm test

# カバレッジ付きでテストを実行
npm run test:coverage

# ウォッチモードでテストを実行
npm run test:watch

# CI環境でテストを実行
npm run test:ci
```

### テストカバレッジ

プロジェクトは80%以上のテストカバレッジを目標としています。

## 📱 対応ブラウザ

- Chrome (最新2バージョン)
- Firefox (最新2バージョン) 
- Safari (最新2バージョン)
- Edge (最新2バージョン)

## 🎨 デザイン要件

- **背景**: グラデーション (#667eea → #764ba2)
- **フォント**: Segoe UI ファミリー
- **アニメーション**: フェードイン、パルス効果
- **レスポンシブ**: 3つのブレークポイント (480px, 768px)

## ⚡ パフォーマンス要件

- **ファイルサイズ**: 合計1MB以下
- **ロード時間**: 2秒以内
- **メモリ使用量**: 50MB以下

## 🌐 アクセシビリティ

- **スクリーンリーダー**: ARIA属性による適切な対応
- **キーボード操作**: 全要素へのアクセス可能
- **ハイコントラスト**: メディアクエリ対応
- **モーション軽減**: prefer-reduced-motion対応

## 📁 ファイル構成

```
.
├── index.html          # メインHTMLファイル
├── styles.css          # スタイルシート
├── script.js           # JavaScriptメインファイル
├── package.json        # プロジェクト設定
├── tests/              # テストファイル
│   ├── setup.js        # Jestセットアップ
│   └── app.test.js     # メインテストスイート
├── .github/
│   └── workflows/
│       └── ci.yml      # CI/CDワークフロー
└── README.md           # このファイル
```

## 🔄 CI/CD パイプライン

GitHub Actionsを使用した自動化:

1. **テスト**: Jest による自動テスト実行
2. **ビルド**: 静的ファイルの検証
3. **デプロイ**: GitHub Pages への自動デプロイ
4. **パフォーマンス**: Lighthouse による品質チェック

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。

## 📞 サポート

問題や質問がある場合は、[Issues](https://github.com/BB999/TestClaudeCode/issues) でお知らせください。

---

Generated with [Claude Code](https://claude.ai/code)