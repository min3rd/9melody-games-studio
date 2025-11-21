"use client";
import React, { useEffect, useRef, useState } from 'react';
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
}

export default function Modal({
  open,
  onClose,
  backdrop = true,
  allowMove = false,
  allowResize = false,
  width = 600,
  height = 300,
  initialTop = 100,
  initialLeft = 80,
  origin = 'center',
  animationDuration: animationDurationProp,
  title,
  children,
  ...rest
}: Readonly<ModalProps>) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const posRef = useRef({ left: initialLeft, top: initialTop });
  const sizeRef = useRef({ w: width ?? 0, h: height ?? 0 });
  const draggingRef = useRef(false);
  const resizingRef = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ w: 0, h: 0, x: 0, y: 0 });
  const [, setTick] = useState(0); // for re-render
  const animationDuration = typeof animationDurationProp === 'number' ? animationDurationProp : 140; // ms
  const [visible, setVisible] = useState(open);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // ensure root exists
    const el = document.getElementById('modal-root');
    if (!el) {
      const root = document.createElement('div');
      root.id = 'modal-root';
      document.body.appendChild(root);
    }
  }, []);

  // When the modal first becomes visible, if autosize (no width/height) is used,
  // compute size based on content after mount.
  useEffect(() => {
    if (!visible) return;
    const el = modalRef.current;
    if (!el) return;
    // Only compute if width/height weren't provided
    if (!width) {
      sizeRef.current.w = el.offsetWidth;
    }
    if (!height) {
      sizeRef.current.h = el.offsetHeight;
    }
    // trigger render update to apply sizes
    setTick((t) => t + 1);
  }, [visible]);

  useEffect(() => {
    if (open) {
      setVisible(true);
      setClosing(false);
    } else if (visible) {
      // start closing animation and unmount after animation completes
      setClosing(true);
      const id = setTimeout(() => {
        setVisible(false);
        setClosing(false);
      }, animationDuration + 10);
      return () => clearTimeout(id);
    }
    return;
  }, [open, visible]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) {
        onClose?.();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (draggingRef.current && allowMove) {
        const x = e.clientX - dragOffset.current.x;
        const y = e.clientY - dragOffset.current.y;
        posRef.current.left = Math.max(8, x);
        posRef.current.top = Math.max(8, y);
        setTick((t) => t + 1);
      }
      if (resizingRef.current && allowResize) {
        const dx = e.clientX - resizeStart.current.x;
        const dy = e.clientY - resizeStart.current.y;
        sizeRef.current.w = Math.max(200, resizeStart.current.w + dx);
        sizeRef.current.h = Math.max(100, resizeStart.current.h + dy);
        setTick((t) => t + 1);
      }
    }

    function onMouseUp() {
      draggingRef.current = false;
      resizingRef.current = false;
      // commit position / size
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [allowMove, allowResize]);

  function onTitlePointerDown(e: React.PointerEvent) {
    if (!allowMove) return;
    draggingRef.current = true;
    dragOffset.current = {
      x: e.clientX - posRef.current.left,
      y: e.clientY - posRef.current.top,
    };
  }

  function onResizePointerDown(e: React.PointerEvent) {
    if (!allowResize) return;
    resizingRef.current = true;
    resizeStart.current = {
      w: sizeRef.current.w,
      h: sizeRef.current.h,
      x: e.clientX,
      y: e.clientY,
    };
    e.stopPropagation();
  }

  if (!visible) return null;

  const modalStyle: React.CSSProperties = {
    left: posRef.current.left,
    top: posRef.current.top,
    ...(width ? { width: `${sizeRef.current.w}px` } : {}),
    ...(height ? { height: `${sizeRef.current.h}px` } : {}),
  };

  const { transformOrigin, translateX, translateY } = (() => {
    switch (origin) {
      case 'top-left':
        return { transformOrigin: '0 0', translateX: '-8px', translateY: '-8px' };
      case 'top-right':
        return { transformOrigin: '100% 0', translateX: '8px', translateY: '-8px' };
      case 'bottom-left':
        return { transformOrigin: '0 100%', translateX: '-8px', translateY: '8px' };
      case 'bottom-right':
        return { transformOrigin: '100% 100%', translateX: '8px', translateY: '8px' };
      case 'center':
      default:
        return { transformOrigin: '50% 50%', translateX: '0px', translateY: '0px' };
    }
  })();

  const content = (
    <div
      ref={rootRef}
      className="fixed inset-0 z-50 flex items-start justify-center"
      role="presentation"
    >
      {backdrop && (
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity ${closing ? 'animate-backdropOut' : 'animate-backdropIn'}`}
          style={{ animation: `${closing ? 'fadeOut' : 'fadeIn'} .12s ease` }}
          onClick={() => onClose?.()}
        />
      )}

      <div
        ref={modalRef}
        className={`relative bg-white dark:bg-neutral-900 rounded shadow-lg overflow-hidden transition-transform transform ${closing ? 'opacity-0' : 'opacity-100'} ${closing ? 'animate-modalClose' : 'animate-modalOpen'}`}
        style={{ ...modalStyle, position: 'absolute', transformOrigin: transformOrigin, ["--modal-init-translate-x" as any]: translateX, ["--modal-init-translate-y" as any]: translateY }}
        role="dialog"
        aria-modal
        {...rest}
      >
        <div
          className={`flex items-center justify-between gap-2 px-4 py-2 text-sm border-b border-neutral-200 dark:border-neutral-800 ${allowMove ? 'cursor-grab' : 'cursor-default'}`}
          onPointerDown={onTitlePointerDown}
        >
          <div className="font-medium text-sm">{title ?? 'Modal'}</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onClose?.()}
              aria-label="Close"
              className="px-2 py-1 rounded text-xs bg-neutral-100 dark:bg-neutral-800"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-4 overflow-auto h-[calc(100%-48px)]">{children}</div>

        {allowResize && (
          <div
            className="absolute right-0 bottom-0 w-4 h-4 cursor-se-resize z-10"
            onPointerDown={onResizePointerDown}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="opacity-60">
              <path d="M3 21L21 3" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes modalOpen { from { opacity: 0; transform: translate(var(--modal-init-translate-x), var(--modal-init-translate-y)) scale(.86); } to { opacity: 1; transform: translate(0, 0) scale(1); } }
        @keyframes modalClose { from { opacity: 1; transform: translate(0, 0) scale(1); } to { opacity: 0; transform: translate(var(--modal-init-translate-x), var(--modal-init-translate-y)) scale(.86); } }
        .animate-modalOpen { animation: modalOpen ${animationDuration}ms cubic-bezier(.2,.9,.2,1) forwards; }
        .animate-modalClose { animation: modalClose ${animationDuration}ms cubic-bezier(.2,.9,.2,1) forwards; }
        @keyframes backdropIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes backdropOut { from { opacity: 1; } to { opacity: 0; } }
        .animate-backdropIn { animation: backdropIn ${animationDuration}ms linear forwards; }
        .animate-backdropOut { animation: backdropOut ${animationDuration}ms linear forwards; }
      `}</style>
    </div>
  );

  const root = document.getElementById('modal-root')!;
  return ReactDOM.createPortal(content, root);
}
