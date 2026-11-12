import type { BreakingHeadline, AlertItem } from '@/lib/cms-client';
import Header from '@/components/chrome/Header';
import CategoryNav from '@/components/chrome/CategoryNav';
import BreakingNews from '@/components/chrome/BreakingNews';
import AlertsRail from '@/components/chrome/AlertsRail';
import { resolveChrome } from '@/lib/chrome';
import { hasCapability } from '@/lib/capabilities';

interface ChromeHostProps {
  headlines: BreakingHeadline[];
  alerts: AlertItem[];
}

/**
 * Owns chrome composition order from siteConfig.chrome (Phase 1).
 * Sticky shell keeps header + category rail fixed while content scrolls.
 */
export default function ChromeHost({ headlines, alerts }: ChromeHostProps) {
  const chrome = resolveChrome().header;
  const showBreaking =
    hasCapability('breaking-ticker') &&
    chrome.breakingPosition !== 'none' &&
    chrome.breakingPosition !== 'inside-header';
  const showNav =
    hasCapability('category-nav') && chrome.navPosition === 'below-main';
  const stickyShell = chrome.stickyMode !== 'none';

  const breaking =
    showBreaking && headlines.length ? (
      <BreakingNews headlines={headlines} />
    ) : null;

  const mainChrome = (
    <>
      <Header />
      {showNav ? <CategoryNav /> : null}
      {chrome.breakingPosition === 'below-nav' ? breaking : null}
    </>
  );

  return (
    <>
      {chrome.breakingPosition === 'top' ? breaking : null}
      {stickyShell ? (
        <div className="sticky top-0 z-50">{mainChrome}</div>
      ) : (
        mainChrome
      )}
      {hasCapability('alerts-rail') ? <AlertsRail alerts={alerts} /> : null}
    </>
  );
}
