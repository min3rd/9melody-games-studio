"use client";
import React, { useId, useState } from 'react';
import clsx from 'clsx';
import { PRESET_MAP, type Preset, BUTTON_SIZE_CLASSES, ROUND_CLASSES, type UISize } from '../presets';
import { useI18n } from '@/hooks/useI18n';

export type SelectOption = { value: string; label: React.ReactNode; disabled?: boolean };

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'size' | 'title'> {
  placeholder?: string;
  options?: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  preset?: Preset;
  color?: string;
  size?: UISize;
  withEffects?: boolean;
  variant?: 'solid' | 'ghost' | 'outline' | 'none';
  rounded?: keyof typeof ROUND_CLASSES;
  title?: React.ReactNode;
  description?: React.ReactNode;
  hint?: React.ReactNode;
}

export default function Select({
  options = [
    { value: 'option-1', label: 'Option 1' },
    { value: 'option-2', label: 'Option 2' },
    { value: 'option-3', label: 'Option 3' },
  ],
  value: valueProp,
  defaultValue,
  onValueChange,
  size = 'md',
  preset = 'muted',
  color,
  variant = 'solid',
  withEffects = true,
  rounded = 'sm',
  title,
  placeholder,
  description,
  hint,
  className = '',
  ...rest
}: Readonly<SelectProps>): React.ReactElement {
  const id = useId();
  const isControlled = typeof valueProp !== 'undefined';
  const [valueState, setValueState] = useState<string | undefined>(defaultValue);
  const value = isControlled ? valueProp : valueState;
  const { t } = useI18n();

  const presetColor = preset ? PRESET_MAP[preset] : undefined;
  const activeColor = color ?? presetColor ?? PRESET_MAP['primary'];
  const sizeClass = BUTTON_SIZE_CLASSES[size] ?? BUTTON_SIZE_CLASSES.md;
  const roundClass = ROUND_CLASSES[rounded] ?? ROUND_CLASSES.sm;
  // compute variant classes
  const variantClasses: Record<'solid' | 'ghost' | 'outline' | 'none', string> = {
    solid: 'border border-transparent',
    ghost: 'bg-transparent border border-neutral-300 dark:border-neutral-700',
    outline: 'bg-transparent border border-transparent',
    none: 'bg-transparent border-none',
  };

  function onChange(v: string) {
    if (!isControlled) setValueState(v);
    onValueChange?.(v);
  }

  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      {title && <div className="text-sm font-medium">{title}</div>}
      {description && <div className="text-xs text-neutral-500 dark:text-neutral-400">{description}</div>}

      <div className="relative inline-block">
        <select
          id={id}
          aria-label={typeof title === 'string' ? title : 'Select'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={clsx(
            'appearance-none border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100',
            'px-3 py-2 focus:outline-none',
            sizeClass,
            roundClass,
            withEffects ? 'transition duration-150 ease-in-out' : '',
            variantClasses[variant],
            'pr-8'
          )}
          style={
            variant === 'solid'
              ? { backgroundColor: activeColor, color: '#ffffff', borderColor: 'transparent' }
              : variant === 'ghost'
              ? { color: activeColor, borderColor: activeColor, backgroundColor: 'transparent' }
              : variant === 'outline'
              ? { color: activeColor, borderColor: activeColor, backgroundColor: 'transparent' }
              : variant === 'none'
              ? { backgroundColor: 'transparent', borderColor: 'transparent', color: 'inherit' }
              : undefined
          }
          {...rest}
        >
          <option value="" disabled>
            {placeholder ?? t('selected') ?? 'Select...'}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-70">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="opacity-80">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {hint && <div className="text-xs text-neutral-500 dark:text-neutral-400">{hint}</div>}
    </div>
  );
}
