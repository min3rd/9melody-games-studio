"use client";
import React, { useId, useState, useMemo, useRef, useEffect } from "react";
import clsx from "clsx";
import { PRESET_MAP, type Preset, BUTTON_SIZE_CLASSES, ROUND_CLASSES, type UISize } from "../presets";

export interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'size'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  preset?: Preset;
  color?: string;
  size?: UISize;
  variant?: 'solid' | 'ghost' | 'outline' | 'none';
  pattern?: 'pixel' | 'neon' | 'bubble' | 'pixel3d';
  rounded?: keyof typeof ROUND_CLASSES;
  withEffects?: boolean;
}

export default function TextArea({
  value: valueProp,
  defaultValue,
  onValueChange,
  label,
  hint,
  error,
  preset = 'muted',
  color,
  size = 'md',
  variant = 'solid',
  rounded = 'sm',
  withEffects = true,
  pattern,
  id: idProp,
  className = '',
  disabled = false,
  rows = 4,
  ...rest
}: Readonly<TextAreaProps>) {
  const id = idProp ?? useId();
  const isControlled = typeof valueProp !== 'undefined';
  const [valueState, setValueState] = useState<string | undefined>(defaultValue);
  const value = isControlled ? valueProp : valueState;

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

  const base = clsx('flex flex-col w-full', roundClass, className);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const inputWrapper = clsx(
    'relative w-full',
    'border border-neutral-200 dark:border-neutral-700',
    sizeClass,
    roundClass,
    variantClasses[variant],
    patternClass,
    disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-text'
  );

  // reuse smaller simplified versions of the pattern spawns, neon, bubble and pixel3d
  // we adapted logic from TextInput; not all features must be present

  // Neon
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
      const left = Math.random() * 92;
      const top = Math.random() * 72;
      const delay = Math.random() * 0.8;
      const size = 4 + Math.random() * 12;
      const duration = 700 + Math.round(Math.random() * 1000);
      const tile = { id, left, top, size, duration, delay };
      setNeonTiles(s => [...s, tile]);
      setTimeout(() => setNeonTiles(s => s.filter(t => t.id !== id)), duration + 80);
      setTimeout(spawn, 200 + Math.random() * 700);
    };
    const timers: any[] = [];
    for (let i = 0; i < 2; i++) timers.push(setTimeout(spawn, i * 40));
    return () => { cancelled = true; timers.forEach(t => clearTimeout(t)); setNeonTiles([]); };
  }, [pattern]);

  // Bubble
  type Bubble = { id: number; x: number; y: number; size: number; duration: number; color: string; isHover?: boolean };
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const bubbleId = useRef(0);
  const bubbleColors = ['#ff69b4', '#ff1493', '#ff6b9d', '#ff8c94', '#ff4757'];

  useEffect(() => {
    if (pattern !== 'bubble' || !wrapperRef.current) {
      setBubbles([]);
      return;
    }
    let cancelled = false;
    const spawnFloating = () => {
      if (cancelled) return;
      const id = bubbleId.current++;
      const x = Math.random() * 100;
      const y = 100;
      const size = 10 + Math.random() * 30;
      const duration = 2000 + Math.random() * 3000;
      const color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
      setBubbles(s => [...s, { id, x, y, size, duration, color }]);
      setTimeout(() => setBubbles(s => s.filter(b => b.id !== id)), duration);
      setTimeout(spawnFloating, 800 + Math.random() * 1200);
    };
    const timer = setTimeout(spawnFloating, 200);
    return () => { cancelled = true; clearTimeout(timer); setBubbles([]); };
  }, [pattern]);

  const handleBubbleHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (pattern !== 'bubble' || !wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const count = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const id = bubbleId.current++;
      const offsetX = x + (Math.random() - 0.5) * 10;
      const offsetY = y + (Math.random() - 0.5) * 10;
      const size = 12 + Math.random() * 30;
      const duration = 1000 + Math.random() * 1000;
      const color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
      const bubble = { id, x: offsetX, y: offsetY, size, duration, color, isHover: true };
      setBubbles(s => [...s, bubble]);
      setTimeout(() => setBubbles(s => s.filter(b => b.id !== id)), duration);
    }
  };

  // Pixel3D minimal reuse: spawn pixels from outside and land into cells
  type Pixel3D = { id: number; left: number; top: number; width: number; height: number; color: string; delay: number; duration: number; phase: 'falling' | 'settled' | 'fading'; startX: number; startY: number; startScale: number; startZ: number; claimedIndex: number; };
  const [pixels3D, setPixels3D] = useState<Pixel3D[]>([]);
  const pixel3DId = useRef(0);
  const pixel3DColors = ['#00d4ff', '#0099ff', '#0066ff', '#6b5cff', '#00ffcc'];
  const claimedRef = useRef<boolean[]>([]);
  const [gridCols, setGridCols] = useState(12);
  const [gridRows, setGridRows] = useState(3);

  useEffect(() => {
    if (pattern !== 'pixel3d' || !wrapperRef.current) {
      setPixels3D([]);
      claimedRef.current = [];
      return;
    }
    let cancelled = false;

    const updateGrid = () => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const pixelSize = 16;
      const c = Math.max(8, Math.floor(rect.width / pixelSize));
      const r = Math.max(2, Math.floor(rect.height / pixelSize));
      setGridCols(c); setGridRows(r);
      claimedRef.current = new Array(c * r).fill(false);
    };
    updateGrid();
    const ro = new ResizeObserver(updateGrid);
    ro.observe(wrapperRef.current);

    const spawn = () => {
      if (cancelled) return;
      const total = gridCols * gridRows;
      if (pixels3D.length > total * 1.5) { setTimeout(spawn, 200 + Math.random()*300); return; }
      const candidates: number[] = [];
      for (let r = 0; r < gridRows; r++) for (let c = 0; c < gridCols; c++) { const idx = r * gridCols + c; if (!claimedRef.current[idx]) candidates.push(idx); }
      if (!candidates.length) { setTimeout(spawn, 200 + Math.random()*400); return; }
      const chosenIndex = candidates[Math.floor(Math.random() * candidates.length)];
      const chosenRow = Math.floor(chosenIndex / gridCols);
      const chosenCol = chosenIndex % gridCols;
      claimedRef.current[chosenIndex] = true;

      const rect = wrapperRef.current!.getBoundingClientRect();
      const gap = 2;
      const pixelW = Math.floor((rect.width - (gridCols - 1) * gap) / gridCols);
      const pixelH = Math.floor((rect.height - (gridRows - 1) * gap) / gridRows);
      const left = chosenCol * (pixelW + gap);
      const top = chosenRow * (pixelH + gap);
      const startPad = 80 + Math.random() * 120;
      const dir = Math.floor(Math.random() * 4);
      let startX: number, startY: number;
      switch(dir){ case 0: startX = Math.random() * rect.width; startY = -startPad; break; case 1: startX = rect.width + startPad; startY = Math.random() * rect.height; break; case 2: startX = Math.random() * rect.width; startY = rect.height + startPad; break; default: startX = -startPad; startY = Math.random()*rect.height; break; }
      const id = pixel3DId.current++;
      const duration = 900 + Math.random() * 900;
      const delay = Math.random() * 0.2;
      const startScale = 1.6 + Math.random() * 1.2; const startZ = 60 + Math.random() * 160;
      const color = pixel3DColors[Math.floor(Math.random()*pixel3DColors.length)];
      const pixel: Pixel3D = { id, left, top, width: pixelW, height: pixelH, color, delay, duration, phase: 'falling', startX, startY, startScale, startZ, claimedIndex: chosenIndex };
      setPixels3D(s => [...s, pixel]);

      setTimeout(() => {
        if (!cancelled) {
          setPixels3D(s => s.map(p => p.id === id ? { ...p, phase: 'settled' } : p));
          setTimeout(() => {
            if (!cancelled) {
              setPixels3D(s => s.map(p => p.id === id ? { ...p, phase: 'fading' } : p));
              setTimeout(() => {
                if (!cancelled) { claimedRef.current[chosenIndex] = false; setPixels3D(s => s.filter(p => p.id !== id)); }
              }, 600);
            }
          }, 1000 + Math.random() * 1000);
        }
      }, duration);

      const next = 150 + Math.random()*250;
      setTimeout(spawn, next);
    };

    const timers: any[] = [];
    for (let i=0;i<5;i++) timers.push(setTimeout(spawn, i*50));
    return () => { cancelled = true; timers.forEach(t=>clearTimeout(t)); ro.disconnect(); setPixels3D([]); claimedRef.current = [] };
  }, [pattern, gridCols, gridRows]);

  // mouse gravity for pixel3d
  const [mousePos, setMousePos] = useState<{x:number;y:number} | null>(null);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (pattern !== 'pixel3d' || !wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  const handleMouseLeave = () => setMousePos(null);

  return (
    <div className={base}>
      {label && <label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label>}
      <div ref={wrapperRef} className={inputWrapper} onMouseMove={pattern === 'bubble' ? handleBubbleHover : pattern === 'pixel3d' ? handleMouseMove : undefined} onMouseLeave={pattern === 'pixel3d' ? handleMouseLeave : undefined} aria-disabled={disabled}>
        {pattern === 'neon' && (
          <div className="input-neon-overlay" aria-hidden>
            {neonTiles.map(t => (
              <span key={t.id} className="input-neon-tile" style={{ left: `${t.left}%`, top: `${t.top}%`, width: `${t.size}px`, height: `${t.size}px`, backgroundColor: color ?? PRESET_MAP[preset] ?? PRESET_MAP.primary, ['--input-neon-duration' as any]: `${t.duration}ms`, ['--input-neon-delay' as any]: `${-t.delay}s` }} />
            ))}
          </div>
        )}

        {pattern === 'bubble' && (
          <div className="input-bubble-overlay" aria-hidden>
            {bubbles.map(b => <span key={b.id} className={b.isHover ? 'input-bubble-hover' : 'input-bubble-float'} style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.size}px`, height: `${b.size}px`, backgroundColor: b.color, ['--bubble-duration' as any]: `${b.duration}ms` }} />)}
          </div>
        )}

        {pattern === 'pixel' && (
          <div className="input-pattern-overlay" aria-hidden>
            {Array.from({length: gridCols * gridRows}).map((_, i) => <span key={i} className="input-pattern-tile" />)}
          </div>
        )}

        {pattern === 'pixel3d' && (
          <div className="input-pixel3d-overlay" aria-hidden>
            <div className="input-pixel3d-grid">
              {pixels3D.map(p => {
                let innerTransform: string | undefined;
                if (mousePos && p.phase === 'settled') {
                  const dx = mousePos.x - (p.left + p.width / 2);
                  const dy = mousePos.y - (p.top + p.height / 2);
                  const dist = Math.sqrt(dx * dx + dy * dy);
                  const max = 160;
                  if (dist < max) {
                    const f = 1 - dist / max;
                    const bx = dx * f * 0.18;
                    const by = dy * f * 0.18;
                    const s = 1 + f * 0.12;
                    innerTransform = `translate(${bx}px, ${by}px) scale(${s})`;
                  }
                }
                return (
                  <span key={p.id} className={`input-pixel3d-block ${p.phase}`} style={{ left: `${p.left}px`, top: `${p.top}px`, width: `${p.width}px`, height: `${p.height}px`, backgroundColor: p.color, ['--pixel-delay' as any]: `${p.delay}s`, ['--pixel-duration' as any]: `${p.duration}ms`, ['--start-x' as any]: `${p.startX - p.left}px`, ['--start-y' as any]: `${p.startY - p.top}px`, ['--start-scale' as any]: `${p.startScale}`, ['--start-z' as any]: `${p.startZ}px` }}>
                    <span className={`input-pixel3d-inner ${p.phase}`} style={{ transform: innerTransform || undefined }} />
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <textarea id={id} rows={rows} value={value ?? ''} onChange={(e) => handleChange(e.target.value)} className={clsx('w-full bg-transparent border-none outline-none px-2 py-1 relative z-20 text-sm', disabled ? 'cursor-not-allowed' : 'cursor-text')} disabled={disabled} {...rest} />

        <div className="flex items-center justify-between mt-1"><div className="text-xs text-neutral-500 dark:text-neutral-400">{hint}</div><div className="text-xs text-red-600">{error}</div></div>
      </div>
    </div>
  );
}
