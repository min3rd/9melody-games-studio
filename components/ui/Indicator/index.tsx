import React from 'react';
import { PRESET_MAP, type Preset } from '../presets';

export type IndicatorPreset = Preset;
type IndicatorSize = 'sm' | 'md' | 'lg';

export interface IndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  preset?: IndicatorPreset;
  color?: string; // custom color for the indicator
  size?: IndicatorSize;
  rounded?: boolean; // whether the pill is rounded (full) or slightly rounded
  withEffects?: boolean; // enable/disable visual effects like hover/scale
  children?: React.ReactNode; // optional custom content inside the indicator
}

export default function Indicator({
  preset = 'primary',
  color,
  size = 'md',
  rounded = true,
  withEffects = true,
  className = '',
  children,
  ...rest
}: Readonly<IndicatorProps>) {
  const activeColor = color ?? PRESET_MAP[preset];

  const sizeClasses: Record<IndicatorSize, string> = {
    sm: 'w-2 h-2 text-xs',
    md: 'w-3 h-3 text-sm',
    lg: 'w-4 h-4 text-base',
  };

  const pillPadding: Record<IndicatorSize, string> = {
    sm: 'px-1 py-[1px] text-[10px]',
    md: 'px-2 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  const base = 'inline-flex items-center justify-center gap-1 font-medium select-none';
  const roundClass = rounded ? 'rounded-full' : 'rounded-sm';
  const effects = withEffects ? 'transition-transform duration-150 ease-[cubic-bezier(.2,.9,.2,1)] hover:scale-105 hover:shadow-sm' : '';

  // If children are provided, render a pill with padding; otherwise render a dot
  const isDot = children === undefined || children === null;

  const classes = isDot
    ? `${base} ${sizeClasses[size]} ${roundClass} ${effects} ${className}`.trim()
    : `${base} ${pillPadding[size]} ${roundClass} ${effects} ${className}`.trim();

  const style: React.CSSProperties = {};
  if (activeColor) {
    style.backgroundColor = activeColor;
    // If custom color background is dark-ish, the text color should contrast white; otherwise keep as white by default
    style.color = '#fff';
  }

  // Accessibility: if it's a purely visual dot, hide from assistive tech unless aria-label provided
  const ariaHidden = isDot && !rest['aria-label'] ? { 'aria-hidden': true } : {};

  return (
    <span
      {...rest}
      {...ariaHidden}
      className={classes}
      style={{ ...style, ...(rest.style ?? {}) }}
    >
      {isDot ? null : children}
    </span>
  );
}
