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

test('hero is the glass prism scene fed by admin content', () => {
  const hero = read('src/components/Hero.tsx');
  assert.match(hero, /<GlassPrismHero/);
  assert.match(hero, /headline=\{content\.hero\.greeting\}/);
  assert.match(hero, /eyebrow=\{content\.hero\.status\}/);
  assert.match(hero, /description=\{content\.hero\.bio\}/);
  assert.match(hero, /content\.resumeUrl/);
  assert.doesNotMatch(hero, /WorldMap|Clock|HalftoneWordmark|hero-grid/);
  const source = read('src/components/ui/glass-prism-hero.tsx');
  // Plain WebGL — no 3D library was added for the scene.
  assert.match(source, /getContext\("webgl"/);
  assert.match(source, /prefers-reduced-motion/);
  // No scroll hint and no stage fade: the handoff is a continuous dot field,
  // phase-synced to the page background.
  assert.doesNotMatch(source, /scrollHint|gph-hint|gph-wheel/);
  assert.doesNotMatch(source, /stageRef\.current\.style\.opacity/);
  assert.match(source, /--dot-phase-y/);
  const gphCss = read('src/components/ui/glass-prism-hero.css');
  assert.match(gphCss, /\.gph-stage/);
  assert.doesNotMatch(gphCss, /gph-hint|gph-wheel/);
  // The bento widgets are gone and the site texture is the hero's dot grid.
  const css = read('src/index.css');
  assert.match(css, /background-size: 20px 13px/);
  assert.ok(!css.includes('64px 64px'), 'square grid background still present');
  for (const dead of ['hero-grid', 'profile-widget', 'map-widget', 'tech-widget', 'code-widget', 'art-widget', 'badge-widget']) {
    assert.ok(!css.includes(dead), `leftover hero-bento css: ${dead}`);
  }
  const pkg = JSON.parse(read('package.json'));
  assert.doesNotMatch(JSON.stringify(pkg.dependencies), /three|regl|pixi/);
});

test('statement carries the intro copy for the hero handoff', () => {
  const statement = read('src/components/Statement.tsx');
  assert.ok(statement.includes('Im a visual artist based in Indonesia,'));
  assert.ok(statement.includes('shaping cinematic edits and visual identities that carry feeling from first frame to last.'));
  assert.doesNotMatch(statement, /Alief Lutfa'ul Ridho is a visual artist/);
  // Portrait card: the artist's photo framed by masked hairlines.
  assert.match(statement, /i\.imgur\.com\/K35klRx\.jpeg/);
  assert.match(statement, /statement-portrait/);
  const css = read('src/index.css');
  assert.match(css, /statement-line-v/);
  assert.match(css, /radial-gradient\(ellipse closest-side, #000 60%, transparent 100%\)/);
  assert.match(css, /align-self: stretch/);
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
