import React from 'react';

type ButtonVariant = 'primary' | 'ghost' | 'danger';
export type ButtonPreset = 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'muted';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: string; // custom color for the button (hex or CSS color)
  preset?: ButtonPreset;
}

export default function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  color,
  preset,
  ...rest
}: Readonly<ButtonProps>) {
  const base =
    'rounded-none font-medium inline-flex items-center justify-center gap-2 transform transition-transform duration-150 ease-[cubic-bezier(.2,.9,.2,1)] hover:-translate-y-1 hover:scale-105 hover:shadow-lg active:translate-y-0 active:scale-95 active:shadow-sm pixel-btn';

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

  const classes = `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  // Preset map
  const PRESET_MAP: Record<ButtonPreset, string> = {
    primary: '#3b82f6',
    success: '#16a34a',
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#06b6d4',
    muted: '#94a3b8',
  };

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
