"use client";
import React from "react";
import clsx from "clsx";
import { PRESET_MAP, type Preset } from "../presets";

export type SelectSize = "sm" | "md" | "lg";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size" | "onChange"> {
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  preset?: Preset;
  color?: string;
  size?: SelectSize;
  withEffects?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: "px-2 py-1 text-sm",
  md: "px-3 py-2 text-base",
  lg: "px-4 py-2 text-lg",
};

export default function Select({
  options,
  value,
  onValueChange,
  preset,
  color,
  size = "md",
  withEffects = true,
  className,
  ...rest
}: SelectProps) {
  const presetColor = preset ? PRESET_MAP[preset] : undefined;
  const activeColor = color ?? presetColor ?? PRESET_MAP["primary"];

  return (
    <select
      value={value}
      onChange={e => onValueChange?.(e.target.value)}
      className={clsx(
        "rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2",
        SIZE_MAP[size],
        withEffects && "transition-colors duration-150 hover:border-gray-400 hover:shadow cursor-pointer",
        className
      )}
      style={{ color: activeColor }}
      {...rest}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
