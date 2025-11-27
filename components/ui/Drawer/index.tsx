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
import { PRESET_MAP, type Preset } from "../presets";

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
}

const DrawerContext = createContext<DrawerContextValue | undefined>(undefined);

export function DrawerContainer({
  children,
  open = false,
  onClose,
  position = "right",
  mode = "over",
  width = 320,
  height = 280,
  backdrop,
  animationDuration = 220,
  preset,
  color,
  className,
}: React.PropsWithChildren<
  Partial<DrawerContextValue> & { className?: string }
>) {
  const [internalOpen, setInternalOpen] = useState(Boolean(open));

  useEffect(() => {
    setInternalOpen(Boolean(open));
  }, [open]);

  const effectiveBackdrop =
    typeof backdrop === "boolean" ? backdrop : mode === "over";
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
  };

  // Container layout depending on position and mode. For `side` mode, we use flex layout
  // so the drawer consumes space and shifts content. For `over` mode the drawer is absolute.
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
          <div className={`${containerClasses} w-full h-full relative`}>
            {
              // Render backdrop for 'over' mode as an overlay sibling when open
            }
            {mode === "over" && backdrop && open && (
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                style={{ zIndex: 40 }}
                onClick={onClose}
              ></div>
            )}
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
      style.width = open ? w : 0;
    } else {
      style.height = open ? h : 0;
    }
  } else {
    // over
    if (position === "right") style.right = 0;
    if (position === "left") style.left = 0;
    if (position === "top") style.top = 0;
    if (position === "bottom") style.bottom = 0;
    if (isHorizontal) style.width = w;
    else style.height = h;
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

  const panelBaseClass = `relative bg-white dark:bg-neutral-900 ${
    isSide ? "shadow-none" : "shadow-xl"
  } ${className ?? ""}`;

  // Adjust order to place panel before/after content for side layouts
  const orderStyle: React.CSSProperties = {};
  if (isSide) {
    if (position === "right" || position === "bottom") orderStyle.order = 2;
    else orderStyle.order = 0;
  }

  return (
    <div
      className={baseClass}
      style={{ ...style, ...orderStyle }}
      aria-hidden={!open}
    >
      <div className={panelBaseClass}>
        <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200 dark:border-neutral-800">
          <div className="text-sm font-medium">
            {rest["aria-label"] ?? "Drawer"}
          </div>
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
        <div className="p-4">{children}</div>
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
