"use client";
import React from 'react';
import clsx from 'clsx';
import { PRESET_MAP, type Preset, CARD_PADDING_MAP, type UISize, ROUND_CLASSES } from '../presets';

export type NavbarPlacement = 'top' | 'bottom' | 'left' | 'right';
export type NavbarDisplay = 'side' | 'over';

export interface NavbarItem {
  label: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  items?: NavbarItem[];
  children?: React.ReactNode;
  placement?: NavbarPlacement;
  display?: NavbarDisplay; // 'side' pushes content aside when used as part of layout, 'over' overlays.
  size?: UISize;
  preset?: Preset;
  color?: string;
  rounded?: keyof typeof ROUND_CLASSES;
  withEffects?: boolean;
}

// Small dimension maps for navbar sizes (height for top/bottom, width for left/right).
const NAVBAR_SIZES = {
  sm: { height: 'h-12', width: 'w-48' },
  md: { height: 'h-16', width: 'w-56' },
  lg: { height: 'h-20', width: 'w-72' },
} as const;

export default function Navbar({ items, children, placement = 'left', display = 'side', size = 'md', preset = 'muted', color, rounded = 'sm', withEffects = true, className = '', ...rest }: NavbarProps) {
  const themeColor = color ?? PRESET_MAP[preset];
  const dim = NAVBAR_SIZES[size] ?? NAVBAR_SIZES['md'];
  const side = placement === 'left' || placement === 'right';

  // compose classes dependent on placement and display
  const base = clsx(
    'flex items-center gap-3 px-4',
    CARD_PADDING_MAP[size],
    ROUND_CLASSES[rounded],
  );

  const effectClass = withEffects ? 'transition-all duration-200 ease-in-out' : '';

  // main container classes (no memo to keep compatibility with React Compiler)
  const overlay = display === 'over';
  let navClasses = '';
  if (side) {
    const pos = placement === 'left' ? 'left-0' : 'right-0';
    navClasses = clsx(
      'bg-white dark:bg-neutral-800 border dark:border-neutral-700 z-40',
      dim.width,
      'flex flex-col px-2',
      effectClass,
      overlay ? `fixed top-0 ${pos} h-full` : 'relative h-full',
    );
  } else {
    const pos2 = placement === 'top' ? 'top-0' : 'bottom-0';
    navClasses = clsx(
      'bg-white dark:bg-neutral-800 border dark:border-neutral-700 z-40',
      dim.height,
      'w-full flex items-center px-4',
      effectClass,
      overlay ? `fixed left-0 right-0 ${pos2}` : 'relative',
    );
  }

  return (
    <nav role="navigation" aria-label="Site navigation" className={clsx(navClasses, className)} style={{ borderColor: undefined }} {...rest}>
      <div className={base} style={{ color: themeColor }}>
        {items ? (
          items.map((it, i) => (
            <a
              key={`nav-item-${i}`}
              href={it.href ?? '#'}
              onClick={it.onClick}
              aria-disabled={it.disabled}
              className={clsx('flex items-center gap-2 py-2 px-1', it.disabled && 'opacity-50 pointer-events-none')}
            >
              {it.icon && <span className="inline-flex items-center justify-center">{it.icon}</span>}
              <span className="text-sm">{it.label}</span>
            </a>
          ))
        ) : (
          <div className="flex items-center gap-3">{children}</div>
        )}
      </div>
    </nav>
  );
}
