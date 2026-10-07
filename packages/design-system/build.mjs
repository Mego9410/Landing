// Generates, from tokens.json: tokens.css (CSS custom properties for the web and the prototype),
// tokens.ts (plain values for the Expo app) and preview.html (a gallery of every
// components/<Name>/preview.html). Run: pnpm --filter @landing/design-system build
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const tokens = JSON.parse(readFileSync(join(dir, 'tokens.json'), 'utf8'));
const themes = tokens.color.themes.map((t) => t.id);
const [primary] = themes;

// A value is a string (first theme) or {themeId: value}; "{name}" is an alias.
const resolve = (v) => String(v).replace(/^\{([A-Za-z0-9_.-]+)\}$/, 'var(--$1)');
const valueFor = (value, theme) =>
  typeof value === 'object' ? value[theme] ?? value[primary] : theme === primary ? value : undefined;

const themed = [...tokens.color.tokens];
const flat = [];
for (const [family, group] of Object.entries(tokens)) {
  if (['name', 'version', 'color', 'type', 'meta'].includes(family) || !group?.tokens) continue;
  for (const t of group.tokens) (typeof t.value === 'object' ? themed : flat).push(t);
}

const block = (theme) =>
  themed
    .map((t) => [t.name, valueFor(t.value, theme)])
    .filter(([, v]) => v !== undefined)
    .map(([n, v]) => `  --${n}: ${resolve(v)};`)
    .join('\n');

const families = Object.entries(tokens.type.families).map(([n, v]) => `  --font-${n}: ${v};`);
const textStyles = tokens.type.groups.flatMap((g) =>
  g.styles.map((s) =>
    [
      `.ld-text-${s.name} {`,
      `  font-family: var(--font-${g.family});`,
      `  font-size: ${s.fontSize};`,
      `  line-height: ${s.lineHeight};`,
      `  font-weight: ${s.fontWeight};`,
      s.letterSpacing && `  letter-spacing: ${s.letterSpacing};`,
      s.name === 'numeral' && '  font-variant-numeric: tabular-nums;',
      '}',
    ]
      .filter(Boolean)
      .join('\n'),
  ),
);

const others = themes.filter((t) => t !== primary);
const css = [
  '/* Generated from tokens.json by build.mjs. Do not edit by hand. */',
  `:root {\n${block(primary)}\n${families.join('\n')}\n${flat.map((t) => `  --${t.name}: ${t.value};`).join('\n')}\n}`,
  ...others.flatMap((t) => [
    `@media (prefers-color-scheme: ${t}) {\n  :root:not([data-theme="${primary}"]) {\n${block(t).replace(/^/gm, '  ')}\n  }\n}`,
    `:root[data-theme="${t}"] {\n${block(t)}\n}`,
  ]),
  ...textStyles,
].join('\n\n');
writeFileSync(join(dir, 'tokens.css'), css + '\n');

// tokens.ts: the same values for React Native, which has no CSS variables. Aliases are resolved per theme,
// lengths become numbers and letter spacing becomes points.
const px = (v) => (typeof v === 'number' ? v : parseFloat(v));
const colorFor = (name, theme, seen = new Set()) => {
  const t = tokens.color.tokens.find((x) => x.name === name);
  const v = valueFor(t.value, theme);
  const alias = /^\{([A-Za-z0-9_.-]+)\}$/.exec(String(v));
  if (alias && !seen.has(alias[1])) return colorFor(alias[1], theme, seen.add(name));
  return v;
};
const camel = (n) => n.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const colors = Object.fromEntries(themes.map((th) => [th, Object.fromEntries(tokens.color.tokens.map((t) => [camel(t.name), colorFor(t.name, th)]))]));
const scale = (family, strip) => Object.fromEntries((tokens[family]?.tokens || []).map((t) => [t.name.replace(strip, ''), px(t.value)]));
const fontFamilies = Object.fromEntries(tokens.type.groups.map((g) => [g.family, g.name === 'Display' ? 'Fredoka' : 'Nunito']));
const text = Object.fromEntries(tokens.type.groups.flatMap((g) => g.styles.map((st) => [camel(st.name), {
  family: g.family,
  fontSize: px(st.fontSize),
  lineHeight: px(st.lineHeight),
  fontWeight: String(st.fontWeight),
  letterSpacing: st.letterSpacing ? Math.round(parseFloat(st.letterSpacing) * px(st.fontSize) * 100) / 100 : 0,
}])));
const ts = `// Generated from tokens.json by build.mjs. Do not edit by hand.
export const colors = ${JSON.stringify(colors, null, 2)} as const;
export type ThemeName = keyof typeof colors;
export type ColorName = keyof typeof colors.light;
export const space = ${JSON.stringify(scale('spacing', 'space-'), null, 2)} as const;
export const radius = ${JSON.stringify(scale('radius', 'radius-'), null, 2)} as const;
/** Font families by role; the app loads Fredoka and Nunito from @expo-google-fonts. */
export const fontFamilies = ${JSON.stringify(fontFamilies, null, 2)} as const;
export const text = ${JSON.stringify(text, null, 2)} as const;
export type TextStyleName = keyof typeof text;
`;
writeFileSync(join(dir, 'tokens.ts'), ts);

// Gallery: each preview runs in an iframe with the same preloads the design
// system page gave it (tokens, stylesheet, React, the bundle).
const head = [
  '<link rel="stylesheet" href="tokens.css">',
  '<link rel="stylesheet" href="components/bundle.css">',
  '<script src="components/lib/react.production.min.js"></script>',
  '<script src="components/lib/react-dom.production.min.js"></script>',
  '<script src="components/bundle.js"></script>',
].join('');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const names = readdirSync(join(dir, 'components'))
  .filter((n) => existsSync(join(dir, 'components', n, 'preview.html')))
  .sort((a, b) => (a === 'Cover' ? -1 : b === 'Cover' ? 1 : a.localeCompare(b)));
const cards = names.map((name) => {
  const src = readFileSync(join(dir, 'components', name, 'preview.html'), 'utf8');
  const height = Number(/height=(\d+)/.exec(src.split('\n')[0])?.[1] ?? 200);
  const doc = src.replace(/<head>/i, `<head>${head}`);
  return `<section><h2>${name}</h2><iframe title="${name}" style="height:${height}px" srcdoc="${esc(doc)}"></iframe></section>`;
});
const page = `<!doctype html>
<!-- Generated by build.mjs. Do not edit by hand. -->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Steadie design system</title>
<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="components/bundle.css">
<style>
  main { max-width: 1000px; margin: 0 auto; padding: var(--space-8) var(--space-4); display: grid; gap: var(--space-6); }
  section { background: var(--surface-raised); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); overflow: hidden; }
  h2 { margin: 0; padding: var(--space-3) var(--space-4) 0; font: 700 13px/18px var(--font-body); letter-spacing: .02em; color: var(--ink-muted); }
  iframe { display: block; width: 100%; border: 0; }
</style>
</head>
<body>
<main>
${cards.join('\n')}
</main>
<script>
  // Grow each frame to its content once React has rendered.
  document.querySelectorAll('iframe').forEach(function (f) {
    f.addEventListener('load', function () {
      setTimeout(function () { f.style.height = Math.max(f.offsetHeight, f.contentDocument.documentElement.scrollHeight) + 'px'; }, 50);
    });
  });
</script>
</body>
</html>
`;
writeFileSync(join(dir, 'preview.html'), page);
console.log(`tokens.css and tokens.ts: ${themed.length + flat.length} tokens; preview.html: ${names.length} previews`);
