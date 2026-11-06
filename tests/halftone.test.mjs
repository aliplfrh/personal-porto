import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { hexToRgb, dotRadius, springStep, displacement, cellCoverage } from '../src/components/ui/halftone/geometry.ts';

test('hex parsing accepts short/full hex and rejects unsupported formats', () => {
  assert.deepEqual(hexToRgb('#abc'), [170, 187, 204]);
  assert.deepEqual(hexToRgb(' FFFFFF '), [255, 255, 255]);
  assert.deepEqual(hexToRgb('#000000'), [0, 0, 0]);
  for (const value of ['', '#xyz', '#abcd', 'rgb(0,0,0)']) assert.equal(hexToRgb(value), null);
});

test('coverage radius clamps and scales area proportionally', () => {
  assert.equal(dotRadius(-1, 6), 0);
  assert.equal(dotRadius(2, 6), dotRadius(1, 6));
  assert.equal(dotRadius(0.25, 6), dotRadius(1, 6) / 2);
});

test('spring rests at home without a pointer', () => {
  assert.deepEqual(springStep(10, 10, 0, 0, 10, 10, -1000, -1000, 80), [10, 10, 0, 0]);
});

test('pointer repels nearby dots; zero radius disables push', () => {
  assert.ok(springStep(10, 0, 0, 0, 10, 0, 0, 0, 80)[0] > 10);
  assert.deepEqual(springStep(10, 0, 0, 0, 10, 0, 0, 0, 0), [10, 0, 0, 0]);
  assert.ok(springStep(0, 0, 0, 0, 0, 0, 0, 0, 80).every(Number.isFinite));
});

test('displaced dot settles home after pointer leaves', () => {
  let dot = [50, -20, 5, 3];
  for (let i = 0; i < 240; i++) dot = springStep(...dot, 0, 0, -1000, -1000, 80);
  for (const value of dot) assert.ok(Math.abs(value) < 0.001);
});

test('displacement is bounded and handles zero span', () => {
  assert.equal(displacement(0, 0, 0, 0, 28), 0);
  assert.equal(displacement(3, 4, 0, 0, 10), 0.5);
  assert.equal(displacement(100, 0, 0, 0, 28), 1);
  assert.equal(displacement(3, 4, 0, 0, 0), 0);
});

test('cell coverage samples alpha and clamps at right/bottom edges', () => {
  const pixels = new Uint8ClampedArray(4 * 4 * 4);
  assert.equal(cellCoverage(pixels, 4, 0, 0, 6), 0);
  for (let i = 3; i < pixels.length; i += 4) pixels[i] = 255;
  assert.equal(cellCoverage(pixels, 4, 0, 0, 6), 1);
  pixels.fill(0);
  pixels[pixels.length - 1] = 255;
  assert.ok(cellCoverage(pixels, 4, 0, 0, 6) > 0);
});

test('footer uses halftone wrapper without adding controls or changing destinations', () => {
  const source = readFileSync(new URL('../src/components/Footer.tsx', import.meta.url), 'utf8');
  assert.match(source, /<HalftoneWordmarkFooter/);
  assert.equal((source.match(/<a\s/g) || []).length, 6);
  assert.doesNotMatch(source, /<button|Back to top|hello@halden|Careers/);
  for (const href of ['https://github.com/aliplfrh', 'https://linkedin.com/in/aliplfrh', 'https://youtube.com/@aliplfrh', 'https://instagram.com/aliplfrh']) {
    assert.ok(source.includes(href));
  }
  assert.equal((source.match(/href=\{content.resumeUrl\}/g) || []).length, 2);
});
