#!/usr/bin/env node
const { spawnSync } = require('node:child_process')

if (process.env.OFFLINE_BUILD === '1') {
  console.log('[postbuild] OFFLINE_BUILD=1 → skip sitemap generation')
  process.exit(0)
}

const r = spawnSync('pnpm', ['exec', 'next-sitemap'], { stdio: 'inherit' })
process.exit(r.status || 0)

