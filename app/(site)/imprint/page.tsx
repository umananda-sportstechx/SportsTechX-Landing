import type { Metadata } from 'next';
import { LegalDocument } from '@/components/legal-document';
import { imprint } from '@/lib/legal';

export const metadata: Metadata = {
  // Bare title: the root layout supplies the ' — SportsTechX' template.
  title: 'Imprint',
  description:
    'Legal disclosure for SportsTechX GmbH in accordance with section 5 TMG.',
  alternates: { canonical: '/imprint' },
  // Without its own openGraph this page inherits the home page's, so a shared
  // link is captioned as the homepage.
  openGraph: {
    title: 'Imprint — SportsTechX',
    description:
      'Legal disclosure for SportsTechX GmbH in accordance with section 5 TMG.',
    url: '/imprint',
  },
};

export default function ImprintPage() {
  return (
    <div className="container-page section-y pt-32 lg:pt-40">
      <LegalDocument doc={imprint} />
    </div>
  );
}
