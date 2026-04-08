'use client';

import { supabase } from '@/lib/supabase';

interface Props {
  href: string;
  partner: string;        // e.g. 'manduka', 'yogaworks', 'eventbrite'
  children: React.ReactNode;
  className?: string;
  page?: string;          // current page path for analytics
}

/**
 * Tracks affiliate link clicks in Supabase before opening the URL.
 * Logs anonymously if no user is logged in.
 */
export default function AffiliateLink({ href, partner, children, className = '', page }: Props) {
  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    // Log the click (fire-and-forget)
    try {
      const { data } = await supabase.auth.getSession();
      await supabase.from('affiliate_clicks').insert({
        user_id: data.session?.user.id ?? null,
        partner,
        url: href,
        page: page ?? (typeof window !== 'undefined' ? window.location.pathname : null),
      });
    } catch {
      // Never block navigation on analytics failure
    }
    window.open(href, '_blank', 'noopener,noreferrer');
  }

  return (
    <a href={href} onClick={handleClick} className={className} rel="sponsored noopener noreferrer" target="_blank">
      {children}
    </a>
  );
}
