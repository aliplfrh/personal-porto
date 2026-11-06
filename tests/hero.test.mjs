import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('home keeps the original hero above about, with footer outside main', () => {
  const app = read('src/App.tsx');
  const home = app.slice(app.indexOf('function HomePage()'), app.indexOf('function App()'));
  assert.ok(home.indexOf('<Hero') >= 0);
  assert.ok(home.indexOf('<Hero') < home.indexOf('<About'));
  assert.doesNotMatch(home, /<TechStack|<Footer/);
  assert.ok(app.indexOf('<Footer') > app.indexOf('</main>'));
});

test('hero stays on the original bento layout rather than the halftone composition', () => {
  const hero = read('src/components/Hero.tsx');
  assert.match(hero, /className="hero-grid"/);
  assert.match(hero, /<WorldMap \/>/);
  assert.match(hero, /<Clock \/>/);
  assert.doesNotMatch(hero, /HalftoneWordmark|wordmark="alief"/);
  for (const property of ['greeting', 'status', 'bio']) assert.ok(hero.includes(`content.hero.${property}`));
  assert.match(hero, /content.resumeUrl/);
});

test('footer retains aliplfrh and composes shared field without extra footer landmarks', () => {
  const footer = read('src/components/ui/halftone-wordmark-footer.tsx');
  const field = read('src/components/ui/halftone-wordmark.tsx');
  assert.match(footer, /wordmark = 'aliplfrh'/);
  assert.match(footer, /<footer/);
  assert.match(footer, /<HalftoneWordmark/);
  assert.doesNotMatch(field, /<footer/);
  assert.match(field, /prefers-reduced-motion/);
  assert.match(field, /visibilitychange/);
});

test('bottom footer keeps its six original destinations and adds no controls', () => {
  const source = read('src/components/Footer.tsx');
  assert.match(source, /<HalftoneWordmarkFooter/);
  assert.equal((source.match(/<a\s/g) || []).length, 6);
  assert.doesNotMatch(source, /<button|Back to top|hello@halden|Careers/);
  for (const href of ['https://github.com/aliplfrh', 'https://linkedin.com/in/aliplfrh', 'https://youtube.com/@aliplfrh', 'https://instagram.com/aliplfrh']) {
    assert.ok(source.includes(href));
  }
  assert.equal((source.match(/href=\{content.resumeUrl\}/g) || []).length, 2);
});
