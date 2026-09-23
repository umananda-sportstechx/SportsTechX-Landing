import type { Metadata } from 'next';
import { LegalDocument } from '@/components/legal-document';
import { termsOfService } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Terms of Service — SportsTechX',
  description: 'The terms governing your access to and use of the SportsTechX Intelligence Platform.',
};

export default function TermsOfServicePage() {
  return (
    <div className="container-page section-y pt-32 lg:pt-40">
      <LegalDocument doc={termsOfService} />
    </div>
  );
}
