import React from 'react';
import { PRESET_MAP, type Preset } from '../presets';

type ButtonVariant = 'primary' | 'ghost' | 'danger';
export type ButtonPreset = Preset;
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: string; // custom color for the button (hex or CSS color)
  preset?: ButtonPreset;
  withEffects?: boolean;
}

export default function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  color,
  preset,
  withEffects = true,
  ...rest
}: Readonly<ButtonProps>) {
  const base = 'rounded-none font-medium inline-flex items-center justify-center gap-2 pixel-btn';
  const effectsClasses = 'transform transition-transform duration-150 ease-[cubic-bezier(.2,.9,.2,1)] hover:-translate-y-1 hover:scale-105 hover:shadow-lg active:translate-y-0 active:scale-95 active:shadow-sm';

  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      'bg-foreground text-background dark:bg-background dark:text-foreground border border-transparent',
    ghost: 'bg-transparent text-foreground dark:text-foreground border border-neutral-300 dark:border-neutral-700',
    danger: 'bg-red-600 text-white dark:bg-red-500 border border-transparent',
  };

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  const classes = `${base} ${withEffects ? effectsClasses : ''} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  // Use shared PRESET_MAP

  const presetColor = preset ? PRESET_MAP[preset] : undefined;
  const activeColor = color ?? presetColor;

  const styleOverride: React.CSSProperties = {};
  if (activeColor) {
    if (variant === 'ghost') {
      styleOverride.color = activeColor;
      styleOverride.borderColor = activeColor;
    } else {
      styleOverride.backgroundColor = activeColor;
      styleOverride.borderColor = 'transparent';
      styleOverride.color = '#ffffff';
    }
  }

  return (
    <button
      {...rest}
      className={classes}
      style={{ outlineOffset: '2px', fontFamily: 'var(--font-pixel, monospace)', ...styleOverride, ...(rest.style ?? {}) }}
    >
      {children}
    </button>
  );
}
