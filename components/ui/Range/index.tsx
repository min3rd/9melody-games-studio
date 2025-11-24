"use client";
import React, { useEffect, useId, useState } from 'react';
import clsx from 'clsx';
import { PRESET_MAP, type Preset } from '../presets';

export type RangeSize = 'sm' | 'md' | 'lg';

export interface RangeProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  disabled?: boolean;
  preset?: Preset;
  color?: string; // custom color
  size?: RangeSize;
  withEffects?: boolean;
}

export default function Range({
  min = 0,
  max = 100,
  step = 1,
  value: valueProp,
  defaultValue,
  onValueChange,
  disabled = false,
  preset,
  color,
  size = 'md',
  withEffects = true,
  className,
  ...rest
}: Readonly<RangeProps>) {
  const id = useId();
  const isControlled = typeof valueProp !== 'undefined';
  const [valueState, setValueState] = useState<number | undefined>(defaultValue ?? min);
  const value = isControlled ? (valueProp as number) : (valueState as number);

  const presetColor = preset ? PRESET_MAP[preset] : undefined;
  const activeColor = color ?? presetColor ?? PRESET_MAP['primary'];

  const sizeClasses = size === 'sm' ? 'h-1' : size === 'lg' ? 'h-2' : 'h-1.5';
  const thumbSize = size === 'sm' ? 10 : size === 'lg' ? 18 : 14; // pixels

  useEffect(() => {
    if (typeof value === 'undefined') setValueState(min);
  }, []);

  const safeVal = Number.isFinite(Number(value)) ? Number(value) : min;
  const percent = Math.max(0, Math.min(100, ((safeVal - min) / (max - min)) * 100));

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value);
    if (!isControlled) setValueState(v);
    onValueChange?.(v);
  }

  const trackStyle: React.CSSProperties = {
    // We expose the CSS vars for the styled-jsx rules to use
    ['--pi-range-percent' as any]: `${percent}%`,
    ['--pi-range-active-color' as any]: activeColor,
    ['--pi-range-track-height' as any]: `${size === 'sm' ? 4 : size === 'lg' ? 8 : 6}px`,
    ['--pi-range-thumb-size' as any]: `${thumbSize}px`,
    ['--pi-range-base-color' as any]: 'rgba(0,0,0,0.06)'
  };

  return (
    <div className={clsx('pi-range', 'w-full', className)}>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className={clsx('pi-range appearance-none w-full bg-transparent', sizeClasses, withEffects ? 'transition-colors duration-150' : '')}
        style={trackStyle}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        {...rest}
      />
      <style jsx>{`
        input[type=range].pi-range:focus-visible::-webkit-slider-runnable-track {
          box-shadow: 0 0 0 4px rgba(59,130,246,0.12);
        }
        input[type=range].pi-range::-webkit-slider-runnable-track {
          height: var(--pi-range-track-height);
          border-radius: calc(var(--pi-range-track-height) / 2);
          background: linear-gradient(90deg, var(--pi-range-active-color) var(--pi-range-percent), var(--pi-range-base-color) var(--pi-range-percent));
        }
        input[type=range].pi-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: var(--pi-range-thumb-size);
          height: var(--pi-range-thumb-size);
          border-radius: 9999px;
          background: #fff;
          border: 2px solid var(--pi-range-active-color);
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
          margin-top: calc((var(--pi-range-track-height) - var(--pi-range-thumb-size)) / 2);
        }
        input[type=range].pi-range:focus-visible::-moz-range-track {
          box-shadow: 0 0 0 4px rgba(59,130,246,0.12);
        }
        input[type=range].pi-range::-moz-range-track {
          height: var(--pi-range-track-height);
          border-radius: calc(var(--pi-range-track-height) / 2);
          background: var(--pi-range-base-color);
        }
        input[type=range].pi-range::-moz-range-progress {
          background: var(--pi-range-active-color);
          height: var(--pi-range-track-height);
          border-radius: calc(var(--pi-range-track-height) / 2);
        }
        input[type=range].pi-range::-moz-range-thumb {
          width: var(--pi-range-thumb-size);
          height: var(--pi-range-thumb-size);
          border-radius: 9999px;
          background: #fff;
          border: 2px solid var(--pi-range-active-color);
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
          margin-top: 0;
        }
        input[type=range].pi-range[disabled] {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
