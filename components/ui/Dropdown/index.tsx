"use client";
import React, { useEffect, useRef, useState } from 'react';

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
}

export default function Dropdown({
  label,
  items,
  align = 'left',
  className = '',
  ...rest
}: Readonly<DropdownProps>) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }

    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === 'Escape') setOpen(false);
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

  useEffect(() => {
    if (open) setActiveIndex(null);
  }, [open]);

  useEffect(() => {
    if (activeIndex !== null && listRef.current) {
      const el = listRef.current.children[activeIndex] as HTMLElement | undefined;
      el?.focus();
    }
  }, [activeIndex]);

  const menuClasses =
    'mt-2 w-48 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-sm shadow-sm ring-1 ring-black/5 focus:outline-none z-50';

  const itemBase =
    'px-3 py-2 text-sm text-foreground dark:text-foreground cursor-pointer select-none focus:bg-neutral-100 dark:focus:bg-neutral-900 transform transition-transform duration-100 hover:translate-x-1 hover:bg-neutral-100 dark:hover:bg-neutral-900';

  return (
    <div ref={rootRef} className={`relative inline-block ${className}`} {...rest}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        className={`inline-flex items-center gap-2 rounded-none px-3 py-2 bg-foreground text-background dark:bg-background dark:text-foreground pixel-btn border border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-sm transition-colors transition-shadow duration-150`}
      >
        {label}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="opacity-80">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          role="menu"
          aria-label="Dropdown menu"
          className={`${menuClasses} ${align === 'right' ? 'right-0' : 'left-0'} absolute`}
        >
          {items.map((it, idx) => (
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
              className={`${itemBase} ${it.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'}`}
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
