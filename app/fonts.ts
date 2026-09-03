import { Bebas_Neue, Space_Mono } from 'next/font/google';
import localFont from 'next/font/local';

/**
 * The design uses four families (counts are text nodes in the .fig):
 *   New Frank  276   body + UI                — commercial, see the note below
 *   CommitMono  98   buttons, pills, labels   — @fontsource/commit-mono, imported in layout.tsx
 *   Bebas Neue  70   all display headlines    — Google
 *   Space Mono  28   eyebrows, attributions   — Google
 */

export const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bebas-neue',
});

export const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-mono',
});

/**
 * Body face. The design specifies **New Frank**, which is a commercial typeface
 * (Displaay / Adobe Fonts) — it needs a paid Creative Cloud plan or a purchased
 * webfont licence, and Figma does not embed font binaries in a .fig, so it
 * cannot come out of the design file either.
 *
 * Switzer stands in: a neo-grotesque of very similar proportions and colour,
 * from Fontshare under the ITF Free Font License, which grants use "for personal
 * or commercial purposes, free of charge" and permits self-hosting. The licence
 * ships alongside the files at public/fonts/Switzer-LICENSE.txt.
 *
 * New Frank now comes from the designer's Adobe Fonts kit, linked in
 * app/layout.tsx, and leads the --font-sans stack. Switzer stays behind it as
 * the fallback for a slow or blocked kit.
 */
export const sans = localFont({
  src: [
    { path: '../public/fonts/Switzer-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/Switzer-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/Switzer-Semibold.woff2', weight: '600', style: 'normal' },
    { path: '../public/fonts/Switzer-Bold.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-sans-local',
  // Switzer is the fallback now that New Frank comes from Adobe, so it should
  // not be fetched on every visit. Preloading it downloaded four woff2 files
  // the page does not draw a single glyph with. It still resolves instantly if
  // the kit is slow or blocked — the files are self-hosted, just not eager.
  preload: false,
});
