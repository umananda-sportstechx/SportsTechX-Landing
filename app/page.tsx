import { Rise } from '@/components/rise';
import { Footer } from '@/components/sections/footer';
import { Hero } from '@/components/sections/hero';
import { Media } from '@/components/sections/media';
import { Solutions } from '@/components/sections/solutions';
import { Stats } from '@/components/sections/stats';
import { TrustedBy, rotateRow } from '@/components/sections/trusted-by';
import { siteContent, type SiteItem } from '@/lib/site-content';
import { trustedBy, type Partner, type Testimonial } from '@/lib/content';

export default async function Home() {
  /* Partner photos and testimonials come from the admin panel (Site assets ->
     STX landing). siteContent() swallows every failure, so an empty result
     leaves both sections on the content decoded from the .fig. */
  const cms = await siteContent();
  /* The partner rail is two rows drifting opposite ways, and each is its own
     CMS section so an admin can say which image belongs where. A second row
     left empty mirrors the first, rotated — which is what the artboard does. */
  const rowOne = toPartners(cms.gallery) ?? trustedBy.partners;
  const rowTwoCms = toPartners(cms.gallery2);
  const rowTwo = rowTwoCms ?? rotateRow(rowOne);
  /* Each solution card has its own testimonials section, so the two can carry
     different quotes. Keyed by card id rather than by position: the sector
     filter can drop a card, and an index would then hand Atlas the Playmakers
     quotes. */
  const fromCms = (items?: SiteItem[]): Testimonial[] | undefined =>
    items?.length
      ? items.map((it) => ({
          // Admins type a plain message; the design's curly quotes go on here.
          quote: quoted(it.body ?? ''),
          name: it.title ?? '',
          // Both optional in the admin panel. Left unset rather than filled in
          // with a stand-in: a borrowed stock face on a real, named person is
          // worse than no photo.
          role: it.subtitle || undefined,
          avatar: it.url ?? undefined,
        }))
      : undefined;
  const testimonials = {
    playmakers: fromCms(cms.testimonials),
    atlas: fromCms(cms.testimonials2),
  };

  return (
    <>
      <main>
        <Hero />
        <Stats />
        <TrustedBy
          rowOne={rowOne}
          rowTwo={rowTwo}
          rowOneIsPlaceholder={!cms.gallery?.length}
          // A mirrored row is still whatever the first row is made of.
          rowTwoIsPlaceholder={rowTwoCms ? false : !cms.gallery?.length}
        />
        <Solutions testimonials={testimonials} previews={cms.solutions} />
        <Media />
      </main>
      <Footer />
      <Rise />
    </>
  );
}

function toPartners(items: SiteItem[] | undefined): Partner[] | null {
  if (!items?.length) return null;
  return items.map((it) => ({
    name: it.title ?? '',
    role: it.subtitle ?? '',
    logo: '',
    logoSrc: it.logoUrl,
    photo: it.url ?? '',
  }));
}

/** The artboard's quotes carry their own curly marks; CMS messages do not. */
function quoted(text: string): string {
  const t = text.trim();
  if (!t) return '';
  return /^[“"]/.test(t) ? t : `“${t}”`;
}
