"use client";
import React from 'react';
import clsx from 'clsx';
import { PRESET_MAP, type Preset, BUTTON_SIZE_CLASSES, PILL_PADDING_MAP, type UISize, ROUND_CLASSES } from '../presets';

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  size?: UISize;
  preset?: Preset;
  color?: string;
  rounded?: keyof typeof ROUND_CLASSES;
  withEffects?: boolean;
  showPrevNext?: boolean;
  showFirstLast?: boolean;
  siblingsCount?: number; // pages shown around the current page
  boundaryCount?: number; // pages shown at start/end
}

function range(start: number, end: number) {
  const res: number[] = [];
  for (let i = start; i <= end; i += 1) res.push(i);
  return res;
}

export default function Pagination({ currentPage, totalPages, onPageChange, size = 'md', preset = 'muted', color, rounded = 'sm', withEffects = true, showPrevNext = true, showFirstLast = false, siblingsCount = 1, boundaryCount = 1, className = '', ...rest }: PaginationProps) {
  // themeColor is available for future uses (like solid backgrounds), keep it for now
  const themeColor = color ?? PRESET_MAP[preset];
  const btnSize = BUTTON_SIZE_CLASSES[size];
  const padding = PILL_PADDING_MAP[size];
  const roundedClass = ROUND_CLASSES[rounded];
  const effect = withEffects ? 'transition-colors duration-150 ease-in-out hover:underline' : '';

  // compute item list with ellipsis as -1
  const items: (number | 'ellipsis')[] = [];
  if (totalPages <= 1) {
    return null;
  }

  // left/right sibling indices are not required when using mainStart/mainEnd calculated below

  const firstPages = range(1, Math.min(boundaryCount, totalPages));
  const lastPages = range(Math.max(totalPages - boundaryCount + 1, boundaryCount + 1), totalPages);

  if (showFirstLast && 1 < currentPage) {
    // do nothing here — handled via showFirstLast prop
  }

  items.push(...firstPages);

  const mainStart = Math.max(boundaryCount + 1, currentPage - siblingsCount);
  const mainEnd = Math.min(totalPages - boundaryCount, currentPage + siblingsCount);

  // left ellipsis
  if (mainStart > boundaryCount + 1) {
    items.push('ellipsis');
  }

  if (mainStart <= mainEnd) {
    items.push(...range(mainStart, mainEnd));
  }

  // right ellipsis
  if (mainEnd < totalPages - boundaryCount) {
    items.push('ellipsis');
  }

  items.push(...lastPages.filter((p) => !items.includes(p)));

  const handleClick = (page: number) => {
    if (page === currentPage) return;
    onPageChange?.(page);
  };

  return (
    <nav role="navigation" aria-label="Pagination" className={clsx('inline-flex items-center gap-2', className)} {...rest}>
      {showPrevNext && (
        <button
          aria-label="Previous page"
          onClick={() => handleClick(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={clsx('px-2 py-1 border rounded-sm', padding, btnSize, 'text-sm', currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer', effect)}
        >
          ‹
        </button>
      )}

      {items.map((it, idx) => (
        it === 'ellipsis' ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-sm text-neutral-400">…</span>
        ) : (
          <button
            key={`page-${it}`}
            aria-current={it === currentPage ? 'page' : undefined}
            onClick={() => handleClick(it)}
            className={clsx(
              'px-2 py-1 border text-sm',
              padding,
              btnSize,
              roundedClass,
              it === currentPage ? 'text-white' : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200',
              effect,
            )}
            style={it === currentPage ? { backgroundColor: themeColor } : undefined}
          >
            {it}
          </button>
        )
      ))}

      {showPrevNext && (
        <button
          aria-label="Next page"
          onClick={() => handleClick(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={clsx('px-2 py-1 border rounded-sm', padding, btnSize, 'text-sm', currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer', effect)}
        >
          ›
        </button>
      )}
    </nav>
  );
}
