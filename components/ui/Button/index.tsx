import React from 'react';
import { PRESET_MAP, type Preset, BUTTON_SIZE_CLASSES, ROUND_CLASSES, type UISize } from '../presets';

type ButtonVariant = 'primary' | 'ghost' | 'danger';
export type ButtonPreset = Preset;
type ButtonSize = UISize;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: string; // custom color for the button (hex or CSS color)
  preset?: ButtonPreset;
  withEffects?: boolean;
  rounded?: boolean;
}

const ButtonImpl: React.ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  {
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    color,
    preset,
    withEffects = true,
    rounded = false,
    ...rest
  }: Readonly<ButtonProps>,
  ref,
) => {
  const base = 'font-medium inline-flex items-center justify-center gap-2 pixel-btn';
  const roundClass = rounded ? ROUND_CLASSES.sm : ROUND_CLASSES.none; // keep default `none` to preserve pixel-art look
  const effectsClasses = 'transform transition-transform duration-150 ease-[cubic-bezier(.2,.9,.2,1)] hover:-translate-y-1 hover:scale-105 hover:shadow-lg active:translate-y-0 active:scale-95 active:shadow-sm';

  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      'bg-foreground text-background dark:bg-background dark:text-foreground border border-transparent',
    ghost: 'bg-transparent text-foreground dark:text-foreground border border-neutral-300 dark:border-neutral-700',
    danger: 'bg-red-600 text-white dark:bg-red-500 border border-transparent',
  };

  const sizeClasses = BUTTON_SIZE_CLASSES as Record<ButtonSize, string>;

  const classes = `${base} ${roundClass} ${withEffects ? effectsClasses : ''} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

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
      ref={ref}
      {...rest}
      className={classes}
      style={{ outlineOffset: '2px', fontFamily: 'var(--font-pixel, monospace)', ...styleOverride, ...(rest.style ?? {}) }}
    >
      {children}
    </button>
  );
}
export default React.forwardRef<HTMLButtonElement, ButtonProps>(ButtonImpl);
// Make this name available in React DevTools
// Assign displayName safely without using `any` type
(ButtonImpl as unknown as { displayName?: string }).displayName = 'Button';
