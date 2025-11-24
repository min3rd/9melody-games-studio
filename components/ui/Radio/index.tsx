"use client";
import React, { useId, useState } from 'react';
import clsx from 'clsx';
import { PRESET_MAP, type Preset } from '../presets';

export type RadioOption = { value: string; label: React.ReactNode; disabled?: boolean };

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  options?: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  preset?: Preset;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  withEffects?: boolean;
}

export default function Radio({
  options = [
    { value: 'option-1', label: 'Option 1' },
    { value: 'option-2', label: 'Option 2' },
    { value: 'option-3', label: 'Option 3' },
  ],
  value: valueProp,
  defaultValue,
  onValueChange,
  preset,
  color,
  size = 'md',
  withEffects = true,
  className,
  ...rest
}: Readonly<RadioProps>) {
  const id = useId();
  const isControlled = typeof valueProp !== 'undefined';
  const [valueState, setValueState] = useState<string | undefined>(defaultValue);
  const value = isControlled ? valueProp : valueState;
  const presetColor = preset ? PRESET_MAP[preset] : undefined;
  const activeColor = color ?? presetColor ?? PRESET_MAP['primary'];

  const sizeClasses = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

  function onChange(v: string) {
    if (!isControlled) setValueState(v);
    onValueChange?.(v);
  }

  return (
    <div className={clsx('pi-radio-group', className)} {...rest}>
      {options.map((opt, i) => {
        const inputId = `${id}-${i}`;
        const isSelected = value === opt.value;
        const disabled = opt.disabled ?? false;
        return (
          <label
            key={opt.value}
            htmlFor={inputId}
            className={clsx('flex items-center gap-3 select-none', disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer')}
          >
            <input
              id={inputId}
              type="radio"
              name={id}
              value={opt.value}
              checked={isSelected}
              disabled={disabled}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />

            <span
              aria-hidden
              className={clsx(
                'inline-flex items-center justify-center border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800',
                'rounded-full',
                sizeClasses,
                withEffects ? 'transition duration-150 ease-in-out' : ''
              )}
              style={isSelected ? { backgroundColor: activeColor, borderColor: activeColor } : undefined}
            >
              {/* make the indicator circular */}
              {isSelected && (
                <span className="w-full h-full flex items-center justify-center">
                  <span
                    className={clsx('bg-white dark:bg-neutral-900 rounded-full', size === 'sm' ? 'w-1 h-1' : size === 'lg' ? 'w-3 h-3' : 'w-2 h-2')}
                    aria-hidden
                  />
                </span>
              )}
            </span>

            <span className="text-sm text-neutral-800 dark:text-neutral-100">{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
}
