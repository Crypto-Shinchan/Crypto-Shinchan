#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const nextDir = path.join(__dirname, '..', '.next');
const jsPath = path.join(nextDir, 'prerender-manifest.js');
const jsonPath = path.join(nextDir, 'prerender-manifest.json');

try {
  if (!fs.existsSync(jsonPath) && fs.existsSync(jsPath)) {
    const vm = require('vm');
    const src = fs.readFileSync(jsPath, 'utf8');
    const context = { self: {}, result: null };
    vm.runInNewContext(`${src}; result = self.__PRERENDER_MANIFEST;`, context);
    const jsonText = context.result;
    if (typeof jsonText === 'string' && jsonText.trim().startsWith('{')) {
      const obj = JSON.parse(jsonText);
      fs.writeFileSync(jsonPath, JSON.stringify(obj));
      console.log(`[fix-manifests] Wrote ${path.relative(process.cwd(), jsonPath)}`);
    }
  }
} catch (e) {
  console.warn('[fix-manifests] skipped:', e?.message || e);
}
