import { Mail, MapPin } from 'lucide-react';
import { BrandLogo } from '@/components/brand-logo';
import { NewsletterForm } from '@/components/newsletter-form';
import { SOCIAL_ICONS, type SocialIconName } from '@/components/social-icons';
import { footer } from '@/lib/content';

export function Footer() {
  return (
    <footer id="about" className="section-y relative overflow-hidden bg-surface pb-8">
      {/* The "Cloud grid" rules that frame the footer content. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[var(--section-y)] container-page">
        <div className="h-px w-full bg-line" />
      </div>

      <div className="container-page relative">
        <div className="grid gap-12 pt-[54px] lg:grid-cols-[451px_1fr_1fr_1fr] lg:gap-[94px]">
          <div className="flex flex-col gap-[18px]">
            <BrandLogo className="h-[41px]" />
            <p className="font-sans text-body leading-[1.78] text-heading/70">{footer.blurb}</p>
            <div className="flex flex-col gap-px">
              <a
                href={`mailto:${footer.email}`}
                className="inline-flex items-center gap-[13px] font-sans text-body-sm text-heading transition-opacity hover:opacity-70"
              >
                <Mail className="size-4 shrink-0" strokeWidth={1.5} />
                {footer.email}
              </a>
              <span className="inline-flex items-center gap-[15px] font-sans text-body-sm text-heading">
                <MapPin className="size-4 shrink-0" strokeWidth={1.5} />
                {footer.location}
              </span>
            </div>
          </div>

          {footer.columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-[21px]">
              <h2 className="tracked font-display text-eyebrow leading-[1.45] text-fg uppercase">{column.title}</h2>
              <ul className="flex flex-col">
                {column.links.map((link) => {
                  const icon = 'icon' in link ? (link.icon as SocialIconName) : undefined;
                  const Icon = icon ? SOCIAL_ICONS[icon] : undefined;
                  return (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                        className="inline-flex items-center gap-2.5 py-px font-sans text-body leading-[1.78] text-heading transition-opacity hover:opacity-70"
                      >
                        {Icon && <Icon className="size-[15px] shrink-0" />}
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div id="newsletter" className="mt-[54px] border-t border-line pt-[42px]">
          <NewsletterForm />
        </div>

        <div className="mt-[42px] flex flex-col gap-2 border-t border-line pt-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="font-mono text-legal text-heading/70">{footer.legal}</p>
          <p className="font-mono text-legal text-heading/70">{footer.legalLinks}</p>
        </div>
      </div>
    </footer>
  );
}
