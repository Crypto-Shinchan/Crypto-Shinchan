module.exports = {
  ci: {
    collect: {
      // SSRのため静的配信は使わず、Nextのサーバーを起動して計測する
      // Run server in OFFLINE mode so /blog/sample-ci is available for CI
      startServerCommand: 'OFFLINE_BUILD=1 NEXT_PUBLIC_SITE_URL=http://localhost:3000 pnpm --filter web start -p 3000',
      // Next.js (production) の起動ログは dev 時の "Local:" ではなく
      // "started server on ... , url: http://localhost:3000" という形式。
      // そのためLHCIのready検知パターンを本番ログに合わせる。
      startServerReadyPattern: 'started server .*http://localhost:3000',
      startServerReadyTimeout: 180000,
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/blog',
        'http://localhost:3000/blog/sample-ci',
      ],
      numberOfRuns: 1,
    },
    assert: {
      // スコアの閾値
      assertions: {
        // まずはCIを安定稼働させるため全て warn に設定。
        // スコア改善が進んだら error に引き上げる運用を想定。
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
      },
    },
    upload: {
      // 結果をアップロードする場合の設定 (今回は使わない)
      target: 'temporary-public-storage',
    },
  },
};
