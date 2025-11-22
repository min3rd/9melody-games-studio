"use client";
import React from 'react';
import clsx from 'clsx';
import { PRESET_MAP, type Preset, INDICATOR_SIZE_CLASSES, BUTTON_SIZE_CLASSES, PILL_PADDING_MAP, ROUND_CLASSES, type UISize, type UIRound } from '../presets';
import Button from '../Button';

export interface StepAction {
  label?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  preset?: Preset;
  color?: string;
  size?: UISize;
  rounded?: UIRound;
  withEffects?: boolean;
}

export interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  index?: number;
  label?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  active?: boolean;
  completed?: boolean;
  disabled?: boolean;
  preset?: Preset;
  color?: string;
  size?: UISize;
  rounded?: UIRound;
  withEffects?: boolean;
  action?: StepAction;
}

export default function Step({ index, label, description, icon, active = false, completed = false, disabled = false, preset = 'muted', color, size = 'md', rounded = 'sm', withEffects = true, action, className = '', ...rest }: Readonly<StepProps>) {
  const themeColor = color ?? PRESET_MAP[preset];
  const indicatorSize = INDICATOR_SIZE_CLASSES[size] ?? INDICATOR_SIZE_CLASSES.md;
  const textSize = BUTTON_SIZE_CLASSES[size] ?? BUTTON_SIZE_CLASSES.md;
  // Keep padding variable in case we add pill-like modifiers later
  const padding = PILL_PADDING_MAP[size] ?? PILL_PADDING_MAP.md;
  const rounding = ROUND_CLASSES[rounded] ?? ROUND_CLASSES.sm;
  const effectClass = withEffects ? 'transition-transform duration-150 ease-[cubic-bezier(.2,.9,.2,1)] hover:scale-[1.02]' : '';

  const base = clsx('flex items-start gap-3 justify-between', className);

  const indicatorClasses = clsx(
    'inline-flex items-center justify-center font-medium select-none',
    indicatorSize,
    `${padding}`,
    rounding,
    'border',
    completed ? 'text-white' : 'text-neutral-700 dark:text-neutral-200',
    disabled ? 'opacity-50 pointer-events-none' : 'cursor-default',
    effectClass,
  );

  const indicatorStyle: React.CSSProperties = {};
  if (completed) {
    indicatorStyle.backgroundColor = themeColor;
    indicatorStyle.borderColor = themeColor;
  } else if (active) {
    indicatorStyle.borderColor = themeColor;
    indicatorStyle.boxShadow = `0 0 0 4px ${themeColor}33`;
  } else {
    // default outline
    indicatorStyle.borderColor = 'transparent';
  }

  return (
    <div className={base} {...rest}>
      <div className="flex items-start gap-3 flex-1">
        <span className={indicatorClasses} style={indicatorStyle} aria-hidden={true}>
          {icon ? icon : (index ?? 0)}
        </span>

        <div className="flex-1">
          {label && <div className={clsx('font-medium', textSize)}>{label}</div>}
          {description && <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{description}</div>}
        </div>
      </div>

      {action && (
        <div className="ml-3 shrink-0">
          <Button
            onClick={action.onClick}
            size={action.size ?? size}
            preset={action.preset ?? preset}
            color={action.color}
            withEffects={action.withEffects ?? withEffects}
            rounded={!!(action.rounded && action.rounded === 'full')}
          >
            {action.icon}
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
