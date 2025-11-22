"use client";
import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import Button from '../Button';
import { PRESET_MAP, type Preset, ROUND_CLASSES, type UISize } from '../presets';

export type TabVariant = 'solid' | 'ghost' | 'outline';

export interface TabItem {
  key: string | number;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: TabItem[];
  activeKey?: string | number;
  defaultActiveKey?: string | number;
  onTabChange?: (key: string | number) => void;
  size?: UISize;
  preset?: Preset;
  color?: string;
  rounded?: keyof typeof ROUND_CLASSES;
  withEffects?: boolean;
  variant?: TabVariant;
  renderPanel?: (key: string | number) => React.ReactNode;
}

export default function Tabs({ items, activeKey: activeKeyProp, defaultActiveKey, onTabChange, size = 'md', preset = 'muted', color, rounded = 'sm', withEffects = true, variant = 'ghost', renderPanel, className = '', ...rest }: TabsProps) {
  const isControlled = activeKeyProp !== undefined;
  const [activeKeyState, setActiveKeyState] = useState<string | number | undefined>(defaultActiveKey ?? (items[0]?.key));
  const activeKey = isControlled ? activeKeyProp : activeKeyState;
  const presetColor = color ?? PRESET_MAP[preset];
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  // No effect required: defaultActiveKey is used to initialize state; keep the logic simple.

  const handleClick = (key: string | number, idx: number) => {
    if (items[idx]?.disabled) return;
    if (!isControlled) setActiveKeyState(key);
  onTabChange?.(key);
    refs.current[idx]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, idx: number) => {
    const length = items.length;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      let next = (idx + 1) % length;
      while (items[next]?.disabled) next = (next + 1) % length;
      refs.current[next]?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      let prev = (idx - 1 + length) % length;
      while (items[prev]?.disabled) prev = (prev - 1 + length) % length;
      refs.current[prev]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      refs.current[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      refs.current[length - 1]?.focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const key = items[idx].key;
      handleClick(key, idx);
    }
  };

  return (
    <div className={clsx('w-full', className)} {...rest}>
      <div role="tablist" aria-label="Tabs" className="flex gap-2 items-center">
        {items.map((it, i) => {
          const selected = activeKey === it.key;
          // Placeholder for variant mapping; variant is applied via Button's variant prop below.
          const style: React.CSSProperties = {};
          if (variant === 'solid' && selected) style.backgroundColor = presetColor;
          if (variant === 'outline' && selected) style.borderColor = presetColor;

          return (
        <Button
              key={String(it.key)}
              ref={(el: HTMLButtonElement | null) => { refs.current[i] = el; }}
              role="tab"
              aria-selected={selected}
              aria-controls={`tab-panel-${String(it.key)}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => handleClick(it.key, i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              disabled={it.disabled}
              size={size}
              preset={selected ? preset : 'muted'}
              color={selected ? color : undefined}
              rounded={rounded === 'full'}
              withEffects={withEffects}
              className={clsx('px-3 py-1')}
              style={style}
              variant={variant === 'solid' ? 'primary' : variant === 'outline' ? 'ghost' : 'ghost'}
            >
              {it.icon}
              {it.label}
            </Button>
          );
        })}
      </div>

      {renderPanel && (
        <div className="mt-3">
          {renderPanel(activeKey ?? items[0].key)}
        </div>
      )}
    </div>
  );
}
