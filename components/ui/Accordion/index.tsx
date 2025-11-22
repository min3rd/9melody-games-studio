"use client";
import React, { useEffect, useRef, useState } from 'react';
import { PRESET_MAP, type Preset } from '../presets';

export type AccordionPreset = Preset;

export interface AccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  color?: string; // custom color (CSS value)
  preset?: AccordionPreset; // preset color
  open?: boolean; // controlled
  defaultOpen?: boolean; // uncontrolled initial
  onOpenChange?: (open: boolean) => void;
}

export default function Accordion({
  title,
  description,
  icon,
  disabled = false,
  color,
  preset,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
  className = '',
  ...rest
}: Readonly<AccordionProps>) {
  const isControlled = typeof openProp === 'boolean';
  const [open, setOpen] = useState<boolean>(isControlled ? !!openProp : !!defaultOpen);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isControlled) setOpen(!!openProp);
  }, [openProp, isControlled]);

  useEffect(() => {
    function onResize() {
      if (open && contentRef.current && containerRef.current) {
        containerRef.current.style.maxHeight = `${contentRef.current.scrollHeight}px`;
      }
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open]);

  useEffect(() => {
    if (containerRef.current && contentRef.current) {
      containerRef.current.style.transition = 'max-height 220ms cubic-bezier(.2,.9,.2,1), opacity 220ms ease';
      if (open) {
        containerRef.current.style.maxHeight = `${contentRef.current.scrollHeight}px`;
        containerRef.current.style.opacity = '1';
      } else {
        containerRef.current.style.maxHeight = '0px';
        containerRef.current.style.opacity = '0';
      }
    }
  }, [open, children]);

  function toggle() {
    if (disabled) return;
    const next = !open;
    if (!isControlled) setOpen(next);
    onOpenChange?.(next);
  }

  const presetColor = preset ? PRESET_MAP[preset] : undefined;
  const activeColor = color ?? presetColor ?? undefined;

  return (
    <div className={`${className} border rounded overflow-hidden bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800`} {...rest}>
      <button
        type="button"
        className={`w-full text-left px-4 py-3 flex items-center gap-3 ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} bg-transparent`}
        onClick={toggle}
        aria-expanded={open}
        aria-disabled={disabled}
        disabled={disabled}
      >
        {icon && (
          <div style={{ color: activeColor }} className="flex items-center justify-center w-6 h-6">
            {icon}
          </div>
        )}
        <div className="flex-1">
          {title && (
            <div className={`font-medium ${activeColor ? '' : 'text-neutral-900 dark:text-neutral-100'}`}>{title}</div>
          )}
          {description && <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{description}</div>}
        </div>

        <div
          className={`flex items-center justify-center transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          style={{ color: activeColor }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      <div ref={containerRef} style={{ maxHeight: open ? undefined : '0px', overflow: 'hidden', opacity: open ? 1 : 0 }}>
        <div ref={contentRef} className="px-4 py-3">
          {children}
        </div>
      </div>
    </div>
  );
}
