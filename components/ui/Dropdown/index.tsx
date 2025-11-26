"use client";
import React, { useEffect, useRef, useState } from 'react';
import { PRESET_MAP, type Preset } from '../presets';

export interface DropdownItem {
  key: string;
  label: React.ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
}

export interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
  preset?: Preset;
  color?: string;
  compact?: boolean;
}

export default function Dropdown({
  label,
  items,
  align = 'left',
  className = '',
  preset,
  color,
  compact = false,
  ...rest
}: Readonly<DropdownProps>) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) { setOpen(false); setActiveIndex(null); }
    }

    function onKey(e: KeyboardEvent) {
      if (!open) return;
  if (e.key === 'Escape') { setOpen(false); setActiveIndex(null); }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => (i === null ? 0 : Math.min(items.length - 1, i + 1)));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => (i === null ? items.length - 1 : Math.max(0, i - 1)));
      }
      if (e.key === 'Enter' && activeIndex !== null) {
        const it = items[activeIndex];
        if (it && !it.disabled) {
          it.onClick?.();
          setOpen(false);
        }
      }
    }

    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, items, activeIndex]);

  // Clear activeIndex when opening using direct toggle or external events

  useEffect(() => {
    if (activeIndex !== null && listRef.current) {
      const el = listRef.current.children[activeIndex] as HTMLElement | undefined;
      el?.focus();
    }
  }, [activeIndex]);

  const menuClasses =
    'mt-2 w-48 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-sm shadow-sm ring-1 ring-black/5 focus:outline-none z-50';

  // Temporarily remove hover animations and hover bg so popover items don't
  // animate unexpectedly — keep focus styles for keyboard accessibility.
  const itemBase =
    'px-3 py-2 text-sm text-foreground dark:text-foreground cursor-pointer select-none focus:bg-neutral-100 dark:focus:bg-neutral-900';

  return (
    <div ref={rootRef} className={`relative inline-block ${className}`} {...rest}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((s) => { const next = !s; if (next) setActiveIndex(null); return next; })}
        className={compact ? `inline-flex items-center gap-0 p-0 pixel-btn rounded-full border border-transparent hover:shadow-sm transition duration-150 ease-out` : `inline-flex items-center gap-2 rounded-none px-3 py-2 pixel-btn border border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-sm transition duration-150 ease-out`}
        style={{ color: color ?? (preset ? PRESET_MAP[preset] : undefined) }}
      >
        {label}
        {!compact && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="opacity-80">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {open && (
        <ul
          ref={listRef}
          role="menu"
          aria-label="Dropdown menu"
          className={`${menuClasses} ${align === 'right' ? 'right-0' : 'left-0'} absolute`}
        >
          {items.map((it) => (
            <li
              key={it.key}
              role="menuitem"
              tabIndex={0}
              aria-disabled={it.disabled}
              onClick={() => {
                if (it.disabled) return;
                it.onClick?.();
                setOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !it.disabled) {
                  it.onClick?.();
                  setOpen(false);
                }
              }}
              className={`${itemBase} ${it.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {it.href ? (
                <a href={it.href} className="block w-full">{it.label}</a>
              ) : (
                <span className="block w-full">{it.label}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
