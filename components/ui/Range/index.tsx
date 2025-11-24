"use client";
import React, {
  useEffect,
  useId,
  useState,
  useRef,
  useLayoutEffect,
} from "react";
import clsx from "clsx";
import { PRESET_MAP, type Preset } from "../presets";

export type RangeSize = "sm" | "md" | "lg";

export interface RangeProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "size"
  > {
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
  /** Show tick marks at every step interval */
  showTicks?: boolean;
  /** Show a small tooltip with the current value when hovering/dragging/focused */
  showTooltip?: boolean;
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
  size = "md",
  withEffects = true,
  showTicks = false,
  showTooltip = false,
  className,
  ...rest
}: Readonly<RangeProps>) {
  const id = useId();
  const isControlled = typeof valueProp !== "undefined";
  const [valueState, setValueState] = useState<number | undefined>(
    defaultValue ?? min
  );
  const value = isControlled ? (valueProp as number) : (valueState as number);

  const presetColor = preset ? PRESET_MAP[preset] : undefined;
  const activeColor = color ?? presetColor ?? PRESET_MAP["primary"];

  const sizeClasses = size === "sm" ? "h-1" : size === "lg" ? "h-2" : "h-1.5";
  const thumbSize = size === "sm" ? 10 : size === "lg" ? 18 : 14; // pixels

  useEffect(() => {
    if (typeof value === "undefined") setValueState(min);
  }, []);

  const safeVal = Number.isFinite(Number(value)) ? Number(value) : min;
  const percent = Math.max(
    0,
    Math.min(100, ((safeVal - min) / (max - min)) * 100)
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hoveredTick, setHoveredTick] = useState<{
    left: number;
    value: number;
  } | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [trackWidth, setTrackWidth] = useState(0);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value);
    if (!isControlled) setValueState(v);
    onValueChange?.(v);
  }

  function onPointerDown() {
    setIsDragging(true);
  }

  function onPointerUp() {
    setIsDragging(false);
  }

  const trackStyle: React.CSSProperties = {
    // We expose the CSS vars for the styled-jsx rules to use
    ["--pi-range-percent" as any]: `${percent}%`,
    ["--pi-range-active-color" as any]: activeColor,
    ["--pi-range-track-height" as any]: `${
      size === "sm" ? 4 : size === "lg" ? 8 : 6
    }px`,
    ["--pi-range-thumb-size" as any]: `${thumbSize}px`,
    ["--pi-range-base-color" as any]: "rgba(0,0,0,0.12)",
  };

  // Build tick marks positions (pixel-perfect)
  const ticks: { left: number; active: boolean; value: number }[] = [];
  const maxTicks = 120; // safety bound — prevents rendering thousands of ticks
  const totalSteps = step > 0 ? Math.floor((max - min) / step) : 0;
  const usableTrack = Math.max(0, trackWidth - thumbSize);
  if (showTicks && totalSteps >= 0 && totalSteps <= maxTicks) {
    for (let i = 0; i <= totalSteps; i++) {
      const tickVal = min + i * step;
      const percentVal = (tickVal - min) / (max - min);
      const px = percentVal * usableTrack + thumbSize / 2;
      const active = percentVal * 100 <= percent + 0.0001;
      ticks.push({ left: px, active, value: tickVal });
    }
  }

  function onTrackMouseMove(e: React.MouseEvent) {
    if (!showTicks || totalSteps <= 0) return;
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    // find nearest tick
    let nearest: { left: number; value: number } | null = null;
    let nearestDist = Infinity;
    const hitPx = 12; // px distance allowance
    for (const t of ticks) {
      const dist = Math.abs(t.left - x);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = t;
      }
    }
    if (nearest && nearestDist <= hitPx) {
      setHoveredTick(nearest);
    } else {
      setHoveredTick(null);
    }
  }

  // Measure track width for pixel-perfect alignment
  useLayoutEffect(() => {
    function measure() {
      if (trackRef.current) {
        setTrackWidth(trackRef.current.offsetWidth);
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div
      className={clsx("pi-range relative w-full", className)}
      style={trackStyle}
    >
      <div
        ref={trackRef}
        className="pi-range-track relative w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setHoveredTick(null);
        }}
        onMouseMove={onTrackMouseMove}
      >
        {/* ticks */}
        {showTicks && (
          <div className="absolute inset-0 pointer-events-none">
            {ticks.map((t, i) => (
              <span
                key={i}
                className="absolute top-1/2 -translate-y-1/2 w-px"
                style={{
                  left: t.left,
                  transform: `translateX(-0.5px) translateY(-50%)`,
                  background: t.active
                    ? "var(--pi-range-active-color)"
                    : "var(--pi-range-base-color)",
                  height: `calc(var(--pi-range-track-height) + 8px)`,
                  zIndex: 10,
                }}
                aria-hidden
              />
            ))}
          </div>
        )}

        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={onChange}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={clsx(
            "pi-range appearance-none w-full bg-transparent relative z-0",
            sizeClasses,
            withEffects ? "transition-colors duration-150" : ""
          )}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          {...rest}
        />
        {/* tooltip placed inside track to use relative coords */}
        {showTooltip &&
          (isDragging || isHovered || isFocused || hoveredTick) && (
            <div
              className="pi-range-tooltip pointer-events-none absolute w-max"
              style={{
                left: hoveredTick
                  ? hoveredTick.left
                  : usableTrack * ((safeVal - min) / (max - min)) +
                    thumbSize / 2,
                transform: "translateX(-50%)",
                bottom: `calc(var(--pi-range-track-height) + 10px)`,
              }}
              aria-hidden
            >
              <div
                className="pi-range-tooltip-bubble px-2 py-1 text-white text-xs rounded shadow-md"
                style={{ background: "var(--pi-range-active-color)" }}
              >
                {String(hoveredTick ? hoveredTick.value : safeVal)}
              </div>
              {/* Tooltip arrow removed as requested */}
            </div>
          )}
      </div>
      <style jsx>{`
        input[type="range"].pi-range:focus-visible::-webkit-slider-runnable-track {
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
        }
        input[type="range"].pi-range::-webkit-slider-runnable-track {
          height: var(--pi-range-track-height);
          border-radius: calc(var(--pi-range-track-height) / 2);
          background: linear-gradient(
            90deg,
            var(--pi-range-active-color) var(--pi-range-percent),
            var(--pi-range-base-color) var(--pi-range-percent)
          );
        }
        input[type="range"].pi-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: var(--pi-range-thumb-size);
          height: var(--pi-range-thumb-size);
          border-radius: 9999px;
          background: #fff;
          border: 2px solid var(--pi-range-active-color);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          margin-top: calc(
            (var(--pi-range-track-height) - var(--pi-range-thumb-size)) / 2
          );
          z-index: 40;
          position: relative;
        }
        input[type="range"].pi-range:focus-visible::-moz-range-track {
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
        }
        input[type="range"].pi-range::-moz-range-track {
          height: var(--pi-range-track-height);
          border-radius: calc(var(--pi-range-track-height) / 2);
          background: var(--pi-range-base-color);
        }
        input[type="range"].pi-range::-moz-range-progress {
          background: var(--pi-range-active-color);
          height: var(--pi-range-track-height);
          border-radius: calc(var(--pi-range-track-height) / 2);
        }
        input[type="range"].pi-range::-moz-range-thumb {
          width: var(--pi-range-thumb-size);
          height: var(--pi-range-thumb-size);
          border-radius: 9999px;
          background: #fff;
          border: 2px solid var(--pi-range-active-color);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          margin-top: 0;
          z-index: 40;
          position: relative;
        }
        input[type="range"].pi-range[disabled] {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
      <style jsx>{`
        :global(.dark) .pi-range {
          --pi-range-base-color: rgba(255, 255, 255, 0.12);
        }
      `}</style>
      <style jsx>{`
        .pi-range-tooltip {
          z-index: 20;
        }
        .pi-range-tooltip-bubble {
          transform: translateY(-6px);
          white-space: nowrap;
        }
        /* Tooltip arrow removed */
      `}</style>
    </div>
  );
}
