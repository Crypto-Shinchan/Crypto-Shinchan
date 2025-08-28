# CODEX 実行ガイドと仕様

本ドキュメントは、Codex CLI（この環境のコーディングエージェント）で本リポジトリのブログ開発を継続するための実行ガイドです。従来の `GEMINI.md` の要件を維持しつつ、Codex 向けの進め方・出力形式を明確化しています。運用ルールは `OPERATING_RULES.md` を参照（本ドキュメントからも要点を抜粋）。

## 目的
仕様書に従い、モノレポ構成で Next.js アプリ（`/web`）と Sanity Studio（`/studio`）を初期化・運用する。
- Node 20+ / pnpm
- TypeScript / App Router / Tailwind
- ルートに pnpm ワークスペース定義
- Vercel デプロイ前提

## 仕様の根拠
- 画面構成、SEO、検索、ISR、リダイレクト、GA4 等は仕様書準拠。
- 旧 WordPress → 新 URL の 301 は `next.config.js` で実装。
- Sanity スキーマ: post/category/tag/author/globalSettings ほか。Draft/公開、予約公開。

## 制約（Codex 運用方針）
- 既存ファイルを壊さず差分のみ追加・修正（目的外の変更は避ける）
- 小さく安全に変更し、必要に応じて段階的に PR/コミット（この環境では「変更パッチ」を提示）
- 変更は関連箇所のみ・最小限（副作用や無関係修正を避ける）
- 修正後は `pnpm --filter web build` など最小単位で検証（テスト・型・ビルド）
- 機密情報はハードコードせず環境変数を使用

### 運用ルールの要点
- 変更前説明と必要に応じた承認の取得
- APIキーは生成・保存・露出しない。APIはユーザー許可とキー提供がある場合のみ有効化
- CODEX を既定、障害時は GEMINI への切替を提案のうえ承認後に実施
- 詳細は `OPERATING_RULES.md` を正本として参照

## Codex CLI での進め方
- 作業前に短いプレアンブルで「次に何をするか」を宣言
- マルチステップの作業は `update_plan` を使って可視化（常に1つだけ in_progress）
- 変更は `apply_patch` で提示（大きなファイルは必要箇所のみ）
- 検索は `rg` を使い、ファイル閲覧は 250 行以内で分割
- バリデーション（任意）: `pnpm dev` / `pnpm --filter web build` で手元確認
- 作業終了時は「変更点の一覧」と「次の一手」を簡潔に共有

## タスク
1. ルートに以下を生成/維持:
   - `package.json`（pnpm workspaces）
   - `pnpm-workspace.yaml`
   - `.gitignore`、`README.md`
2. `/web`: create-next-app の結果 + Tailwind 初期化
3. `/studio`: Sanity init（production dataset、Basicテンプレ）
4. ルートの README にローカル起動コマンドを追記:
   - `pnpm dev`（並行起動: web:3000, studio:3333）
5. 必要なライブラリをインストール:
   - `@sanity/client` `next-sanity` `groq` `@portabletext/react`
   - `fuse.js` `next-sitemap`
   - `zod` `date-fns`
6. すべて pnpm スクリプトに統合。

## 出力形式（Codex）
- 変更/追加ファイル一覧（パスと要点）
- 追加/変更したスクリプトや設定の要約
- 実行・検証コマンドのメモ（必要最小限）
- `update_plan` の更新（進捗の見える化）

## 追加タスク: Sanity スキーマ
`/studio/schemas` に以下を実装し、index で export:
- post: title, slug, excerpt, coverImage(image + alt必須), body(blockContent), categories, tags, author, publishedAt, updatedAt, ogImage, state(draft/published), publishStart(publishEnd)
- category: title, slug
- tag: title, slug
- author: name, bio, avatar
- globalSettings: siteTitle, description, nav, footer, socialLinks, defaultOG

バリデーション:
- alt 必須、タイトル/スラッグ必須、excerpt 120-160字推奨

## 追加タスク: Next からの Sanity 接続
- `/web/lib/sanity.client.ts`: projectId, dataset, apiVersion, useCdn
- `/web/lib/queries.ts`: 一覧/個別/カテゴリ/タグ/検索用の GROQ
- 環境変数: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_TOKEN`

## 追加タスク: ルーティングと UI
- `/web/app/blog/page.tsx`: 一覧 + ページネーション
- `/web/app/blog/[slug]/page.tsx`: 個別（タイトル/日付/カテゴリ/タグ/目次/本文/シェア/関連記事）
- `/web/app/blog/category/[category]/page.tsx`
- `/web/app/blog/tag/[tag]/page.tsx`
- `/web/components`: PostCard, PostGrid, PostBody(PortableText), Toc, ShareButtons, RelatedPosts
- 検索: `/web/app/search/page.tsx` + `fuse.js`（クライアント検索 or API route）
- ヘッダー/フッター/SEO共通 Layout、ダークモード切替

## 追加タスク: SEO
- App Router の `generateMetadata` で各ページのメタ/OGP
- `next-sitemap` 設定: `sitemap.xml` と `robots.txt` 自動生成
- JSON-LD: Article, BreadcrumbList, （必要なら）FAQPage
- OG画像自動生成: `@vercel/og` で `/web/app/og/route.ts` 実装

## 追加タスク: リダイレクト
- 旧 WP パーマリンク（例 `/YYYY/MM/slug/`）→ 新 `/blog/slug` へ 301
- `/web/next.config.js` の `redirects()` を実装
- 任意: `redirects.json` 等から読み込み

## 追加タスク: パフォーマンス/ISR
- 動的データは `revalidate` 設定（秒指定 or `revalidateTag`）
- `/web/app/api/revalidate/route.ts`: `SANITY_REVALIDATE_SECRET` を検証
- Sanity Webhook から該当 slug/tag を revalidate
- `next/image`、遅延読み込み、フォント最適化

## 追加タスク: Analytics
- `NEXT_PUBLIC_GA_ID` を使い、`/web/app/_components/Analytics.tsx`
- Layout で計測スクリプトを読み込み

## 追加タスク: CI/CD
- `.github/workflows/ci.yml`:
  - `pnpm i --frozen-lockfile`
  - `pnpm -w build`
  - Lighthouse CI を走らせ、スコア90未満で fail
- 週1の sanity export を artifact 保存

## 追加タスク: 環境変数
`.env.local`（ローカル）と Vercel Project Settings に登録：

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_READ_TOKEN=
SANITY_REVALIDATE_SECRET=
NEXT_PUBLIC_GA_ID=
```

---

## ローカル検証コマンド例

```
pnpm dev                 # web:3000 / studio:3333 を並行起動
pnpm --filter web build  # Next.js を単体ビルド
```

必要に応じて `vercel build` を使用して本番相当のビルドを確認。
