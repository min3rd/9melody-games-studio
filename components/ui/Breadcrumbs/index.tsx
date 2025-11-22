"use client";
import React from 'react';
import clsx from 'clsx';
import { PRESET_MAP, type Preset, PILL_PADDING_MAP, type UISize } from '../presets';

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  icon?: React.ReactNode;
  active?: boolean;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  separatorVariant?: 'slash' | 'chevron' | 'arrow' | 'dot' | 'none';
  preset?: Preset;
  color?: string;
  size?: UISize; // controls padding
  textSize?: 'sm' | 'md' | 'lg' | string;
  withEffects?: boolean;
  rounded?: boolean;
  showIcon?: boolean;
}

export default function Breadcrumbs({
  items,
  separator = '/',
  separatorVariant = 'slash',
  preset = 'muted',
  color,
  size = 'md',
  textSize = 'md',
  withEffects = true,
  rounded = true,
  showIcon = false,
  className = '',
  ...rest
}: Readonly<BreadcrumbsProps>) {
  const displayColor = color ?? PRESET_MAP[preset];
  const padding = PILL_PADDING_MAP[size];
  const textSizeClass = textSize === 'sm' ? 'text-sm' : textSize === 'lg' ? 'text-lg' : 'text-base';
  const hoverClass = withEffects ? 'hover:underline' : '';

  const getSeparator = (variant: BreadcrumbsProps['separatorVariant']) => {
    switch (variant) {
      case 'chevron':
        return (
          <svg aria-hidden width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'arrow':
        return (
          <svg aria-hidden width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'dot':
        return <span className="inline-block w-1 h-1 rounded-full bg-neutral-300" />;
      case 'none':
        return null;
      case 'slash':
      default:
        return '/';
    }
  };

  const resolvedSeparator = separator ?? getSeparator(separatorVariant);

  return (
    <nav {...rest} className={clsx('flex items-center gap-2', className)} aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 list-none p-0 m-0">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          const isActive = !!item.active || (isLast && !items.some((it) => it.active));
          const textStyle: React.CSSProperties = { color: isActive ? displayColor : undefined };
          return (
            <li key={`crumb-${i}`} className="flex items-center gap-2">
              {item.icon && showIcon && (
                <span className={clsx('inline-flex items-center justify-center', 'w-4 h-4')}>{item.icon}</span>
              )}
              {item.href ? (
                <a href={item.href} onClick={item.onClick} aria-current={isActive ? 'page' : undefined} style={textStyle} className={clsx(textSizeClass, padding, rounded ? 'rounded-sm' : 'rounded-none', hoverClass)}>
                  {item.label}
                </a>
              ) : (
                <span aria-current={isActive ? 'page' : undefined} style={textStyle} className={clsx(textSizeClass, padding, rounded ? 'rounded-sm' : 'rounded-none')}>
                  {item.label}
                </span>
              )}
              {!isLast && resolvedSeparator && (
                <span className="text-neutral-400" aria-hidden>
                  {resolvedSeparator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
