import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * Theme-swapped wordmark. Both files ship in public/ and the inactive one is
 * hidden with CSS rather than swapped in JS, so there is no hydration flash.
 *
 * ponytail: the design's own logo asset is a single all-pink PNG, while the
 * mobile-menu artboards show a monochrome mark — no two-tone (pink mark +
 * theme-coloured wordmark) asset exists in the .fig. These mono files match the
 * menu exactly and are very close on desktop. Drop in a two-tone SVG here if
 * exact desktop fidelity matters.
 */
export function BrandLogo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <span className={cn('relative block', className)}>
      <Image
        src="/stx_black_horizontal.png"
        alt="SportsTechX"
        width={1394}
        height={459}
        priority={priority}
        className="h-full w-auto dark:hidden"
      />
      <Image
        src="/stx_white_horizontal.png"
        alt=""
        aria-hidden
        width={1394}
        height={459}
        priority={priority}
        className="hidden h-full w-auto dark:block"
      />
    </span>
  );
}
