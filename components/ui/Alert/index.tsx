"use client";
import React, { useState } from 'react';
import clsx from 'clsx';
import Button from '../Button';
import { PRESET_MAP, type Preset, PILL_PADDING_MAP, type UISize, ROUND_CLASSES } from '../presets';

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
}

export default function Alert({ title, description, icon, preset = 'muted', color, size = 'md', rounded = 'sm', withEffects = true, variant = 'outline', dismissible = false, onClose, action, className = '', ...rest }: Readonly<AlertProps>) {
  const [open, setOpen] = useState(true);
  const themeColor = color ?? PRESET_MAP[preset];
  const padding = PILL_PADDING_MAP[size] ?? PILL_PADDING_MAP.md;
  const rounding = ROUND_CLASSES[rounded] ?? ROUND_CLASSES.sm;
  const effects = withEffects ? 'transition-shadow duration-150 ease-in-out' : '';

  if (!open) return null;

  const containerClasses = clsx('flex items-start gap-3 p-3', padding, rounding, 'border', className, effects);

  const style: React.CSSProperties = {};
  const textColorDefault = 'text-neutral-900 dark:text-neutral-100';
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

  return (
    <div className={containerClasses} style={style} role="status" {...rest}>
      {icon && (
        <div className="flex items-center justify-center w-6 h-6">
          {icon}
        </div>
      )}

      <div className="flex-1">
        {title && <div className={clsx('font-medium', textColorDefault)}>{title}</div>}
        {description && <div className="text-sm text-neutral-700 dark:text-neutral-400 mt-1">{description}</div>}
      </div>

      <div className="flex items-center gap-2">
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
            className="px-2 py-1 rounded-sm text-sm bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
