import { Rise } from '@/components/rise';
import { Footer } from '@/components/sections/footer';
import { Hero } from '@/components/sections/hero';
import { Media } from '@/components/sections/media';
import { Solutions } from '@/components/sections/solutions';
import { Stats } from '@/components/sections/stats';
import { TrustedBy } from '@/components/sections/trusted-by';

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Stats />
        <TrustedBy />
        <Solutions />
        <Media />
      </main>
      <Footer />
      <Rise />
    </>
  );
}
