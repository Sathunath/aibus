import React, { useState, useEffect, useRef } from 'react';

export interface UseTableViewportFillOptions {
  actualRowCount: number;
  rowHeight?: number; // Default 28px
  headerHeight?: number; // Default 28px
  footerHeight?: number; // Default 0px
  enabled?: boolean;
}

export function useTableViewportFill({
  actualRowCount,
  rowHeight = 28,
  headerHeight = 28,
  footerHeight = 0,
  enabled = true,
}: UseTableViewportFillOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [blankRowsCount, setBlankRowsCount] = useState<number>(0);

  useEffect(() => {
    if (!enabled) {
      setBlankRowsCount(0);
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const calculate = () => {
      // clientHeight of the scrollable table container element
      const totalContainerHeight = el.clientHeight;
      if (totalContainerHeight <= 0) return;

      const bodyAvailableHeight = totalContainerHeight - headerHeight - footerHeight;
      if (bodyAvailableHeight <= 0) {
        setBlankRowsCount(0);
        return;
      }

      const visibleTotalRows = Math.floor(bodyAvailableHeight / rowHeight);
      // If actualRowCount is 0, 1 row is occupied by the empty message row
      const rowsOccupied = actualRowCount === 0 ? 1 : actualRowCount;
      const neededBlankRows = Math.max(0, visibleTotalRows - rowsOccupied);

      setBlankRowsCount(neededBlankRows);
    };

    calculate();

    const observer = new ResizeObserver(() => {
      calculate();
    });
    observer.observe(el);

    window.addEventListener('resize', calculate);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', calculate);
    };
  }, [actualRowCount, rowHeight, headerHeight, footerHeight, enabled]);

  return { containerRef, blankRowsCount };
}

export interface PlaceholderRowsProps {
  count: number;
  colCount: number;
  rowHeight?: number;
  zebra?: boolean;
  startZebraIdx?: number;
  className?: string;
  customTdClasses?: string;
}

export const PlaceholderRows: React.FC<PlaceholderRowsProps> = ({
  count,
  colCount,
  rowHeight = 28,
  zebra = false,
  startZebraIdx = 0,
  className = '',
  customTdClasses = 'px-2 py-0',
}) => {
  if (count <= 0) return null;

  return (
    <>
      {Array.from({ length: count }).map((_, idx) => {
        const isOdd = (startZebraIdx + idx) % 2 !== 0;
        const bgClass = zebra && isOdd ? 'bg-slate-50/50' : 'bg-white';

        return (
          <tr
            key={`placeholder-row-${idx}`}
            style={{ height: `${rowHeight}px` }}
            className={`border-b border-slate-200/60 pointer-events-none select-none ${bgClass} ${className}`}
            aria-hidden="true"
            tabIndex={-1}
          >
            {Array.from({ length: colCount }).map((_, colIdx) => (
              <td key={`placeholder-cell-${idx}-${colIdx}`} className={customTdClasses}>
                &nbsp;
              </td>
            ))}
          </tr>
        );
      })}
    </>
  );
};
