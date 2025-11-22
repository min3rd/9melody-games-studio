"use client";
import React from 'react';
import clsx from 'clsx';
import { PRESET_MAP, type Preset, AVATAR_SIZE_CLASSES, PILL_PADDING_MAP, type UISize } from '../presets';

export interface DockItem {
  icon: React.ReactNode;
  label?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
  active?: boolean;
}

export interface DockProps extends React.HTMLAttributes<HTMLElement> {
  items: DockItem[];
  placement?: 'bottom' | 'top' | 'left' | 'right';
  size?: UISize; // controls icon size using AVATAR_SIZE_CLASSES keys
  preset?: Preset;
  color?: string; // override
  hoverEffect?: 'scale' | 'glow' | 'bounce' | 'highlight' | 'none';
  showLabels?: boolean;
  withEffects?: boolean;
  rounded?: boolean;
}

export default function Dock({
  items,
  placement = 'bottom',
  size = 'md',
  preset = 'muted',
  color,
  hoverEffect = 'scale',
  showLabels = false,
  withEffects = true,
  rounded = true,
  className = '',
  ...rest
}: Readonly<DockProps>) {
  const displayColor = color ?? PRESET_MAP[preset];
  const iconSizeClass = AVATAR_SIZE_CLASSES[size];
  const padding = PILL_PADDING_MAP[size];
  const flexDirection = placement === 'left' || placement === 'right' ? 'flex-col' : 'flex-row';
  const isVertical = placement === 'left' || placement === 'right';

  const baseButton = clsx('inline-flex items-center justify-center', iconSizeClass, rounded ? 'rounded-full' : 'rounded-sm', padding);
  const effectClass = withEffects ? 'transition-transform duration-150 ease-in-out' : '';

  const hoverClasses = {
    scale: 'hover:scale-110',
    glow: 'hover:shadow-lg hover:ring-2 hover:ring-offset-0',
    bounce: 'hover:-translate-y-1',
    highlight: 'hover:bg-neutral-100 dark:hover:bg-neutral-800',
    none: '',
  } as const;

  return (
    <div {...rest} className={clsx('inline-flex items-center p-2 bg-transparent', flexDirection, className)} role="toolbar" aria-orientation={isVertical ? 'vertical' : 'horizontal'}>
      {items.map((item, i) => {
        const isActive = !!item.active;
        const colorStyle: React.CSSProperties = { color: isActive ? displayColor : undefined };
        const hover = withEffects ? hoverClasses[hoverEffect] : '';
        const ItemEl = item.href ? 'a' : 'button';
        const props = item.href ? { href: item.href } : {};

        return (
          <div key={`dock-${i}`} className={clsx('flex items-center', isVertical ? 'flex-col' : 'flex-row', 'gap-2')}> 
            <ItemEl
              {...props}
              onClick={item.onClick}
              className={clsx(baseButton, hover, effectClass)}
              aria-current={isActive ? 'true' : undefined}
              style={colorStyle}
            >
              {item.icon}
            </ItemEl>
            {showLabels && (
              <div className={clsx('text-xs text-neutral-600 dark:text-neutral-300')}>{item.label}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
