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
  /** Landing-specific override for the Playmakers card quotes (usually empty —
   *  the card falls back to the Playmakers site's own testimonials below). */
  testimonials?: SiteItem[];
  /** Landing-specific override for the Atlas card quotes. */
  testimonials2?: SiteItem[];
  /** The Atlas site's own testimonials, reused on the STX landing Atlas card. */
  atlasTestimonials?: SiteItem[];
  /** The Playmakers site's own testimonials, reused on the Playmakers card. */
  playmakersTestimonials?: SiteItem[];
}

async function fetchSite(site: string): Promise<SiteSections> {
  const base = process.env.BACKEND_URL;
  if (!base) return {};
  try {
    const res = await fetch(`${base}/api/public/site-content?site=${site}`, {
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

export async function siteContent(): Promise<SiteSections> {
  // The STX landing reuses each product's OWN testimonials — the ones entered
  // under the `atlas` and `playmakers` sites in the admin CMS — on its two
  // solution cards, so the quotes never have to be re-entered under `landing`.
  // A landing-specific section still wins when present (see page.tsx). Each
  // fetch is independent and fail-safe, so a dead product feed can't blank the
  // landing.
  const [landing, atlas, playmakers] = await Promise.all([
    fetchSite('landing'),
    fetchSite('atlas'),
    fetchSite('playmakers'),
  ]);
  return {
    ...landing,
    atlasTestimonials: atlas.testimonials,
    playmakersTestimonials: playmakers.testimonials,
  };
}
