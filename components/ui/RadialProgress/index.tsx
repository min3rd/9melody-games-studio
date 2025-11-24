"use client";
import React from 'react';
import clsx from 'clsx';
import { PRESET_MAP, type Preset, type UISize } from '../presets';

export interface RadialProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number; // 0 - 100
  indeterminate?: boolean;
  size?: UISize;
  preset?: Preset;
  color?: string;
  showPercent?: boolean;
  withEffects?: boolean;
  rounded?: boolean; // round stroke cap
  label?: string;
}

const SIZE_MAP: Record<UISize, { diameter: number; stroke: number; fontSize: string }> = {
  sm: { diameter: 40, stroke: 6, fontSize: 'text-xs' },
  md: { diameter: 64, stroke: 8, fontSize: 'text-sm' },
  lg: { diameter: 96, stroke: 10, fontSize: 'text-base' },
};

export default function RadialProgress({ value = 0, indeterminate = false, size = 'md', preset = 'muted', color, showPercent = true, withEffects = true, rounded = true, label, className = '', ...rest }: RadialProgressProps) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const themeColor = color ?? PRESET_MAP[preset];
  const { diameter, stroke, fontSize } = SIZE_MAP[size] ?? SIZE_MAP.md;
  const center = diameter / 2;
  const radius = center - stroke / 2; // stroke is centered on path
  const circumference = 2 * Math.PI * radius;
  const offset = indeterminate ? 0 : circumference * (1 - pct / 100);

  const ringProps: React.SVGProps<SVGCircleElement> = {
    cx: center,
    cy: center,
    r: radius,
    strokeWidth: stroke,
    fill: 'transparent',
  };

  const effectClass = withEffects ? 'transition-all duration-500 ease-in-out' : '';

  return (
    <div
      {...rest}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indeterminate ? undefined : pct}
      aria-label={label}
      className={clsx('pi-radial inline-flex items-center justify-center relative', indeterminate && 'indeterminate', className)}
      style={{ ['--radial-color' as any]: themeColor, ['--radial-stroke' as any]: `${stroke}px`, ['--radial-circumference' as any]: circumference }}
    >
      <svg width={diameter} height={diameter} viewBox={`0 0 ${diameter} ${diameter}`} className={clsx(effectClass)}>
        <circle {...ringProps} className="pi-track" stroke="rgba(148,163,184,0.18)" />

        <circle
          {...ringProps}
          className="pi-progress"
          stroke={themeColor}
          strokeDasharray={indeterminate ? undefined : circumference}
          strokeDashoffset={indeterminate ? undefined : offset}
          strokeLinecap={rounded ? 'round' : 'butt'}
          style={indeterminate ? {} : { transition: 'stroke-dashoffset 700ms ease, stroke 300ms linear' }}
        />
      </svg>

      {showPercent && !indeterminate && (
        <div className={clsx('absolute inset-0 flex items-center justify-center font-semibold text-neutral-800 dark:text-neutral-100', fontSize)}>
          {pct}%
        </div>
      )}
    </div>
  );
}
