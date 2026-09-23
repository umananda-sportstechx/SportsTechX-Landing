/**
 * The About page: who SportsTechX is, and the people behind it.
 *
 * Copy and photographs carried over from sportstechx.com/about. The photos were
 * embedded there as base64 data URIs; they are real files under public/team/ now.
 */

export interface Person {
  name: string;
  role: string;
  bio: string;
  /** Favourite teams or athletes - the personal note the design shows last. */
  teams: string;
  /** Path under public/. */
  photo: string;
}

export const about = {
  intro: [
    'Based in Berlin, SportsTechX is the leading source for sports technology, innovation, and investment intelligence. Since 2018, we\'ve meticulously mapped the fast evolving Sports Tech ecosystem, delivering nuanced analysis of emerging startups, investment patterns, and market dynamics through multi-modal content, proprietary research, consulting, and investment advisory services.',
    'We help sports business leaders make smarter decisions and build future-focused strategies. Here\'s the team that delivers on that promise.',
  ],
  team: [
    {
      name: 'Rohn Malhotra',
      role: 'Co-Founder & Managing Director',
      bio: 'Rohn is a serial entrepreneur, sports nut and cinephile with 16+ years of experience. He began his career as a Management Consultant with KPMG, successfully exited his last startup in 2017, then entered the SportsTech industry in 2018, making Berlin his home. Is also an Investment Director at Match Ventures, a SportsTech VC fund.',
      teams: 'Manchester United, Bengaluru FC, Golden State Warriors',
      photo: '/team/rohn-malhotra.jpg',
    },
    {
      name: 'Vishnu Dixit',
      role: 'Head of Tech & Infrastructure',
      bio: 'Vishnu is a passionate football enthusiast, enjoys high-altitude trekking and has a keen interest in data science, machine learning and computer vision. With prior experience as a risk investigator at Amazon, he has developed strong analytical skills and is currently pursuing a Masters in Data Science from Liverpool John Moores University.',
      teams: 'Bengaluru FC, Newcastle United, FC Barcelona, RC Bangalore',
      photo: '/team/vishnu-dixit.jpg',
    },
    {
      name: 'Khyati Choudhary',
      role: 'Head of Communications & Operations',
      bio: 'KC is an amateur footballer, long distance runner and an adventure sports enthusiast. She brings extensive experience in sports media and presenting across multiple sports, backed by an academic foundation in psychology and a Masters in Journalism. Beyond sport, she\'s actively involved in animal welfare and rescue initiatives.',
      teams: 'Real Madrid, Cristiano Ronaldo, Aryna Sabalenka, Alex Pereira',
      photo: '/team/khyati-choudhary.jpg',
    },
    {
      name: 'Atiriya Narayan',
      role: 'Head of Data & Product',
      bio: 'Atiriya is a semi-professional footballer who has played for teams like FC Goa. With a BSc in Computer Science, she has developed a keen interest in data and machine learning. In the sports industry, her passion lies in women\'s sports, innovation, and the startup ecosystem.',
      teams: 'Mumbai Indians (WPL), FC Goa, Any Indian Contingent!',
      photo: '/team/atiriya-narayan.jpg',
    },
    {
      name: 'Advika Ponnappa',
      role: 'Research & Data',
      bio: 'Advika is currently pursuing a BSc in Computer Studies with a keen interest in International Relations. She is an enthusiastic sportswoman, having played hockey and badminton professionally. She has a strong interest towards learning about women\'s sports and advancements in sports technology.',
      teams: 'Roger Federer, Serena Williams, PV Sindhu, RC Bangalore',
      photo: '/team/advika-ponnappa.jpg',
    },
    {
      name: 'Avdhut Gursale',
      role: 'Research & Data',
      bio: 'Avdhut is a national-level footballer who has played for Rajasthan United FC. He holds an MBA in Sports Management and blends his on-field experience with a passion for digital storytelling and social media. He is passionate about promoting football and creating more opportunities for the sport to grow.',
      teams: 'Rajasthan United FC, Union Bank of India, Any Indian Contingent!',
      photo: '/team/avdhut-gursale.jpg',
    },
  ] satisfies Person[],
  advisors: [
    {
      name: 'Mitch Heath',
      role: 'Advisor',
      bio: 'Sports Executive || Coach, Advisor, Investor, Board Member || Co-Founder at Teamworks, The Operating System for Sports (TM)',
      teams: 'Duke Blue Devils',
      photo: '/team/mitch-heath.jpg',
    },
    {
      name: 'Thomas Preiss',
      role: 'Advisor',
      bio: 'Common Goal Co-Founder | Athlete Community Builder | Venture Investor | Sports, Capital & Innovation for Positive Impact',
      teams: 'SV Werder Bremen',
      photo: '/team/thomas-preiss.jpg',
    },
    {
      name: 'Benjamin Penkert',
      role: 'Co-Founder & Advisor',
      bio: 'SportsTechX ｜ Enjoys talking Web3, playing Padel & spending time in Cape Town',
      teams: 'FC Bayern Munich',
      photo: '/team/benjamin-penkert.jpg',
    },
  ] satisfies Person[],
};
