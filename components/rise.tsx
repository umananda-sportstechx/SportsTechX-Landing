'use client';

import { useEffect } from 'react';

/**
 * Reveals each major section as it arrives — a 40px rise, triggered as the
 * section comes within 40px of the bottom of the window.
 *
 * Three things this deliberately does NOT do:
 *
 * It does not hide anything the stylesheet has not been told to hide. Sections
 * are only made invisible once this has armed them, so if the script fails or
 * never loads, the page is simply visible. A CSS-only `opacity: 0` default is
 * the usual way this feature ships broken.
 *
 * It does not arm anything already on screen. Those are marked shown outright,
 * so the first paint cannot flash: nothing is hidden after the reader has
 * already seen it.
 *
 * It does not run at all under prefers-reduced-motion — the sections stay put,
 * which is their resting state anyway.
 */
export function Rise() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = document.querySelectorAll<HTMLElement>('[data-rise]');
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute('data-shown', '');
          observer.unobserve(entry.target);
        }
      },
      // -40px at the foot is the trigger the brief asks for: the section has
      // come 40px past the bottom edge.
      //
      // The enormous top margin is what makes this reliable. Extending the root
      // upward means a section that has been scrolled past still counts as
      // intersecting, so it reveals. Without it, jumping over a section — an
      // anchor link, a restored scroll position, a fast fling — takes it from
      // below the viewport to above it with no intersection *change* between,
      // the callback never fires, and that section stays invisible for the rest
      // of the session.
      { rootMargin: '100000px 0px -40px 0px' }
    );

    for (const el of targets) {
      if (el.getBoundingClientRect().top < window.innerHeight - 40) {
        el.setAttribute('data-shown', '');
        continue;
      }
      el.setAttribute('data-rise-armed', '');
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
