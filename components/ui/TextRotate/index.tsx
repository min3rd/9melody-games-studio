"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { PRESET_MAP, type Preset, PILL_PADDING_MAP, type UISize } from '../presets';

export interface TextRotateProps extends React.HTMLAttributes<HTMLDivElement> {
  items: Array<React.ReactNode | string>;
  interval?: number; // ms
  animation?: 'slide' | 'fade' | 'flip';
  direction?: 'up' | 'down';
  size?: UISize;
  preset?: Preset;
  color?: string;
  rounded?: boolean;
  withEffects?: boolean;
  loop?: boolean;
  pauseOnHover?: boolean;
  fontFamily?: string;
  textSize?: 'sm' | 'md' | 'lg' | string;
  backgroundColor?: string;
}

export default function TextRotate({
  items,
  interval = 2000,
  animation = 'slide',
  direction = 'up',
  size = 'md',
  textSize = 'md',
  fontFamily,
  preset = 'muted',
  color,
  rounded = true,
  withEffects = true,
  loop = true,
  pauseOnHover = true,
  className = '',
  backgroundColor,
  ...rest
}: Readonly<TextRotateProps>) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const itemsCount = items?.length ?? 0;
  const mounted = useRef(false);

  const displayColor = color ?? PRESET_MAP[preset];
  const padding = PILL_PADDING_MAP[size];
  const transitionClass = withEffects ? 'transition-transform duration-300 ease-in-out' : '';
  const textSizeClass = textSize === 'sm' ? 'text-sm' : textSize === 'lg' ? 'text-3xl' : 'text-base';

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!itemsCount || (itemsCount <= 1)) return;
    if (paused) return;
  let id: number | undefined = undefined;
  id = window.setInterval(() => {
      setIndex((i) => {
        if (i + 1 >= itemsCount) {
          return loop ? 0 : i; // if not looping stop at final
        }
        return i + 1;
      });
    }, interval);
    return () => { if (typeof id !== 'undefined') window.clearInterval(id); };
  }, [itemsCount, interval, paused, loop]);

  const onMouseEnter = () => {
    if (pauseOnHover) setPaused(true);
  };
  const onMouseLeave = () => {
    if (pauseOnHover) setPaused(false);
  };

  const active = index % (itemsCount || 1);

  const content = useMemo(() => {
    if (!itemsCount) return null;
    return items.map((it, i) => {
      const isActive = i === active;
  const baseStyle = clsx('absolute left-0 right-0 flex items-center justify-start', padding, rounded ? 'rounded-sm' : 'rounded-none', textSizeClass);
  const colorStyle = { color: displayColor } as React.CSSProperties;
  if (fontFamily) colorStyle.fontFamily = fontFamily;
      let style: React.CSSProperties = { ...colorStyle };
      let classNames = baseStyle;

      if (animation === 'fade') {
        classNames = clsx(classNames, 'opacity-0', isActive && 'opacity-100');
        style = { ...style, transition: withEffects ? 'opacity 300ms ease' : undefined };
      } else if (animation === 'slide') {
        const translateY = isActive ? 0 : direction === 'up' ? 20 : -20;
        classNames = clsx(classNames, transitionClass);
        style = { ...style, transform: `translateY(${translateY}px)`, opacity: isActive ? 1 : 0 };
      } else if (animation === 'flip') {
        classNames = clsx(classNames, 'transform-gpu', isActive ? 'rotate-x-0' : 'rotate-x-90');
        style = { ...style, transition: withEffects ? 'transform 300ms ease, opacity 300ms ease' : undefined, opacity: isActive ? 1 : 0 };
      }

      return (
        <div role="presentation" aria-hidden={!isActive} key={`rot-${i}`} style={style} className={classNames}>
          {it}
        </div>
      );
    });
  }, [items, active, animation, padding, displayColor, direction, rounded, withEffects, transitionClass, itemsCount, fontFamily, textSizeClass]);

  if (!itemsCount) return null;

  const wrapperStyle: React.CSSProperties = { backgroundColor: backgroundColor ?? undefined } as React.CSSProperties;

  return (
    <div {...rest} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={clsx('relative overflow-hidden', className)} style={wrapperStyle}>
      <div className="relative min-h-[1.4rem]">
        {content}
      </div>
      <div aria-live="polite" className="sr-only" role="status">
        {String(items[active])}
      </div>
    </div>
  );
}
