import React from 'react';
import { PRESET_MAP, type Preset, PILL_PADDING_MAP, ROUND_CLASSES, type UISize } from '../presets';

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  preset?: Preset;
  color?: string; // custom background color
  size?: UISize; // sm | md | lg
  rounded?: boolean;
  withEffects?: boolean;
}

export default function Kbd({
  preset = 'muted',
  color,
  size = 'sm',
  rounded = true,
  withEffects = true,
  className = '',
  children,
  ...rest
}: Readonly<KbdProps>) {
  const activeColor = color ?? PRESET_MAP[preset];
  const padding = PILL_PADDING_MAP[size] ?? PILL_PADDING_MAP.md;
  const roundClass = rounded ? ROUND_CLASSES.full : ROUND_CLASSES.sm;
  const effects = withEffects ? 'transition-transform duration-150 ease-[cubic-bezier(.2,.9,.2,1)] hover:scale-105' : '';

  const style: React.CSSProperties = { backgroundColor: activeColor, color: '#fff' };

  return (
    <kbd
      {...rest}
      className={`inline-flex items-center justify-center font-mono text-xs ${padding} ${roundClass} ${effects} ${className}`.trim()}
      style={{ ...(rest.style ?? {}), ...style }}
    >
      {children}
    </kbd>
  );
}
