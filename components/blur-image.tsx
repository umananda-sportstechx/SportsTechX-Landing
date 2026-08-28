'use client';

import Image, { type ImageProps, type StaticImageData } from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * A photo that loads in two passes, per the interactions board: a very small,
 * heavily blurred stand-in first, then a cross-fade to the full image once it
 * has downloaded.
 *
 * next/image's own `placeholder="blur"` does the two passes but swaps between
 * them — and it paints the stand-in onto the <img> itself, so fading the image
 * in would fade the stand-in out with it and leave a gap. The two live in
 * separate layers here instead: the blur sits behind, the image fades in over
 * it, and the blur is dropped once it is covered.
 *
 * The parent must be positioned; the stand-in is absolutely placed against it.
 * Callers pass `standIn` for remote images, whose blur data Next cannot know at
 * build time. Where motion is reduced the image simply appears.
 */
export function BlurImage({ className, standIn, ...props }: ImageProps & { standIn?: string }) {
  const [loaded, setLoaded] = useState(false);
  const blur = standIn ?? (typeof props.src === 'object' ? (props.src as StaticImageData).blurDataURL : undefined);

  return (
    <>
      {blur && !loaded && (
        <span
          aria-hidden
          // scale-110 hides the soft edge the blur leaves at the boundary.
          className="pointer-events-none absolute inset-0 scale-110 bg-cover bg-center blur-lg"
          style={{ backgroundImage: `url(${blur})` }}
        />
      )}
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt is required by
          ImageProps and always arrives through the spread. */}
      <Image
        {...props}
        onLoad={() => setLoaded(true)}
        className={cn(
          'motion-safe:transition-opacity motion-safe:duration-500 motion-safe:ease-out',
          loaded ? 'opacity-100' : 'opacity-0 motion-reduce:opacity-100',
          className
        )}
      />
    </>
  );
}
