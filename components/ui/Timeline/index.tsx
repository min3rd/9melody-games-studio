"use client";
import React from 'react';
import { PRESET_MAP, type Preset, INDICATOR_SIZE_CLASSES, AVATAR_SIZE_CLASSES, type UISize } from '../presets';

export type TimelineSize = UISize; // re-use UISize types (sm|md|lg)

export interface TimelineProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

export interface TimelineItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  preset?: Preset;
  color?: string; // custom color for dot or icon
  size?: TimelineSize;
  rounded?: boolean;
  withEffects?: boolean;
  icon?: React.ReactNode;
  image?: string; // optional thumbnail
  heading?: React.ReactNode; // title/heading
  short?: React.ReactNode;
  description?: React.ReactNode;
  date?: React.ReactNode;
}

// Intentionally define small marker inline in TimelineItem rather than a separate Dot component

export default function Timeline({ className = '', children, ...rest }: Readonly<TimelineProps>) {
  return (
    <ol {...rest} className={`space-y-6 ${className}`.trim()}>
      {children}
    </ol>
  );
}

export function TimelineItem({ preset = 'muted', color, size = 'md', rounded = true, withEffects = true, icon, image, heading, short, description, date, className = '', ...rest }: Readonly<TimelineItemProps>) {
  const bg = color ?? PRESET_MAP[preset];
  const contentPadding = size === 'sm' ? 'px-2 py-1' : size === 'lg' ? 'px-4 py-3' : 'px-3 py-2';
  const imageSize = size === 'sm' ? AVATAR_SIZE_CLASSES.sm : size === 'lg' ? AVATAR_SIZE_CLASSES.lg : AVATAR_SIZE_CLASSES.md;
  const effectClass = withEffects ? 'hover:shadow-sm' : '';

  return (
    <li {...rest} className={`flex gap-4 items-start ${className}`.trim()}>
      <div className={`flex-1 ${contentPadding} ${effectClass}`.trim()}>
        <div className="flex items-center gap-3">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={(heading as string) ?? 'thumb'} className={`${imageSize} object-cover ${rounded ? 'rounded-full' : 'rounded-sm'}`} />
          ) : icon ? (
            <div className={`inline-flex items-center justify-center ${INDICATOR_SIZE_CLASSES[size]} ${rounded ? 'rounded-full' : 'rounded-sm'}`} style={{ backgroundColor: bg }}>
              {icon}
            </div>
          ) : (
            <div className={`inline-flex items-center justify-center ${INDICATOR_SIZE_CLASSES[size]} ${rounded ? 'rounded-full' : 'rounded-sm'}`} style={{ backgroundColor: bg }} />
          )}

          <div className="flex-1">
            {heading && <div className="text-sm font-semibold">{heading}</div>}
            {short && <div className="text-xs text-neutral-500 dark:text-neutral-400">{short}</div>}
            {description && <div className="text-sm text-neutral-700 dark:text-neutral-200 mt-2">{description}</div>}
          </div>
          {date && <div className="text-xs text-neutral-500 dark:text-neutral-400">{date}</div>}
        </div>
      </div>
    </li>
  );
}
