'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { resolveChrome } from '@/lib/chrome';
import { cn } from '@/lib/utils';
import { cmsSectionBySlug } from '@/lib/sections';

/**
 * Short primary rail — no horizontal scroll. Full Postman desk list on /categories.
 * Prefer sections that already have published CMS inventory so the rail isn’t empty.
 * (Série B / Brasileirão APIs exist; they stay on /categories until CMS has published rows.)
 */
const PRIMARY_SLUGS = [
  'serie-c',
  'noticias',
  'base-e-amador',
  'outras',
  'partidas',
] as const;

export default function CategoryNav() {
  const pathname = usePathname();
  const chrome = resolveChrome().header;

  if (chrome.navPosition === 'none' || chrome.navPosition === 'inside-main') {
    return null;
  }

  const dark = chrome.surface === 'dark';
  const links = PRIMARY_SLUGS.map((slug) => cmsSectionBySlug(slug)).filter(
    (section): section is NonNullable<typeof section> => Boolean(section)
  );

  const linkClass = (active: boolean) =>
    cn(
      'inline-flex min-h-9 items-center rounded-sm px-2.5 text-[11px] font-semibold uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:min-h-10 sm:px-3 sm:text-xs',
      active
        ? 'bg-primary text-secondary focus-visible:outline-accent'
        : dark
          ? 'text-white/85 hover:bg-white/10 hover:text-white focus-visible:outline-accent'
          : 'text-secondary hover:bg-primary/10 hover:text-primary focus-visible:outline-primary'
    );

  return (
    <nav
      className={cn(
        'border-b shadow-sm',
        dark ? 'border-white/10 bg-secondary' : 'border-primary/15 bg-background'
      )}
      aria-label="Categorias"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-1 gap-y-1 px-3 py-1.5 sm:gap-x-1.5 sm:px-4 sm:py-2">
        <Link href="/" className={linkClass(pathname === '/')}>
          Início
        </Link>
        {links.map((section) => (
          <Link
            key={section.slug}
            href={section.href}
            className={linkClass(pathname === section.href)}
          >
            {section.label}
          </Link>
        ))}
        <Link href="/categories" className={linkClass(pathname === '/categories')}>
          Mais
        </Link>
      </div>
    </nav>
  );
}
