module.exports = {
  ci: {
    collect: {
      // Next.js のビルドディレクトリを指定
      staticDistDir: './web/.next',
      // Next.js のプレビューサーバーを起動するコマンド
      // 'pnpm --filter web start' を実行したいが、lhci は pnpm のワークスペースを直接サポートしていない可能性があるため、
      // ルートで 'pnpm start' を実行し、ルートの package.json で 'web' を起動するように設定するのが確実。
      // しかし、今回は 'start' スクリプトが 'web' にしかないので、直接指定してみる。
      // 'lhci/action' が pnpm を認識してくれることに期待。
      // ダメな場合は、ルートの package.json を修正する必要がある。
      startServerCommand: 'pnpm --filter web start',
      // テスト対象の URL (プレビューサーバーが起動した後)
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
    },
    assert: {
      // スコアの閾値
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      // 結果をアップロードする場合の設定 (今回は使わない)
      target: 'temporary-public-storage',
    },
  },
};
