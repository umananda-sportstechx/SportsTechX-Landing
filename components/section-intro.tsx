import { cn } from '@/lib/utils';

/**
 * The shared section head: a Bebas 72 title over an uppercase New Frank
 * Medium 21 subtitle at 70% opacity. Used by Trusted by, Solutions and Media.
 */
export function SectionIntro({
  title,
  subtitle,
  className,
  tracking = 'tracked',
  children,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  tracking?: 'tracked' | 'tracking-[0.05em]';
  children?: React.ReactNode;
}) {
  return (
    <div className={cn('flex flex-col gap-2.5', className)}>
      <h2 className={cn('font-display text-section leading-[1.1] text-heading uppercase', tracking)}>{title}</h2>
      {subtitle && (
        <p className="font-sans text-card-title leading-[1.5] font-medium text-heading/70 uppercase">{subtitle}</p>
      )}
      {children}
    </div>
  );
}
