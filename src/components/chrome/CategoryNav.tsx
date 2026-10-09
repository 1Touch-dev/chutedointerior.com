'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { resolveChrome } from '@/lib/chrome';
import { cn } from '@/lib/utils';
import { cmsSections } from '@/lib/sections';

/** Category rail - contrast follows chrome.surface */
export default function CategoryNav() {
  const pathname = usePathname();
  const chrome = resolveChrome().header;

  if (chrome.navPosition === 'none' || chrome.navPosition === 'inside-main') {
    return null;
  }

  const dark = chrome.surface === 'dark';

  const linkClass = (active: boolean) =>
    cn(
      'shrink-0 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
      active
        ? 'bg-primary text-white focus-visible:outline-accent'
        : dark
          ? 'text-white/85 hover:bg-white/10 hover:text-white focus-visible:outline-accent'
          : 'text-secondary hover:bg-primary/10 hover:text-primary focus-visible:outline-primary'
    );

  return (
    <nav
      className={cn(
        'border-b',
        dark ? 'border-white/10 bg-[#0B3D2E]' : 'border-black/10 bg-background'
      )}
      aria-label="Categorias"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2 scrollbar-hide">
        <Link href="/" className={linkClass(pathname === '/')}>
          Início
        </Link>
        {cmsSections.map((section) => (
          <Link
            key={section.slug}
            href={section.href}
            className={linkClass(pathname === section.href)}
          >
            {section.label}
          </Link>
        ))}
        <Link
          href="/categories"
          className={cn(linkClass(pathname === '/categories'), 'ml-auto')}
        >
          Categorias
        </Link>
      </div>
    </nav>
  );
}
