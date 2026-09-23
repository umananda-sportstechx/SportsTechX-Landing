/**
 * Reads the CMS-managed partner photos and testimonials for this site from the
 * STX backend's admin panel (Site assets → STX landing).
 *
 * Same contract as newsletter.ts and podcast.ts: a dead feed must never blank
 * the page. Any error, timeout or non-200 returns `{}` and every consumer falls
 * back to the content decoded from the .fig. An empty section behaves the same
 * way, and one uploaded card means exactly one card renders — never one plus
 * the eight placeholders.
 */
const SITE = 'landing';
const REVALIDATE_SEC = 300;

export interface SiteItem {
  url: string | null;
  alt: string;
  logoUrl: string | null;
  logoAlt: string;
  title: string | null;
  subtitle: string | null;
  body: string | null;
}

export interface SiteSections {
  /** The upper partner rail. */
  gallery?: SiteItem[];
  /** The lower partner rail, which drifts the other way. */
  gallery2?: SiteItem[];
  /** Solutions card previews. Positional: [0] Playmakers, [1] Atlas. */
  solutions?: SiteItem[];
  testimonials?: SiteItem[];
}

export async function siteContent(): Promise<SiteSections> {
  const base = process.env.BACKEND_URL;
  if (!base) return {};
  try {
    const res = await fetch(`${base}/api/public/site-content?site=${SITE}`, {
      next: { revalidate: REVALIDATE_SEC },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return {};
    const json = (await res.json()) as { sections?: SiteSections };
    return json.sections ?? {};
  } catch {
    return {};
  }
}
