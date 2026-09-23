import type { Metadata } from 'next';
import { LegalDocument } from '@/components/legal-document';
import { privacyPolicy } from '@/lib/legal';

export const metadata: Metadata = {
  // Bare title: the root layout supplies the ' — SportsTechX' template.
  title: 'Privacy Policy',
  description:
    'How SportsTechX GmbH collects, uses and protects your personal data.',
  alternates: { canonical: '/privacy-policy' },
  // Without its own openGraph this page inherits the home page's, so a shared
  // link is captioned as the homepage.
  openGraph: {
    title: 'Privacy Policy — SportsTechX',
    description:
      'How SportsTechX GmbH collects, uses and protects your personal data.',
    url: '/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container-page section-y pt-32 lg:pt-40">
      <LegalDocument doc={privacyPolicy} />
    </div>
  );
}
