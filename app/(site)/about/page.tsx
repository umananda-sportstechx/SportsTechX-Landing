import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { SectionIntro } from '@/components/section-intro';
import { about, type Person } from '@/lib/about';

export const metadata: Metadata = {
  // Bare title: the root layout supplies the ' — SportsTechX' template.
  title: 'About',
  description:
    'Based in Berlin, SportsTechX is the leading source for sports technology, innovation and investment intelligence. Meet the team.',
  alternates: { canonical: '/about' },
  // Without its own openGraph this page inherits the home page's, so a shared
  // link is captioned as the homepage.
  openGraph: {
    title: 'About — SportsTechX',
    description:
      'Based in Berlin, SportsTechX is the leading source for sports technology, innovation and investment intelligence. Meet the team.',
    url: '/about',
  },
};

/**
 * A person card: portrait, name with a LinkedIn link, role, the bio behind a
 * toggle, and the favourite-teams line the old site closed each profile with.
 *
 * The card is a five-row subgrid — portrait / name / role / bio / teams — so every
 * card in a row shares those tracks and each block starts on the same line as
 * its neighbours. It used to be a plain flex column, which meant a role that
 * wrapped to two lines ("Head of Communications & Operations") pushed that one
 * card's bio down, and the bio's own length then pushed the teams rule down
 * again. The rule reads as a shared baseline, so every accumulated difference
 * showed up as a line that didn't line up.
 *
 * The portrait is a 128 circle, matching the old site. It was a full-bleed 4:5,
 * which rendered ~316x395 — but the source photos are 400x400, so that was a 2x
 * upscale on a retina screen and looked soft. At 128 the same files are sharp
 * with room to spare, and a square source no longer has to be cropped to 4:5.
 */
function PersonCard({ person }: { person: Person }) {
  return (
    <article data-rise className="grid grid-rows-subgrid row-span-5 justify-items-center gap-0 text-center">
      <div className="relative size-32 overflow-hidden rounded-full bg-band shadow-md">
        <Image src={person.photo} alt={person.name} fill sizes="128px" className="object-cover" />
      </div>

      <div className="mt-5 flex items-center justify-center gap-2">
        <h3 className="tracked font-display text-feature leading-[1.2] text-heading uppercase">
          {person.name}
        </h3>
        <a
          href={person.linkedin}
          target="_blank"
          rel="noreferrer"
          aria-label={`${person.name} on LinkedIn`}
          className="text-fg-muted transition-colors hover:text-[#0077b5]"
        >
          {/* Masked so it takes currentColor. .brand-icon rather than
              .footer-icon: the latter is re-sized by the --k scale model in two
              media queries, which would override the size here. */}
          <span
            aria-hidden
            style={{ '--m': 'url(/vectors/icon-footer-linkedin.svg)' } as CSSProperties}
            className="brand-icon size-4"
          />
        </a>
      </div>

      <p className="tracked mt-1 font-mono-alt text-mono-eyebrow text-accent uppercase">
        {person.role}
      </p>

      {/* Native <details>, so this page stays a server component and the bios
          are still reachable with JavaScript off. */}
      <details className="person-bio mt-4 w-full">
        <summary className="tracked inline-flex cursor-pointer list-none items-center gap-1.5 font-mono text-legal text-fg-muted uppercase transition-colors hover:text-heading">
          <span className="person-bio-caret" aria-hidden />
          <span className="person-bio-show">Read bio</span>
          <span className="person-bio-hide">Hide bio</span>
        </summary>
        <p className="mt-3 text-left font-sans text-body-sm leading-[1.7] text-heading/70 dark:text-heading/55">
          {person.bio}
        </p>
      </details>

      {/* Its own track, not nested under the bio: opening one card's bio grows
          the shared bio track, so every teams rule in the row drops together
          and the row stays aligned. Nested, only the opened card would move.
          Outside the toggle at all because on the old site this line is the
          tail of the bio paragraph, so collapsing would take it with it. */}
      <p className="mt-4 w-full border-t border-line pt-3 font-mono text-legal text-fg-muted">
        {person.teams}
      </p>
    </article>
  );
}

function People({ title, intro, people }: { title: string; intro?: string; people: Person[] }) {
  return (
    <section className="mt-16 lg:mt-24">
      <h2 className="tracked font-display text-card-sm leading-[1.05] text-heading uppercase" data-rise>
        {title}
      </h2>
      {intro && (
        <p
          className="mt-6 max-w-[820px] font-sans text-body leading-[1.78] text-heading/70 dark:text-heading/55"
          data-rise
        >
          {intro}
        </p>
      )}
      {/* grid-rows-subgrid on the cards needs them to span real tracks here, so
          each card claims five rows and siblings share them. */}
      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 xl:grid-cols-4">
        {people.map((p) => (
          <PersonCard key={p.name} person={p} />
        ))}
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="container-page section-y pt-32 lg:pt-40">
      <div className="max-w-[820px]" data-rise>
        <SectionIntro title="Meet Team SportsTechX" />
        {about.intro.map((p, i) => (
          <p
            key={i}
            className="mt-6 font-sans text-body leading-[1.78] text-heading/70 dark:text-heading/55"
          >
            {p}
          </p>
        ))}
      </div>

      <People title="The team" people={about.team} />
      <People title="Advisors" intro={about.advisorsIntro} people={about.advisors} />
    </div>
  );
}
