"use client";
import React, { useId, useState, useMemo, useRef, useEffect } from "react";
import PatternOverlay from "../patterns";
import clsx from "clsx";
import { PRESET_MAP, type Preset, BUTTON_SIZE_CLASSES, ROUND_CLASSES, type UISize } from "../presets";

export interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'size'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  preset?: Preset;
  color?: string;
  size?: UISize;
  variant?: 'solid' | 'ghost' | 'outline' | 'none';
  pattern?: 'pixel' | 'neon' | 'bubble' | 'pixel3d';
  rounded?: keyof typeof ROUND_CLASSES;
  withEffects?: boolean;
}

export default function TextArea({
  value: valueProp,
  defaultValue,
  onValueChange,
  label,
  hint,
  error,
  preset = 'muted',
  color,
  size = 'md',
  variant = 'solid',
  rounded = 'sm',
  withEffects = true,
  pattern,
  id: idProp,
  className = '',
  disabled = false,
  rows = 4,
  ...rest
}: Readonly<TextAreaProps>) {
  const id = idProp ?? useId();
  const isControlled = typeof valueProp !== 'undefined';
  const [valueState, setValueState] = useState<string | undefined>(defaultValue);
  const value = isControlled ? valueProp : valueState;

  const sizeClass = BUTTON_SIZE_CLASSES[size] ?? BUTTON_SIZE_CLASSES.md;
  const roundClass = ROUND_CLASSES[rounded] ?? ROUND_CLASSES.sm;

  const variantClasses: Record<'solid' | 'ghost' | 'outline' | 'none', string> = {
    solid: 'bg-white dark:bg-neutral-800 border border-transparent',
    ghost: 'bg-transparent border border-neutral-300 dark:border-neutral-700',
    outline: 'bg-transparent border border-neutral-300 dark:border-neutral-700',
    none: 'bg-transparent border-none',
  };
  const patternClass = pattern === 'pixel' ? 'input-pattern-pixel' : pattern === 'neon' ? 'input-pattern-neon' : pattern === 'bubble' ? 'input-pattern-bubble' : pattern === 'pixel3d' ? 'input-pattern-pixel3d' : '';

  function handleChange(next: string) {
    if (!isControlled) setValueState(next);
    onValueChange?.(next);
  }

  const base = clsx('flex flex-col w-full', roundClass, className);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const inputWrapper = clsx(
    'relative w-full',
    'border border-neutral-200 dark:border-neutral-700',
    sizeClass,
    roundClass,
    variantClasses[variant],
    patternClass,
    disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-text'
  );

  // reuse smaller simplified versions of the pattern spawns, neon, bubble and pixel3d
  // we adapted logic from TextInput; not all features must be present

  // All pattern rendering is handled by the shared PatternOverlay

  // pattern overlay handles pixel3d with gravity and spawn

  return (
    <div className={base}>
      {label && <label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label>}
      <div ref={wrapperRef} className={inputWrapper} aria-disabled={disabled}>
        <PatternOverlay pattern={pattern as any} wrapperRef={wrapperRef} activeColor={color} preset={preset} />

        <textarea id={id} rows={rows} value={value ?? ''} onChange={(e) => handleChange(e.target.value)} className={clsx('w-full bg-transparent border-none outline-none px-2 py-1 relative z-20 text-sm', disabled ? 'cursor-not-allowed' : 'cursor-text')} disabled={disabled} {...rest} />

        <div className="flex items-center justify-between mt-1"><div className="text-xs text-neutral-500 dark:text-neutral-400">{hint}</div><div className="text-xs text-red-600">{error}</div></div>
      </div>
    </div>
  );
}
