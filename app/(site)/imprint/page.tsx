import type { Metadata } from 'next';
import { LegalDocument } from '@/components/legal-document';
import { imprint } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Imprint — SportsTechX',
  description: 'Legal disclosure for SportsTechX GmbH in accordance with section 5 TMG.',
};

export default function ImprintPage() {
  return (
    <div className="container-page section-y pt-32 lg:pt-40">
      <LegalDocument doc={imprint} />
    </div>
  );
}
