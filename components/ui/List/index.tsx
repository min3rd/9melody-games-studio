"use client";
import React, { createContext, useContext } from 'react';
import { PRESET_MAP, type Preset, BUTTON_SIZE_CLASSES, ROUND_CLASSES } from '../presets';

export type ListSize = keyof typeof BUTTON_SIZE_CLASSES;

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  preset?: Preset;
  color?: string;
  size?: ListSize;
  rounded?: boolean;
  divided?: boolean; // adds dividers between items
}

export interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  leading?: React.ReactNode; // left icon/avatar
  trailing?: React.ReactNode; // right actions
  disabled?: boolean;
  selected?: boolean;
  interactive?: boolean; // adds hover/active styles and role
}

const ListContext = createContext<Partial<Pick<ListProps, 'size'|'preset'|'color'|'rounded'|'divided'>> | undefined>(undefined);

export default function List({ preset = 'muted', color, size = 'md', rounded = true, divided = false, className = '', children, ...rest }: Readonly<ListProps>) {
  return (
    <ListContext.Provider value={{ size, preset, color, rounded, divided }}>
      <ul {...rest} className={`${className} w-full`.trim()}>
        {children}
      </ul>
    </ListContext.Provider>
  );
}

export function ListItem({ leading, trailing, disabled = false, selected = false, interactive = true, className = '', children, ...rest }: Readonly<ListItemProps>) {
  const ctx = useContext(ListContext);
  const sizeKey = ctx?.size ?? 'md';
  const sizeClasses = BUTTON_SIZE_CLASSES[sizeKey];
  const roundedClass = ctx?.rounded ? ROUND_CLASSES.sm : ROUND_CLASSES.none;
  const preset = ctx?.preset ?? 'muted';
  const bgColor = selected ? (ctx?.color ?? PRESET_MAP[preset]) : undefined;

  const interactiveClasses = interactive && !disabled ? 'cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800' : '';
  const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed' : '';

  return (
    <li
      {...rest}
      role={interactive ? 'button' : undefined}
      aria-disabled={disabled || undefined}
      className={`flex items-center gap-3 ${sizeClasses} ${roundedClass} ${interactiveClasses} ${disabledClasses} ${className}`.trim()}
      style={{ backgroundColor: bgColor }}
    >
      {leading && <span className="shrink-0">{leading}</span>}
      <span className="flex-1">{children}</span>
      {trailing && <span className="shrink-0">{trailing}</span>}
    </li>
  );
}
