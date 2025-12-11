"use client";
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import ReactDOM from "react-dom";
import { PRESET_MAP, type Preset, type Pattern } from "../presets";
import PatternOverlay from "../patterns";

export interface DrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose?: () => void;
  position?: "right" | "left" | "top" | "bottom";
  mode?: "over" | "side";
  width?: number | string; // px or css
  height?: number | string;
  backdrop?: boolean;
  animationDuration?: number; // ms
  preset?: Preset;
  color?: string;
  pattern?: Pattern;
}

// Very small helper to normalize width/height
function sizeToCss(v?: number | string) {
  if (v === undefined) return undefined;
  if (typeof v === "number") return `${v}px`;
  return v;
}

// New Context-based Drawer components for container-based layout
interface DrawerContextValue {
  open: boolean;
  onClose?: () => void;
  position: "left" | "right" | "top" | "bottom";
  mode: "over" | "side";
  width?: number | string;
  height?: number | string;
  backdrop?: boolean;
  animationDuration?: number;
  preset?: Preset;
  color?: string;
  pattern?: Pattern;
  overlayElement?: HTMLElement | null;
}

const DrawerContext = createContext<DrawerContextValue | undefined>(undefined);

export function DrawerContainer({
  children,
  open = false,
  onClose,
  position = "right",
  mode = "over",
  width,
  height,
  backdrop,
  animationDuration = 220,
  preset,
  color,
  pattern,
  className,
}: React.PropsWithChildren<
  Partial<DrawerContextValue> & { className?: string }
>) {
  const [internalOpen, setInternalOpen] = useState(Boolean(open));

  useEffect(() => setInternalOpen(Boolean(open)), [open]);

  const effectiveBackdrop = typeof backdrop === "boolean" ? backdrop : mode === "over";
  const overlayRootRef = useRef<HTMLDivElement | null>(null);
  const overlayPanelRef = useRef<HTMLDivElement | null>(null);
  const ctx: DrawerContextValue = {
    open: internalOpen,
    onClose: onClose ?? (() => setInternalOpen(false)),
    position,
    mode,
    width,
    height,
    backdrop: effectiveBackdrop,
    animationDuration,
    preset,
    color,
    pattern,
    overlayElement: overlayPanelRef.current,
  };

  const isSide = mode === "side";
  const isHorizontal = position === "left" || position === "right";
  const containerClasses = isSide
    ? isHorizontal
      ? "flex flex-row"
      : "flex flex-col"
    : "relative";

  return (
    <div className={`relative ${className ?? ""}`}>
      <DrawerContext.Provider value={ctx}>
        {
          <div className={`${containerClasses} w-full h-full relative ${mode === 'over' ? 'overflow-hidden' : ''}`}>
            <div ref={overlayRootRef} className={`absolute inset-0 z-40 pointer-events-none`}> 
              {mode === 'over' && effectiveBackdrop && internalOpen && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={ctx.onClose} />
              )}
              <div
                ref={overlayPanelRef}
                className={`absolute inset-0 z-50 ${mode === 'over' && internalOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
              />
            </div>
              {children}
          </div>
        }
      </DrawerContext.Provider>
    </div>
  );
}

export function Drawer({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const ctx = useContext(DrawerContext);
  const {
    open,
    position,
    mode,
    width,
    height,
    backdrop,
    onClose,
    animationDuration,
    preset,
    color,
    overlayElement,
  } = ctx as any;
  const w = sizeToCss(width);
  const h = sizeToCss(height);
  const isHorizontal = position === "left" || position === "right";
  const isSide = mode === "side";

  // Transition style
  const transition = `transform ${animationDuration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${animationDuration}ms ease-out, width ${animationDuration}ms ease`;

  const baseClass = isSide ? "flex-none overflow-hidden" : "absolute z-50";

  // Side mode uses layout sizing; over mode uses absolute transforms
  let style: React.CSSProperties = { transition };
  if (isSide) {
    if (isHorizontal) {
      style.width = open ? (w ?? 'auto') : 0;
      style.height = '100%';
    } else {
      style.height = open ? (h ?? 'auto') : 0;
      style.width = '100%';
    }
    // Avoid side drawers affecting layout when closed by hiding element.
    // This prevents padding or borders from leaving a residual size when width/height is 0.
    if (!open) {
      style.display = 'none';
      // enforce zero size & no min width/height in case CSS elsewhere sets them
      if (isHorizontal) {
        style.width = 0;
        style.minWidth = 0;
      } else {
        style.height = 0;
        style.minHeight = 0;
      }
    }
  } else {
    // over
    if (position === "right") style.right = 0;
    if (position === "left") style.left = 0;
    if (position === "top") style.top = 0;
    if (position === "bottom") style.bottom = 0;
    if (isHorizontal) style.width = w ?? 'auto';
    else style.height = h ?? 'auto';
    // Fill container cross-axis. Use top/bottom for more reliable stretch in container
    style.top = 0;
    style.bottom = 0;
    if (isHorizontal) style.width = w ?? 'auto';
    else style.height = h ?? 'auto';
    style.transform =
      position === "right"
        ? open
          ? "translateX(0)"
          : "translateX(100%)"
        : position === "left"
        ? open
          ? "translateX(0)"
          : "translateX(-100%)"
        : position === "top"
        ? open
          ? "translateY(0)"
          : "translateY(-100%)"
        : open
        ? "translateY(0)"
        : "translateY(100%)";
  }

  const panelBaseClass = `relative bg-white dark:bg-neutral-900 box-border ${isSide ? "shadow-none" : "shadow-xl"} ${isHorizontal ? 'h-full' : 'w-full'} ${className ?? ""}`;
  
  const patternClass = pattern ? `drawer-pattern-${pattern}` : '';
  const patternStyle = pattern === 'pixel' 
    ? { backgroundColor: '#071028', color: '#fff' }
    : pattern === 'neon'
    ? { backgroundColor: '#05060a', color: '#fff' }
    : pattern === 'pixel3d'
    ? { backgroundColor: '#1a1a2e', color: '#fff' }
    : pattern === 'bubble'
    ? { backgroundColor: 'transparent', color: '#fff' }
    : {};
  
  const drawerRef = useRef<HTMLDivElement | null>(null);

  // Adjust order to place panel before/after content for side layouts
  const orderStyle: React.CSSProperties = {};
  if (isSide) {
    if (position === "right" || position === "bottom") orderStyle.order = 2;
    else orderStyle.order = 0;
  }

  // split children into header/body/footer if provided
  const childArray = React.Children.toArray(children);
  function isType(el: React.ReactNode, name: string) {
    return React.isValidElement(el) && (((el.type as any).displayName === name) || ((el.type as any).name === name));
  }
  const headerChild = childArray.find((c) => isType(c, 'DrawerHeader')) as React.ReactElement | undefined;
  const footerChild = childArray.find((c) => isType(c, 'DrawerFooter')) as React.ReactElement | undefined;
  const bodyChildren = childArray.filter((c) => !isType(c, 'DrawerHeader') && !isType(c, 'DrawerFooter'));

  // Portal into overlayElement when 'over' mode to ensure overlay is clipped to container
  if (mode === 'over' && overlayElement) {
    const overlayContent = (
      <div
        className={baseClass}
        style={{ ...style, ...orderStyle }}
        aria-hidden={!open}
      >
        <div ref={drawerRef} className={`${panelBaseClass} ${patternClass} overflow-hidden`} style={pattern ? patternStyle : {}}>
          {pattern && (
            <PatternOverlay 
              pattern={pattern} 
              wrapperRef={drawerRef} 
              activeColor={color ?? (preset ? PRESET_MAP[preset] : undefined)}
              classPrefix="drawer" 
            />
          )}
          <div className={`flex flex-col h-full relative z-10 ${pattern ? 'text-white' : ''}`}>
            {headerChild ? (
              headerChild
            ) : (
              <div className={`flex items-center justify-between px-4 py-2 border-b ${pattern ? 'border-white/20' : 'border-neutral-200 dark:border-neutral-800'}`}>
                <div className="text-sm font-medium">{rest['aria-label'] ?? 'Drawer'}</div>
                <div className="flex items-center gap-2">
                  <button
                    aria-label="Close"
                    onClick={onClose}
                    className="px-2 py-1 text-xs rounded-sm transition-colors"
                    style={color ? { background: color, color: '#fff' } : undefined}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-auto">{bodyChildren}</div>

            {footerChild && <div className={`border-t ${pattern ? 'border-white/20' : 'border-neutral-200 dark:border-neutral-800'}`}>{footerChild}</div>}
          </div>
        </div>
      </div>
    );
    return ReactDOM.createPortal(overlayContent, overlayElement as HTMLElement);
  }

  return (
    <div
      className={baseClass}
      style={{ ...style, ...orderStyle }}
      aria-hidden={!open}
    >
      <div ref={drawerRef} className={`${panelBaseClass} ${patternClass} overflow-hidden`} style={pattern ? patternStyle : {}}>
        {pattern && (
          <PatternOverlay 
            pattern={pattern} 
            wrapperRef={drawerRef} 
            activeColor={color ?? (preset ? PRESET_MAP[preset] : undefined)}
            classPrefix="drawer" 
          />
        )}
        <div className={`flex flex-col h-full relative z-10 ${pattern ? 'text-white' : ''}`}>
        {headerChild ? (
          headerChild
        ) : (
          <div className={`flex items-center justify-between px-4 py-2 border-b ${pattern ? 'border-white/20' : 'border-neutral-200 dark:border-neutral-800'}`}>
            <div className="text-sm font-medium">{rest["aria-label"] ?? "Drawer"}</div>
            <div className="flex items-center gap-2">
              <button
                aria-label="Close"
                onClick={onClose}
                className="px-2 py-1 text-xs rounded-sm transition-colors"
                style={color ? { background: color, color: "#fff" } : undefined}
              >
                ✕
              </button>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-auto p-4">{bodyChildren}</div>
        {footerChild && <div className={`border-t ${pattern ? 'border-white/20' : 'border-neutral-200 dark:border-neutral-800'}`}>{footerChild}</div>}
        </div>
      </div>
      {/* Backdrop for over mode is handled by DrawerContainer to span the full container */}
    </div>
  );
}

export function DrawerContent({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const ctx = useContext(DrawerContext);
  // When in `side` mode the layout is managed automatically by flex; allow content to grow
  const style: React.CSSProperties = {};
  if (ctx && ctx.mode === "side") {
    if (ctx.position === "right" || ctx.position === "bottom") {
      style.order = 0;
    } else {
      style.order = 1;
    }
  }
  return (
    <div className={`flex-1 ${className ?? ""}`} style={style} {...rest}>
      {children}
    </div>
  );
}

// Export the Drawer panel as the default (preferred API)
export default Drawer;

// (DrawerContainer and DrawerContent are above as the new API)

// Small header/footer/body helper components for composition
export function DrawerHeader({ children, className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 ${className ?? ""}`} {...rest}>
      {children}
    </div>
  );
}
DrawerHeader.displayName = 'DrawerHeader';

export function DrawerFooter({ children, className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-4 py-2 border-t border-neutral-200 dark:border-neutral-800 ${className ?? ""}`} {...rest}>
      {children}
    </div>
  );
}
DrawerFooter.displayName = 'DrawerFooter';

export function DrawerBody({ children, className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex-1 overflow-auto p-4 ${className ?? ""}`} {...rest}>
      {children}
    </div>
  );
}
DrawerBody.displayName = 'DrawerBody';
