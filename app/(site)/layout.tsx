import { Rise } from '@/components/rise';
import { Footer } from '@/components/sections/footer';

/**
 * Shell for the standalone content pages (terms, privacy, imprint, about).
 *
 * The nav, the mobile drawer, the fonts and the theme all come from the root
 * layout, so this only has to supply what `app/page.tsx` supplies for the home
 * page: the main landmark, the footer and `<Rise/>` to arm the `[data-rise]`
 * entrance animations.
 *
 * Each page brings its own container, because About wants a wider grid than a
 * column of prose does.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="bg-page">{children}</main>
      <Footer />
      <Rise />
    </>
  );
}
