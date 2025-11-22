import React from 'react';
import { PRESET_MAP, type Preset, PILL_PADDING_MAP, INDICATOR_SIZE_CLASSES, ROUND_CLASSES, type UISize } from '../presets';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  preset?: Preset;
  color?: string;
  size?: UISize; // sm/md/lg
  rounded?: boolean;
  withEffects?: boolean;
  asDot?: boolean; // render as a small dot instead of content
  value?: number | string; // numeric or string value to show; overrides children
}

export default function Badge({
  preset = 'muted',
  color,
  size = 'md',
  rounded = true,
  withEffects = true,
  asDot = false,
  value,
  children,
  className = '',
  ...rest
}: Readonly<BadgeProps>) {
  const activeColor = color ?? PRESET_MAP[preset];
  const pillPadding = PILL_PADDING_MAP[size];
  const dotSize = INDICATOR_SIZE_CLASSES[size as keyof typeof INDICATOR_SIZE_CLASSES] ?? INDICATOR_SIZE_CLASSES.md;
  const base = 'inline-flex items-center justify-center gap-1 font-medium select-none';
  const roundClass = rounded ? ROUND_CLASSES.full : ROUND_CLASSES.sm;
  const effects = withEffects ? 'transition-transform duration-150 ease-[cubic-bezier(.2,.9,.2,1)] hover:scale-105 hover:shadow-sm' : '';

  // If asDot, render a small dot badge with a fixed background.
  if (asDot) {
    const classes = `inline-block ${dotSize} ${roundClass} ${className}`.trim();
    const style: React.CSSProperties = { backgroundColor: activeColor, color: '#fff' };
    return <span {...rest} className={classes} style={{ ...(rest.style ?? {}), ...style }} aria-hidden />;
  }

  // For content-based badges
  const content = value !== undefined ? value : children;
  const classes = `${base} ${pillPadding} ${roundClass} ${effects} ${className}`.trim();
  const style: React.CSSProperties = { backgroundColor: activeColor, color: '#fff' };

  // For numeric badges, clamp large numbers
  let display = content;
  if (typeof content === 'number' && content > 99) display = '99+';

  return (
    <span {...rest} className={classes} style={{ ...(rest.style ?? {}), ...style }}>
      {display}
    </span>
  );
}
