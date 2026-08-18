import type { Metadata, Viewport } from 'next';
import '@fontsource/commit-mono/400.css';
import './globals.css';
import { bebasNeue, spaceMono } from './fonts';
import { Providers } from './providers';

export const metadata: Metadata = {
  metadataBase: new URL('https://sportstechx.com'),
  title: 'SportsTechX — Your Insider Access to Sports Tech & Venture',
  description:
    'The leading people, deepest insights and active capital shaping the future of sports. 20K+ community members, 2,000+ investors tracked, 1,500+ companies mapped across 40+ countries.',
  openGraph: {
    title: 'SportsTechX — Your Insider Access to Sports Tech & Venture',
    description:
      'The leading people, deepest insights and active capital shaping the future of sports.',
    type: 'website',
    siteName: 'SportsTechX',
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Add `newFrank.variable` here once the licensed files are in public/fonts/.
    <html lang="en" className={`${bebasNeue.variable} ${spaceMono.variable}`} suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
