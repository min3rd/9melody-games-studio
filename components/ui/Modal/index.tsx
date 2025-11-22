"use client";
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { PRESET_MAP, type Preset } from '../presets';
import ReactDOM from 'react-dom';

export interface ModalProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  open: boolean;
  onClose?: () => void;
  backdrop?: boolean; // show backdrop
  allowMove?: boolean; // draggable
  allowResize?: boolean; // resizable
  width?: number; // default width (px) - omit to auto-fit
  height?: number; // default height (px) - omit to auto-fit
  origin?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  animationDuration?: number; // ms
  initialTop?: number;
  initialLeft?: number;
  title?: React.ReactNode;
  preset?: Preset;
  color?: string;
}

export default function Modal({
  open,
  onClose,
  backdrop = true,
  allowMove = false,
  allowResize = false,
  width,
  height,
  initialTop = 100,
  initialLeft = 80,
  origin = 'center',
  animationDuration = 200,
  title,
  preset,
  color,
  children,
  ...rest
}: Readonly<ModalProps>) {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const portalRoot = useMemo(() => {
    if (typeof document === 'undefined') return null;
    let root = document.getElementById('modal-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'modal-root';
      document.body.appendChild(root);
    }
    return root;
  }, []);
  
  // Position and Size State
  // We use refs for values that change frequently during drag to avoid stale closures in event listeners,
  // but we also need state to trigger renders.
  const posRef = useRef({ x: initialLeft, y: initialTop });
  const sizeRef = useRef({ w: width, h: height });
  
  // Modal style state (avoid reading refs in render)
  const [modalStyleState, setModalStyleState] = useState<React.CSSProperties>(() => ({
    position: 'absolute',
    left: initialLeft,
    top: initialTop,
    width: width ?? 0,
    height: height ?? 0,
    transition: `opacity ${animationDuration}ms ease-out, transform ${animationDuration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
    transformOrigin: '50% 50%',
    opacity: 0,
    transform: `translate(0, 0) scale(0.95)`,
  }));

  // Drag/Resize Refs
  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const dragStart = useRef({ mouseX: 0, mouseY: 0, startX: 0, startY: 0 });
  const resizeStart = useRef({ mouseX: 0, mouseY: 0, startW: 0, startH: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  // Portals created during render (useMemo) — no effect/async state needed.

  // Handle Open/Close Animation Lifecycle
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let rafId: number;

    if (open) {
      rafId = requestAnimationFrame(() => {
        setMounted(true);
        rafId = requestAnimationFrame(() => {
          setActive(true);
        });
      });
      // Double RAF ensures the browser paints the "mounted" state (opacity 0) 
      // before applying the "active" state (opacity 1), triggering the transition.
    } else {
      rafId = requestAnimationFrame(() => setActive(false));
      // Wait for the transition to finish before removing from DOM
      timeoutId = setTimeout(() => {
        setMounted(false);
      }, animationDuration);
    }

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
    };
  }, [open, animationDuration]);

  // Auto-size logic: if width/height are not provided, measure content once mounted
  useEffect(() => {
    if (mounted && modalRef.current) {
      if (width === undefined) {
        sizeRef.current.w = modalRef.current.offsetWidth;
      } else {
        sizeRef.current.w = width;
      }
      if (height === undefined) {
        sizeRef.current.h = modalRef.current.offsetHeight;
      } else {
        sizeRef.current.h = height;
      }
      setModalStyleState((prev) => ({
        ...prev,
        left: posRef.current.x,
        top: posRef.current.y,
        width: sizeRef.current.w,
        height: sizeRef.current.h,
      }));
    }
  }, [mounted, width, height]);

  // Drag and Resize Event Handlers
  useEffect(() => {
    if (!allowMove && !allowResize) return;

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging.current && allowMove) {
        const dx = e.clientX - dragStart.current.mouseX;
        const dy = e.clientY - dragStart.current.mouseY;
        posRef.current.x = Math.max(0, dragStart.current.startX + dx);
        posRef.current.y = Math.max(0, dragStart.current.startY + dy);
        setModalStyleState((prev) => ({
          ...prev,
          left: posRef.current.x,
          top: posRef.current.y,
        }));
      }
      if (isResizing.current && allowResize) {
        const dx = e.clientX - resizeStart.current.mouseX;
        const dy = e.clientY - resizeStart.current.mouseY;
        sizeRef.current.w = Math.max(200, resizeStart.current.startW + dx);
        sizeRef.current.h = Math.max(100, resizeStart.current.startH + dy);
        setModalStyleState((prev) => ({
          ...prev,
          width: sizeRef.current.w,
          height: sizeRef.current.h,
        }));
      }
    };

    const onMouseUp = () => {
      isDragging.current = false;
      isResizing.current = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [allowMove, allowResize]);

  // Keyboard Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const onTitleMouseDown = (e: React.MouseEvent) => {
    if (!allowMove) return;
    // Prevent default to avoid text selection
    e.preventDefault(); 
    isDragging.current = true;
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: posRef.current.x,
      startY: posRef.current.y
    };
  };

  const onResizeMouseDown = (e: React.MouseEvent) => {
    if (!allowResize) return;
    e.preventDefault();
    e.stopPropagation();
    isResizing.current = true;
    resizeStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startW: sizeRef.current.w || 0,
      startH: sizeRef.current.h || 0
    };
  };

  if (!mounted || !portalRoot) return null;

  // Calculate Transform Origin and Initial Offsets for Animation
  const getOriginStyles = () => {
    switch (origin) {
      case 'top-left': return { origin: '0% 0%', translate: '-10px -10px' };
      case 'top-right': return { origin: '100% 0%', translate: '10px -10px' };
      case 'bottom-left': return { origin: '0% 100%', translate: '-10px 10px' };
      case 'bottom-right': return { origin: '100% 100%', translate: '10px 10px' };
      case 'center': default: return { origin: '50% 50%', translate: '0px 0px' };
    }
  };
  const { origin: tOrigin, translate: tTranslate } = getOriginStyles();

  // Dynamic Styles
  // derive the active style from the state and other props
  const modalStyle: React.CSSProperties = {
    ...modalStyleState,
    transformOrigin: tOrigin,
    transition: `opacity ${animationDuration}ms ease-out, transform ${animationDuration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
    opacity: active ? 1 : 0,
    transform: active ? 'translate(0, 0) scale(1)' : `translate(${tTranslate}) scale(0.95)`,
  };

  const backdropStyle: React.CSSProperties = {
    transition: `opacity ${animationDuration}ms ease-out`,
    opacity: active ? 1 : 0,
  };

  const themeColor = color ?? (preset ? PRESET_MAP[preset] : undefined);

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center" role="presentation">
      {/* Backdrop */}
      {backdrop && (
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          style={backdropStyle}
          onClick={onClose}
        />
      )}

      {/* Modal Window */}
      <div
        ref={modalRef}
        className="relative bg-white dark:bg-neutral-900 rounded shadow-lg overflow-hidden flex flex-col"
        style={modalStyle}
        role="dialog"
        aria-modal
        {...rest}
      >
        {/* Header / Title Bar */}
        <div
          className={`flex items-center justify-between gap-2 px-4 py-2 text-sm border-b border-neutral-200 dark:border-neutral-800 select-none ${allowMove ? 'cursor-grab active:cursor-grabbing' : ''}`}
          onMouseDown={onTitleMouseDown}
        >
          <div className="font-medium text-sm truncate">{title ?? 'Modal'}</div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="px-2 py-1 rounded text-xs transition-colors"
            style={{ background: themeColor ?? undefined, color: themeColor ? '#fff' : undefined }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-auto">
          {children}
        </div>

        {/* Resize Handle */}
        {allowResize && (
          <div
            className="absolute right-0 bottom-0 w-4 h-4 cursor-se-resize z-10 flex items-center justify-center"
            onMouseDown={onResizeMouseDown}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="opacity-50">
              <path d="M22 2L2 22" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
            </svg>
          </div>
        )}
      </div>
    </div>,
    portalRoot!
  );
}
