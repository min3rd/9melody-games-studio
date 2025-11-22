"use client";
import React, { useLayoutEffect, useRef, useState } from 'react';
import { PRESET_MAP, type Preset, INDICATOR_SIZE_CLASSES, AVATAR_SIZE_CLASSES, type UISize } from '../presets';

export type TimelineSize = UISize; // re-use UISize types (sm|md|lg)

export interface TimelineProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  orientation?: 'vertical' | 'horizontal';
}

export interface TimelineItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  preset?: Preset;
  color?: string; // custom color for dot or icon
  size?: TimelineSize;
  rounded?: boolean;
  withEffects?: boolean;
  status?: 'pending' | 'active' | 'done' | 'warning' | 'danger' | 'info';
  icon?: React.ReactNode;
  image?: string; // optional thumbnail
  heading?: React.ReactNode; // title/heading
  short?: React.ReactNode;
  description?: React.ReactNode;
  date?: React.ReactNode;
  /* Internal helper: should the connector below this item be colored (progress) */
  connectorBelow?: boolean;
  /* Internal helper: marker index assigned by parent for DOM data attribute */
  markerId?: number;
  orientation?: 'vertical' | 'horizontal';
}

// Intentionally define small marker inline in TimelineItem rather than a separate Dot component

export default function Timeline({ className = '', children, orientation = 'vertical', ...rest }: Readonly<TimelineProps>) {
  const olRef = useRef<HTMLOListElement | null>(null);
  const [segments, setSegments] = useState<Array<{ top: number; height: number; color?: string; left?: number; width?: number }>>([]);

  const childArray = React.Children.toArray(children).filter(Boolean) as React.ReactElement<TimelineItemProps>[];

  const cloned = childArray.map((child, i) => {
    const status = child.props.status ?? 'pending';
    const connectorBelow = i < childArray.length - 1 && (status === 'done' || status === 'active');
    // pass marker index that the child will use as a data attribute
    return React.isValidElement(child) ? React.cloneElement(child, { connectorBelow, markerId: i, orientation }) : child;
  });

  useLayoutEffect(() => {
    const el = olRef.current;
    if (!el) return;
  const nodes = Array.from(el.querySelectorAll('[data-timeline-marker]')) as HTMLElement[];
  const localChildArray = React.Children.toArray(children).filter(Boolean) as React.ReactElement<TimelineItemProps>[];
    if (!nodes.length) {
      // make async to avoid setting state synchronously inside effect body
      window.requestAnimationFrame(() => setSegments([]));
      return;
    }

      const rect = el.getBoundingClientRect();
      const HORIZONTAL_THICKNESS = 4;
      const newSegments: Array<{ top: number; height: number; color?: string; left?: number; width?: number } > = [];

    for (let i = 0; i < nodes.length - 1; i++) {
  const topEl = nodes[i];
  const bottomEl = nodes[i + 1];
      if (!topEl || !bottomEl) continue;
      const topRect = topEl.getBoundingClientRect();
      const bottomRect = bottomEl.getBoundingClientRect();
      const topCenterY = topRect.top + topRect.height / 2 - rect.top;
      const bottomCenterY = bottomRect.top + bottomRect.height / 2 - rect.top;
      const topCenterX = topRect.left + topRect.width / 2 - rect.left;
      const bottomCenterX = bottomRect.left + bottomRect.width / 2 - rect.left;
      let topPx = 0;
      let heightPx = 0;
      if (orientation === 'horizontal') {
        topPx = Math.round(topCenterY - HORIZONTAL_THICKNESS / 2);
        heightPx = HORIZONTAL_THICKNESS;
      } else {
        const topBottom = topCenterY + topRect.height / 2; // bottom of top dot
        const bottomTop = bottomCenterY - bottomRect.height / 2; // top of bottom dot
        topPx = Math.round(topBottom);
        heightPx = Math.max(0, Math.round(bottomTop - topBottom));
      }

  // Choose color from top element's status if present (matching index from data attribute)
      const topIndex = Number(topEl.getAttribute('data-timeline-marker')) ?? i;
      const bottomIndex = Number(bottomEl.getAttribute('data-timeline-marker')) ?? i + 1;
  const topChild = localChildArray[topIndex];
  const bottomChild = localChildArray[bottomIndex];
      const statusTop = topChild?.props?.status ?? 'pending';
      const statusBottom = bottomChild?.props?.status ?? 'pending';
      // decide coloring: prefer completed/active status from top, otherwise bottom
      let segColor: string | undefined;
      if (['done', 'active', 'warning', 'danger', 'info'].includes(statusTop)) {
        const statusPreset = STATUS_PRESET_MAP[statusTop] ?? 'muted';
        segColor = (topChild?.props?.color as string) ?? PRESET_MAP[topChild?.props?.preset ?? statusPreset];
      } else if (['done', 'active', 'warning', 'danger', 'info'].includes(statusBottom)) {
        const statusPreset = STATUS_PRESET_MAP[statusBottom] ?? 'muted';
        segColor = (bottomChild?.props?.color as string) ?? PRESET_MAP[bottomChild?.props?.preset ?? statusPreset];
      }
      if (segColor) {
        if (orientation === 'horizontal') {
          const leftPx = Math.round(Math.min(topCenterX, bottomCenterX));
          const widthPx = Math.max(0, Math.round(Math.abs(bottomCenterX - topCenterX)));
          newSegments.push({ top: topPx, height: heightPx, color: segColor, left: leftPx, width: widthPx });
        } else {
          newSegments.push({ top: topPx, height: heightPx, color: segColor, left: Math.round((topCenterX + bottomCenterX) / 2) - 1 });
        }
      }
    }

  // set async to avoid sync setState inside effect
  window.requestAnimationFrame(() => setSegments(newSegments));
    const onResize = () => {
      // recompute on resize
      const resizeRect = el.getBoundingClientRect();
    const newSegs: Array<{ top: number; height: number; color?: string; left?: number; width?: number } > = [];
      for (let i = 0; i < nodes.length - 1; i++) {
        const topRect = nodes[i].getBoundingClientRect();
        const bottomRect = nodes[i + 1].getBoundingClientRect();
        const topCenterY = topRect.top + topRect.height / 2 - resizeRect.top;
        const bottomCenterY = bottomRect.top + bottomRect.height / 2 - resizeRect.top;
        const topCenterX = topRect.left + topRect.width / 2 - resizeRect.left;
        const bottomCenterX = bottomRect.left + bottomRect.width / 2 - resizeRect.left;
        let topPx = 0;
        let heightPx = 0;
        if (orientation === 'horizontal') {
          topPx = Math.round(topCenterY - HORIZONTAL_THICKNESS / 2);
          heightPx = HORIZONTAL_THICKNESS;
        } else {
          const topBottom = topCenterY + topRect.height / 2;
          const bottomTop = bottomCenterY - bottomRect.height / 2;
          topPx = Math.round(topBottom);
          heightPx = Math.max(0, Math.round(bottomTop - topBottom));
        }
        const topIndex = Number(nodes[i].getAttribute('data-timeline-marker')) ?? i;
        const bottomIndex = Number(nodes[i + 1].getAttribute('data-timeline-marker')) ?? i + 1;
          const topChild = localChildArray[topIndex];
          const bottomChild = localChildArray[bottomIndex];
        const statusTop = topChild?.props?.status ?? 'pending';
        const statusBottom = bottomChild?.props?.status ?? 'pending';
        let segColorResize: string | undefined;
        if (['done', 'active', 'warning', 'danger', 'info'].includes(statusTop)) {
          const statusPreset = STATUS_PRESET_MAP[statusTop] ?? 'muted';
          segColorResize = (topChild?.props?.color as string) ?? PRESET_MAP[topChild?.props?.preset ?? statusPreset];
        } else if (['done', 'active', 'warning', 'danger', 'info'].includes(statusBottom)) {
          const statusPreset = STATUS_PRESET_MAP[statusBottom] ?? 'muted';
          segColorResize = (bottomChild?.props?.color as string) ?? PRESET_MAP[bottomChild?.props?.preset ?? statusPreset];
        }
        if (segColorResize) {
          if (orientation === 'horizontal') {
            const leftPx = Math.round(Math.min(topCenterX, bottomCenterX));
            const widthPx = Math.max(0, Math.round(Math.abs(bottomCenterX - topCenterX)));
            newSegs.push({ top: topPx, height: heightPx, color: segColorResize, left: leftPx, width: widthPx });
          } else {
            newSegs.push({ top: topPx, height: heightPx, color: segColorResize, left: Math.round((topCenterX + bottomCenterX) / 2) - 1 });
          }
        }
      }
      setSegments(newSegs);
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [children, orientation]);

  return (
    <ol ref={olRef} {...rest} className={`relative pl-12 space-y-6 ${className}`.trim()}>
      {/* overlay segments */}
      {segments.map((s, i) => (
        <span
          key={`seg-${i}`}
          aria-hidden
          className={s.width ? 'absolute h-1 rounded z-10' : 'absolute w-0.5 rounded z-10'}
          style={s.width ? { left: s.left, top: s.top, width: s.width, backgroundColor: s.color } : { top: s.top, height: s.height, left: s.left, backgroundColor: s.color }}
        />
      ))}
      {cloned}
    </ol>
  );
}

const STATUS_PRESET_MAP: Record<'pending' | 'active' | 'done' | 'warning' | 'danger' | 'info', Preset> = {
  pending: 'muted',
  active: 'primary',
  done: 'success',
  warning: 'warning',
  danger: 'danger',
  info: 'info',
};

export function TimelineItem({ preset = 'muted', color, size = 'md', rounded = true, withEffects = true, status = 'pending', markerId, icon, image, heading, short, description, date, className = '', ...rest }: Readonly<TimelineItemProps>) {
  // NOTE: `statusColor` is used for indicators; fall back to preset if needed
  // status color takes precedence if no explicit color set
  const statusPreset: Preset = STATUS_PRESET_MAP[status] ?? 'muted';
  const statusColor = color ?? PRESET_MAP[preset] ?? PRESET_MAP[statusPreset];
  const contentPadding = size === 'sm' ? 'px-2 py-1' : size === 'lg' ? 'px-4 py-3' : 'px-3 py-2';
  const imageSize = size === 'sm' ? AVATAR_SIZE_CLASSES.sm : size === 'lg' ? AVATAR_SIZE_CLASSES.lg : AVATAR_SIZE_CLASSES.md;
  const effectClass = withEffects ? 'hover:shadow-sm' : '';

  const dotStyle = { backgroundColor: statusColor, boxShadow: status === 'active' ? `0 0 0 6px ${statusColor}22` : undefined } as React.CSSProperties;
  // connectorHeight previously used by per-item connectors (not used now)

  const markerRef = useRef<HTMLDivElement | null>(null);

  return (
    <li {...rest} aria-current={status === 'active' ? 'step' : undefined} className={`relative grid grid-cols-[48px_1fr] grid-rows-[auto_1fr] gap-4 ${className}`.trim()}>
      <div ref={markerRef} data-timeline-marker={markerId !== undefined ? String(markerId) : undefined} className="relative z-20 col-start-1 row-start-1 flex items-center justify-center" aria-hidden>
        {/* indicator circle */}
  {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={(heading as string) ?? 'thumb'} className={`${imageSize} object-cover ${rounded ? 'rounded-full' : 'rounded-sm'} border-2 border-white dark:border-black`} />
          ) : icon ? (
          <div className={`inline-flex items-center justify-center ${INDICATOR_SIZE_CLASSES[size]} ${rounded ? 'rounded-full' : 'rounded-sm'}`} style={dotStyle}>
            {icon}
          </div>
        ) : (
          <div className={`inline-flex items-center justify-center ${INDICATOR_SIZE_CLASSES[size]} ${rounded ? 'rounded-full' : 'rounded-sm'}`} style={dotStyle}>
            {/* dot */}
            {status === 'done' && (
              <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        )}
        {/* per-item connector removed — overlay segments handle connectors between markers */}
      </div>

      <div className={`col-start-2 row-start-1 ${contentPadding} ${effectClass}`.trim()}>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            {heading && <div className="text-sm font-semibold">{heading}</div>}
            {short && <div className="text-xs text-neutral-500 dark:text-neutral-400">{short}</div>}
          </div>
          {date && <div className="text-xs text-neutral-500 dark:text-neutral-400">{date}</div>}
        </div>
      </div>
      {description && (
        <div className={`col-start-2 row-start-2 ${contentPadding} ${effectClass}`.trim()}>
          <div className="text-sm text-neutral-700 dark:text-neutral-200">{description}</div>
        </div>
      )}
    </li>
  );
}
