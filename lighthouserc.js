module.exports = {
  ci: {
    collect: {
      // SSRのため静的配信は使わず、Nextのサーバーを起動して計測する
      // Run server in OFFLINE mode so /blog/sample-ci is available for CI
      startServerCommand: 'OFFLINE_BUILD=1 NEXT_PUBLIC_LHCI=1 NEXT_PUBLIC_SITE_URL=http://localhost:3000 pnpm --filter web start -p 3000',
      // Next.js 14 の本番起動ログ例: "Local:        http://localhost:3000"
      // これに一致させてLHCIの起動待機を安定させる。
      startServerReadyPattern: 'Local:.*http://localhost:3000',
      startServerReadyTimeout: 180000,
      // Make CI runs more stable and representative of our server without extra throttling.
      settings: {
        // Use desktop profile for blog layout and avoid simulated throttling noise in CI
        preset: 'desktop',
        throttlingMethod: 'provided',
      },
      url: [
        // Exclude "/" which 307-redirects to /blog and hurts LH performance
        'http://localhost:3000/blog',
        'http://localhost:3000/blog/sample-ci',
      ],
      numberOfRuns: 1,
    },
    assert: {
      // スコアの閾値
      assertions: {
        // Performance も 0.9 で厳格化
        'categories:performance': ['error', { minScore: 0.9 }],
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
