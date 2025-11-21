"use client";
import React, { useEffect, useId, useRef, useState } from 'react';

export interface ToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'title'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  hint?: React.ReactNode;
  color?: string; // any valid CSS color for the "on" state
}

export default function Toggle({
  checked: checkedProp,
  defaultChecked,
  onCheckedChange: onCheckedChangeProp,
  disabled = false,
  title,
  description,
  hint,
  color,
  className = '',
  ...rest
}: Readonly<ToggleProps>) {
  const id = useId();
  const isControlled = typeof checkedProp === 'boolean';
  const [checked, setChecked] = useState<boolean>(
    isControlled ? !!checkedProp : !!defaultChecked
  );

  useEffect(() => {
    if (isControlled) {
      setChecked(!!checkedProp);
    }
  }, [checkedProp, isControlled]);

  const toggle = () => {
    if (disabled) return;
    const next = !checked;
    if (!isControlled) setChecked(next);
    onCheckedChangeProp?.(next);
  };

  const trackColor = checked ? (color ?? 'rgb(59 130 246)') : 'rgb(226 232 240)';
  const knobTranslate = checked ? 'translateX(20px)' : 'translateX(0)';

  return (
    <div className={`${className} flex items-start gap-3`}>
      <div className="flex-1">
        {title && <div className={`text-sm font-medium ${disabled ? 'text-neutral-400' : 'text-neutral-800'} dark:${disabled ? 'text-neutral-500' : 'text-neutral-100'}`}>{title}</div>}
        {description && <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">{description}</div>}
      </div>

      <div className="flex items-center gap-3">
        {hint && <div className="text-xs text-neutral-500 dark:text-neutral-400">{hint}</div>}

        <button
          type="button"
          aria-label={typeof title === 'string' ? title : 'Toggle'}
          role="switch"
          aria-checked={checked}
          aria-disabled={disabled}
          disabled={disabled}
          onClick={toggle}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggle();
            }
          }}
          className={`relative inline-flex items-center w-12 h-7 rounded-full transition-colors duration-200 focus:outline-none ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} bg-neutral-200 dark:bg-neutral-800`}
          style={{ background: checked ? trackColor : undefined, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)' }}
          {...rest}
        >
          <span
            className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200"
            style={{ transform: knobTranslate }}
          />
        </button>
      </div>
    </div>
  );
}
