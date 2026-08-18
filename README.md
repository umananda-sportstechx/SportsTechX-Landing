# SportsTechX landing page

The public homepage, built from `STX-Figma.fig` (the "STX — Homepage, Final Design" export).
Next.js 16 App Router, React 19, Tailwind v4, npm.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # the real gate — must pass clean
```

## Where the design values come from

Figma MCP access is gated behind an Editor seat, so nothing here was read off Figma live.
Instead `STX-Figma.fig` is decoded locally — it is a zip whose `canvas.fig` is Figma's
`fig-kiwi` container: a deflate-compressed kiwi schema block plus a **zstd**-compressed
document. Node 23.8+ ships `zlib.zstdDecompressSync`, so this needs no dependencies.

> **`STX-Figma.fig` is not in the repo** (~27MB — it would be on every clone forever).
> The extracted output that the app actually needs *is* committed: `design/tokens.json`,
> `design/images.json` and `public/images/`. You only need the `.fig` to re-extract after
> a design change — get it from Figma (File → Save local copy) and drop it at
> `landing/STX-Figma.fig`, then run `npm run design`.

```bash
npm run design         # decode -> design/tokens.json, design/nodes.json, public/images/
npm run design:check   # assert the decode is lossless and the known tokens are present
```

`design:check` fails loudly if the decode stops consuming every byte, which is the only
way this can go quietly wrong — a misread field would leave every number downstream
plausible but false.

While building, look values up instead of eyeballing them:

```bash
node scripts/fig-inspect.mjs                      # list the artboards
node scripts/fig-inspect.mjs "Intro Hero" 3       # tree with sizes, colours, type
node scripts/fig-inspect.mjs --text "Footer"      # just the copy
```

Repeated frame names (each section exists six times — desktop/mobile/menu x light/dark)
are printed with their ancestor chain so you can tell them apart.

## Layout conventions

- Tokens live in `app/globals.css`: raw vars on `:root`, overridden under
  `[data-theme="dark"]`, bridged to utilities via `@theme inline`.
- The type ramp is fluid between the two artboard widths, so each step hits the
  designed size exactly at 402px and at 1512px: `clamp(<mobile>, <intercept> + <slope>vw, <desktop>)`.
- next-themes uses `attribute="data-theme"`, so Tailwind's `dark:` is redefined via
  `@custom-variant` at the top of `globals.css`.
- **Adding a token?** Add its name to `FONT_SIZES` or `COLORS` in `lib/utils.ts` as well.
  tailwind-merge cannot tell a custom `text-*` size from a custom `text-*` colour, and
  silently drops one of them if it isn't told.

## Fonts

| Font | Source | Status |
|---|---|---|
| Bebas Neue | `next/font/google` | ✅ |
| Space Mono | `next/font/google` | ✅ |
| CommitMono | `@fontsource/commit-mono` (OFL, not on Google Fonts) | ✅ |
| **New Frank** | licensed, self-hosted | ⛔ **not included** |

New Frank is the body face (276 of the design's text nodes) and is commercial — Figma does
not embed font binaries in a `.fig`, so it cannot come out of the export. Until the files
are supplied the page falls back to the system grotesque stack.

**To switch it on:** drop `NewFrank-Regular.woff2` and `NewFrank-Medium.woff2` into
`public/fonts/`, uncomment the `localFont` block in `app/fonts.ts` and its import, and add
`newFrank.variable` to the `<html>` className in `app/layout.tsx`. Nothing else changes —
every component already reads `font-sans`.

## Newsletter

`POST /api/subscribe` validates the address, then forwards `{email, source}` to
`NEWSLETTER_WEBHOOK_URL` (see `.env.example`). There is no newsletter endpoint on the STX
backend — everything named "subscription" there is Stripe billing — so this points at
whichever ESP you use. With the variable unset the route returns **501**, deliberately,
rather than pretending the address was stored.

## Known gaps

- **Wordmarks.** The Playmakers and Atlas logotypes are vector networks in the `.fig`,
  which the export does not expose as images. Both are set in type as a stand-in; drop in
  SVGs when the brand files exist.
- **Logo.** The design's own logo asset is a single all-pink PNG while the mobile-menu
  artboards show a monochrome mark, so no two-tone (pink mark + themed wordmark) file
  exists. `components/brand-logo.tsx` uses the mono black/white pair from the app.
- **Sector switch.** FOUNDERS / INVESTORS toggles, but the `.fig` only contains the
  FOUNDERS state — there is no INVESTORS variant to render, so both show the same two
  cards. The cards are data-driven in `lib/content.ts`, so adding the variant is a data
  change.
- **Partner cards** carry a placeholder "BCG" logo and one repeated name in the design;
  both are reproduced as-is rather than invented over.
