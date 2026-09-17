import { Rise } from '@/components/rise';
import { Footer } from '@/components/sections/footer';
import { Hero } from '@/components/sections/hero';
import { Media } from '@/components/sections/media';
import { Solutions } from '@/components/sections/solutions';
import { Stats } from '@/components/sections/stats';
import { TrustedBy } from '@/components/sections/trusted-by';
import { siteContent } from '@/lib/site-content';
import { testimonial, type Partner, type Testimonial } from '@/lib/content';

export default async function Home() {
  /* Partner photos and testimonials come from the admin panel (Site assets ->
     STX landing). siteContent() swallows every failure, so an empty result
     leaves both sections on the content decoded from the .fig. */
  const cms = await siteContent();
  const partners: Partner[] | undefined = cms.gallery?.length
    ? cms.gallery.map((it) => ({
        name: it.title ?? '',
        role: it.subtitle ?? '',
        logo: '',
        logoSrc: it.logoUrl,
        photo: it.url ?? '',
      }))
    : undefined;
  const testimonials: Testimonial[] | undefined = cms.testimonials?.length
    ? cms.testimonials.map((it) => ({
        // Admins type a plain message; the design's curly quotes go on here.
        quote: quoted(it.body ?? ''),
        name: it.title ?? '',
        role: it.subtitle ?? '',
        // The photo is optional in the admin panel, but this design always
        // draws one, so a quote without a photo borrows the artboard's.
        avatar: it.url ?? testimonial.avatar,
      }))
    : undefined;

  return (
    <>
      <main>
        <Hero />
        <Stats />
        <TrustedBy partners={partners} />
        <Solutions testimonials={testimonials} />
        <Media />
      </main>
      <Footer />
      <Rise />
    </>
  );
}

/** The artboard's quotes carry their own curly marks; CMS messages do not. */
function quoted(text: string): string {
  const t = text.trim();
  if (!t) return '';
  return /^[“"]/.test(t) ? t : `“${t}”`;
}
