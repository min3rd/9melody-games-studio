"use client";
import React, { useId, useState, useMemo, useRef, useEffect } from "react";
import clsx from "clsx";
import { PRESET_MAP, type Preset, BUTTON_SIZE_CLASSES, ROUND_CLASSES, type UISize } from "../presets";

export interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  preset?: Preset;
  color?: string;
  size?: UISize;
  variant?: 'solid' | 'ghost' | 'outline' | 'none';
  pattern?: 'pixel' | 'neon' | 'bubble' | 'pixel3d';
  rounded?: keyof typeof ROUND_CLASSES;
  withEffects?: boolean;
  clearable?: boolean; // shows clear button when true
}

export default function TextInput({
  value: valueProp,
  defaultValue,
  onValueChange,
  label,
  hint,
  error,
  prefix,
  suffix,
  preset = 'muted',
  color,
  size = 'md',
  variant = 'solid',
  rounded = 'sm',
  withEffects = true,
  clearable = false,
  pattern,
  id: idProp,
  className = '',
  disabled = false,
  ...rest
}: Readonly<TextInputProps>) {
  const id = idProp ?? useId();
  const isControlled = typeof valueProp !== 'undefined';
  const [valueState, setValueState] = useState<string | undefined>(defaultValue);
  const value = isControlled ? valueProp : valueState;

  const presetColor = preset ? PRESET_MAP[preset] : undefined;
  const activeColor = color ?? presetColor ?? PRESET_MAP['primary'];

  const sizeClass = BUTTON_SIZE_CLASSES[size] ?? BUTTON_SIZE_CLASSES.md;
  const roundClass = ROUND_CLASSES[rounded] ?? ROUND_CLASSES.sm;

  const variantClasses: Record<'solid' | 'ghost' | 'outline' | 'none', string> = {
    solid: 'bg-white dark:bg-neutral-800 border border-transparent',
    ghost: 'bg-transparent border border-neutral-300 dark:border-neutral-700',
    outline: 'bg-transparent border border-neutral-300 dark:border-neutral-700',
    none: 'bg-transparent border-none',
  };

  const patternClass = pattern === 'pixel' ? 'input-pattern-pixel' : pattern === 'neon' ? 'input-pattern-neon' : pattern === 'bubble' ? 'input-pattern-bubble' : pattern === 'pixel3d' ? 'input-pattern-pixel3d' : '';

  function handleChange(next: string) {
    if (!isControlled) setValueState(next);
    onValueChange?.(next);
  }

  function clear() {
    handleChange('');
    const e = document.getElementById(id) as HTMLInputElement | null;
    e?.focus();
  }

  const effectClass = withEffects ? 'transition duration-150 ease-in-out' : '';

  const base = clsx('inline-flex items-center gap-2 w-full', roundClass, className);

  const inputWrapper = clsx(
    'flex items-center w-full relative overflow-hidden',
    'border border-neutral-200 dark:border-neutral-700',
    sizeClass,
    roundClass,
    effectClass,
    variantClasses[variant],
    patternClass,
    disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-text'
  );

  const inputStyle = variant === 'solid'
    ? { backgroundColor: activeColor, color: '#ffffff', borderColor: 'transparent' }
    : variant === 'ghost'
      ? { color: activeColor, borderColor: activeColor }
      : variant === 'outline'
        ? { color: activeColor, borderColor: activeColor }
        : undefined;

  const inputId = id;

  // dynamic measurement for tile grid to fully cover wrapper
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [tileCols, setTileCols] = useState(12);
  const [tileRows, setTileRows] = useState(2);
  const [tileCount, setTileCount] = useState(24);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const el = wrapperRef.current;
    const ro = new ResizeObserver(() => {
      const styles = window.getComputedStyle(el);
      const tileSizeStr = styles.getPropertyValue('--input-pattern-size') || '6px';
      const tileSize = parseFloat(tileSizeStr);
      const rect = el.getBoundingClientRect();
      const cols = Math.max(1, Math.ceil(rect.width / tileSize));
      const rows = Math.max(1, Math.ceil(rect.height / tileSize));
      setTileCols(cols);
      setTileRows(rows);
      setTileCount(cols * rows + cols); // add extra row to ensure full coverage
    });
    ro.observe(el);
    // initialize once
    ro.disconnect();
    ro.observe(el);
    return () => ro.disconnect();
  }, [wrapperRef]);

  const tiles = useMemo(() => {
    return Array.from({ length: tileCount }).map((_, i) => ({ id: i, delay: Math.random() * 1.8, opacity: 0.5 + Math.random() * 0.5, duration: 800 + Math.random() * 1200 }));
  }, [tileCount]);

  // Neon pattern: dynamic neon pixel tiles that spawn randomly and fade out
  type NeonTile = { id: number; left: number; top: number; size: number; duration: number; delay: number };
  const [neonTiles, setNeonTiles] = useState<NeonTile[]>([]);
  const neonTileId = useRef(0);

  useEffect(() => {
    if (pattern !== 'neon' || !wrapperRef.current) {
      setNeonTiles([]);
      return;
    }

    let cancelled = false;
    const spawn = () => {
      if (cancelled) return;
      const id = neonTileId.current++;
      const left = Math.round(Math.random() * 92 * 100) / 100; // percent
      const top = Math.round(Math.random() * 72 * 100) / 100; // percent - keep inside top area
      const delay = Math.random() * 0.8; // seconds (used as animationDelay - negative for immediate stagger)
      const size = Math.round((4 + Math.random() * 10) * 10) / 10; // px
      const duration = 700 + Math.round(Math.random() * 1000);
      const tile: NeonTile = { id, left, top, size, duration, delay };
      setNeonTiles(s => [...s, tile]);

      // remove after duration
      const timeoutId = setTimeout(() => {
        setNeonTiles(s => s.filter(t => t.id !== id));
      }, duration + 80);

      // schedule next spawn at a random interval
      const next = 220 + Math.random() * 420;
      setTimeout(() => spawn(), next);
      // ensure cleanup for timeout
      return () => clearTimeout(timeoutId);
    };

    // initial spawn set
    const initialTimers: any[] = [];
    for (let i = 0; i < 2; i++) {
      const t = setTimeout(spawn, 80 * i);
      initialTimers.push(t);
    }

    return () => {
      cancelled = true;
      initialTimers.forEach((t) => clearTimeout(t));
      setNeonTiles([]);
    };
  }, [pattern, wrapperRef, activeColor]);

  // Bubble pattern: interactive bubbles on hover + automatic floating bubbles
  type Bubble = { id: number; x: number; y: number; size: number; duration: number; color: string; isHover?: boolean };
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const bubbleId = useRef(0);
  const bubbleColors = ['#ff69b4', '#ff1493', '#ff6b9d', '#ff8c94', '#ff4757', '#ff6348', '#ffa502', '#ff7675'];

  useEffect(() => {
    if (pattern !== 'bubble' || !wrapperRef.current) {
      setBubbles([]);
      return;
    }

    let cancelled = false;

    // Spawn automatic floating bubbles from bottom
    const spawnFloating = () => {
      if (cancelled) return;
      const id = bubbleId.current++;
      const x = Math.random() * 100; // percent
      const y = 100; // start from bottom
      const size = 10 + Math.random() * 30; // 10-40px
      const duration = 2000 + Math.random() * 3000; // 2-5s
      const color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
      const bubble: Bubble = { id, x, y, size, duration, color };
      
      setBubbles(s => [...s, bubble]);

      // Remove after duration
      setTimeout(() => {
        if (!cancelled) setBubbles(s => s.filter(b => b.id !== id));
      }, duration);

      // Schedule next
      const next = 800 + Math.random() * 1200;
      setTimeout(() => spawnFloating(), next);
    };

    // Start spawning
    const initialTimer = setTimeout(spawnFloating, 200);

    return () => {
      cancelled = true;
      clearTimeout(initialTimer);
      setBubbles([]);
    };
  }, [pattern]);

  // Handle mouse move for hover bubbles
  const handleBubbleHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (pattern !== 'bubble' || !wrapperRef.current) return;
    
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Spawn multiple bubbles at hover position
    const count = 3 + Math.floor(Math.random() * 3); // 3-5 bubbles
    for (let i = 0; i < count; i++) {
      const id = bubbleId.current++;
      const offsetX = x + (Math.random() - 0.5) * 10;
      const offsetY = y + (Math.random() - 0.5) * 10;
      const size = 15 + Math.random() * 25;
      const duration = 1000 + Math.random() * 1000; // 1-2s
      const color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
      const bubble: Bubble = { id, x: offsetX, y: offsetY, size, duration, color, isHover: true };
      
      setBubbles(s => [...s, bubble]);

      // Remove after duration
      setTimeout(() => {
        setBubbles(s => s.filter(b => b.id !== id));
      }, duration);
    }
  };

  // Pixel 3D pattern: falling pixels with 3D depth effect and mouse gravity
  type Pixel3D = { 
    id: number; 
    col: number; 
    row: number; 
    color: string; 
    delay: number; 
    duration: number;
    phase: 'falling' | 'settled' | 'fading';
    left: number; // px
    top: number; // px
    width: number; // px
    height: number; // px
    startX: number; // px absolute start coordinate (for offset calc)
    startY: number; // px
    claimedIndex: number; // index into grid cols*rows
  };
  const [pixels3D, setPixels3D] = useState<Pixel3D[]>([]);
  const pixel3DId = useRef(0);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const pixel3DColors = ['#00d4ff', '#0099ff', '#0066ff', '#6b5cff', '#00ffcc', '#4db8ff', '#3399ff', '#5577ff'];

  // Calculate grid dimensions for pixel3d
  const [pixel3DCols, setPixel3DCols] = useState(20);
  const [pixel3DRows, setPixel3DRows] = useState(3);
  const claimedRef = useRef<boolean[]>([]);

  useEffect(() => {
    if (pattern !== 'pixel3d' || !wrapperRef.current) {
      setPixels3D([]);
      setMousePos(null);
      claimedRef.current = [];
      return;
    }

    // Calculate grid based on wrapper size
    const updateGrid = () => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const pixelSize = 16; // size of each pixel block
      const cols = Math.max(10, Math.floor(rect.width / pixelSize));
      const rows = Math.max(2, Math.floor(rect.height / pixelSize));
      setPixel3DCols(cols);
      setPixel3DRows(rows);
      // initialize claimed grid with false
      claimedRef.current = new Array(cols * rows).fill(false);
    };

    updateGrid();
    const ro = new ResizeObserver(updateGrid);
    ro.observe(wrapperRef.current);

    let cancelled = false;

    // Spawn falling pixels
    const spawnPixel = () => {
      if (cancelled) return;
      // compute available cells (weighted toward bottom rows)
      const cols = pixel3DCols;
      const rows = pixel3DRows;
      const gridCount = cols * rows;
      // Avoid overspawning more than grid capacity + small buffer
      if (pixels3D.length > gridCount * 1.5) {
        const retry = 200 + Math.random() * 400;
        setTimeout(spawnPixel, retry);
        return;
      }
      // Build a list of unclaimed indices
      const candidates: { col: number; row: number; weight: number; index: number }[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          if (!claimedRef.current[idx]) {
            const weight = 1 + (rows - r); // prefer lower rows: bottom rows heavier
            candidates.push({ col: c, row: r, weight, index: idx });
          }
        }
      }

      if (candidates.length === 0) {
        // all claimed, quietly exit; we'll try again later
        const retry = 300 + Math.random() * 500;
        setTimeout(spawnPixel, retry);
        return;
      }

      // choose by weighted random
      let total = 0;
      for (const t of candidates) total += t.weight;
      let pick = Math.random() * total;
      let chosen = candidates[0];
      for (const t of candidates) {
        if (pick < t.weight) {
          chosen = t; break;
        }
        pick -= t.weight;
      }

      const id = pixel3DId.current++;
      const col = chosen.col;
      const row = chosen.row;
      const claimedIndex = chosen.index;
      claimedRef.current[claimedIndex] = true; // reserve
      const color = pixel3DColors[Math.floor(Math.random() * pixel3DColors.length)];
      const delay = Math.random() * 0.3;
      const duration = 1200 + Math.random() * 800;

      // compute pixel final left/top coordinates inside wrapper
      const rect = wrapperRef.current!.getBoundingClientRect();
      const gap = 2;
      const pixelW = Math.floor((rect.width - (cols - 1) * gap) / cols);
      const pixelH = Math.floor((rect.height - (rows - 1) * gap) / rows);
      const left = Math.round(col * (pixelW + gap));
      const top = Math.round(row * (pixelH + gap));

      // choose a random start point outside the wrapper area
      const spawnPad = 80 + Math.random() * 120;
      const dir = Math.floor(Math.random() * 4); // 0 top, 1 right, 2 bottom, 3 left
      let startX: number, startY: number;
      switch (dir) {
        case 0: // top
          startX = Math.random() * rect.width;
          startY = -spawnPad;
          break;
        case 1: // right
          startX = rect.width + spawnPad;
          startY = Math.random() * rect.height;
          break;
        case 2: // bottom
          startX = Math.random() * rect.width;
          startY = rect.height + spawnPad;
          break;
        default: // left
          startX = -spawnPad;
          startY = Math.random() * rect.height;
          break;
      }

      const pixel: Pixel3D = { id, col, row, color, delay, duration, phase: 'falling', left, top, width: pixelW, height: pixelH, startX, startY, claimedIndex };
      
      setPixels3D(s => [...s, pixel]);

      // After falling, set to settled
      setTimeout(() => {
        if (!cancelled) {
          setPixels3D(s => s.map(p => p.id === id ? { ...p, phase: 'settled' } : p));
          
          // After 1-2s, fade out
          setTimeout(() => {
            if (!cancelled) {
              setPixels3D(s => s.map(p => p.id === id ? { ...p, phase: 'fading' } : p));
              
              // Remove after fade
              setTimeout(() => {
                if (!cancelled) {
                  // free claimed index when removed
                  const idx = claimedIndex;
                  claimedRef.current[idx] = false;
                  setPixels3D(s => s.filter(p => p.id !== id));
                }
              }, 600);
            }
          }, 1000 + Math.random() * 1000);
        }
      }, duration);

      // Schedule next spawn dynamically based on remaining unclaimed cells; faster when grid is sparse
      const totalCells = pixel3DCols * pixel3DRows;
      const claimedCount = claimedRef.current.filter(Boolean).length;
      const unclaimed = totalCells - claimedCount;
      const density = claimedCount / Math.max(1, totalCells);
      // target fill until ~80% coverage
      const base = 120 + Math.random() * 260;
      const next = Math.max(80, base - Math.round((1 - density) * 300));
      setTimeout(() => spawnPixel(), next);
    };

    // Start spawning rapidly to build coverage from the outside
    const initialTimers: number[] = [];
    for (let i = 0; i < 6; i++) {
      initialTimers.push(window.setTimeout(spawnPixel, 30 * i));
    }

    return () => {
      cancelled = true;
      initialTimers.forEach((t) => clearTimeout(t));
      ro.disconnect();
      setPixels3D([]);
      setMousePos(null);
    };
  }, [pattern, pixel3DCols]);

  // Track mouse position for 3D gravity effect
  const handlePixel3DMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (pattern !== 'pixel3d' || !wrapperRef.current) return;
    
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePos({ x, y });
  };

  const handlePixel3DMouseLeave = () => {
    setMousePos(null);
  };

  // compute overlay tile color derived from activeColor if possible
  function hexToRgba(hex: string, alpha = 0.06) {
    const sanitized = String(hex).replace('#', '');
    const isShort = sanitized.length === 3;
    const re = isShort ? /([a-f0-9])([a-f0-9])([a-f0-9])/i : /([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/i;
    const match = sanitized.match(re);
    if (!match) return undefined;
    const r = parseInt(isShort ? match[1] + match[1] : match[1], 16);
    const g = parseInt(isShort ? match[2] + match[2] : match[2], 16);
    const b = parseInt(isShort ? match[3] + match[3] : match[3], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  const tileColorVar = hexToRgba(String(activeColor)) ?? undefined;

  return (
    <div className={base}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium mb-1 block">
          {label}
        </label>
      )}

      <div className="flex flex-col w-full">
        <div
          ref={wrapperRef}
          className={inputWrapper}
          style={{
            ...inputStyle,
            ['--input-pattern-color' as any]: activeColor,
            ['--input-pattern-cols' as any]: tileCols,
            ['--input-pattern-tile' as any]: tileColorVar,
              ['--input-neon-tile-shadow' as any]: `0 0 6px ${activeColor}, 0 0 14px ${activeColor}`,
              ['--input-neon-tile-strong-shadow' as any]: `0 0 12px ${activeColor}, 0 0 28px ${activeColor}`,
            backgroundColor:
              pattern === 'pixel'
                ? 'var(--input-pattern-bg)'
                : pattern === 'neon'
                ? 'var(--input-pattern-bg-dark, #05060a)'
                : pattern === 'bubble'
                ? 'transparent'
                : pattern === 'pixel3d'
                ? '#1a1a2e'
                : (inputStyle as any)?.backgroundColor,
          }}
          aria-disabled={disabled}
          onMouseMove={pattern === 'bubble' ? handleBubbleHover : pattern === 'pixel3d' ? handlePixel3DMouseMove : undefined}
          onMouseLeave={pattern === 'pixel3d' ? handlePixel3DMouseLeave : undefined}
        >
          {pattern === 'neon' && (
            <div className="input-neon-overlay" aria-hidden>
              {neonTiles.map((t) => (
                <span
                  key={t.id}
                  className="input-neon-tile"
                    style={{
                      left: `${t.left}%`,
                      top: `${t.top}%`,
                      width: `${t.size}px`,
                      height: `${t.size}px`,
                      backgroundColor: activeColor,
                      ['--input-neon-duration' as any]: `${t.duration}ms`,
                      ['--input-neon-flicker-duration' as any]: `${300 + (Math.round(Math.random() * 300))}ms`,
                      ['--input-neon-delay' as any]: `${-t.delay}s`,
                      // stronger glow available as an override; wrapper sets default if needed
                    } as React.CSSProperties}
                />
              ))}
            </div>
          )}
          {pattern === 'pixel' && (
            <div className="input-pattern-overlay" aria-hidden>
              {tiles.map((t) => (
                <span
                  key={t.id}
                  className="input-pattern-tile"
                  style={{ animationDelay: `${-t.delay}s`, animationDuration: `${t.duration}ms`, opacity: t.opacity } as React.CSSProperties}
                />
              ))}
            </div>
          )}
          {pattern === 'bubble' && (
            <div className="input-bubble-overlay" aria-hidden>
              {bubbles.map((b) => (
                <span
                  key={b.id}
                  className={b.isHover ? 'input-bubble-hover' : 'input-bubble-float'}
                  style={{
                    left: `${b.x}%`,
                    top: `${b.y}%`,
                    width: `${b.size}px`,
                    height: `${b.size}px`,
                    backgroundColor: b.color,
                    ['--bubble-duration' as any]: `${b.duration}ms`,
                  } as React.CSSProperties}
                />
              ))}
            </div>
          )}
          {pattern === 'pixel3d' && (
            <div className="input-pixel3d-overlay" aria-hidden>
              <div 
                className="input-pixel3d-grid"
                style={{
                  gridTemplateColumns: `repeat(${pixel3DCols}, 1fr)`,
                  gridTemplateRows: `repeat(${pixel3DRows}, 1fr)`,
                }}
              >
                {pixels3D.map((p) => {
                  // Calculate distance to mouse for gravity effect (apply to inner)
                  const rect = wrapperRef.current?.getBoundingClientRect();
                  let innerTransform = '';
                  if (mousePos && rect && p.phase === 'settled') {
                    const pixelCenterX = p.left + p.width / 2;
                    const pixelCenterY = p.top + p.height / 2;
                    const dx = mousePos.x - pixelCenterX;
                    const dy = mousePos.y - pixelCenterY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const maxDistance = 150; // pixels
                    if (distance < maxDistance) {
                      const force = 1 - distance / maxDistance;
                      const bendX = dx * force * 0.18;
                      const bendY = dy * force * 0.18;
                      const scale = 1 + force * 0.12;
                      innerTransform = `translate(${bendX}px, ${bendY}px) scale(${scale})`;
                    }
                  }

                  return (
                    <span
                      key={p.id}
                      className={`input-pixel3d-block ${p.phase}`}
                      style={{
                        backgroundColor: p.color,
                        left: `${p.left}px`,
                        top: `${p.top}px`,
                        width: `${p.width}px`,
                        height: `${p.height}px`,
                        ['--pixel-delay' as any]: `${p.delay}s`,
                        ['--pixel-duration' as any]: `${p.duration}ms`,
                        ['--start-x' as any]: `${p.startX - p.left}px`,
                        ['--start-y' as any]: `${p.startY - p.top}px`,
                      } as React.CSSProperties}
                    >
                      <span className={`input-pixel3d-inner ${p.phase}`} style={{ transform: innerTransform || undefined }} />
                    </span>
                  );
                })}
              </div>
            </div>
          )}
          {prefix && <div className={clsx('pl-2 pr-1 text-sm', pattern === 'pixel' || pattern === 'neon' || pattern === 'pixel3d' ? 'text-neutral-100' : 'text-neutral-600 dark:text-neutral-300')}>{prefix}</div>}

          <input
            id={inputId}
            className={clsx('flex-1 bg-transparent border-none outline-none text-sm px-2 relative z-20', pattern === 'pixel3d' ? 'text-neutral-100' : 'text-neutral-800 dark:text-neutral-100', disabled ? 'cursor-not-allowed' : 'cursor-text')}
            disabled={disabled}
            value={value ?? ''}
            onChange={(e) => handleChange(e.target.value)}
            {...rest}
          />

          {clearable && !!value && !disabled && (
            <button
              type="button"
              aria-label="Clear"
              className={clsx('px-2 text-sm', pattern === 'pixel' || pattern === 'neon' || pattern === 'pixel3d' ? 'text-neutral-100' : 'text-neutral-700 dark:text-neutral-200')}
              onClick={() => clear()}
            >
              ✕
            </button>
          )}

          {suffix && <div className={clsx('pl-1 pr-2 text-sm', pattern === 'pixel' || pattern === 'neon' || pattern === 'pixel3d' ? 'text-neutral-100' : 'text-neutral-600 dark:text-neutral-300')}>{suffix}</div>}
        </div>

        <div className="flex items-center justify-between mt-1">
          <div className="text-xs text-neutral-500 dark:text-neutral-400">{hint}</div>
          <div className="text-xs text-red-600">{error}</div>
        </div>
      </div>
    </div>
  );
}
