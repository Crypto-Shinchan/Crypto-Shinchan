# 目的
仕様書に従い、モノレポ構成で Next.js アプリ(`/web`)と Sanity Studio(`/studio`)を初期化せよ。
- Node 20+ / pnpm
- TypeScript / App Router / Tailwind
- リポジトリ直下に pnpm ワークスペース定義
- Vercel デプロイ前提

# 仕様の根拠
- 画面構成、SEO、検索、ISR、リダイレクト、GA4 等は仕様書準拠。
- 旧 WordPress → 新 URL の 301 も next.config.js で実装。
- Sanity スキーマ: post/category/tag/author/globalSettings ほか。Draft/公開、予約公開。

# 制約
- 既存ファイルを壊さず差分のみ追加・修正
- 各ステップ後に「変更点の一覧」と「次の指示用の短いToDo」を出力

# タスク
1. ルートに以下を生成:
   - package.json（pnpm workspaces）
   - pnpm-workspace.yaml
   - .gitignore、README.md(簡易)
2. `/web`: create-next-app の結果 + Tailwind 初期化
3. `/studio`: Sanity init（production dataset、Basicテンプレ）
4. ルートの README にローカル起動コマンドを追記:
   - `pnpm dev`（並行起動: web:3000, studio:3333）
5. 必要なライブラリをインストール:
   - @sanity/client next-sanity groq @portabletext/react
   - fuse.js next-sitemap
   - zod date-fns
6. すべて pnpm スクリプトに統合。

# 出力形式
- 生成/変更ファイル一覧
- 追加したスクリプト
- 実行コマンド

# 追加タスク: Sanity スキーマ
/studio/schemas に以下を実装し、index でexport:
- post: title, slug, excerpt, coverImage(image + alt必須), body(blockContent), categories, tags, author, publishedAt, updatedAt, ogImage, state(draft/published), publishStart(publishEnd)
- category: title, slug
- tag: title, slug
- author: name, bio, avatar
- globalSettings: siteTitle, description, nav, footer, socialLinks, defaultOG

# バリデーション
- alt 必須、タイトル/スラッグ必須、excerpt 120-160字推奨

# 運用
- 予約公開: publishStart/end を UIで分かりやすく
スキーマや運用強化は仕様書「管理・運用強化」/「環境変数」節の方針に沿います。

# 追加タスク: Next からのSanity接続
- /web/lib/sanity.client.ts: projectId, dataset, apiVersion, useCdn
- /web/lib/queries.ts: 一覧/個別/カテゴリ/タグ/検索用の GROQ
- /web/env: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN

# 追加タスク: ルーティングとUI
- /web/app/blog/page.tsx: 一覧 + ページネーション（Load more または cursor）
- /web/app/blog/[slug]/page.tsx: 個別（タイトル/日付/カテゴリ/タグ/目次/本文/シェア/関連記事）
- /web/app/blog/category/[category]/page.tsx
- /web/app/blog/tag/[tag]/page.tsx
- /web/components: PostCard, PostGrid, PostBody(PortableText), Toc, ShareButtons, RelatedPosts
- 検索: /web/app/search/page.tsx + fuse.js クライアント検索 or API route
- ヘッダー/フッター/SEO共通Layout
- ダークモード切替

画面要件と共通コンポーネントは仕様書通りです。検索・目次・シェア・関連記事の要求も反映します。

# 追加タスク: SEO
- Next.js App Router の generateMetadata で各ページのメタ/OGP
- next-sitemap 設定: sitemap.xml と robots.txt 自動生成
- JSON-LD: Article, BreadcrumbList, （必要なら）FAQPage を <script type="application/ld+json">
- OG画像自動生成: @vercel/og で /web/app/og/route.ts 実装（タイトル・著者・日付）

仕様書の「SEO最適化」「構造化データ」「OG画像自動生成」を反映。

# 追加タスク: リダイレクト
- 旧WPパーマリンク（例 /YYYY/MM/slug/）→ 新 /blog/slug へ 301
- /web/next.config.js に redirects() を定義
- 任意: redirects.json などを読み込む実装

仕様書のリダイレクト設計に準拠。

# 追加タスク: パフォーマンス/ISR
- 重要ページの動的データは revalidate を設定（秒指定 or revalidateTag）
- /web/app/api/revalidate/route.ts を作り、SANITY_REVALIDATE_SECRET を検証
- Sanity の Webhook から該当 slug/tag を revalidate
- next/image、遅延読み込み、フォント最適化を実装

「ISR + Webhook」「パフォーマンス最適化」要件を満たします。

# 追加タスク: Analytics
- NEXT_PUBLIC_GA_ID を使い、/web/app/_components/Analytics.tsx を作成
- Layout で計測スクリプトを読み込み（App Router）

仕様書のアナリティクス要件。

# 追加タスク: CI/CD
- .github/workflows/ci.yml:
  - pnpm i --frozen-lockfile
  - pnpm -w build
  - Lighthouse CI を走らせ、スコア90未満で fail
- 週1の sanity export を artifact 保存

仕様書のCI/CD方針に沿った簡易版から導入。

# 追加タスク: 環境変数
.env.local（ローカル）と Vercel Project Settings に以下を登録：

NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_READ_TOKEN=
SANITY_REVALIDATE_SECRET=
NEXT_PUBLIC_GA_ID=
