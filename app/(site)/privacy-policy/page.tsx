import type { Metadata } from 'next';
import { LegalDocument } from '@/components/legal-document';
import { privacyPolicy } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Privacy Policy — SportsTechX',
  description: 'How SportsTechX GmbH collects, uses and protects your personal data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container-page section-y pt-32 lg:pt-40">
      <LegalDocument doc={privacyPolicy} />
    </div>
  );
}
