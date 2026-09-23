import type { Metadata } from 'next';
import Image from 'next/image';
import { SectionIntro } from '@/components/section-intro';
import { about, type Person } from '@/lib/about';

export const metadata: Metadata = {
  title: 'About — SportsTechX',
  description:
    'Based in Berlin, SportsTechX is the leading source for sports technology, innovation and investment intelligence. Meet the team.',
};

/**
 * A person card: portrait, name, role, bio, and the favourite-teams line the
 * old site closed each profile with.
 *
 * The portrait is a fixed 4:5 so a grid row stays even no matter how the source
 * photos were cropped, and `object-cover` does the rest.
 */
function PersonCard({ person }: { person: Person }) {
  return (
    <article data-rise className="flex flex-col">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[10px] bg-band">
        <Image
          src={person.photo}
          alt={person.name}
          fill
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
          className="object-cover"
        />
      </div>

      <h3 className="tracked mt-5 font-display text-feature leading-[1.2] text-heading uppercase">
        {person.name}
      </h3>
      <p className="tracked mt-1 font-mono-alt text-mono-eyebrow text-accent uppercase">
        {person.role}
      </p>
      <p className="mt-4 font-sans text-body-sm leading-[1.7] text-heading/70 dark:text-heading/55">
        {person.bio}
      </p>
      {person.teams && (
        <p className="mt-4 border-t border-line pt-3 font-mono text-legal text-fg-muted">
          {person.teams}
        </p>
      )}
    </article>
  );
}

function People({ title, people }: { title: string; people: Person[] }) {
  return (
    <section className="mt-16 lg:mt-24">
      <h2 className="tracked font-display text-card-sm leading-[1.05] text-heading uppercase" data-rise>
        {title}
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
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
      <div className="max-w-[70ch]" data-rise>
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
      <People title="Advisors" people={about.advisors} />
    </div>
  );
}
