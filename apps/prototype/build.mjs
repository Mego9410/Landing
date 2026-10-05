// Bundles the prototype into single self-contained HTML files.
// Run: pnpm --filter @landing/prototype build
//   dist/index.html      everything inlined, React included. Vercel serves this; it also opens offline.
//   dist-artifact.html   the page body for publishing as a claude.ai artifact (React from cdnjs)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const read = (p) => readFileSync(resolve(dir, p), 'utf8');
const index = read('index.html');

const css = [...index.matchAll(/<link rel="stylesheet" href="([^"]+)">/g)].map((m) => read(m[1])).join('\n');
const scripts = [...index.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]);
const isReact = (src) => /components\/lib\/react/.test(src);

const svg = (p) => 'data:image/svg+xml;base64,' + Buffer.from(read(p)).toString('base64');
const assets = `window.LANDING_ASSETS = ${JSON.stringify({ mark: svg('../../packages/design-system/assets/Logos/landing-mark.svg'), lockup: svg('../../packages/design-system/assets/Logos/landing-lockup.svg') })};`;

const inline = (code) => {
  if (/<\/script/i.test(code)) throw new Error('A script contains "</script", which would end the inline tag early.');
  return `<script>\n${code}\n</script>`;
};
const appScripts = [inline(assets), ...scripts.filter((s) => !isReact(s)).map((s) => inline(read(s)))].join('\n');
const head = `<title>Landing Prototype</title>\n<meta name="robots" content="noindex">\n<style>\n${css}\n</style>`;
const body = `<div id="root"></div>`;

mkdirSync(join(dir, 'dist'), { recursive: true });

const standalone = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${head}
</head>
<body>
${body}
${scripts.filter(isReact).map((s) => inline(read(s))).join('\n')}
${appScripts}
</body>
</html>
`;
writeFileSync(join(dir, 'dist/index.html'), standalone);

const cdn = ['react', 'react-dom'].map((n) => `<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/${n}.production.min.js"></script>`)
  .map((tag, i) => (i ? tag.replace('/react/18.3.1/umd/react-dom', '/react-dom/18.3.1/umd/react-dom') : tag));
const artifact = `${head}\n${body}\n${cdn.join('\n')}\n${appScripts}\n`;
writeFileSync(join(dir, 'dist-artifact.html'), artifact);

const kb = (s) => Math.round(Buffer.byteLength(s) / 1024) + ' KB';
console.log(`dist/index.html ${kb(standalone)} · dist-artifact.html ${kb(artifact)}`);
