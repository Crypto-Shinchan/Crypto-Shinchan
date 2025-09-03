module.exports = {
  ci: {
    collect: {
      // SSRのため静的配信は使わず、Nextのサーバーを起動して計測する
      startServerCommand: 'pnpm --filter web start -p 3000',
      startServerReadyPattern: 'Local:.*http://localhost:3000',
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
