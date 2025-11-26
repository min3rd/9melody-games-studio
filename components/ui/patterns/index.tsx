"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { type Preset } from "../presets";

export type Pattern = 'pixel' | 'neon' | 'bubble' | 'pixel3d' | undefined;

export interface PatternOverlayProps {
  pattern?: Pattern;
  // allow any HTMLElement wrapper (div, input, button, etc)
  wrapperRef: React.RefObject<HTMLElement | null>;
  activeColor?: string;
  preset?: Preset;
  // optional class prefix for overlay classes and css variables; defaults to 'input'
  classPrefix?: string;
}

/**
 * PatternOverlay
 * Shared overlay that renders interactive patterns for inputs and other UI elements.
 * - pattern: 'pixel' | 'neon' | 'bubble' | 'pixel3d'
 * - wrapperRef: the element that acts as the visible area; PatternOverlay will attach resize/mouse listeners
 * - activeColor: optional color for neon/pixel accents
 * - preset: preset mapping for default colors
 *
 * Usage:
 *  <div ref={wrapperRef} className="...">
 *    <PatternOverlay pattern={pattern} wrapperRef={wrapperRef} activeColor={color} />
 *    <input ... />
 *  </div>
 */
export default function PatternOverlay({ pattern, wrapperRef, activeColor, preset, classPrefix = 'input' }: PatternOverlayProps) {
  // -------------------- Neon --------------------
  type NeonTile = { id: number; left: number; top: number; size: number; duration: number; delay: number; flickerDuration: number };
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
      const top = Math.round(Math.random() * 72 * 100) / 100; // percent
      const delay = Math.random() * 0.8;
      const size = Math.round((4 + Math.random() * 10) * 10) / 10;
      const duration = 700 + Math.round(Math.random() * 1000);
      const flickerDuration = 300 + Math.round(Math.random() * 300);
      const tile: NeonTile = { id, left, top, size, duration, delay, flickerDuration };
      setNeonTiles(s => [...s, tile]);

      const timeoutId = setTimeout(() => {
        setNeonTiles(s => s.filter(t => t.id !== id));
      }, duration + 80);

      const next = 220 + Math.random() * 420;
      setTimeout(() => spawn(), next);
      return () => clearTimeout(timeoutId);
    };

    const initialTimers: number[] = [];
    for (let i = 0; i < 2; i++) initialTimers.push(window.setTimeout(spawn, 80 * i));
    return () => {
      cancelled = true;
      initialTimers.forEach((t) => clearTimeout(t));
      setNeonTiles([]);
    };
  }, [pattern, wrapperRef, activeColor]);

  // -------------------- Bubble --------------------
  type Bubble = { id: number; x: number; y: number; size: number; duration: number; color: string; isHover?: boolean };
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const bubbleId = useRef(0);
  const bubbleColors = useMemo(() => ['#ff69b4', '#ff1493', '#ff6b9d', '#ff8c94', '#ff4757', '#ff6348', '#ffa502', '#ff7675'], []);

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
      const bubble: Bubble = { id, x, y, size, duration, color };
      setBubbles(s => [...s, bubble]);
      setTimeout(() => {
        if (!cancelled) setBubbles(s => s.filter(b => b.id !== id));
      }, duration);
      const next = 800 + Math.random() * 1200;
      setTimeout(() => spawnFloating(), next);
    };

    const timer = setTimeout(spawnFloating, 200);

    // hover spawns using attaching listeners directly
    const el = wrapperRef.current;
    function onMove(e: MouseEvent) {
      if (cancelled) return;
      const rect = el!.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      const count = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const id = bubbleId.current++;
        const offsetX = x + (Math.random() - 0.5) * 10;
        const offsetY = y + (Math.random() - 0.5) * 10;
        const size = 15 + Math.random() * 25;
        const duration = 1000 + Math.random() * 1000;
        const color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
        const bubble: Bubble = { id, x: offsetX, y: offsetY, size, duration, color, isHover: true };
        setBubbles(s => [...s, bubble]);
        setTimeout(() => setBubbles(s => s.filter(b => b.id !== id)), duration);
      }
    }

    el!.addEventListener('mousemove', onMove);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      el!.removeEventListener('mousemove', onMove);
      setBubbles([]);
    };
  }, [pattern, wrapperRef, classPrefix, bubbleColors]);

  // -------------------- Pixel (grid) --------------------
  const [tileCols, setTileCols] = useState<number>(12);
  const [tileRows, setTileRows] = useState<number>(2);
  const [tileCount, setTileCount] = useState<number>(24);
  const [tileSize, setTileSize] = useState<number>(6);
  const [tileGap, setTileGap] = useState<number>(2);

  useEffect(() => {
    if (pattern !== 'pixel' || !wrapperRef.current) {
      setTileCols(12);
      setTileRows(2);
      setTileCount(24);
      return;
    }

    const el = wrapperRef.current;
    const ro = new ResizeObserver(() => {
      const styles = window.getComputedStyle(el);
      const tileSizeStr = styles.getPropertyValue(`--${classPrefix}-pattern-size`) || '6px';
      const parsedTileSize = parseFloat(tileSizeStr);
      const gapStr = styles.getPropertyValue(`--${classPrefix}-pattern-gap`) || '2px';
      const parsedGap = parseFloat(gapStr);
      const rect = el.getBoundingClientRect();
      // compute columns/rows to completely cover the element
      const cols = Math.max(1, Math.ceil((rect.width + parsedGap) / (parsedTileSize + parsedGap)));
      const rows = Math.max(1, Math.ceil((rect.height + parsedGap) / (parsedTileSize + parsedGap)));
      setTileCols(cols);
      setTileRows(rows);
      setTileSize(parsedTileSize);
      setTileGap(parsedGap);
      setTileCount(cols * rows);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [pattern, wrapperRef]);

  const [tiles, setTiles] = useState(() => Array.from({ length: tileCount }).map((_, i) => ({ id: i, delay: 0, opacity: 1, duration: 1000 })));

  useEffect(() => {
    // generate non-deterministic randomness in effect to avoid impure render
    setTiles(
      Array.from({ length: tileCount }).map((_, i) => ({ id: i, delay: Math.random() * 1.8, opacity: 0.5 + Math.random() * 0.5, duration: 800 + Math.random() * 1200 }))
    );
  }, [tileCount]);

  // -------------------- Pixel3D --------------------
  type Pixel3D = { id: number; left: number; top: number; width: number; height: number; color: string; delay: number; duration: number; phase: 'falling' | 'settled' | 'fading'; startX: number; startY: number; startScale: number; startZ: number; claimedIndex: number; };
  const [pixels3D, setPixels3D] = useState<Pixel3D[]>([]);
  const pixel3DId = useRef(0);
  const pixel3DColors = useMemo(() => ['#00d4ff', '#0099ff', '#0066ff', '#6b5cff', '#00ffcc', '#4db8ff', '#3399ff', '#5577ff'], []);
  const pixels3DCountRef = useRef(0);
  const claimedRef = useRef<boolean[]>([]);
  const [gridCols, setGridCols] = useState<number>(20);
  const [gridRows, setGridRows] = useState<number>(3);

  useEffect(() => {
    if (pattern !== 'pixel3d' || !wrapperRef.current) {
      setPixels3D([]);
      setGridCols(20);
      setGridRows(3);
      claimedRef.current = [];
      return;
    }

    const updateGrid = () => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const pixelSize = 16; // pixel block size
      const styles = window.getComputedStyle(wrapperRef.current);
      const gapStr = styles.getPropertyValue(`--${classPrefix}-pattern-gap`) || '2px';
      const gap = parseFloat(gapStr);
      const cols = Math.max(10, Math.floor((rect.width + gap) / (pixelSize + gap)));
      const rows = Math.max(2, Math.floor((rect.height + gap) / (pixelSize + gap)));
      setGridCols(cols);
      setGridRows(rows);
      claimedRef.current = new Array(cols * rows).fill(false);
    };

    updateGrid();
    const ro = new ResizeObserver(updateGrid);
    ro.observe(wrapperRef.current);

    let cancelled = false;

    const spawnPixel = () => {
      if (cancelled) return;
      const cols = gridCols;
      const rows = gridRows;
      const gridCount = cols * rows;
      if (pixels3DCountRef.current > gridCount * 1.5) { setTimeout(spawnPixel, 200 + Math.random() * 400); return; }

      const candidates: { col: number; row: number; weight: number; index: number }[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          if (!claimedRef.current[idx]) {
            const weight = 1 + (rows - r);
            candidates.push({ col: c, row: r, weight, index: idx });
          }
        }
      }

      if (candidates.length === 0) {
        const retry = 300 + Math.random() * 500;
        setTimeout(() => spawnPixel(), retry);
        return;
      }

      let totalW = 0;
      for (const t of candidates) totalW += t.weight;
      let pick = Math.random() * totalW;
      let chosen = candidates[0];
      for (const t of candidates) {
        if (pick < t.weight) { chosen = t; break; }
        pick -= t.weight;
      }

      const id = pixel3DId.current++;
      const col = chosen.col;
      const row = chosen.row;
      const claimedIndex = chosen.index;
      claimedRef.current[claimedIndex] = true;
      const color = pixel3DColors[Math.floor(Math.random() * pixel3DColors.length)];
      const delay = Math.random() * 0.3;
      const duration = 1200 + Math.random() * 800;

      const rect = wrapperRef.current!.getBoundingClientRect();
      const styles = window.getComputedStyle(wrapperRef.current!);
      const gapStr2 = styles.getPropertyValue('--input-pattern-gap') || '2px';
      const gap = parseFloat(gapStr2);
      const pixelW = Math.floor((rect.width - (cols - 1) * gap) / cols);
      const pixelH = Math.floor((rect.height - (rows - 1) * gap) / rows);
      const left = Math.round(col * (pixelW + gap));
      const top = Math.round(row * (pixelH + gap));

      const spawnPad = 80 + Math.random() * 120;
      const dir = Math.floor(Math.random() * 4);
      let startX: number, startY: number;
      switch (dir) {
        case 0:
          startX = Math.random() * rect.width;
          startY = -spawnPad;
          break;
        case 1:
          startX = rect.width + spawnPad;
          startY = Math.random() * rect.height;
          break;
        case 2:
          startX = Math.random() * rect.width;
          startY = rect.height + spawnPad;
          break;
        default:
          startX = -spawnPad;
          startY = Math.random() * rect.height;
          break;
      }

      const pixel: Pixel3D = { id, color, delay, duration, phase: 'falling', left, top, width: pixelW, height: pixelH, startX, startY, startScale: 1.5 + Math.random() * 1.2, startZ: 60 + Math.random() * 140, claimedIndex };
      setPixels3D(s => { pixels3DCountRef.current = s.length + 1; return [...s, pixel]; });

      setTimeout(() => {
        if (!cancelled) {
          setPixels3D(s => s.map(p => p.id === id ? { ...p, phase: 'settled' } : p));
          setTimeout(() => {
            if (!cancelled) {
              setPixels3D(s => s.map(p => p.id === id ? { ...p, phase: 'fading' } : p));
              setTimeout(() => {
                if (!cancelled) {
                  const idx = claimedIndex;
                  claimedRef.current[idx] = false;
                  setPixels3D(s => { pixels3DCountRef.current = Math.max(0, s.length - 1); return s.filter(p => p.id !== id); });
                }
              }, 600);
            }
          }, 1000 + Math.random() * 1000);
        }
      }, duration);

      const base = 120 + Math.random() * 260;
      const totalCells = gridCols * gridRows;
      const claimedCount = claimedRef.current.filter(Boolean).length;
      const unclaimed = totalCells - claimedCount;
      const density = claimedCount / Math.max(1, totalCells);
      const next = Math.max(80, base - Math.round((1 - density) * 300));
      setTimeout(() => spawnPixel(), next);
    };

    const initialTimers: number[] = [];
    for (let i = 0; i < 6; i++) {
      initialTimers.push(window.setTimeout(spawnPixel, 30 * i));
    }

    return () => { cancelled = true; initialTimers.forEach(t => clearTimeout(t)); ro.disconnect(); pixels3DCountRef.current = 0; setPixels3D([]); claimedRef.current = [] };
  }, [pattern, wrapperRef, gridCols, gridRows, classPrefix, pixel3DColors]);

  // Do not render anything if no pattern
  if (!pattern) return null;

  const cls = (suffix: string) => `${classPrefix}-${suffix}`;

  return (
    <>
      {pattern === 'neon' && (
        <div className={cls('neon-overlay')} aria-hidden>
          {neonTiles.map((t) => (
            <span
              key={t.id}
              className={cls('neon-tile')}
              style={{
                left: `${t.left}%`,
                top: `${t.top}%`,
                width: `${t.size}px`,
                height: `${t.size}px`,
                backgroundColor: activeColor ?? undefined,
                [`--${classPrefix}-neon-duration` as any]: `${t.duration}ms`,
                ['--input-neon-duration' as any]: `${t.duration}ms`,
                [`--${classPrefix}-neon-flicker-duration` as any]: `${t.flickerDuration}ms`,
                ['--input-neon-flicker-duration' as any]: `${t.flickerDuration}ms`,
                [`--${classPrefix}-neon-delay` as any]: `${-t.delay}s`,
                ['--input-neon-delay' as any]: `${-t.delay}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {pattern === 'bubble' && (
        <div className={cls('bubble-overlay')} aria-hidden>
          {bubbles.map((b) => (
            <span
              key={b.id}
              className={b.isHover ? cls('bubble-hover') : cls('bubble-float')}
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                width: `${b.size}px`,
                height: `${b.size}px`,
                backgroundColor: b.color,
                [`--${classPrefix}-bubble-duration` as any]: `${b.duration}ms`,
                ['--bubble-duration' as any]: `${b.duration}ms`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {pattern === 'pixel' && (
        <div
          className={cls('pattern-overlay')}
          aria-hidden
          style={{
            gridTemplateColumns: `repeat(${tileCols}, ${tileSize}px)`,
            gridAutoRows: `${tileSize}px`,
            gap: `${tileGap}px`,
            // ensure overlay inherits the same tile size variables for CSS that relies on them
            [`--${classPrefix}-pattern-size` as any]: `${tileSize}px`,
            ['--input-pattern-size' as any]: `${tileSize}px`,
            [`--${classPrefix}-pattern-cols` as any]: tileCols,
            ['--input-pattern-cols' as any]: tileCols,
            [`--${classPrefix}-pattern-gap` as any]: `${tileGap}px`,
            ['--input-pattern-gap' as any]: `${tileGap}px`,
          } as React.CSSProperties}
        >
          {tiles.map((t) => (
            <span
              key={t.id}
              className={cls('pattern-tile')}
              style={{ width: `${tileSize}px`, height: `${tileSize}px`, animationDelay: `${-t.delay}s`, animationDuration: `${t.duration}ms`, opacity: t.opacity } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {pattern === 'pixel3d' && (
        <div className={cls('pixel3d-overlay')} aria-hidden>
          <div className={cls('pixel3d-grid')}>
            {pixels3D.map((p) => (
              <span
                key={p.id}
                className={`${cls('pixel3d-block')} ${p.phase}`}
                style={{
                  left: `${p.left}px`,
                  top: `${p.top}px`,
                  width: `${p.width}px`,
                  height: `${p.height}px`,
                  backgroundColor: p.color,
                  [`--${classPrefix}-pixel-delay` as any]: `${p.delay}s`,
                  ['--pixel-delay' as any]: `${p.delay}s`,
                  [`--${classPrefix}-pixel-duration` as any]: `${p.duration}ms`,
                  ['--pixel-duration' as any]: `${p.duration}ms`,
                  [`--${classPrefix}-start-x` as any]: `${p.startX - p.left}px`,
                  ['--start-x' as any]: `${p.startX - p.left}px`,
                  [`--${classPrefix}-start-y` as any]: `${p.startY - p.top}px`,
                  ['--start-y' as any]: `${p.startY - p.top}px`,
                  [`--${classPrefix}-start-scale` as any]: `${p.startScale}`,
                  ['--start-scale' as any]: `${p.startScale}`,
                  [`--${classPrefix}-start-z` as any]: `${p.startZ}px`,
                  ['--start-z' as any]: `${p.startZ}px`,
                } as React.CSSProperties}
              >
                <span className={`${cls('pixel3d-inner')} ${p.phase}`} style={{}} />
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
