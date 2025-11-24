"use client";
import React, { useState } from "react";
import clsx from "clsx";
import { PRESET_MAP, type Preset } from "../presets";

export type RatingSize = "sm" | "md" | "lg";

export interface RatingProps {
  value?: number;
  max?: number;
  onChange?: (value: number) => void;
  preset?: Preset;
  color?: string;
  size?: RatingSize;
  withEffects?: boolean;
  className?: string;
  readOnly?: boolean;
}

const SIZE_MAP = {
  sm: "w-4 h-4 text-base",
  md: "w-6 h-6 text-lg",
  lg: "w-8 h-8 text-xl",
};

export default function Rating({
  value = 0,
  max = 5,
  onChange,
  preset,
  color,
  size = "md",
  withEffects = true,
  className,
  readOnly = false,
}: RatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const presetColor = preset ? PRESET_MAP[preset] : undefined;
  const activeColor = color ?? presetColor ?? PRESET_MAP["primary"];

  return (
    <div className={clsx("flex items-center gap-1 select-none", className)}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = (hovered !== null ? i < hovered : i < value);
        return (
          <button
            key={i}
            type="button"
            className={clsx(
              "p-0 bg-transparent border-none cursor-pointer focus:outline-none",
              SIZE_MAP[size],
              withEffects && !readOnly && "transition-transform hover:scale-110",
              readOnly && "pointer-events-none opacity-60"
            )}
            style={{ color: filled ? activeColor : "#e5e7eb" }}
            onMouseEnter={() => !readOnly && setHovered(i + 1)}
            onMouseLeave={() => !readOnly && setHovered(null)}
            onClick={() => !readOnly && onChange?.(i + 1)}
            aria-label={`Rate ${i + 1}`}
            tabIndex={readOnly ? -1 : 0}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="block">
              <polygon points="10,2 12.59,7.36 18.51,8.09 14,12.26 15.18,18.09 10,15.1 4.82,18.09 6,12.26 1.49,8.09 7.41,7.36" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
