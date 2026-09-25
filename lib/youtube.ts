/**
 * The latest STX Allstars episode, from YouTube.
 *
 * YouTube publishes an Atom feed per playlist at /feeds/videos.xml, newest
 * first, with no API key and no quota — so this needs neither a Google Cloud
 * project nor a secret in the deploy. The playlist is the same one the podcast
 * card already links to in content.ts.
 *
 * Parsed by hand for the same reason newsletter.ts is: three fields off a known
 * feed is not worth a dependency. Callers treat null as "show the static copy" —
 * a dead feed must never blank the card.
 */
const PLAYLIST = 'PLptEoomboUFS422kldem0tLkXJjDbHjfx';
const FEED = `https://www.youtube.com/feeds/videos.xml?playlist_id=${PLAYLIST}`;
const REVALIDATE = { next: { revalidate: 1800 } } as const;

export type Episode = {
  title: string;
  link: string;
  /** 1280x720. The card's slot is 16:9, which is this natively. */
  image: string;
};

/**
 * Thumbnail sizes, best first.
 *
 * The feed's own <media:thumbnail> is hqdefault — 480x360, which is 4:3 with
 * black bars baked in, so it would letterbox inside a 16:9 slot and read as a
 * cut image. maxresdefault and hq720 are both true 1280x720. maxresdefault is
 * only generated for uploads that were at least 720p, hence the fallbacks.
 */
const SIZES = ['maxresdefault', 'hq720', 'hqdefault'] as const;
const thumb = (id: string, size: string) => `https://i.ytimg.com/vi/${id}/${size}.jpg`;

/** The first size YouTube actually has for this video. */
async function bestThumb(id: string): Promise<string> {
  for (const size of SIZES) {
    try {
      const res = await fetch(thumb(id, size), {
        method: 'HEAD',
        ...REVALIDATE,
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) return thumb(id, size);
    } catch {
      // Try the next size down rather than failing the whole card.
    }
  }
  // hqdefault is always generated, so this is a safe last resort even unchecked.
  return thumb(id, 'hqdefault');
}

/** Pull one tag's text, unwrapping CDATA and decoding the few entities Atom uses. */
function tag(entry: string, name: string): string {
  const match = entry.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`));
  if (!match) return '';
  return match[1]
    .replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .trim();
}

export function parse(xml: string): { id: string; title: string; link: string }[] {
  const entries = xml.match(/<entry\b[\s\S]*?<\/entry>/g) ?? [];
  return entries.map((entry) => ({
    id: tag(entry, 'yt:videoId'),
    title: tag(entry, 'title'),
    // <link rel="alternate" href="..."/> is self-closing, so tag() can't read it.
    link: entry.match(/<link[^>]+href="([^"]+)"/)?.[1] ?? '',
  }));
}

/**
 * Cached for 30 minutes, matching the newsletter and Spotify fetchers.
 */
export async function latestEpisode(): Promise<Episode | null> {
  try {
    const response = await fetch(FEED, {
      ...REVALIDATE,
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      console.error(`youtube feed responded ${response.status}`);
      return null;
    }
    // The playlist feed is already newest-first; no sort needed.
    const [latest] = parse(await response.text()).filter((e) => e.id && e.title);
    if (!latest) return null;
    return {
      title: latest.title,
      link: latest.link || `https://www.youtube.com/watch?v=${latest.id}`,
      image: await bestThumb(latest.id),
    };
  } catch (error) {
    console.error('youtube feed unavailable', error);
    return null;
  }
}
