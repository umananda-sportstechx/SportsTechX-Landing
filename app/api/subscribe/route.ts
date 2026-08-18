import { NextResponse } from 'next/server';

/**
 * Newsletter signup. There is no newsletter endpoint on the STX backend — every
 * "subscription" route there is Stripe billing — so this forwards to whatever
 * provider is configured via NEWSLETTER_WEBHOOK_URL (Mailchimp, Beehiiv, a
 * Zapier catch hook, …). With no URL set it reports 501 rather than pretending
 * the address was stored.
 */

// Deliberately permissive but bounded: one @, no whitespace, a dotted domain.
// The provider is the real authority on deliverability; this only rejects junk.
const EMAIL = /^[^\s@]+@[^\s@.]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254; // RFC 5321

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Expected a JSON body.' }, { status: 400 });
  }

  const raw = (payload as { email?: unknown })?.email;
  const email = typeof raw === 'string' ? raw.trim() : '';

  if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }

  const webhook = process.env.NEWSLETTER_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json(
      { error: 'Newsletter signup is not configured yet. Set NEWSLETTER_WEBHOOK_URL.' },
      { status: 501 }
    );
  }

  try {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, source: 'landing' }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      console.error(`newsletter webhook responded ${response.status}`);
      return NextResponse.json({ error: 'Could not subscribe right now. Please try again.' }, { status: 502 });
    }
  } catch (error) {
    console.error('newsletter webhook failed', error);
    return NextResponse.json({ error: 'Could not subscribe right now. Please try again.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
