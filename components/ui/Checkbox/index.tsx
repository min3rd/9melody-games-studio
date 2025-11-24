"use client";
import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { PRESET_MAP, type Preset } from "../presets";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "title"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  hint?: React.ReactNode;
  color?: string;
  preset?: Preset;
  size?: "sm" | "md" | "lg";
  withEffects?: boolean;
}

export default function Checkbox({
  checked: checkedProp,
  defaultChecked,
  onCheckedChange: onCheckedChangeProp,
  disabled = false,
  title,
  description,
  hint,
  color,
  preset,
  size = "md",
  withEffects = true,
  className = "",
  ...rest
}: Readonly<CheckboxProps>): React.ReactElement {
  const isControlled = typeof checkedProp === "boolean";
  const [checkedState, setCheckedState] = useState<boolean>(!!defaultChecked);
  const checked = isControlled ? !!checkedProp : checkedState;

  const [playEffect, setPlayEffect] = useState(false);
  const prevCheckedRef = useRef<boolean>(checked);

  const onChange = (next: boolean) => {
    if (disabled) return;
    if (!isControlled) setCheckedState(next);
    onCheckedChangeProp?.(next);
  };

  // Trigger a quick sonic animation when the checkbox becomes checked
  useEffect(() => {
    const prev = prevCheckedRef.current;
    if (!prev && checked) {
      setPlayEffect(true);
      const t = setTimeout(() => setPlayEffect(false), 520); // duration slightly larger than animation
      return () => clearTimeout(t);
    }
    prevCheckedRef.current = checked;
  }, [checked]);

  const presetColor = preset ? PRESET_MAP[preset] : undefined;
  const activeColor = color ?? presetColor ?? PRESET_MAP["primary"];

  const indicatorClass =
    size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5";

  const effectClass = withEffects ? "transition duration-150 ease-in-out" : "";

  return (
    <label
      className={clsx("select-none flex items-start gap-3", className)}
      style={{ WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none', userSelect: 'none' }}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
        {...rest}
      />

      <span
        aria-hidden
        className={`pi-checkbox-indicator relative inline-flex items-center justify-center ${indicatorClass} ${clsx(
          effectClass,
          disabled ? "opacity-60" : "cursor-pointer"
        )} bg-white border border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700 ${
          checked ? "checked" : ""
        } ${playEffect ? "anim" : ""}`}
        style={{
          ["--checkbox-active" as any]: activeColor,
          ...(checked
            ? { backgroundColor: activeColor, borderColor: activeColor }
            : undefined),
        }}
      >
        {/* shine overlay for sonic sweep */}
        <span aria-hidden className="pi-checkbox-shine" />
        {checked && (
          <span className="pi-checkbox-tick">
            <svg
              className="w-3 h-3 text-white"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M20 6L9 17l-5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </span>

      <div className="flex-1">
        {title && (
          <div
            className={`text-sm font-medium ${
              disabled ? "text-neutral-400" : "text-neutral-800"
            } dark:${disabled ? "text-neutral-500" : "text-neutral-100"}`}
          >
            {title}
          </div>
        )}
        {description && (
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {description}
          </div>
        )}
      </div>

      {hint && (
        <div className="shrink-0 text-xs text-neutral-500 dark:text-neutral-400">
          {hint}
        </div>
      )}
    </label>
  );
}
