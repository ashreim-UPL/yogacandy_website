'use client';

import { useEffect, useRef } from 'react';

interface Props {
  slot: string;           // AdSense ad unit ID, e.g. "1234567890"
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
  label?: string;         // Override the "Sponsored" label
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

/**
 * Renders a Google AdSense ad unit.
 * The AdSense script is loaded globally in layout.tsx.
 * Only renders when NEXT_PUBLIC_ADSENSE_CLIENT_ID is set.
 */
export default function AdSlot({ slot, format = 'auto', className = '', label = 'Advertisement' }: Props) {
  const adRef = useRef<HTMLElement | null>(null);
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || !adRef.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense not yet loaded — will auto-init when script loads
    }
  }, [clientId]);

  if (!clientId) return null;

  return (
    <div className={`text-center ${className}`}>
      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium mb-1">{label}</p>
      <ins
        ref={adRef as React.RefObject<HTMLModElement>}
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
