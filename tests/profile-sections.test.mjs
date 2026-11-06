import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const fixture = {
  about: { bioParagraphs: ['Admin-written cinematic biography.', 'A second editable paragraph.'] },
  tools: [
    { name: 'Premiere Pro', iconUrl: '/premiere.svg' },
    { name: 'DaVinci Resolve', iconUrl: '/resolve.svg' },
    { name: 'CapCut', iconUrl: '/capcut.svg' },
    { name: 'Affinity Designer', iconUrl: '/designer.svg' },
    { name: 'Affinity Photo', iconUrl: '/photo.svg' },
    { name: 'Figma', iconUrl: '/figma.svg' },
    { name: 'Canva', iconUrl: '/canva.svg' },
    { name: 'Admin Custom Tool', iconUrl: '' },
  ],
  workExperiences: [{ id: 'work', date: 'Ongoing', title: 'Admin Organisation', subtitle: 'Creative role', description: 'Editable role description.' }],
  studyExperiences: [{ id: 'study', date: '2024 - Present', title: 'Universitas Brawijaya', subtitle: 'Studying in Animal Science', description: null }],
  projects: [{ id: 'one' }, { id: 'two' }, { id: 'three' }],
};

const rootHref = new URL('../', import.meta.url).href;
const codeCache = new Map();
const toDataUrl = (code, content) =>
  `data:text/javascript;base64,${Buffer.from(`const __content = ${JSON.stringify(content)};\n${code}`).toString('base64')}`;

const resolveLocalFile = (base) => {
  for (const suffix of ['', '.ts', '.tsx', '/index.ts', '/index.tsx']) {
    const candidate = new URL(base.href + suffix);
    const file = fileURLToPath(candidate);
    if (existsSync(file)) return file;
  }
  return null;
};

async function compileFile(path, content) {
  // Compile a project TS/TSX file (and its local imports) with the project's own
  // compiler; keeps tests dependency-free while following the "@" alias.
  if (!codeCache.has(path)) {
    const source = read(path)
      .replace(/import\s+\{\s*useSiteContent\s*\}\s+from\s+['"][^'"]+['"];?/, 'const useSiteContent = () => ({ content: __content });')
      .replace(/import\s+Reveal\s+from\s+['"][^'"]+['"];?/, 'const Reveal = ({ children, className }) => React.createElement("div", { className }, children);')
      .replace(/import\s+['"][^'"]+\.css['"];?/g, '');
    const compiled = ts.transpileModule(source, {
      compilerOptions: { jsx: ts.JsxEmit.React, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    const names = [...compiled.matchAll(/import\s+(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g)].map((match) => match[1]);
    let code = compiled;
    for (const name of names) {
      let specifier;
      if (name.startsWith('./') || name.startsWith('../')) {
        specifier = await resolveImport(name, new URL(name, new URL(`../${path}`, import.meta.url)).href, content);
      } else if (name.startsWith('@/')) {
        specifier = await resolveImport(name, new URL(`../src/${name.slice(2)}`, import.meta.url).href, content);
      } else {
        specifier = import.meta.resolve(name);
      }
      code = code.replaceAll(`'${name}'`, JSON.stringify(specifier)).replaceAll(`"${name}"`, JSON.stringify(specifier));
    }
    codeCache.set(path, code);
  }
  return toDataUrl(codeCache.get(path), content);
}

async function resolveImport(name, baseHref, content) {
  const file = resolveLocalFile(new URL(baseHref));
  if (!file) throw new Error(`Cannot resolve import ${name} (${baseHref})`);
  const relative = fileURLToPath(new URL('../', import.meta.url));
  const path = file.slice(relative.length).replaceAll('\\', '/');
  return compileFile(path, content);
}

async function loadComponent(path, content = fixture) {
  const module = await import(await compileFile(path, content));
  return renderToStaticMarkup(React.createElement(module.default));
}

const tileNames = (html) => [...html.matchAll(/class="stack-tool-name">([^<]+)</g)].map((match) => match[1]);

test('standalone TechStack groups every admin tool exactly once in the tile grids', async () => {
  const html = await loadComponent('src/components/TechStack.tsx');
  assert.match(html, /Skills &amp; technologies/);
  assert.match(html, /Video &amp; post-production/);
  assert.match(html, /Design &amp; visual tools/);
  assert.deepEqual(tileNames(html).sort(), fixture.tools.map((tool) => tool.name).sort());
  assert.equal(new Set(tileNames(html)).size, fixture.tools.length);
  assert.equal((html.match(/class="stack-tool-grid"/g) || []).length, 2);
  assert.doesNotMatch(html, /<button|<a\s|marquee/);
});

test('tool images are lazy, decorative, and empty icon URLs get readable initials', async () => {
  const html = await loadComponent('src/components/TechStack.tsx');
  const images = html.match(/<img\b[^>]+>/g) || [];
  assert.ok(images.length > 0);
  for (const image of images) {
    assert.match(image, /alt=""/);
    assert.match(image, /loading="lazy"/);
    assert.match(image, /width="\d+"/);
    assert.match(image, /height="\d+"/);
  }
  assert.match(html, /class="[^"]*stack-icon-fallback"[^>]*>AC</);
  assert.match(read('src/components/TechStack.tsx'), /onError=/);
});

test('empty tool list renders no fabricated tools and no controls', async () => {
  const html = await loadComponent('src/components/TechStack.tsx', { ...fixture, tools: [] });
  assert.deepEqual(tileNames(html), []);
  assert.doesNotMatch(html, /<button|<a\s|<img/);
});

test('About preserves editable biography and displays organisation and education together', async () => {
  const html = await loadComponent('src/pages/About.tsx');
  for (const text of ['Admin-written cinematic biography.', 'A second editable paragraph.', 'Admin Organisation', 'Creative role', 'Editable role description.', 'Universitas Brawijaya', 'Studying in Animal Science', 'Malang, Indonesia']) {
    assert.ok(html.includes(text), `Missing editable content: ${text}`);
  }
  assert.match(html, /Experience &amp; education/);
  assert.match(html, /<ul[^>]+class="prf-history-list"/);
  assert.doesNotMatch(html, /role="tab|<button|<a\s|developer|full.stack/i);
});

test('every experience card carries a right-corner logo watermark that fades in from the left', async () => {
  const withLogo = {
    ...fixture,
    workExperiences: [{ ...fixture.workExperiences[0], logoSrc: '/organisation.svg' }],
    studyExperiences: [{ ...fixture.studyExperiences[0], logoSrc: '/university.svg' }],
  };
  const html = await loadComponent('src/pages/About.tsx', withLogo);
  assert.equal((html.match(/class="prf-history-watermark"/g) || []).length, 2);
  assert.equal((html.match(/class="prf-history-watermark" aria-hidden="true"><img/g) || []).length, 2);
  assert.match(html, /src="\/organisation\.svg"/);
  assert.match(html, /src="\/university\.svg"/);
  assert.match(html, /aria-hidden="true"/);
  const initials = await loadComponent('src/pages/About.tsx');
  assert.deepEqual([...initials.matchAll(/class="prf-history-watermark-mark">([^<]+)</g)].map((match) => match[1]), ['AO', 'UB']);
  const css = read('src/components/ProfileSections.css');
  assert.match(css, /\.prf-history-watermark img,[\s\S]*?mask-image:\s*linear-gradient\(90deg,\s*transparent 0%/);
  assert.match(css, /object-fit:\s*contain/);
  assert.match(css, /\.prf-history-card \{[\s\S]*?overflow:\s*hidden/);
});

test('creative tools render as a blurred marquee between stats and experience heading', async () => {
  const html = await loadComponent('src/pages/About.tsx');
  assert.match(html, /class="bm-root prf-tools-marquee"/);
  const statsAt = html.indexOf('<dt>Projects in portfolio</dt>');
  const marqueeAt = html.indexOf('class="bm-root prf-tools-marquee"');
  const headingAt = html.indexOf('Experience &amp; education');
  assert.ok(statsAt >= 0 && statsAt < marqueeAt && marqueeAt < headingAt);
  const count = (haystack, needle) => haystack.split(needle).length - 1;
  // Two rows moving in opposite directions; the second is purely decorative.
  assert.equal(count(html, 'class="bm-slider"'), 2);
  assert.match(html, /data-direction="right"/);
  assert.match(html, /class="bm-slider" data-direction="left" aria-hidden="true"/);
  // Server rendering measures nothing yet, so each row renders two copies.
  assert.equal(count(html, 'class="bm-unit"'), 4);
  // Every admin tool with an icon appears once per copy of each row.
  for (const tool of fixture.tools.filter((tool) => tool.iconUrl)) {
    assert.equal(count(html, `src="${tool.iconUrl}"`), 4, tool.name);
    assert.ok(html.includes(`alt="${tool.name}"`), `missing accessible name: ${tool.name}`);
  }
  // Tools without an icon fall back to a readable mono wordmark.
  assert.equal(count(html, 'bm-logo-text'), 4);
  assert.ok(html.includes('>Admin Custom Tool<'));
  // Copies beyond the first, and the whole second row, are hidden from
  // assistive technology: screen readers hear each tool name exactly once.
  assert.equal((html.match(/class="bm-unit"[^>]*aria-hidden="true"/g) || []).length, 3);
  const empty = await loadComponent('src/pages/About.tsx', { ...fixture, tools: [] });
  assert.doesNotMatch(empty, /bm-root/);
  const css = read('src/components/ui/blurred-marquee.css');
  assert.match(css, /\.bm-blur-edge/);
  assert.match(css, /\.bm-rule/);
  assert.match(css, /\.bm-unit/);
  assert.doesNotMatch(css, /@keyframes|animation\s*:/);
  // The spacing rule keeps the marquee clear of the history heading.
  assert.match(read('src/components/ProfileSections.css'), /\.prf-tools-marquee\s*\{[^}]*margin/);
  assert.match(read('src/components/ui/blurred-marquee.tsx'), /useReducedMotion/);
});

test('About statistics use live content counts rather than invented career metrics', async () => {
  const html = await loadComponent('src/pages/About.tsx');
  // Compare visible text only: markup (gradient stops, masks) is not copy.
  const text = html.replace(/<[^>]+>/g, ' ');
  assert.match(html, /<dt>Projects in portfolio<\/dt><dd>3<\/dd>/);
  assert.match(html, /<dt>Creative tools<\/dt><dd>8<\/dd>/);
  assert.doesNotMatch(text, /years|clients|satisfaction|100%/i);
  const empty = await loadComponent('src/pages/About.tsx', { ...fixture, tools: [], projects: [], workExperiences: [], studyExperiences: [] });
  assert.match(empty, /<dt>Projects in portfolio<\/dt><dd>0<\/dd>/);
  assert.match(empty, /<dt>Creative tools<\/dt><dd>0<\/dd>/);
  assert.doesNotMatch(empty, /Universitas Brawijaya|Studying in Animal Science/);
});

test('profile CSS is isolated, monochrome, responsive, and tool strip has no looping motion', () => {
  const css = read('src/components/ProfileSections.css');
  assert.match(css, /max-width:\s*1200px/);
  assert.match(css, /var\(--font-sans/);
  assert.match(css, /var\(--font-mono/);
  assert.match(css, /grayscale\(1\)/);
  assert.match(css, /repeat\(3,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css, /@media\s*\(max-width:\s*767px\)/);
  assert.match(css, /grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.doesNotMatch(css, /@keyframes|animation\s*:|infinite|\.about\b|\.tools\b/);
});
