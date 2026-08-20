/**
 * Every string here was decoded out of STX-Figma.fig. Nothing is invented.
 * To re-check a value:  node scripts/fig-inspect.mjs --text "<frame name>"
 */

export const nav = {
  links: [
    { label: 'SOLUTIONS', href: '#solutions' },
    { label: 'MEDIA', href: '#media' },
    { label: 'ABOUT', href: '#about' },
  ],
  cta: { label: 'JOIN THE NEWSLETTER', href: '#newsletter' },
};

export const hero = {
  headline: 'Your Insider Access To Sports Tech & Venture',
  subhead: 'The leading people, deepest insights and\nactive capital shaping the future of sports',
  ctas: [
    { label: 'FOR FOUNDERS', href: '#solutions', variant: 'primary' as const },
    { label: 'FOR INVESTORS', href: '#solutions', variant: 'secondary' as const },
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
   * Eight partner headshots extracted from the design. `logo` is the white
   * wordmark the design overlays on each photo — placeholder branding in the
   * artboard, so swap these for real partner marks when they exist.
   */
  partners: [
    { name: 'Alexander Janssen', role: 'CEO, Dutch SportsTech Fund', logo: 'BCG', photo: '/images/17495777b6f3.jpg' },
    { name: 'Alexander Janssen', role: 'CEO, Dutch SportsTech Fund', logo: 'BCG', photo: '/images/b3d04779161b.jpg' },
    { name: 'Alexander Janssen', role: 'CEO, Dutch SportsTech Fund', logo: 'BCG', photo: '/images/389d48c3df5e.jpg' },
    { name: 'Alexander Janssen', role: 'CEO, Dutch SportsTech Fund', logo: 'BCG', photo: '/images/94ce770cf9e8.jpg' },
    { name: 'Alexander Janssen', role: 'CEO, Dutch SportsTech Fund', logo: 'BCG', photo: '/images/d9507786c8d8.jpg' },
    { name: 'Alexander Janssen', role: 'CEO, Dutch SportsTech Fund', logo: 'BCG', photo: '/images/75683fd57261.jpg' },
    { name: 'Alexander Janssen', role: 'CEO, Dutch SportsTech Fund', logo: 'BCG', photo: '/images/68e925ea570d.jpg' },
    { name: 'Alexander Janssen', role: 'CEO, Dutch SportsTech Fund', logo: 'BCG', photo: '/images/4b66197f9eb7.jpg' },
  ],
};

const testimonial = {
  quote: '“We walked into our raise knowing the market cold. That confidence changed every conversation.”',
  name: 'Alexander Janssen',
  role: 'CEO, Dutch SportsTech Fund',
  avatar: '/images/f342d6ba5294.png',
};

export type SolutionCard = {
  id: string;
  eyebrow: string;
  badge: string;
  title: string;
  blurb: string;
  cta: string;
  features: { title: string; points: string[] }[];
  testimonialsLabel: string;
  testimonials: typeof testimonial[];
};

export const solutions = {
  title: 'SOLUTIONS',
  selectorLabel: 'Select your sector',
  sectors: [
    { id: 'founders', label: 'FOUNDERS' },
    { id: 'investors', label: 'INVESTORS' },
  ],
  cards: [
    {
      id: 'playmakers',
      eyebrow: 'PLAYMAKERS',
      badge: 'FOR THE PROS',
      title: "Where sports tech's\nbest build together.",
      blurb:
        'Playmakers is built around trusted peer exchange, strategic support and access to the people shaping the industry.',
      cta: 'TRY PLAYMAKERS',
      testimonialsLabel: 'PLAYMAKERS TESTIMONIALS',
      testimonials: [testimonial, testimonial, testimonial, testimonial],
      features: [
        {
          title: 'Your personal board\nof advisors',
          points: [
            'Analyze your pitch deck to assess your investor readiness',
            'Perform competitor benchmarking and market sizing',
            'Improve your pitch with expert feedback and iterative refinement',
          ],
        },
        {
          title: 'Insider sports\nindustry network',
          points: [
            'Access detailed profiles of 2+ verified sports tech investors',
            'Get matched with investors most likely to fund your startup',
            'Create a custom investor pipeline and manage your outreach',
          ],
        },
        {
          title: 'Sports tech business intelligence',
          points: [
            'Build and maintain a due\ndiligence-ready data room',
            'Access essential model documents for early stage investments',
            'Monitor progress towards your fundraising goal and keep your raise on track',
          ],
        },
      ],
    },
    {
      id: 'atlas',
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
  /** Absent where the design hides the card's "Product Title" layer. */
  kicker?: string;
  title: string;
  image: string;
  href: string;
};

export const media = {
  title: 'MEDIA',
  subtitle: 'What the insiders read and listen to',
  items: ([
    {
      category: 'NEWSLETTER',
      action: 'SUBSCRIBE',
      kicker: 'SPORTSTECHX WEEKLY',
      title: "#191 🤝 IG Group's $2.15B\nBet on Underdog",
      image: '/images/6552cb5eb340.webp',
      href: '#newsletter',
    },
    {
      category: 'PODCAST',
      action: 'LISTEN',
      kicker: 'STX ALLSTARS PODCAST',
      title: 'From M&A Advisory to Early Stage Sports Tech Investor - Uday Khanna',
      image: '/images/b8758def93ad.webp',
      href: '#podcast',
    },
    {
      category: 'REPORTS',
      action: 'READ',
      // no kicker: the design hides this card's "Product Title" layer
      title: 'Football Tech Report 2006',
      image: '/images/198f122078d1.webp',
      href: '#reports',
    },
    {
      category: 'EVENTS',
      action: 'ATTEND',
      // no kicker: the design hides this card's "Product Title" layer
      title: 'The NextGen Sportstech\nSummit 2026',
      image: '/images/dd889ac2c460.webp',
      href: '#events',
    },
  ] as MediaItem[]),
};

export const footer = {
  blurb:
    'SportsTechX helps founders and investors navigate the sports tech market through curated access, market data and practical fundraising support.',
  email: 'hello@sportstechx.com',
  location: 'Berlin, Germany',
  columns: [
    { title: 'PLAYMAKERS', links: [{ label: 'Terms of membership', href: '#' }] },
    {
      title: 'Quick Links',
      links: [
        { label: 'Intelligence Hub', href: '#' },
        { label: 'Solutions', href: '#solutions' },
        { label: 'Media', href: '#media' },
        { label: 'Newsletter', href: '#newsletter' },
      ],
    },
    {
      title: 'CONNECT',
      links: [
        { label: 'LinkedIn', href: 'https://www.linkedin.com/company/sportstechx', icon: 'linkedin' },
        { label: 'Youtube', href: 'https://www.youtube.com/@sportstechx', icon: 'youtube' },
        { label: 'Instagram', href: 'https://www.instagram.com/sportstechx', icon: 'instagram' },
        { label: 'X', href: 'https://x.com/sportstechx', icon: 'x' },
      ],
    },
  ],
  legal: '© 2026 SportsTechX GmbH. All rights reserved.',
  legalLinks: 'Privacy · Imprint · The Inner Circle of Sports Tech',
};

export const mobileMenu = {
  groups: [
    { title: 'SOLUTIONS', links: [{ label: 'FOR FOUNDERS', href: '#solutions' }, { label: 'FOR INVESTORS', href: '#solutions' }] },
    { title: 'MENU', links: [{ label: 'MEDIA', href: '#media' }, { label: 'ABOUT', href: '#about' }] },
    {
      title: 'CONNECT',
      links: [
        { label: 'JOIN THE NEWSLETTER', href: '#newsletter', accent: true },
        { label: 'LINKEDIN', href: 'https://www.linkedin.com/company/sportstechx' },
        { label: 'YOUTUBE', href: 'https://www.youtube.com/@sportstechx' },
        { label: 'INSTAGRAM', href: 'https://www.instagram.com/sportstechx' },
        { label: 'X', href: 'https://x.com/sportstechx' },
      ],
    },
  ],
};
