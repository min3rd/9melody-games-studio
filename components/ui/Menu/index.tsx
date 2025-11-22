"use client";
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { PRESET_MAP, type Preset, PILL_PADDING_MAP, type UISize } from '../presets';

export interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: React.ReactNode;
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  disabled?: boolean;
  preset?: Preset;
  color?: string;
  selected?: boolean;
  size?: UISize;
  withEffects?: boolean;
}

export const MenuItem = React.forwardRef<HTMLButtonElement, MenuItemProps>(({ label, icon, shortcut, disabled, onClick, preset = 'muted', color, selected = false, size = 'md', withEffects = true, ...rest }, ref) => {
  const displayColor = color ?? PRESET_MAP[preset];
  const padding = PILL_PADDING_MAP[size];
  const effectClass = withEffects ? 'transition-transform duration-150 ease-in-out' : '';
  return (
    <button
      role="menuitem"
      type="button"
      aria-disabled={disabled}
  aria-current={selected ? 'page' : undefined}
      onClick={disabled ? undefined : onClick}
      ref={ref}
  className={clsx('w-full text-left flex items-center justify-between gap-3 px-2 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800', padding, disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer', effectClass)}
      style={{ color: selected ? displayColor : undefined }}
      {...rest}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="inline-flex items-center justify-center">{icon}</span>}
        <span className="flex-1">{label}</span>
      </div>
      {shortcut && <span className="text-xs text-neutral-500 dark:text-neutral-400">{shortcut}</span>}
  </button>
  );
});
MenuItem.displayName = 'MenuItem';

export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: MenuItemProps[];
  children?: React.ReactNode;
  size?: UISize;
  preset?: Preset;
  color?: string;
  withEffects?: boolean;
}

export default function Menu({ items, children, size = 'md', preset = 'muted', color, withEffects = true, className = '', ...rest }: MenuProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    // ensure refs length matches items
    if (items) itemRefs.current = new Array(items.length).fill(null);
  }, [items]);

  useEffect(() => {
    if (activeIndex !== null && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex]?.focus();
    }
  }, [activeIndex]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!itemRefs.current.length) return;
    const length = itemRefs.current.length;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => {
        if (prev === null) return 0;
        return (prev + 1) % length;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => {
        if (prev === null) return length - 1;
        return (prev - 1 + length) % length;
      });
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(length - 1);
    }
  };

  return (
    <div ref={containerRef} role="menu" onKeyDown={onKeyDown} className={clsx('inline-block bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded', className)} {...rest}>
      {items ? (
        <div>
          {items.map((it, i) => (
            <MenuItem
              key={`menu-item-${i}`}
              {...it}
              size={size}
              preset={it.preset ?? preset}
              color={it.color ?? color}
              ref={(el: HTMLButtonElement | null) => { itemRefs.current[i] = el; }}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                setActiveIndex(i);
                it.onClick?.(e);
              }}
              withEffects={withEffects}
            />
          ))}
        </div>
      ) : (
        <div className={clsx('flex flex-col gap-1')}>{children}</div>
      )}
    </div>
  );
}
