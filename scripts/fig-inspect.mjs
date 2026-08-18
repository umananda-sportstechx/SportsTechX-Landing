#!/usr/bin/env node
/**
 * Read design/nodes.json while building. Not part of the app.
 *
 *   node scripts/fig-inspect.mjs                     list top-level frames
 *   node scripts/fig-inspect.mjs "Intro Hero" 3      tree under a named frame
 *   node scripts/fig-inspect.mjs --text "Stats"      just the copy, in order
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const nodes = JSON.parse(readFileSync(resolve(ROOT, 'design/nodes.json'), 'utf8'));

const byId = new Map(nodes.map((n) => [n.id, n]));
const kids = new Map();
for (const n of nodes) {
  if (!n.parent) continue;
  if (!kids.has(n.parent)) kids.set(n.parent, []);
  kids.get(n.parent).push(n);
}
// Figma orders siblings by a fractional index string compared bytewise, not by locale.
for (const list of kids.values()) list.sort((a, b) => (String(a.order) < String(b.order) ? -1 : 1));

const args = process.argv.slice(2);
const textOnly = args.includes('--text');
const rest = args.filter((a) => a !== '--text');
const name = rest[0];
const maxDepth = Number(rest[1] ?? 3);

const label = (n) => {
  const parts = [n.type.toLowerCase(), n.name];
  if (n.size) parts.push(`${n.size.w}x${n.size.h}`);
  if (n.at) parts.push(`@${n.at.x},${n.at.y}`);
  if (n.radius) parts.push(`r${n.radius}`);
  if (n.radii && new Set(n.radii).size > 1) parts.push(`r[${n.radii.join(',')}]`);
  if (n.layout) parts.push(`${n.layout.dir === 'HORIZONTAL' ? 'row' : 'col'} gap${n.layout.gap} pad[${n.layout.pad.join(',')}]`);
  const fill = n.fills?.find((f) => f.color || f.image || f.stops);
  const op = (f) => (f.opacity < 1 ? ` ${Math.round(f.opacity * 100)}%` : '');
  if (fill?.color) parts.push(fill.color + (fill.alpha < 1 ? `/${fill.alpha}` : '') + op(fill));
  else if (fill?.image) parts.push(`img:${fill.image.slice(0, 8)}`);
  else if (fill?.stops) parts.push(`grad(${fill.stops.map((s) => s.color).join('→')})`);
  if (n.strokes?.[0]?.color) parts.push(`border ${n.strokeWeight}px ${n.strokes[0].color}`);
  if (n.text) {
    const t = n.text;
    const ls = t.letterSpacing ? `${t.letterSpacing.v}${t.letterSpacing.units === 'PERCENT' ? '%' : 'px'}` : '0';
    const lh = t.lineHeight ? `${t.lineHeight.v}${t.lineHeight.units === 'PERCENT' ? '%' : 'px'}` : 'auto';
    parts.push(`| ${t.family} ${t.style} ${t.size}/${lh} ls${ls} ${t.align ?? ''} ${t.case ?? ''}`);
    parts.push(`"${t.chars.replace(/\n/g, ' / ').slice(0, 60)}"`);
  }
  return parts.join('  ');
};

function walk(n, depth) {
  if (depth > maxDepth) return;
  if (textOnly) {
    if (n.text) console.log(`${'  '.repeat(depth)}${n.text.chars.replace(/\n/g, ' / ')}`);
  } else {
    console.log(`${'  '.repeat(depth)}${label(n)}`);
  }
  for (const c of kids.get(n.id) ?? []) walk(c, depth + 1);
}

if (!name) {
  for (const n of nodes.filter((x) => x.type === 'CANVAS')) {
    console.log(`CANVAS ${n.name}`);
    for (const c of kids.get(n.id) ?? []) console.log(`  ${c.name}  ${c.size ? `${c.size.w}x${c.size.h}` : ''}`);
  }
} else {
  const matches = nodes.filter((n) => n.name === name);
  if (!matches.length) {
    console.error(`no node named "${name}". Close matches:`);
    const q = name.toLowerCase();
    for (const n of nodes.filter((x) => x.name?.toLowerCase().includes(q)).slice(0, 15)) console.error(`  ${n.name}`);
    process.exit(1);
  }
  matches.forEach((m, i) => {
    if (matches.length > 1) {
      // Name the ancestor chain up to (but not including) the page, so the six
      // copies of every frame — desktop/mobile/menu x light/dark — are tellable apart.
      const chain = [];
      let cur = byId.get(m.parent);
      for (let g = 0; cur && cur.type !== 'CANVAS' && g < 50; g++, cur = byId.get(cur.parent)) chain.unshift(cur.name);
      console.log(`\n### match ${i + 1}/${matches.length} — ${chain.join(' > ') || '(top level)'}`);
    }
    walk(m, 0);
  });
}
