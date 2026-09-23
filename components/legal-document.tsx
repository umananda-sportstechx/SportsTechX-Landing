import type { LegalDoc } from '@/lib/legal';

/**
 * Renders a structured legal document in the site's own voice.
 *
 * Long-form text wants a reading measure, not the poster width: `container-page`
 * caps at `min(90vw, 1600px)`, so the prose column is held to ~70ch inside it.
 *
 * Headings are Bebas caps rather than a large size — there are twenty h2s in the
 * Privacy Policy, and at `text-card-sm` the page would read as a stack of
 * billboards. The hairline above each one carries the structure instead.
 *
 * Every colour is a token, so light and dark both come for free.
 */
export function LegalDocument({ doc }: { doc: LegalDoc }) {
  return (
    <article className="mx-auto max-w-[70ch]">
      <header data-rise>
        <p className="tracked font-mono-alt text-mono-eyebrow text-accent uppercase">Legal</p>
        <h1 className="tracked mt-3 font-display text-section leading-[0.96] text-heading uppercase">
          {doc.title}
        </h1>
        {doc.subtitle && (
          <p className="mt-3 font-sans text-card-title text-fg-muted">{doc.subtitle}</p>
        )}
        {doc.updated && (
          <p className="mt-6 font-mono text-legal text-fg-muted">Last updated: {doc.updated}</p>
        )}
      </header>

      <div className="mt-12 flex flex-col gap-10 lg:mt-16">
        {doc.sections.map((section, i) => (
          <section key={`${section.heading}-${i}`} data-rise>
            {section.level === 2 ? (
              <h2 className="tracked border-t border-line pt-6 font-display text-feature leading-[1.3] text-heading uppercase">
                {section.heading}
              </h2>
            ) : (
              <h3 className="font-sans text-card-title leading-[1.4] font-semibold text-heading">
                {section.heading}
              </h3>
            )}

            <div className="mt-4 flex flex-col gap-4">
              {section.blocks.map((block, j) =>
                block.kind === 'list' ? (
                  <ul key={j} className="flex flex-col gap-3">
                    {block.items.map((item, k) => (
                      <li key={k} className="relative pl-6 font-sans text-body leading-[1.78] text-heading/70 dark:text-heading/55">
                        {/* A square, matching the bullet the Solutions cards use. */}
                        <span
                          aria-hidden
                          className="absolute top-[0.7em] left-0 size-[6px] border border-accent"
                        />
                        {item.label && <strong className="font-medium text-heading">{item.label}{item.text ? ' ' : ''}</strong>}
                        {item.text}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p key={j} className="font-sans text-body leading-[1.78] text-heading/70 dark:text-heading/55">
                    {block.label && <strong className="font-medium text-heading">{block.label}{block.text ? ' ' : ''}</strong>}
                    {block.text}
                  </p>
                )
              )}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
