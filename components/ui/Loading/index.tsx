"use client";
import React from 'react';
import clsx from 'clsx';
import { PRESET_MAP, type Preset, type UISize, ROUND_CLASSES } from '../presets';

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: UISize;
  preset?: Preset;
  color?: string;
  rounded?: keyof typeof ROUND_CLASSES;
  withEffects?: boolean;
  text?: React.ReactNode;
  label?: React.ReactNode;
  inline?: boolean; // place inline with text
  overlay?: boolean; // show a centered overlay
  centered?: boolean; // center inside parent
}

const SPINNER_SIZES: Record<UISize, string> = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-4',
};

export default function Loading({ size = 'md', preset = 'muted', color, rounded = 'full', withEffects = true, text, label, inline = false, overlay = false, centered = true, className = '', ...rest }: LoadingProps) {
  const themeColor = color ?? PRESET_MAP[preset];
  const effectClass = withEffects ? 'transition-opacity duration-200' : '';
  const spinnerSizeClass = SPINNER_SIZES[size] ?? SPINNER_SIZES.md;
  // rounding currently unused for spinner, but keep mapping for container shapes
  const roundClass = ROUND_CLASSES[rounded] ?? ROUND_CLASSES.full;
  // apply rounding to overlay container when overlay is true
  const overlayRound = overlay ? roundClass : undefined;

  const spinner = (
    <div
      aria-hidden
      className={clsx('inline-block animate-spin', spinnerSizeClass, 'rounded-full', 'border-neutral-200 dark:border-neutral-700', effectClass)}
      style={{ borderTopColor: themeColor }}
    />
  );

  const labelText = label ?? text;

  if (overlay) {
    return (
      <div className={clsx('fixed inset-0 z-50 flex items-center justify-center', className)} {...rest}>
        <div className={clsx('bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm p-6 rounded-lg flex flex-col items-center gap-3', centered ? 'items-center' : '', overlayRound)}>
          {spinner}
          {labelText && <div className="text-sm text-neutral-700 dark:text-neutral-300">{labelText}</div>}
        </div>
      </div>
    );
  }

  if (inline) {
    return (
      <div className={clsx('inline-flex items-center gap-2', className)} {...rest}>
        {spinner}
        {labelText && <span className="text-sm text-neutral-700 dark:text-neutral-300">{labelText}</span>}
      </div>
    );
  }

  return (
    <div className={clsx('flex items-center gap-3', centered ? 'justify-center' : '', className)} {...rest}>
      {spinner}
      {labelText && <div className="text-sm text-neutral-700 dark:text-neutral-300">{labelText}</div>}
    </div>
  );
}
