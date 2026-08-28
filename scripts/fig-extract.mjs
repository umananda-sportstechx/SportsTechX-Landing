#!/usr/bin/env node
/**
 * Decode STX-Figma.fig into design tokens, a slim node tree, and image assets.
 *
 * A .fig is a zip:  canvas.fig + thumbnail.png + meta.json + images/<sha1>
 * canvas.fig is Figma's "fig-kiwi" container:
 *   "fig-kiwi" magic, uint32 version, then length-prefixed blocks.
 *   block 0 = the kiwi schema (raw deflate)
 *   block 1 = the document Message (zstd, needs Node >= 23.8)
 * Everything is decoded with node:zlib — no dependencies.
 *
 * Usage:  node scripts/fig-extract.mjs [--check]
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { inflateRawSync, zstdDecompressSync } from 'node:zlib';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// `--file` points the decoder at another board (interactions.fig) without
// touching the pipeline below, which is specific to the main design file.
const argFile = process.argv.indexOf('--file');
const FIG = resolve(ROOT, argFile > -1 ? process.argv[argFile + 1] : 'STX-Figma.fig');

/* ---------- zip ---------- */

function unzip(buf) {
  // End-of-central-directory, scanned backwards. No zip64 handling: this file
  // is 28MB / 33 entries, far under the 4GB / 65535 thresholds.
  let eocd = buf.length - 22;
  while (eocd >= 0 && buf.readUInt32LE(eocd) !== 0x06054b50) eocd--;
  assert.ok(eocd >= 0, 'not a zip: no end-of-central-directory record');

  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const entries = new Map();

  for (let i = 0; i < count; i++) {
    assert.equal(buf.readUInt32LE(p), 0x02014b50, `bad central directory entry ${i}`);
    const method = buf.readUInt16LE(p + 10);
    const compSize = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const localAt = buf.readUInt32LE(p + 42);
    const name = buf.toString('utf8', p + 46, p + 46 + nameLen);
    p += 46 + nameLen + extraLen + commentLen;
    if (name.endsWith('/')) continue;
    // The local header repeats name/extra with its own lengths — trust those.
    const dataAt = localAt + 30 + buf.readUInt16LE(localAt + 26) + buf.readUInt16LE(localAt + 28);
    const raw = buf.subarray(dataAt, dataAt + compSize);
    entries.set(name, method === 0 ? raw : inflateRawSync(raw));
  }
  return entries;
}

/* ---------- kiwi ---------- */

class Reader {
  constructor(b) {
    this.b = b;
    this.i = 0;
  }
  uint() {
    let v = 0, s = 0, c;
    do {
      c = this.b[this.i++];
      v |= (c & 127) << s;
      s += 7;
    } while (c & 128);
    return v >>> 0;
  }
  int() {
    const v = this.uint();
    return v & 1 ? ~(v >>> 1) : v >>> 1;
  }
  uint64() {
    let v = 0n, s = 0n, c;
    do {
      c = this.b[this.i++];
      v |= BigInt(c & 127) << s;
      s += 7n;
    } while (c & 128);
    return v;
  }
  int64() {
    const v = this.uint64();
    return v & 1n ? -((v >> 1n) + 1n) : v >> 1n;
  }
  byte() {
    return this.b[this.i++];
  }
  bool() {
    return !!this.b[this.i++];
  }
  // kiwi varfloat: a lone 0 byte means 0.0, otherwise 4 bytes rotated left by 23
  float() {
    if (this.b[this.i] === 0) {
      this.i++;
      return 0;
    }
    let bits =
      this.b[this.i] | (this.b[this.i + 1] << 8) | (this.b[this.i + 2] << 16) | (this.b[this.i + 3] << 24);
    this.i += 4;
    bits = (bits << 23) | (bits >>> 9);
    const tmp = Buffer.allocUnsafe(4);
    tmp.writeInt32LE(bits | 0);
    return tmp.readFloatLE(0);
  }
  string() {
    const s = this.i;
    while (this.b[this.i]) this.i++;
    const v = this.b.toString('utf8', s, this.i);
    this.i++;
    return v;
  }
}

const PRIMS = ['bool', 'byte', 'int', 'uint', 'float', 'string', 'int64', 'uint64'];
const ENUM = 0;
const STRUCT = 1;

function parseSchema(buf) {
  const r = new Reader(buf);
  const n = r.uint();
  const defs = [];
  for (let d = 0; d < n; d++) {
    const name = r.string();
    const kind = r.byte();
    const fc = r.uint();
    const fields = [];
    for (let f = 0; f < fc; f++) {
      fields.push({ name: r.string(), type: r.int(), isArray: r.bool(), value: r.uint() });
    }
    defs.push({ name, kind, fields, byId: new Map(fields.map((f) => [f.value, f])) });
  }
  return defs;
}

function makeDecoder(defs) {
  const array = (r, type) => {
    const n = r.uint();
    const a = new Array(n);
    for (let k = 0; k < n; k++) a[k] = value(r, type);
    return a;
  };

  const message = (r, def) => {
    const o = {};
    for (;;) {
      const id = r.uint();
      if (id === 0) return o;
      const f = def.byId.get(id);
      assert.ok(f, `unknown field ${id} in ${def.name} at byte ${r.i}`);
      o[f.name] = f.isArray ? array(r, f.type) : value(r, f.type);
    }
  };

  const value = (r, type) => {
    if (type < 0) {
      switch (PRIMS[-type - 1]) {
        case 'bool': return r.bool();
        case 'byte': return r.byte();
        case 'int': return r.int();
        case 'uint': return r.uint();
        case 'float': return r.float();
        case 'string': return r.string();
        case 'int64': return Number(r.int64());
        case 'uint64': return Number(r.uint64());
      }
    }
    const def = defs[type];
    if (def.kind === ENUM) {
      const v = r.uint();
      return def.fields.find((f) => f.value === v)?.name ?? v;
    }
    if (def.kind === STRUCT) {
      const o = {};
      for (const f of def.fields) o[f.name] = f.isArray ? array(r, f.type) : value(r, f.type);
      return o;
    }
    return message(r, def);
  };

  return message;
}

function decodeCanvas(canvas) {
  assert.equal(canvas.toString('latin1', 0, 8), 'fig-kiwi', 'canvas.fig is not fig-kiwi');
  const blocks = [];
  let off = 12; // 8 byte magic + uint32 version
  while (off + 4 <= canvas.length) {
    const n = canvas.readUInt32LE(off);
    off += 4;
    if (!n || off + n > canvas.length) break;
    const raw = canvas.subarray(off, off + n);
    off += n;
    // zstd magic 28 b5 2f fd, otherwise raw deflate
    blocks.push(raw[0] === 0x28 && raw[1] === 0xb5 ? zstdDecompressSync(raw) : inflateRawSync(raw));
  }
  assert.equal(blocks.length, 2, `expected schema + document, got ${blocks.length} blocks`);

  const defs = parseSchema(blocks[0]);
  const message = makeDecoder(defs);
  const r = new Reader(blocks[1]);
  const doc = message(r, defs.find((d) => d.name === 'Message'));
  // A correct decode consumes every byte. Short of that we misread a field and
  // everything downstream is silently garbage, so fail loudly here.
  assert.equal(r.i, blocks[1].length, `decode consumed ${r.i}/${blocks[1].length} bytes`);
  return doc;
}

/* ---------- shaping ---------- */

const gid = (g) => (g ? `${g.sessionID}:${g.localID}` : null);
const hex = (c) => '#' + [c.r, c.g, c.b].map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
const round = (n) => (typeof n === 'number' ? Math.round(n * 100) / 100 : n);

function paint(p) {
  if (p.visible === false) return null;
  const base = { type: p.type, opacity: round(p.opacity ?? 1) };
  if (p.type === 'SOLID' && p.color) return { ...base, color: hex(p.color), alpha: round(p.color.a ?? 1) };
  if (p.image?.hash) return { ...base, image: Buffer.from(p.image.hash).toString('hex'), scaleMode: p.imageScaleMode };
  if (p.stops) {
    return {
      ...base,
      stops: p.stops.map((s) => ({ at: round(s.position), color: hex(s.color), alpha: round(s.color.a ?? 1) })),
      transform: p.transform,
    };
  }
  return base;
}

function slim(n) {
  const o = {
    id: gid(n.guid),
    parent: gid(n.parentIndex?.guid),
    order: n.parentIndex?.position,
    type: n.type,
    name: n.name,
  };
  // Layers the designer switched off. They are kept in the tree so the decode
  // stays lossless, but everything downstream must ignore them — rendering one
  // puts artwork on the page that the design deliberately hides.
  if (n.visible === false) o.hidden = true;
  if (n.size) o.size = { w: round(n.size.x), h: round(n.size.y) };
  if (n.transform) {
    o.at = { x: round(n.transform.m02), y: round(n.transform.m12) };
    // Rotation matters more than it looks: Figma draws every divider as a LINE
    // that is 0px tall and rotated 90deg. Without the angle a vertical rule is
    // indistinguishable from a horizontal one in this data, which is how a dozen
    // of them got skipped when the sections were first built.
    const angle = Math.round((Math.atan2(n.transform.m10, n.transform.m00) * 180) / Math.PI);
    if (angle) o.rotation = angle;
  }

  const fills = (n.fillPaints ?? []).map(paint).filter(Boolean);
  if (fills.length) o.fills = fills;

  const strokes = (n.strokePaints ?? []).map(paint).filter(Boolean);
  if (strokes.length) {
    o.strokes = strokes;
    o.strokeWeight = round(n.strokeWeight);
  }

  if (n.cornerRadius != null) o.radius = round(n.cornerRadius);
  if (n.rectangleTopLeftCornerRadius != null) {
    o.radii = [
      n.rectangleTopLeftCornerRadius,
      n.rectangleTopRightCornerRadius,
      n.rectangleBottomRightCornerRadius,
      n.rectangleBottomLeftCornerRadius,
    ].map(round);
  }
  if (n.opacity != null && n.opacity !== 1) o.opacity = round(n.opacity);

  if (n.stackMode && n.stackMode !== 'NONE') {
    o.layout = {
      dir: n.stackMode,
      gap: round(n.stackSpacing),
      pad: [n.stackVerticalPadding, n.stackPaddingRight, n.stackPaddingBottom, n.stackHorizontalPadding].map(round),
      align: n.stackCounterAlignItems,
      justify: n.stackPrimaryAlignItems,
    };
  }

  if (n.textData?.characters) {
    o.text = {
      chars: n.textData.characters,
      family: n.fontName?.family,
      style: n.fontName?.style,
      size: round(n.fontSize),
      letterSpacing: n.letterSpacing ? { v: round(n.letterSpacing.value), units: n.letterSpacing.units } : null,
      lineHeight: n.lineHeight ? { v: round(n.lineHeight.value), units: n.lineHeight.units } : null,
      align: n.textAlignHorizontal,
      case: n.textCase,
      deco: n.textDecoration,
    };
  }

  if (n.effects?.length) {
    // Keep the full effect payload. Figma's NOISE and DROP_SHADOW effects carry
    // the page's grain and all of its depth; dropping their parameters is how
    // the first build ended up looking flat and untextured.
    o.effects = n.effects
      .filter((e) => e.visible !== false)
      .map((e) => ({
        type: e.type,
        radius: round(e.radius),
        color: e.color ? hex(e.color) : undefined,
        alpha: round(e.color?.a ?? 1),
        offset: e.offset,
        spread: round(e.spread),
        noiseSize: round(e.noiseSize),
        density: round(e.density),
        secondaryColor: e.secondaryColor ? hex(e.secondaryColor) : undefined,
      }));
  }
  return o;
}

function tokens(nodes) {
  const colors = new Map();
  const radii = new Map();
  const type = new Map();
  const fonts = new Map();
  const tally = (m, k) => m.set(k, (m.get(k) ?? 0) + 1);

  for (const n of nodes) {
    if (n.hidden) continue; // a switched-off layer must not pollute the palette or type scale
    for (const f of [...(n.fills ?? []), ...(n.strokes ?? [])]) {
      if (f.color) tally(colors, f.color + (f.alpha < 1 ? `/${f.alpha}` : ''));
      for (const s of f.stops ?? []) tally(colors, s.color + (s.alpha < 1 ? `/${s.alpha}` : ''));
    }
    if (n.radius) tally(radii, n.radius);
    for (const r of n.radii ?? []) if (r) tally(radii, r);
    if (n.text?.family) {
      tally(fonts, `${n.text.family} ${n.text.style}`);
      const ls = n.text.letterSpacing;
      const lh = n.text.lineHeight;
      tally(
        type,
        JSON.stringify({
          font: `${n.text.family} ${n.text.style}`,
          size: n.text.size,
          letterSpacing: ls ? `${ls.v}${ls.units === 'PERCENT' ? '%' : 'px'}` : '0',
          lineHeight: lh ? `${lh.v}${lh.units === 'PERCENT' ? '%' : 'px'}` : 'auto',
        })
      );
    }
  }

  const sorted = (m) => [...m.entries()].sort((a, b) => b[1] - a[1]);
  return {
    fonts: Object.fromEntries(sorted(fonts)),
    colors: Object.fromEntries(sorted(colors)),
    radii: Object.fromEntries(sorted(radii)),
    typeScale: sorted(type).map(([k, count]) => ({ ...JSON.parse(k), count })),
  };
}

/* ---------- vector geometry ----------
 * A VECTOR node's outline lives in `fillGeometry`/`strokeGeometry` as a
 * `commandsBlob` index into doc.blobs. Each blob is a byte opcode followed by
 * float32 pairs:
 *
 *   0 close   1 moveTo(1)   2 lineTo(1)   3 quadTo(2)   4 cubicTo(3)
 *
 * Figma flattens a stroke into the same kind of outline, so a 1.5px stroked
 * icon comes back as a fillable path — exactly what an SVG wants. Decoding
 * this is the only way to get the icons and the two wordmarks out: they are
 * flattened vectors with no image fill, so the asset pass never saw them.
 */
const ARITY = [0, 2, 2, 4, 6];
const CMD = ['Z', 'M', 'L', 'Q', 'C'];
const r3 = (n) => Math.round(n * 1000) / 1000;

function pathFromBlob(bytes) {
  const b = Buffer.from(bytes);
  let o = 0;
  const out = [];
  const box = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
  while (o < b.length) {
    const op = b[o++];
    assert.ok(op < ARITY.length, `unknown path opcode ${op} at byte ${o - 1}`);
    const n = ARITY[op];
    assert.ok(o + n * 4 <= b.length, 'path blob truncated');
    const args = [];
    for (let j = 0; j < n; j++) args.push(b.readFloatLE(o + j * 4));
    o += n * 4;
    for (let j = 0; j < n; j += 2) {
      box.x0 = Math.min(box.x0, args[j]);
      box.x1 = Math.max(box.x1, args[j]);
      box.y0 = Math.min(box.y0, args[j + 1]);
      box.y1 = Math.max(box.y1, args[j + 1]);
    }
    out.push(CMD[op] + args.map(r3).join(' '));
  }
  // Same contract as the document decode: consume every byte or fail loudly,
  // because a misread path still renders, just as the wrong shape.
  assert.equal(o, b.length, `path blob consumed ${o}/${b.length} bytes`);
  return { d: out.join(''), box };
}

/* The flattened vectors the Solutions cards need. These carry no image fill,
 * so the asset pass below never saw them and they were standing in as type and
 * as approximations. Colours are baked in because each is the same in both
 * themes: the number pill is white with a black glyph either way. */
const RINGS = 'atlas-rings';
const VECTORS = [
  { file: RINGS, id: '6018:2687', geom: 'stroke' },
  { file: 'wordmark-playmakers', id: '6018:2680', geom: 'fill', color: '#ffffff' },
  { file: 'wordmark-atlas', id: '6018:2770', geom: 'fill', color: '#000000' },
  { file: 'icon-playmakers-1', id: '6018:2618', geom: 'stroke', color: '#000000' },
  { file: 'icon-playmakers-2', id: '6018:2638', geom: 'stroke', color: '#000000' },
  { file: 'icon-playmakers-3', id: '6018:2658', geom: 'stroke', color: '#000000' },
  { file: 'icon-atlas-1', id: '6018:2709', geom: 'stroke', color: '#000000' },
  { file: 'icon-atlas-2', id: '6018:2729', geom: 'stroke', color: '#000000' },
  { file: 'icon-atlas-3', id: '6018:2750', geom: 'stroke', color: '#000000' },
  // Media card action glyphs, beside SUBSCRIBE / LISTEN / READ / ATTEND.
  { file: 'icon-media-newsletter', id: '6018:2569', geom: 'stroke', color: '#878787' },
  { file: 'icon-media-podcast', id: '6018:2556', geom: 'stroke', color: '#878787' },
  { file: 'icon-media-reports', id: '6018:2544', geom: 'stroke', color: '#878787' },
  { file: 'icon-media-events', id: '6018:2530', geom: 'stroke', color: '#878787' },
  // Footer contact + social glyphs. Emitted opaque: the page uses them as CSS
  // masks tinted with currentColor, so the artboard's 70% rides on the text
  // colour instead of being baked in twice.
  { file: 'icon-footer-mail', id: '6018:2473', geom: 'stroke', color: '#000000' },
  { file: 'icon-footer-pin', id: '6018:2476', geom: 'stroke', color: '#000000' },
  { file: 'icon-footer-linkedin', id: '6018:2501', geom: 'fill', color: '#000000' },
  { file: 'icon-footer-youtube', id: '6018:2504', geom: 'fill', color: '#000000' },
  { file: 'icon-footer-instagram', id: '6018:2507', geom: 'fill', color: '#000000' },
  { file: 'icon-footer-x', id: '6018:2510', geom: 'fill', color: '#000000' },
];


/* ---------- run ---------- */

const zip = unzip(readFileSync(FIG));
const doc = decodeCanvas(zip.get('canvas.fig'));

// `--raw <name>` dumps undigested nodeChanges while working out what the
// format carries. Nothing downstream depends on it.
if (process.argv.includes('--raw')) {
  const want = process.argv[process.argv.indexOf('--raw') + 1];
  console.log('doc keys:', Object.keys(doc).map((k) => `${k}${Array.isArray(doc[k]) ? `[${doc[k].length}]` : ''}`).join(' '));
  const key = (n) => `${n.guid.sessionID}:${n.guid.localID}`;
  for (const n of doc.nodeChanges.filter((n) => n.name === want || key(n) === want).slice(0, 2)) {
    console.log('---', n.name, n.type, '---');
    for (const [k, v] of Object.entries(n)) {
      const s = JSON.stringify(v);
      console.log(' ', k.padEnd(22), s.length > 300 ? s.slice(0, 300) + `... (${s.length} chars)` : s);
    }
  }
  process.exit(0);
}

const nodes = doc.nodeChanges.map(slim);

// `--dump <path>` writes just the slim tree and stops. Everything past this
// point is written for the main design file — it rewrites design/ and prunes
// public/images against whatever it just read, so a second board must not
// reach it.
const argDump = process.argv.indexOf('--dump');
if (argDump > -1) {
  writeFileSync(process.argv[argDump + 1], JSON.stringify(nodes, null, 2));
  console.log(`${nodes.length} nodes -> ${process.argv[argDump + 1]}`);
  process.exit(0);
}

const tok = tokens(nodes);

if (process.argv.includes('--check')) {
  assert.ok(nodes.length > 2000, `expected >2000 nodes, got ${nodes.length}`);
  assert.ok(tok.colors['#ec1e5f'], 'brand pink #ec1e5f missing — is this the right design file?');
  assert.ok(tok.fonts['Bebas Neue Regular'], 'Bebas Neue missing');
  assert.ok(nodes.some((n) => n.name === 'Intro Hero'), 'Intro Hero frame missing');
  assert.ok(nodes.filter((n) => n.text).length > 400, 'expected >400 text nodes');

  // Regression guard: hidden layers were once extracted as if they were live,
  // which put a grain wash and a fade over the hero that the design switched off.
  const hidden = nodes.filter((n) => n.hidden);
  assert.ok(hidden.length > 0, 'no hidden nodes found — is node-level `visible` still being read?');
  assert.ok(
    hidden.some((n) => n.name === 'Noise Textiure'),
    'the hero noise layer is hidden in the design but did not come through marked hidden'
  );

  // Guard for the same class of bug: dividers are rotated LINEs, and dropping
  // the angle makes every vertical rule read as a horizontal one.
  const rotated = nodes.filter((n) => n.type === 'LINE' && n.rotation);
  assert.ok(rotated.length > 10, `expected rotated LINE dividers, found ${rotated.length}`);

  // The grain on the dark surfaces and every shadow on the page come from
  // effects. Losing them is invisible in the data but obvious on screen.
  const withEffect = (t) => nodes.filter((n) => (n.effects ?? []).some((e) => e.type === t));
  assert.ok(withEffect('NOISE').length > 5, 'NOISE effects missing — the dark surfaces lose their grain');
  assert.ok(withEffect('DROP_SHADOW').length > 20, 'DROP_SHADOW effects missing — the page loses its depth');
  // The Solutions glyphs, wordmarks and rings are flattened vectors whose
  // outlines only exist as commandsBlob paths. If that decode breaks the page
  // silently loses its icons and logotypes, so pin it here.
  const byGuid = new Map(doc.nodeChanges.map((n) => [gid(n.guid), n]));
  for (const v of VECTORS) {
    const n = byGuid.get(v.id);
    assert.ok(n, `vector ${v.id} (${v.file}) is not in the document`);
    const g = n[`${v.geom}Geometry`];
    assert.ok(g?.length, `${v.file}: no ${v.geom}Geometry to decode`);
    const parts = g.map((e) => pathFromBlob(doc.blobs[e.commandsBlob].bytes));
    const box = parts.map((p) => p.box).reduce((a, b) => ({
      x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0),
      x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1),
    }));
    // A stroked outline is the node box grown by half the stroke on each side.
    // Anything wildly off means the opcode arities have drifted.
    if (v.geom === 'stroke' && v.file !== RINGS) {
      assert.ok(
        Math.abs(box.x1 - box.x0 - n.size.x - n.strokeWeight) < 0.2,
        `${v.file}: outline ${(box.x1 - box.x0).toFixed(2)} does not match node ${n.size.x} + ${n.strokeWeight} stroke`
      );
    }
    const subpaths = parts.reduce((a, p) => a + (p.d.match(/M/g)?.length ?? 0), 0);
    assert.ok(subpaths > 0, `${v.file}: decoded no subpaths`);
    if (v.file === RINGS) assert.ok(subpaths > 100, `${v.file}: only ${subpaths} subpaths — the rings are a dense stack, not a handful`);
  }
  console.log(
    `ok — ${nodes.length} nodes (${hidden.length} hidden), ${Object.keys(tok.colors).length} colors, ${Object.keys(tok.fonts).length} fonts, ${VECTORS.length} vectors`
  );
  process.exit(0);
}

mkdirSync(resolve(ROOT, 'design'), { recursive: true });
mkdirSync(resolve(ROOT, 'public/images'), { recursive: true });
writeFileSync(resolve(ROOT, 'design/tokens.json'), JSON.stringify(tok, null, 2));
writeFileSync(resolve(ROOT, 'design/nodes.json'), JSON.stringify(nodes));

mkdirSync(resolve(ROOT, 'public/vectors'), { recursive: true });
const rawById = new Map(doc.nodeChanges.map((n) => [gid(n.guid), n]));
const geometry = {};
for (const v of VECTORS) {
  const n = rawById.get(v.id);
  assert.ok(n, `vector ${v.id} (${v.file}) not in the document`);
  const g = n[`${v.geom}Geometry`];
  assert.ok(g?.[0], `${v.file}: no ${v.geom}Geometry`);
  // One entry per style run, not per shape — a wordmark's letters are split
  // across several, so taking only the first yields a single glyph.
  const parts = g.map((e) => pathFromBlob(doc.blobs[e.commandsBlob].bytes));
  const d = parts.map((p) => p.d).join('');
  const box = parts.map((p) => p.box).reduce((a, b) => ({
    x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0),
    x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1),
  }));
  const w = r3(box.x1 - box.x0);
  const h = r3(box.y1 - box.y0);
  const view = `${r3(box.x0)} ${r3(box.y0)} ${w} ${h}`;
  // How far the outline reaches outside the node's own box, so the page can
  // place it exactly where Figma does rather than guessing.
  geometry[v.file] = {
    view,
    w,
    h,
    node: { w: r3(n.size.x), h: r3(n.size.y) },
    parts: g.length,
    bleed: { x: r3(-box.x0), y: r3(-box.y0) },
  };
  const paint =
    v.file === RINGS
      ? `<defs><linearGradient id="g" x1="0.3" y1="0.393" x2="0.85" y2="0.687"><stop offset="0" stop-color="#4baf8e" stop-opacity="0"/><stop offset="1" stop-color="#4baf8e"/></linearGradient></defs><path d="${d}" fill="url(#g)" fill-rule="nonzero"/>`
      : `<path d="${d}" fill="${v.color}" fill-rule="nonzero"/>`;
  writeFileSync(
    resolve(ROOT, `public/vectors/${v.file}.svg`),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view}">${paint}</svg>`
  );
}
writeFileSync(resolve(ROOT, 'design/vectors.json'), JSON.stringify(geometry, null, 2));
console.log('vectors:');
for (const [k, g] of Object.entries(geometry))
  console.log(`  ${k.padEnd(22)} outline ${g.w}x${g.h}  node ${g.node.w}x${g.node.h}  bleed ${g.bleed.x},${g.bleed.y}`);

// Images: only the ones a fill on a *visible* node actually references.
const usedBy = new Map();
for (const n of nodes) {
  if (n.hidden) continue;
  for (const f of n.fills ?? []) {
    if (!f.image) continue;
    if (!usedBy.has(f.image)) usedBy.set(f.image, []);
    usedBy.get(f.image).push(n.name);
  }
}

const sniff = (b) =>
  b[0] === 0x89 && b[1] === 0x50 ? 'png' : b[0] === 0xff && b[1] === 0xd8 ? 'jpg' : b[0] === 0x47 ? 'gif' : 'bin';

// Figma exports photographs as PNG, so several are 5-8MB. next/image would
// optimise them at request time anyway, but there is no reason to carry that
// weight in the repo. sharp is already present as a Next dependency — if a
// future Next drops it, fall through and keep the original bytes.
const RECODE_OVER = 300 * 1024;
let sharp = null;
try {
  ({ default: sharp } = await import('sharp'));
} catch {
  console.warn('sharp unavailable — keeping original image encodings');
}

const manifest = {};
for (const [hash, names] of usedBy) {
  const data = zip.get(`images/${hash}`);
  if (!data) {
    console.warn(`missing image ${hash}`);
    continue;
  }

  let bytes = data;
  let ext = sniff(data);
  if (sharp && data.length > RECODE_OVER) {
    const webp = await sharp(data).webp({ quality: 82 }).toBuffer();
    if (webp.length < data.length) {
      bytes = webp;
      ext = 'webp';
    }
  }

  const file = `${hash.slice(0, 12)}.${ext}`;
  writeFileSync(resolve(ROOT, 'public/images', file), bytes);
  manifest[hash] = {
    file: `/images/${file}`,
    bytes: bytes.length,
    originalBytes: data.length,
    usedBy: [...new Set(names)],
  };
}
writeFileSync(resolve(ROOT, 'design/images.json'), JSON.stringify(manifest, null, 2));

// Drop assets that no visible node references any more, so re-extracting after a
// design change cannot leave orphans behind (a hidden layer's image, a replaced photo).
const keep = new Set(Object.values(manifest).map((m) => m.file.replace('/images/', '')));
let pruned = 0;
for (const file of readdirSync(resolve(ROOT, 'public/images'))) {
  if (keep.has(file)) continue;
  unlinkSync(resolve(ROOT, 'public/images', file));
  pruned++;
}

console.log(`nodes      ${nodes.length}`);
console.log(`text       ${nodes.filter((n) => n.text).length}`);
console.log(`colors     ${Object.keys(tok.colors).length}`);
console.log(`type scale ${tok.typeScale.length} combinations`);
console.log(`images     ${Object.keys(manifest).length} written to public/images/${pruned ? ` (${pruned} orphan${pruned > 1 ? 's' : ''} pruned)` : ''}`);
