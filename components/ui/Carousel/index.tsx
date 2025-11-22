"use client";
import React, { useEffect, useRef, useState } from 'react';
import { PRESET_MAP, type Preset, ROUND_CLASSES } from '../presets';

export type CarouselSize = 'sm' | 'md' | 'lg';

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  preset?: Preset;
  color?: string;
  size?: CarouselSize;
  round?: boolean;
  autoNext?: boolean;
  autoDelay?: number; // ms
  pagination?: boolean;
  showControls?: boolean;
  prevIcon?: React.ReactNode;
  nextIcon?: React.ReactNode;
}

const SIZE_HEIGHT: Record<CarouselSize, string> = {
  sm: 'h-40',
  md: 'h-64',
  lg: 'h-96',
};

export default function Carousel({
  preset = 'muted',
  color,
  size = 'md',
  round = true,
  autoNext = false,
  autoDelay = 4000,
  pagination = true,
  showControls = true,
  prevIcon,
  nextIcon,
  children,
  className = '',
  ...rest
}: Readonly<CarouselProps>) {
  const slides = React.Children.toArray(children).filter(Boolean);
  const [index, setIndex] = useState(0);
  const count = slides.length;
  // No id needed; avoid calling impure functions during render
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!autoNext) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, Math.max(500, autoDelay));
    return () => clearInterval(timer);
  }, [autoNext, autoDelay, count]);

  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);

  const sizeClass = SIZE_HEIGHT[size];
  const roundClass = round ? ROUND_CLASSES.sm : ROUND_CLASSES.none;
  const bgColor = color ?? PRESET_MAP[preset];

  return (
    <div {...rest} className={`relative w-full ${sizeClass} ${roundClass} ${className}`.trim()} style={{ backgroundColor: bgColor }}>
      <div className="absolute inset-0 overflow-hidden">
        <div
          ref={containerRef}
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ width: `${count * 100}%`, transform: `translateX(-${index * (100 / count)}%)` }}
        >
          {slides.map((s, i) => (
            <div key={i} className="w-full flex-shrink-0 h-full">
              {s}
            </div>
          ))}
        </div>
      </div>

      {showControls && count > 1 && (
        <>
          <button aria-label="Previous" onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 rounded-full p-2">
            {prevIcon ?? (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
          </button>
          <button aria-label="Next" onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 rounded-full p-2">
            {nextIcon ?? (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
          </button>
        </>
      )}

      {pagination && count > 1 && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-2 flex gap-2">
          {Array.from({ length: count }).map((_, i) => (
            <button key={i} aria-label={`Go to slide ${i + 1}`} onClick={() => setIndex(i)} className={`w-2 h-2 rounded-full ${i === index ? 'bg-white dark:bg-neutral-200' : 'bg-white/50 dark:bg-black/40'}`} />
          ))}
        </div>
      )}
    </div>
  );
}
