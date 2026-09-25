/**
 * Every string here was decoded out of STX-Figma.fig. Nothing is invented.
 * To re-check a value:  node scripts/fig-inspect.mjs --text "<frame name>"
 */

import type { StaticImageData } from 'next/image';

/**
 * Images are either a build-time static import (everything decoded from the
 * .fig) or a runtime URL from the CMS (admin panel -> Site assets). Consumers
 * pass both to next/image, which accepts either.
 */
export type Img = StaticImageData | string;

export interface Partner {
  name: string;
  role: string;
  /** Fallback wordmark drawn as text when no logo image is set. */
  logo: string;
  /** A real company mark from the CMS, drawn over the photo instead. */
  logoSrc: Img | null;
  photo: Img;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatar: Img;
}
import img17495777b6f3 from '@/public/images/17495777b6f3.jpg';
import imgb3d04779161b from '@/public/images/b3d04779161b.jpg';
import img389d48c3df5e from '@/public/images/389d48c3df5e.jpg';
import img94ce770cf9e8 from '@/public/images/94ce770cf9e8.jpg';
import imgd9507786c8d8 from '@/public/images/d9507786c8d8.jpg';
import img75683fd57261 from '@/public/images/75683fd57261.jpg';
import img68e925ea570d from '@/public/images/68e925ea570d.jpg';
import img4b66197f9eb7 from '@/public/images/4b66197f9eb7.jpg';
import imgf342d6ba5294 from '@/public/images/f342d6ba5294.png';
import img6552cb5eb340 from '@/public/images/6552cb5eb340.webp';
import imgb8758def93ad from '@/public/images/b8758def93ad.webp';
import img198f122078d1 from '@/public/images/198f122078d1.webp';
import imgdd889ac2c460 from '@/public/images/dd889ac2c460.webp';

export const nav = {
  links: [
    { label: 'SOLUTIONS', href: '/#solutions' },
    { label: 'MEDIA', href: '/#media' },
    { label: 'ABOUT', href: '/about' },
  ],
  cta: { label: 'JOIN THE NEWSLETTER', href: 'https://newsletter.sportstechx.com' },
};

export const hero = {
  headline: 'Your Insider Access To Sports Tech & Venture',
  subhead: 'The leading people, deepest insights and\nactive capital shaping the future of sports',
  ctas: [
    { label: 'FOR OPERATORS', href: '/#solutions', variant: 'primary' as const },
    { label: 'FOR INVESTORS', href: '/#solutions', variant: 'secondary' as const },
  ],
  /**
   * Orbiting category pills. Icons are the design's own vectors, exported from
   * Figma; `w`/`h` are each glyph's leaf size on the artboard and must stay
   * explicit — the six are not a uniform set.
   */
  pills: [
    { label: 'LEAGUES', icon: '/icons/pill-leagues.svg', w: 14.375, h: 14.5, primary: false },
    { label: 'TEAMS', icon: '/icons/pill-teams.svg', w: 10, h: 11, primary: false },
    { label: 'MEDIA', icon: '/icons/pill-media.svg', w: 10, h: 10, primary: false },
    { label: 'ATHLETES', icon: '/icons/pill-media.svg', w: 10, h: 10, primary: false },
    { label: 'FOUNDERS', icon: '/icons/pill-founders.svg', w: 12, h: 12, primary: true },
    { label: 'INVESTORS', icon: '/icons/pill-investors.svg', w: 14, h: 8, primary: true },
  ],
};

export const stats = [
  { value: '20K+', label: 'Community\nmembers' },
  { value: '2,000+', label: 'Investors\ntracked' },
  { value: '1,500+', label: 'Companies\nmapped' },
  { value: '40+', label: 'Countries\nrepresented' },
];

export const trustedBy = {
  title: 'TRUSTED BY',
  subtitle: 'founders, investors, sports organizations',
  /**
   * Eight partner headshots extracted from the design, used only until an
   * admin fills Site assets -> STX landing -> Carousel gallery. `logo` is the
   * white wordmark the artboard overlays on each photo; a CMS card supplies a
   * real logo image instead.
   */
  partners: [
    { name: 'Alexander Janssen', role: 'CEO, Dutch SportsTech Fund', logo: 'BCG', logoSrc: null, photo: img17495777b6f3 },
    { name: 'Alexander Janssen', role: 'CEO, Dutch SportsTech Fund', logo: 'BCG', logoSrc: null, photo: imgb3d04779161b },
    { name: 'Alexander Janssen', role: 'CEO, Dutch SportsTech Fund', logo: 'BCG', logoSrc: null, photo: img389d48c3df5e },
    { name: 'Alexander Janssen', role: 'CEO, Dutch SportsTech Fund', logo: 'BCG', logoSrc: null, photo: img94ce770cf9e8 },
    { name: 'Alexander Janssen', role: 'CEO, Dutch SportsTech Fund', logo: 'BCG', logoSrc: null, photo: imgd9507786c8d8 },
    { name: 'Alexander Janssen', role: 'CEO, Dutch SportsTech Fund', logo: 'BCG', logoSrc: null, photo: img75683fd57261 },
    { name: 'Alexander Janssen', role: 'CEO, Dutch SportsTech Fund', logo: 'BCG', logoSrc: null, photo: img68e925ea570d },
    { name: 'Alexander Janssen', role: 'CEO, Dutch SportsTech Fund', logo: 'BCG', logoSrc: null, photo: img4b66197f9eb7 },
  ] as Partner[],
};

export const testimonial: Testimonial = {
  quote: '“We walked into our raise knowing the market cold. That confidence changed every conversation.”',
  name: 'Alexander Janssen',
  role: 'CEO, Dutch SportsTech Fund',
  avatar: imgf342d6ba5294,
};

export type SolutionCard = {
  id: string;
  /** Which of the sector buttons show this card. */
  sectors: string[];
  eyebrow: string;
  badge: string;
  title: string;
  blurb: string;
  cta: string;
  features: { title: string; points: string[] }[];
  testimonialsLabel: string;
  testimonials: Testimonial[];
};

/**
 * The card that drops from SOLUTIONS. Two columns on the board — 503x163, the
 * rows 28 tall with a 28 circular badge and the label 38 in. The role glyphs
 * are the same 12x12 and 14x8 vectors the hero pills use; the product rows show
 * their initial, as the board draws them.
 */
export const navMenu = [
  {
    label: 'BY ROLE',
    items: [
      { label: 'FOR OPERATORS', href: '/#solutions', icon: '/icons/pill-founders.svg', w: 12, h: 12 },
      { label: 'FOR INVESTORS', href: '/#solutions', icon: '/icons/pill-investors.svg', w: 14, h: 8 },
    ],
  },
  {
    label: 'BY PRODUCT',
    items: [
      { label: 'ATLAS', href: '/#solutions', initial: 'A' },
      { label: 'PLAYMAKERS', href: '/#solutions', initial: 'P' },
    ],
  },
];

export const solutions = {
  title: 'SOLUTIONS',
  selectorLabel: 'I am a sports tech',
  // Singular: the label above now reads into them — "I am a sports tech
  // OPERATOR". The ids stay as they were; they key the cards' `sectors`.
  sectors: [
    { id: 'founders', label: 'OPERATOR' },
    { id: 'investors', label: 'INVESTOR' },
  ],
  cards: [
    {
      id: 'playmakers',
      // Playmakers is the founder product — picking INVESTORS drops it.
      sectors: ['founders'],
      eyebrow: 'PLAYMAKERS',
      badge: 'FOR THE PROS',
      // This card shipped with Atlas's feature copy pasted into it — all nine
      // points were about pitch decks and investor pipelines. Replaced with the
      // Playmakers copy the team supplied. Sentence case and the ALL-CAPS CTA
      // follow the Atlas card beside it; neither has a text-transform, so the
      // casing here is what renders.
      // Three lines: the copy grew past the two the card was drawn for, and the
      // breaks are explicit so it does not wrap mid-phrase.
      title: "Where sports tech's best\nbuild smarter, faster,\ntogether.",
      blurb:
        'The private peer advisory network for high-growth sports tech founders and CEOs.',
      cta: 'EXPLORE MEMBERSHIP',
      testimonialsLabel: 'PLAYMAKERS TESTIMONIALS',
      testimonials: [testimonial, testimonial, testimonial, testimonial],
      features: [
        {
          title: 'Your personal board\nof peer advisors',
          points: [
            "Skip costly trial-and-error by learning from other founders who've been there",
            'Scale faster with advice from leaders who have navigated complex growth',
            'Stay mentally resilient with a circle that understands your journey',
          ],
        },
        {
          title: 'Insider sports\nindustry network',
          points: [
            'Join private membership events turning your peers into collaborators',
            'Receive introductions that expand your network among top leaders in sports',
            'Gain access to new partners, markets and investment to accelerate business growth',
          ],
        },
        {
          title: 'Insider tech\nbusiness intelligence',
          points: [
            'Build with anytime / anywhere access to the best knowledge in sports tech',
            'Inform your strategy with world-class sports tech market data and research',
            'Leverage insider expertise to obtain a competitive advantage',
          ],
        },
      ],
    },
    {
      id: 'atlas',
      sectors: ['founders', 'investors'],
      eyebrow: 'atlas',
      badge: 'EARLY STAGE',
      title: 'Raising your next round?',
      blurb:
        'Find the right investors, benchmark your company and sharpen your pitch with the SportsTechX intelligence layer.',
      cta: 'TRY ATLAS',
      testimonialsLabel: 'ATLAS TESTIMONIALS',
      testimonials: [testimonial, testimonial, testimonial, testimonial],
      features: [
        {
          title: 'Build your case',
          points: [
            'Analyze your pitch deck to assess your investor readiness',
            'Perform competitor benchmarking and market sizing',
            'Improve your pitch with expert feedback and iterative refinement',
          ],
        },
        {
          title: 'Identify the right investors',
          points: [
            'Access detailed profiles of 2+ verified sports tech investors',
            'Get matched with investors most likely to fund your startup',
            'Create a custom investor pipeline and manage your outreach',
          ],
        },
        {
          title: 'Close the deal',
          points: [
            'Build and maintain a due\ndiligence-ready data room',
            'Access essential model documents for early stage investments',
            'Monitor progress towards your fundraising goal and keep your raise on track',
          ],
        },
      ],
    },
  ] satisfies SolutionCard[],
};

export type MediaItem = {
  category: string;
  action: string;
  /** Extra destinations shown as brand icons beside the category word. */
  links?: { label: string; href: string; icon: string; color: string }[];
  title: string;
  /** Static stand-in. Three of the four cards replace this at render time. */
  image: Img;
  href: string;
};

export const media = {
  title: 'MEDIA',
  subtitle: 'What the insiders read and listen to',
  items: ([
    {
      category: 'NEWSLETTER',
      action: 'SUBSCRIBE',
      title: "#191 🤝 IG Group's $2.15B\nBet on Underdog",
      image: img6552cb5eb340,
      // Replaced at render time by the latest issue from the Beehiiv feed.
      href: 'https://newsletter.sportstechx.com',
    },
    {
      category: 'PODCAST',
      action: 'LISTEN',
      // Replaced at render time by the latest video on the YouTube playlist.
      title: 'From M&A Advisory to Early Stage Sports Tech Investor - Uday Khanna',
      image: imgb8758def93ad,
      // Spotify is the default destination for the card itself.
      href: 'https://open.spotify.com/show/2IWyvvtC2fAeRAyt55TmtF',
      links: [
        {
          label: 'Spotify',
          href: 'https://open.spotify.com/show/2IWyvvtC2fAeRAyt55TmtF',
          icon: 'spotify',
          color: '#1DB954',
        },
        {
          label: 'YouTube',
          href: 'https://www.youtube.com/playlist?list=PLptEoomboUFS422kldem0tLkXJjDbHjfx',
          icon: 'footer-youtube',
          color: '#FF0000',
        },
      ],
    },
    {
      category: 'REPORTS',
      action: 'READ',
      // Replaced at render time by the newest report on the hub. The artboard
      // read "Football Tech Report 2006" — a typo for the 2025 edition.
      title: 'Football Tech Report 2025',
      image: img198f122078d1,
      href: 'https://intelligence.sportstechx.com/reports/',
    },
    {
      category: 'EVENTS',
      action: 'ATTEND',
      title: 'The NextGen Sportstech\nSummit 2026',
      image: imgdd889ac2c460,
      // The hub's events page. This was '/#events', an anchor that does not
      // exist on this page, so the card went nowhere.
      href: 'https://intelligence.sportstechx.com/events/',
    },
  ] as MediaItem[]),
};

/** A footer link. `icon` draws a glyph; with `iconOnly` the label is the a11y name. */
export interface FooterLink {
  label: string;
  href: string;
  icon?: string;
  iconOnly?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export const footer = {
  blurb:
    'SportsTechX is the insider network for sports tech — connecting founders and investors through curated access, market data and practical fundraising support.',
  email: 'hello@sportstechx.com',
  /** Where the brand column\'s signup hands off. There is no /api/subscribe in
   * this app; every newsletter CTA on the site is a link to this host, and the
   * form is a GET so the address arrives as ?email= rather than being posted
   * somewhere that would need a secret. */
  newsletterAction: 'https://newsletter.sportstechx.com/subscribe',
  columns: [
    {
      title: 'Solutions',
      links: [
        { label: 'For Operators', href: '/#solutions' },
        { label: 'For Investors', href: '/#solutions' },
      ],
    },
    {
      title: 'Products',
      links: [
        { label: 'Playmakers', href: 'https://joinplaymakers.co' },
        // The same destination as Playmakers: "Investors Circle" is another
        // name for it, and there is no separate page.
        { label: 'Investors Circle', href: 'https://joinplaymakers.co' },
        { label: 'Atlas', href: 'https://atlas.sportstechx.com' },
      ],
    },
    {
      title: 'Media',
      links: [
        { label: 'Newsletter', href: 'https://newsletter.sportstechx.com' },
        { label: 'Podcast', href: 'https://creators.spotify.com/pod/profile/sportstechx/' },
        // The hub, not atlas.sportstechx.com/reports — that redirects to /login.
        { label: 'Reports', href: 'https://intelligence.sportstechx.com/reports/' },
        { label: 'Events', href: 'https://intelligence.sportstechx.com/events/' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Contact', href: 'mailto:hello@sportstechx.com' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/company/sportstechx', icon: 'linkedin', iconOnly: true },
        { label: 'YouTube', href: 'https://www.youtube.com/@sportstechx', icon: 'youtube', iconOnly: true },
      ],
    },
  ] satisfies FooterColumn[],
  legal: '© 2026 SportsTechX GmbH · Berlin, Germany',
  legalLinks: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
    // The Playmakers site's own terms. This used to point at /terms-of-service,
    // which is SportsTechX's terms, not the membership ones.
    { label: 'Playmakers Membership Terms', href: 'https://playmakers-omega.vercel.app/terms' },
    { label: 'Imprint', href: '/imprint' },
  ],
};

export const mobileMenu = {
  groups: [
    { title: 'SOLUTIONS', links: [{ label: 'FOR OPERATORS', href: '/#solutions' }, { label: 'FOR INVESTORS', href: '/#solutions' }] },
    { title: 'MENU', links: [{ label: 'MEDIA', href: '/#media' }, { label: 'ABOUT', href: '/about' }] },
    {
      title: 'CONNECT',
      links: [
        { label: 'JOIN THE NEWSLETTER', href: 'https://newsletter.sportstechx.com', accent: true },
        { label: 'LINKEDIN', href: 'https://www.linkedin.com/company/sportstechx' },
        { label: 'YOUTUBE', href: 'https://www.youtube.com/@sportstechx' },
        { label: 'INSTAGRAM', href: 'https://www.instagram.com/sportstechx' },
        { label: 'X', href: 'https://x.com/sportstechx' },
      ],
    },
  ],
};
