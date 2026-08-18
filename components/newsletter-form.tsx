'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

type Status = { state: 'idle' | 'pending' | 'done' } | { state: 'error'; message: string };

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>({ state: 'idle' });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ state: 'pending' });

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus({ state: 'error', message: body.error ?? 'Something went wrong. Please try again.' });
        return;
      }
      setStatus({ state: 'done' });
      setEmail('');
    } catch {
      setStatus({ state: 'error', message: 'Network error. Please try again.' });
    }
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="tracked font-display text-eyebrow leading-[1.45] text-fg uppercase">Join the newsletter</h2>
        <p className="font-sans text-body-sm text-heading/70">The inner circle of sports tech, weekly.</p>
      </div>

      <form onSubmit={onSubmit} className="flex w-full max-w-[480px] flex-col gap-2">
        <div className="flex gap-3">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            maxLength={254}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
            className="h-[42px] flex-1 rounded-full border-[1.5px] border-nav-border bg-surface px-5 font-sans text-body-sm text-fg placeholder:text-fg-muted"
          />
          <button
            type="submit"
            disabled={status.state === 'pending'}
            className={cn(
              'tracked inline-flex h-[42px] shrink-0 items-center justify-center rounded-full px-6 font-mono text-label',
              'bg-accent-2 text-white transition-opacity hover:opacity-90 disabled:opacity-60'
            )}
          >
            {status.state === 'pending' ? 'SENDING…' : 'SUBSCRIBE'}
          </button>
        </div>

        {/* Announce the outcome for screen readers as well as sighted users. */}
        <p aria-live="polite" className="min-h-[18px] font-sans text-[13px]">
          {status.state === 'done' && <span className="text-green-2">Thanks — check your inbox to confirm.</span>}
          {status.state === 'error' && <span className="text-accent-2">{status.message}</span>}
        </p>
      </form>
    </div>
  );
}
