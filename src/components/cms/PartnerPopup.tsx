'use client';

import { useState } from 'react';

export default function PartnerPopup({
  banners,
}: {
  banners: Array<{ imageUrl: string; linkUrl?: string; partnerName?: string }>;
}) {
  const [open, setOpen] = useState(true);
  if (!open || !banners.length) return null;
  const banner = banners[0];

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[min(100%-2rem,22rem)] border border-black/15 bg-white p-3 shadow-lg">
      <button
        type="button"
        className="absolute right-2 top-2 text-xs font-bold uppercase text-muted"
        onClick={() => setOpen(false)}
      >
        Fechar
      </button>
      <a href={banner.linkUrl || '#'} target="_blank" rel="sponsored noopener noreferrer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={banner.imageUrl} alt={banner.partnerName || 'Parceiro'} className="mt-4 h-auto w-full object-contain" />
      </a>
    </div>
  );
}
