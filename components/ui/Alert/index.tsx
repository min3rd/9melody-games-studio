"use client";
import React, { useState, useRef } from 'react';
import clsx from 'clsx';
import Button from '../Button';
import { PRESET_MAP, type Preset, PILL_PADDING_MAP, type UISize, ROUND_CLASSES, type Pattern } from '../presets';
import PatternOverlay from '../patterns';

export type AlertVariant = 'solid' | 'outline' | 'ghost';

export interface AlertAction {
  label?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  preset?: Preset;
  color?: string;
  size?: UISize;
  withEffects?: boolean;
}

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  preset?: Preset;
  color?: string;
  size?: UISize;
  rounded?: keyof typeof ROUND_CLASSES;
  withEffects?: boolean;
  variant?: AlertVariant;
  dismissible?: boolean;
  onClose?: () => void;
  action?: AlertAction;
  pattern?: Pattern;
}

export default function Alert({ title, description, icon, preset = 'muted', color, size = 'md', rounded = 'sm', withEffects = true, variant = 'outline', dismissible = false, onClose, action, pattern, className = '', ...rest }: Readonly<AlertProps>) {
  const [open, setOpen] = useState(true);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const themeColor = color ?? PRESET_MAP[preset];
  const padding = PILL_PADDING_MAP[size] ?? PILL_PADDING_MAP.md;
  const rounding = ROUND_CLASSES[rounded] ?? ROUND_CLASSES.sm;
  const effects = withEffects && !pattern ? 'transition-shadow duration-150 ease-in-out' : '';

  if (!open) return null;

  const patternClass = pattern ? `alert-pattern-${pattern}` : '';
  const containerClasses = clsx('flex items-start gap-3 p-3 relative overflow-hidden', padding, rounding, 'border', patternClass, className, effects);

  const style: React.CSSProperties = {};
  const textColorDefault = pattern ? 'text-white' : 'text-neutral-900 dark:text-neutral-100';
  
  if (pattern) {
    // Pattern backgrounds
    if (pattern === 'pixel') {
      style.backgroundColor = '#071028';
      style.color = '#fff';
      style.borderColor = 'transparent';
    } else if (pattern === 'neon') {
      style.backgroundColor = '#05060a';
      style.color = '#fff';
      style.borderColor = 'transparent';
    } else if (pattern === 'pixel3d') {
      style.backgroundColor = '#1a1a2e';
      style.color = '#fff';
      style.borderColor = 'transparent';
    } else if (pattern === 'bubble') {
      style.backgroundColor = 'transparent';
      style.color = '#fff';
      style.borderColor = 'transparent';
    }
  } else {
    // Non-pattern backgrounds
    if (variant === 'solid') {
      style.backgroundColor = themeColor;
      style.color = '#fff';
      style.borderColor = 'transparent';
    } else if (variant === 'outline') {
      style.borderColor = themeColor;
      style.color = undefined; // let CSS handle
    } else {
      style.borderColor = 'transparent';
    }
  }

  return (
    <div ref={wrapperRef} className={containerClasses} style={style} role="status" {...rest}>
      {pattern && (
        <PatternOverlay 
          pattern={pattern} 
          wrapperRef={wrapperRef} 
          activeColor={themeColor}
          classPrefix="alert" 
        />
      )}
      {icon && (
        <div className="flex items-center justify-center w-6 h-6 relative z-10">
          {icon}
        </div>
      )}

      <div className="flex-1 relative z-10">
        {title && <div className={clsx('font-medium', textColorDefault)}>{title}</div>}
        {description && <div className={clsx('text-sm mt-1', pattern ? 'text-white/90' : 'text-neutral-700 dark:text-neutral-400')}>{description}</div>}
      </div>

      <div className="flex items-center gap-2 relative z-10">
        {action && (
          <Button size={action.size ?? size} preset={action.preset ?? preset} color={action.color} onClick={action.onClick} withEffects={action.withEffects ?? withEffects}>
            {action.label}
          </Button>
        )}

        {dismissible && (
          <button
            type="button"
            aria-label="Close"
            onClick={() => {
              setOpen(false);
              onClose?.();
            }}
            className={clsx('px-2 py-1 rounded-sm text-sm bg-transparent', pattern ? 'text-white hover:bg-white/20' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800')}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
