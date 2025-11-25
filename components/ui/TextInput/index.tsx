"use client";
import React, { useId, useState } from "react";
import clsx from "clsx";
import { PRESET_MAP, type Preset, BUTTON_SIZE_CLASSES, ROUND_CLASSES, type UISize } from "../presets";

export interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  preset?: Preset;
  color?: string;
  size?: UISize;
  variant?: 'solid' | 'ghost' | 'outline' | 'none';
  pattern?: 'pixel' | 'neon' | 'bubble';
  rounded?: keyof typeof ROUND_CLASSES;
  withEffects?: boolean;
  clearable?: boolean; // shows clear button when true
}

export default function TextInput({
  value: valueProp,
  defaultValue,
  onValueChange,
  label,
  hint,
  error,
  prefix,
  suffix,
  preset = 'muted',
  color,
  size = 'md',
  variant = 'solid',
  rounded = 'sm',
  withEffects = true,
  clearable = false,
  pattern,
  id: idProp,
  className = '',
  disabled = false,
  ...rest
}: Readonly<TextInputProps>) {
  const id = idProp ?? useId();
  const isControlled = typeof valueProp !== 'undefined';
  const [valueState, setValueState] = useState<string | undefined>(defaultValue);
  const value = isControlled ? valueProp : valueState;

  const presetColor = preset ? PRESET_MAP[preset] : undefined;
  const activeColor = color ?? presetColor ?? PRESET_MAP['primary'];

  const sizeClass = BUTTON_SIZE_CLASSES[size] ?? BUTTON_SIZE_CLASSES.md;
  const roundClass = ROUND_CLASSES[rounded] ?? ROUND_CLASSES.sm;

  const variantClasses: Record<'solid' | 'ghost' | 'outline' | 'none', string> = {
    solid: 'bg-white dark:bg-neutral-800 border border-transparent',
    ghost: 'bg-transparent border border-neutral-300 dark:border-neutral-700',
    outline: 'bg-transparent border border-neutral-300 dark:border-neutral-700',
    none: 'bg-transparent border-none',
  };

  const patternClass = pattern === 'pixel' ? 'input-pattern-pixel' : pattern === 'neon' ? 'input-pattern-neon' : pattern === 'bubble' ? 'input-pattern-bubble' : '';

  function handleChange(next: string) {
    if (!isControlled) setValueState(next);
    onValueChange?.(next);
  }

  function clear() {
    handleChange('');
    const e = document.getElementById(id) as HTMLInputElement | null;
    e?.focus();
  }

  const effectClass = withEffects ? 'transition duration-150 ease-in-out' : '';

  const base = clsx('inline-flex items-center gap-2 w-full', roundClass, className);

  const inputWrapper = clsx(
    'flex items-center w-full relative overflow-hidden',
    'border border-neutral-200 dark:border-neutral-700',
    sizeClass,
    roundClass,
    effectClass,
    variantClasses[variant],
    patternClass,
    disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-text'
  );

  const inputStyle = variant === 'solid'
    ? { backgroundColor: activeColor, color: '#ffffff', borderColor: 'transparent' }
    : variant === 'ghost'
      ? { color: activeColor, borderColor: activeColor }
      : variant === 'outline'
        ? { color: activeColor, borderColor: activeColor }
        : undefined;

  const inputId = id;

  return (
    <div className={base}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium mb-1 block">
          {label}
        </label>
      )}

      <div className="flex flex-col w-full">
        <div className={inputWrapper} style={{ ...inputStyle, ['--input-pattern-color' as any]: activeColor }} aria-disabled={disabled}>
          {prefix && <div className="pl-2 pr-1 text-sm text-neutral-600 dark:text-neutral-300">{prefix}</div>}

          <input
            id={inputId}
            className={clsx('flex-1 bg-transparent border-none outline-none text-sm text-neutral-800 dark:text-neutral-100 px-2', disabled ? 'cursor-not-allowed' : 'cursor-text')}
            disabled={disabled}
            value={value ?? ''}
            onChange={(e) => handleChange(e.target.value)}
            {...rest}
          />

          {clearable && !!value && !disabled && (
            <button
              type="button"
              aria-label="Clear"
              className="px-2 text-sm text-neutral-700 dark:text-neutral-200"
              onClick={() => clear()}
            >
              ✕
            </button>
          )}

          {suffix && <div className="pl-1 pr-2 text-sm text-neutral-600 dark:text-neutral-300">{suffix}</div>}
        </div>

        <div className="flex items-center justify-between mt-1">
          <div className="text-xs text-neutral-500 dark:text-neutral-400">{hint}</div>
          <div className="text-xs text-red-600">{error}</div>
        </div>
      </div>
    </div>
  );
}
