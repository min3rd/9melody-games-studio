"use client";
import clsx from "clsx";
import React from "react";
import {
  PRESET_MAP,
  type Preset,
  type UISize,
} from "../presets";

const VIEWBOX_WIDTH = 200;
const VIEWBOX_HEIGHT = 120;

const CLOUD_SIZE_MAP: Record<UISize, { width: number; height: number }> = {
  sm: { width: 140, height: 84 },
  md: { width: 200, height: 120 },
  lg: { width: 300, height: 180 },
};

type CloudShade = "base" | "depth" | "highlight" | "glow";

type CloudFacet = {
  points: [number, number][];
  shade: CloudShade;
  opacity?: number;
};

type Sparkle = {
  x: number;
  y: number;
  size: number;
  opacity: number;
};

const CLOUD_VARIANTS: Record<
  "layered" | "clustered",
  { facets: CloudFacet[]; sparkles: Sparkle[] }
> = {
  layered: {
    facets: [
      {
        shade: "depth",
        opacity: 0.95,
        points: [
          [0.04, 0.72],
          [0.16, 0.5],
          [0.32, 0.62],
          [0.46, 0.46],
          [0.58, 0.58],
          [0.68, 0.42],
          [0.8, 0.52],
          [0.94, 0.74],
          [0.7, 0.88],
          [0.38, 0.9],
        ],
      },
      {
        shade: "base",
        opacity: 0.92,
        points: [
          [0.12, 0.76],
          [0.24, 0.44],
          [0.36, 0.52],
          [0.5, 0.34],
          [0.64, 0.52],
          [0.78, 0.38],
          [0.86, 0.58],
          [0.76, 0.86],
          [0.48, 0.96],
          [0.2, 0.92],
        ],
      },
      {
        shade: "highlight",
        opacity: 0.78,
        points: [
          [0.3, 0.56],
          [0.4, 0.4],
          [0.52, 0.36],
          [0.62, 0.44],
          [0.54, 0.62],
          [0.36, 0.64],
        ],
      },
      {
        shade: "highlight",
        opacity: 0.68,
        points: [
          [0.66, 0.5],
          [0.74, 0.42],
          [0.84, 0.56],
          [0.76, 0.66],
        ],
      },
      {
        shade: "glow",
        opacity: 0.55,
        points: [
          [0.18, 0.78],
          [0.26, 0.58],
          [0.34, 0.7],
          [0.28, 0.84],
        ],
      },
    ],
    sparkles: [
      { x: 0.22, y: 0.3, size: 4, opacity: 0.65 },
      { x: 0.48, y: 0.18, size: 5, opacity: 0.55 },
      { x: 0.76, y: 0.28, size: 4, opacity: 0.5 },
    ],
  },
  clustered: {
    facets: [
      {
        shade: "depth",
        opacity: 0.95,
        points: [
          [0.08, 0.82],
          [0.18, 0.58],
          [0.32, 0.64],
          [0.42, 0.52],
          [0.54, 0.56],
          [0.62, 0.44],
          [0.74, 0.52],
          [0.82, 0.64],
          [0.74, 0.84],
          [0.44, 0.92],
          [0.2, 0.9],
        ],
      },
      {
        shade: "base",
        opacity: 0.92,
        points: [
          [0.16, 0.78],
          [0.24, 0.54],
          [0.36, 0.6],
          [0.46, 0.48],
          [0.58, 0.52],
          [0.66, 0.4],
          [0.78, 0.52],
          [0.7, 0.78],
          [0.46, 0.86],
          [0.24, 0.84],
        ],
      },
      {
        shade: "highlight",
        opacity: 0.74,
        points: [
          [0.34, 0.62],
          [0.44, 0.48],
          [0.56, 0.46],
          [0.62, 0.54],
          [0.52, 0.68],
          [0.4, 0.7],
        ],
      },
      {
        shade: "highlight",
        opacity: 0.66,
        points: [
          [0.62, 0.54],
          [0.7, 0.44],
          [0.78, 0.58],
          [0.72, 0.68],
        ],
      },
      {
        shade: "glow",
        opacity: 0.6,
        points: [
          [0.52, 0.74],
          [0.6, 0.62],
          [0.68, 0.74],
          [0.6, 0.84],
        ],
      },
    ],
    sparkles: [
      { x: 0.28, y: 0.26, size: 4, opacity: 0.5 },
      { x: 0.58, y: 0.18, size: 5, opacity: 0.62 },
      { x: 0.68, y: 0.26, size: 4, opacity: 0.48 },
    ],
  },
};

const DEFAULT_PRESET: Preset = "cottonCandy";

function hexToRgb(hex: string): [number, number, number] | null {
  const normalized = hex.replace("#", "").trim();
  if (normalized.length === 3) {
    const r = parseInt(normalized[0] + normalized[0], 16);
    const g = parseInt(normalized[1] + normalized[1], 16);
    const b = parseInt(normalized[2] + normalized[2], 16);
    return [r, g, b];
  }
  if (normalized.length === 6) {
    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    return [r, g, b];
  }
  return null;
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (v: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(v)));
    return clamped.toString(16).padStart(2, "0");
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function shadeColor(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const ratio = Math.max(-1, Math.min(1, amount));
  const [r, g, b] = rgb;
  if (ratio >= 0) {
    return rgbToHex(
      r + (255 - r) * ratio,
      g + (255 - g) * ratio,
      b + (255 - b) * ratio
    );
  }
  const factor = 1 + ratio; // ratio is negative here
  return rgbToHex(r * factor, g * factor, b * factor);
}

function scalePoints(points: [number, number][]): string {
  return points
    .map(
      ([x, y]) => `${(x * VIEWBOX_WIDTH).toFixed(2)},${(y * VIEWBOX_HEIGHT).toFixed(2)}`
    )
    .join(" ");
}

export type CloudVariant = keyof typeof CLOUD_VARIANTS;

export interface CloudProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: UISize;
  preset?: Preset;
  color?: string;
  variant?: CloudVariant;
  rounded?: boolean;
  withEffects?: boolean;
}

export default function Cloud({
  size = "md",
  preset = DEFAULT_PRESET,
  color,
  variant = "layered",
  rounded = false,
  withEffects = true,
  className,
  style,
  role,
  ...rest
}: Readonly<CloudProps>): React.ReactElement {
  const { width, height } = CLOUD_SIZE_MAP[size] ?? CLOUD_SIZE_MAP.md;
  const presetColor = PRESET_MAP[preset];
  const activeColor = color ?? presetColor ?? PRESET_MAP[DEFAULT_PRESET];
  const palette = React.useMemo(
    () => ({
      base: shadeColor(activeColor, 0.08),
      depth: shadeColor(activeColor, -0.12),
      highlight: shadeColor(activeColor, 0.22),
      glow: shadeColor(activeColor, 0.35),
      outline: shadeColor(activeColor, -0.35),
      outlineLight: shadeColor(activeColor, 0.45),
    }),
    [activeColor]
  );

  const selected = CLOUD_VARIANTS[variant] ?? CLOUD_VARIANTS.layered;
  const svgClasses = clsx(
    "cloud-svg",
    rounded ? "cloud-rounded" : "cloud-angular"
  );
  const wrapperClasses = clsx(
    "inline-flex select-none",
    withEffects && "cloud-float drop-shadow-[0_10px_0_rgba(15,23,42,0.18)]",
    className
  );

  const ariaLabel = (rest as React.AriaAttributes)["aria-label"];

  return (
    <div
      {...rest}
      className={wrapperClasses}
      style={{
        imageRendering: "pixelated",
        ...style,
      }}
      role={role ?? "img"}
      aria-label={ariaLabel}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        className={svgClasses}
        shapeRendering="crispEdges"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden={ariaLabel ? undefined : true}
      >
        {selected.facets.map((facet, index) => (
          <polygon
            key={`${variant}-${index}`}
            points={scalePoints(facet.points)}
            fill={palette[facet.shade]}
            opacity={facet.opacity ?? 1}
            stroke={rounded ? palette.outlineLight : palette.outline}
            strokeWidth={rounded ? 1.2 : 0.9}
            strokeLinejoin={rounded ? "round" : "miter"}
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {selected.sparkles.map((sparkle, index) => (
          <rect
            key={`sparkle-${variant}-${index}`}
            x={sparkle.x * VIEWBOX_WIDTH}
            y={sparkle.y * VIEWBOX_HEIGHT}
            width={sparkle.size}
            height={sparkle.size}
            fill={palette.glow}
            opacity={sparkle.opacity}
            stroke={palette.highlight}
            strokeWidth={0.6}
            transform={`rotate(45 ${
              sparkle.x * VIEWBOX_WIDTH + sparkle.size / 2
            } ${sparkle.y * VIEWBOX_HEIGHT + sparkle.size / 2})`}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    </div>
  );
}
