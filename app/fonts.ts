import { Bebas_Neue, Space_Mono } from 'next/font/google';
// import localFont from 'next/font/local';

/**
 * The design uses four families (counts are text nodes in the .fig):
 *   New Frank  276   body + UI                — commercial, self-hosted
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
 * New Frank is licensed, so the files are not in the repo and next/font/local
 * would fail the build if they were missing. Until they land, --font-new-frank
 * stays undefined and `--font-sans` in globals.css falls through to the system
 * grotesque stack.
 *
 * To switch it on: drop NewFrank-Regular.woff2 and NewFrank-Medium.woff2 into
 * public/fonts/, uncomment the localFont import above and the block below, and
 * add `newFrank.variable` to the <html> className in layout.tsx. Nothing else
 * changes — every component already reads font-sans.
 */
// export const newFrank = localFont({
//   src: [
//     { path: '../public/fonts/NewFrank-Regular.woff2', weight: '400', style: 'normal' },
//     { path: '../public/fonts/NewFrank-Medium.woff2', weight: '500', style: 'normal' },
//   ],
//   display: 'swap',
//   variable: '--font-new-frank',
// });
