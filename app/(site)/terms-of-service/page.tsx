import type { Metadata } from 'next';
import { LegalDocument } from '@/components/legal-document';
import { termsOfService } from '@/lib/legal';

export const metadata: Metadata = {
  // Bare title: the root layout supplies the ' — SportsTechX' template.
  title: 'Terms of Service',
  description:
    'The terms governing your access to and use of the SportsTechX Intelligence Platform.',
  alternates: { canonical: '/terms-of-service' },
  // Without its own openGraph this page inherits the home page's, so a shared
  // link is captioned as the homepage.
  openGraph: {
    title: 'Terms of Service — SportsTechX',
    description:
      'The terms governing your access to and use of the SportsTechX Intelligence Platform.',
    url: '/terms-of-service',
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="container-page section-y pt-32 lg:pt-40">
      <LegalDocument doc={termsOfService} />
    </div>
  );
}
