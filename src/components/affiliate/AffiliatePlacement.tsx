'use client';

import { usePathname } from 'next/navigation';
import AffiliateBanner, { type AffiliateBannerPreset } from './AffiliateBanner';

/** Shared chrome placements must also respect informational-page exclusions. */
export default function AffiliatePlacement({ preset = 'strip', skipHome = false }: { preset?: AffiliateBannerPreset; skipHome?: boolean }) {
  const pathname = usePathname();
  if (skipHome && pathname === '/') return null;
  if (/^\/(?:about|contact|sobre|sobre-nos|contato|newsletter)(?:\/|$)/.test(pathname)) return null;
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-3">
      <AffiliateBanner preset={preset} />
    </div>
  );
}
