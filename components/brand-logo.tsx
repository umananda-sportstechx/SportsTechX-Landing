import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * The wordmark, using the design's own asset. The artboard references the same
 * pink lockup in *both* themes — there is no monochrome variant in the file, so
 * there is no theme swap here.
 */
export function BrandLogo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/images/dfb510ecda05.png"
      alt="SportsTechX"
      width={709}
      height={195}
      priority={priority}
      className={cn('w-auto', className)}
    />
  );
}
