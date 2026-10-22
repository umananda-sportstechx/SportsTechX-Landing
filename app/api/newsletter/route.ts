import { NextResponse } from 'next/server';

/**
 * Subscribe an email to the Beehiiv newsletter.
 *
 * Needs BEEHIIV_API_KEY + BEEHIIV_PUBLICATION_ID (set them in Vercel). Until
 * they are, this returns 503 with { fallback: true } and the client opens the
 * hosted Beehiiv subscribe page instead — so the form always does something.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({ email: '' }));
  if (typeof email !== 'string' || !EMAIL.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email.' }, { status: 400 });
  }

  const key = process.env.BEEHIIV_API_KEY;
  const pub = process.env.BEEHIIV_PUBLICATION_ID;
  if (!key || !pub) {
    return NextResponse.json({ fallback: true }, { status: 503 });
  }

  const res = await fetch(`https://api.beehiiv.com/v2/publications/${pub}/subscriptions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      reactivate_existing: true,
      send_welcome_email: true,
      utm_source: 'landing',
    }),
  }).catch(() => null);

  if (!res || !res.ok) {
    return NextResponse.json({ fallback: true }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
