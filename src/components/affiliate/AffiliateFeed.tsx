import { Children, Fragment, type ReactNode } from 'react';
import AffiliateBanner from './AffiliateBanner';

/** Only add a placement when another item follows a complete group of six. */
export default function AffiliateFeed({
  children,
  className = '',
  cardSlot = false,
  offset = 0,
}: {
  children: ReactNode;
  className?: string;
  cardSlot?: boolean;
  offset?: number;
}) {
  const items = Children.toArray(children);
  return (
    <div className={className}>
      {items.map((item, index) => {
        const count = index + 1 + offset;
        const placement = Math.floor(count / 6) - 1;
        const showBanner = count % 6 === 0 && index < items.length - 1;
        const isCard = cardSlot && placement === 0;
        const widePlacement = placement - (cardSlot ? 1 : 0);
        return (
          <Fragment key={index}>
            {item}
            {showBanner && (
              <div className={isCard ? 'min-w-0 self-center' : 'col-span-full min-w-0 py-4'}>
                <AffiliateBanner preset={isCard ? 'card' : widePlacement % 2 === 0 ? 'landscape' : 'strip'} />
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
