import React from 'react';
import { PRESET_MAP, type Preset, INDICATOR_SIZE_CLASSES, PILL_PADDING_MAP, ROUND_CLASSES, type UISize } from '../presets';

export type IndicatorPreset = Preset;
type IndicatorSize = UISize;

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
  const sizeClasses = INDICATOR_SIZE_CLASSES as Record<IndicatorSize, string>;
  const pillPadding = PILL_PADDING_MAP as Record<IndicatorSize, string>;

  const base = 'inline-flex items-center justify-center gap-1 font-medium select-none';
  const roundClass = rounded ? ROUND_CLASSES.full : ROUND_CLASSES.sm;
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
