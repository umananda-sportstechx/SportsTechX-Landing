import { MobileMenuPanel, MobileMenuProvider, MobileMenuShell } from '@/components/mobile-menu';
import { Footer } from '@/components/sections/footer';
import { Hero } from '@/components/sections/hero';
import { Media } from '@/components/sections/media';
import { Solutions } from '@/components/sections/solutions';
import { Stats } from '@/components/sections/stats';
import { TrustedBy } from '@/components/sections/trusted-by';

export default function Home() {
  return (
    <MobileMenuProvider>
      <MobileMenuPanel />
      <MobileMenuShell>
        <main>
          <Hero />
          <Stats />
          <TrustedBy />
          <Solutions />
          <Media />
        </main>
        <Footer />
      </MobileMenuShell>
    </MobileMenuProvider>
  );
}
