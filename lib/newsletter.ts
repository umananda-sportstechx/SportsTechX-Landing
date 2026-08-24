/**
 * Latest issues of "Featured by SportsTechX" from Beehiiv.
 *
 * The same feed the STX web app reads (server/routes.ts, /api/medium-articles),
 * so the landing page and the app show the same issues.
 *
 * Parsed by hand rather than with an XML library: four fields off a known feed
 * is not worth a dependency, and `parse` fails loudly if the shape changes
 * rather than quietly returning nothing. Callers treat an empty list as "show
 * the static copy" — a dead feed must never blank the card.
 */
const FEED = 'https://rss.beehiiv.com/feeds/PnKxPFRy0o.xml';

export type Issue = {
  title: string;
  link: string;
  published: string;
  image: string;
};

/** Pull one tag's text, unwrapping CDATA and decoding the few entities RSS uses. */
function tag(item: string, name: string): string {
  const match = item.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`));
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

export function parse(xml: string): Issue[] {
  const items = xml.match(/<item\b[\s\S]*?<\/item>/g) ?? [];
  return items.map((item) => {
    // Beehiiv puts the hero image on media:thumbnail; fall back to the first
    // <img> in the encoded body, as the app's parser does.
    const thumb = item.match(/<media:thumbnail[^>]*\surl="([^"]+)"/);
    const inline = item.match(/<img[^>]+src="([^"]+)"/);
    return {
      title: tag(item, 'title'),
      link: tag(item, 'link') || tag(item, 'guid'),
      published: tag(item, 'pubDate'),
      image: thumb?.[1] ?? inline?.[1] ?? '',
    };
  });
}

/**
 * Cached for 30 minutes, matching the app's own cache window — Beehiiv rate
 * limits, and every render of this page would otherwise hit the feed.
 */
export async function latestIssues(): Promise<Issue[]> {
  try {
    const response = await fetch(FEED, {
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      console.error(`beehiiv feed responded ${response.status}`);
      return [];
    }
    return parse(await response.text()).filter((i) => i.title && i.link);
  } catch (error) {
    console.error('beehiiv feed unavailable', error);
    return [];
  }
}
