/**
 * Cover art for the STX AllStars show, from Spotify — no API key or token, so
 * no client credentials or refresh cycle for one image.
 *
 * Two sources, in order:
 *
 *   1. the show page's og:image, which is the square 640x640 show cover
 *      (Spotify's `ab676563` art). This is what the card wants: the artboard's
 *      image slot is portrait, and a square crops by about 6%.
 *   2. the oEmbed endpoint's thumbnail, which for a show with video episodes is
 *      the latest episode's 16:9 title card. Usable, but cropping that into a
 *      portrait slot cuts the wording off both sides, so it is only a fallback.
 *
 * Either failing returns null and the caller falls back to the artboard's own
 * asset: a dead endpoint must never blank the card.
 */
const SHOW = 'https://open.spotify.com/show/2IWyvvtC2fAeRAyt55TmtF';

export type Show = {
  /** The latest episode's title, per oEmbed. Empty when only og:image resolved. */
  title: string;
  image: string;
};

const REVALIDATE = { next: { revalidate: 1800 } } as const;

/** Square show cover, scraped from the page's OpenGraph tag. */
async function coverFromPage(): Promise<string | null> {
  try {
    const response = await fetch(SHOW, {
      ...REVALIDATE,
      // Spotify serves a stub to unknown agents.
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; sportstechx-landing/1.0)' },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return null;
    const html = await response.text();
    const match = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

/** Latest episode title plus its 16:9 thumbnail. */
async function fromOembed(): Promise<Show | null> {
  try {
    const response = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(SHOW)}`, {
      ...REVALIDATE,
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      console.error(`spotify oembed responded ${response.status}`);
      return null;
    }
    const data = (await response.json()) as { title?: string; thumbnail_url?: string };
    if (!data.thumbnail_url) return null;
    return { title: data.title ?? '', image: data.thumbnail_url };
  } catch (error) {
    console.error('spotify oembed unavailable', error);
    return null;
  }
}

export async function showArtwork(): Promise<Show | null> {
  const [cover, oembed] = await Promise.all([coverFromPage(), fromOembed()]);
  if (cover) return { title: oembed?.title ?? '', image: cover };
  return oembed;
}
