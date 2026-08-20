import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * This design's type ramp and palette are both custom `text-*` utilities
 * (`text-section` is a size, `text-heading` is a colour). tailwind-merge has no
 * way to tell them apart on its own, so it treats them as one group and keeps
 * only the last — which silently drops font sizes wherever a colour is also
 * applied. Registering the names here keeps both.
 *
 * Anything added to the --text-* or --color-* blocks in globals.css must be
 * listed here too.
 */
const FONT_SIZES = [
  'headline',
  'stat',
  'stat-label',
  'section',
  'card',
  'card-sm',
  'label-lg',
  'eyebrow',
  'body-lg',
  'quote',
  'feature',
  'card-title',
  'body',
  'body-sm',
  'cta',
  'label',
  'micro',
  'legal',
  'mono-eyebrow',
];

const COLORS = [
  'page',
  'hero',
  'surface',
  'band',
  'band-2',
  'stats',
  'fg',
  'fg-2',
  'fg-muted',
  'heading',
  'line',
  'nav-bg',
  'nav-border',
  'pill-bg',
  'pill-border',
  'pill-fg',
  'accent',
  'accent-2',
  'accent-fg',
  'navy',
  'slate',
  'green',
  'green-2',
  'mint',
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: FONT_SIZES }],
      'text-color': [{ text: COLORS }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
