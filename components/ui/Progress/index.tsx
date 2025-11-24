"use client";
import React from 'react';
import clsx from 'clsx';
import { PRESET_MAP, type Preset, ROUND_CLASSES, type UISize } from '../presets';

export type LabelPosition = 'none' | 'inside' | 'outside';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number; // 0 - 100
  indeterminate?: boolean;
  size?: UISize;
  preset?: Preset;
  color?: string;
  rounded?: keyof typeof ROUND_CLASSES;
  withEffects?: boolean;
  labelPosition?: LabelPosition;
  showPercent?: boolean; // convenience - if true shows percent number
}

const HEIGHT_MAP: Record<UISize, string> = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
};

export default function Progress({ value = 0, indeterminate = false, size = 'md', preset = 'muted', color, rounded = 'sm', withEffects = true, labelPosition = 'inside', showPercent = true, className = '', ...rest }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const themeColor = color ?? PRESET_MAP[preset];
  const heightClass = HEIGHT_MAP[size] ?? HEIGHT_MAP.md;
  const roundClass = ROUND_CLASSES[rounded] ?? ROUND_CLASSES.sm;
  const effectClass = withEffects ? 'transition-all duration-300 ease-in-out' : '';

  // Use backgroundColor property so CSS background-image (used by pi-indeterminate) is not overridden
  const barStyle: React.CSSProperties = indeterminate ? { backgroundColor: themeColor } : { width: `${pct}%`, backgroundColor: themeColor };
  const SHUTTLE_WIDTH_MAP: Record<UISize, string> = { sm: '16%', md: '22%', lg: '28%' };
  const shuttleWidth = SHUTTLE_WIDTH_MAP[size] ?? SHUTTLE_WIDTH_MAP.md;

  return (
    <div className={clsx('w-full', className)} {...rest}>
      <div className={clsx('relative bg-neutral-100 dark:bg-neutral-800 overflow-hidden', heightClass, roundClass)} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={indeterminate ? undefined : pct}>
        <div className={clsx('absolute inset-0 flex items-center', effectClass)}>
          {/* determinate bar */}
          {!indeterminate && (
            <div className={clsx('h-full', 'order-first')} style={barStyle} />
          )}

          {/* indeterminate shuttle element */}
          {indeterminate && (
            <div
              className="pi-indeterminate-shuttle order-first"
              style={{ ['--progress-shuttle-color' as any]: themeColor, width: shuttleWidth }}
            />
          )}
          {labelPosition === 'inside' && showPercent && !indeterminate && (
            <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
              {pct}%
            </div>
          )}
        </div>
      </div>
      {labelPosition === 'outside' && showPercent && !indeterminate && (
        <div className="mt-2 text-sm text-neutral-700 dark:text-neutral-200">{pct}%</div>
      )}
    </div>
  );
}
