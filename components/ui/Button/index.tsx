"use client";
import React, { useRef } from "react";
import {
  PRESET_MAP,
  type Preset,
  BUTTON_SIZE_CLASSES,
  ROUND_CLASSES,
  type UISize,
} from "../presets";
import PatternOverlay, { type Pattern } from '../patterns';

type ButtonVariant = "primary" | "ghost" | "danger";
export type ButtonPreset = Preset;
type ButtonSize = UISize;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: string; // custom color for the button (hex or CSS color)
  preset?: ButtonPreset;
  withEffects?: boolean;
  rounded?: boolean;
  pattern?: Pattern;
}

const ButtonImpl: React.ForwardRefRenderFunction<
  HTMLButtonElement,
  ButtonProps
> = (
  {
    children,
    className = "",
    variant = "primary",
    size = "md",
    color,
    preset,
    withEffects = true,
    pattern,
    rounded = false,
    ...rest
  }: Readonly<ButtonProps>,
  ref
) => {
  const localRef = useRef<HTMLButtonElement | null>(null);
  // If the caller passed a ref, ensure we forward the native element to them as
  // well as keep a local ref for measurements.
  const setRefs = (node: HTMLButtonElement | null) => {
    localRef.current = node;
    if (!ref) return;
    if (typeof ref === "function") {
      ref(node);
    } else {
      (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    }
  };
  const base =
    "font-medium inline-flex items-center justify-center gap-2 pixel-btn";
  const roundClass = rounded ? ROUND_CLASSES.sm : ROUND_CLASSES.none; // keep default `none` to preserve pixel-art look
  const effectsClasses =
    "transform transition-transform duration-150 ease-[cubic-bezier(.2,.9,.2,1)] hover:-translate-y-1 hover:scale-105 hover:shadow-lg active:translate-y-0 active:scale-95 active:shadow-sm";

  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      "bg-foreground text-background dark:bg-background dark:text-foreground border border-transparent",
    ghost:
      "bg-transparent text-foreground dark:text-foreground border border-neutral-300 dark:border-neutral-700",
    danger: "bg-red-600 text-white dark:bg-red-500 border border-transparent",
  };

  const sizeClasses = BUTTON_SIZE_CLASSES as Record<ButtonSize, string>;

  const patternClass = pattern ? `btn-pattern-${pattern}` : "";
  // Disable hover transforms when we are in pixel pattern mode (tile animation will run independently)
  const classes = `${base} ${patternClass} ${roundClass} ${
    withEffects && pattern !== "pixel" ? effectsClasses : ""
  } ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  // Use shared PRESET_MAP

  const presetColor = preset ? PRESET_MAP[preset] : undefined;
  const activeColor = color ?? presetColor;

  const styleOverride: React.CSSProperties & Record<string, string> = {};
  // helpers for color transformations (lighten/rgba conversion). This is a minimal
  // implementation sufficient for hex colors used in `PRESET_MAP` and color picker values.
  const hexToRgb = (hex?: string): [number, number, number] | null => {
    if (!hex) return null;
    const h = hex.replace("#", "").trim();
    if (h.length === 3) {
      const r = parseInt(h[0] + h[0], 16);
      const g = parseInt(h[1] + h[1], 16);
      const b = parseInt(h[2] + h[2], 16);
      return [r, g, b];
    }
    if (h.length === 6) {
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const b = parseInt(h.slice(4, 6), 16);
      return [r, g, b];
    }
    return null;
  };
  const rgbaFromHex = (hex?: string, alpha = 1) => {
    const rgb = hexToRgb(hex ?? "");
    if (!rgb) return undefined;
    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
  };
  const lightenRgbFromHex = (hex?: string, amount = 0.15) => {
    const rgb = hexToRgb(hex ?? "");
    if (!rgb) return undefined;
    const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
    const r = clamp(rgb[0] + 255 * amount);
    const g = clamp(rgb[1] + 255 * amount);
    const b = clamp(rgb[2] + 255 * amount);
    return { r, g, b };
  };
  const rgbaFromRgb = (
    rgb: { r: number; g: number; b: number } | undefined,
    alpha = 1
  ) => {
    if (!rgb) return undefined;
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
  };
  // Double sizes: sm/md/lg -> 8/12/16px (doubled)
  // Each tile size plus the grid gap should be used to compute how many tiles fit
  const tileSizeMap = { sm: 8, md: 12, lg: 16 } as const;
  const tileSize = tileSizeMap[size] ?? 6;
  // no internal grid: PatternOverlay handles pattern rendering for all pattern types

  if (activeColor) {
    // allow pattern highlight to use a CSS variable if present
    if (pattern === "pixel") {
      // Button background becomes black in pixel mode
      styleOverride.backgroundColor = "#000000";
      styleOverride.color = "#ffffff";
      // derive tile colors from activeColor
      const base = rgbaFromHex(activeColor, 0.2) ?? "rgba(0,0,0,0.24)";
      const shine =
        rgbaFromRgb(lightenRgbFromHex(activeColor, 0.18), 1) ??
        "rgba(255,255,255,0.9)";
      styleOverride["--btn-pattern-shine"] = shine;
      styleOverride["--btn-pattern-overlay"] = base;
      styleOverride["--btn-pattern-size"] = `${tileSize}px`; 
    }

    /* Grid measurement for pixel overlay */
    if (variant === "ghost") {
      styleOverride.color = activeColor;
      styleOverride.borderColor = activeColor;
    } else {
      if (pattern !== "pixel") {
        styleOverride.backgroundColor = activeColor;
      }
      styleOverride.borderColor = "transparent";
      styleOverride.color = "#ffffff";
    }
  }

  // PatternOverlay manages grid & size

  return (
    <button
      ref={setRefs}
      {...rest}
      className={classes}
      style={{
        outlineOffset: "2px",
        fontFamily: "var(--font-pixel, monospace)",
        ...styleOverride,
        ...(rest.style ?? {}),
      }}
    >
      {children}
      {pattern && (
        <PatternOverlay pattern={pattern} wrapperRef={localRef} activeColor={activeColor} classPrefix="btn" />
      )}
    </button>
  );
};
export default React.forwardRef<HTMLButtonElement, ButtonProps>(ButtonImpl);
// Make this name available in React DevTools
// Assign displayName safely without using `any` type
(ButtonImpl as unknown as { displayName?: string }).displayName = "Button";
