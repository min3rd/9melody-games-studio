"use client";
import React, { useState } from 'react';
import { Drawer, DrawerContainer, DrawerContent } from '@/components/ui';
import { type Preset } from '@/components/ui/presets';
import PreviewLayout from '@/components/preview/PreviewLayout';
import CodePreview from '@/components/ui/CodePreview';

export default function DrawerPreview(): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<'right'|'left'|'top'|'bottom'>('right');
  const [useCustom, setUseCustom] = useState(false);
  const [preset, setPreset] = useState<Preset>('muted');
  const [color, setColor] = useState<string>('#06b6d4');
  const [backdrop, setBackdrop] = useState(true);
  const [mode, setMode] = useState<'over'|'side'>('over');
  const [width, setWidth] = useState<number>(320);
  const [height, setHeight] = useState<number>(280);

  return (
    <PreviewLayout
      title="Drawer"
      preview={(
        <DrawerContainer className="border p-4 rounded" open={open} onClose={() => setOpen(false)} position={position} mode={mode} width={position === 'left' || position === 'right' ? width : undefined} height={position === 'top' || position === 'bottom' ? height : undefined} backdrop={backdrop} preset={useCustom ? undefined : preset} color={useCustom ? color : undefined}>
          <div>
            <button className="px-3 py-2 rounded bg-foreground text-background" onClick={() => setOpen(true)}>Open Drawer</button>
            <Drawer aria-label="Example Drawer">
            <p className="text-sm text-neutral-700 dark:text-neutral-300">This is an example of a drawer content. Try changing position and sizes.</p>
            <div className="mt-4 text-sm">
              <button className="px-3 py-2 rounded bg-foreground text-background" onClick={() => setOpen(false)}>Close</button>
            </div>
            </Drawer>
            <DrawerContent>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">This is the main content. Drawer mode {mode}; position {position}</p>
            </DrawerContent>
          </div>
        </DrawerContainer>
      )}
      controls={(
        <div className="flex gap-2 items-center">
          <label className="text-sm">Position
            <select value={position} onChange={(e) => setPosition(e.target.value as any)} className="ml-2 text-sm">
              <option value="right">Right</option>
              <option value="left">Left</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
            </select>
          </label>
          <label className="text-sm">Use custom color
            <input className="ml-2" type="checkbox" checked={useCustom} onChange={(e) => setUseCustom(e.target.checked)} />
          </label>
          <label className="text-sm">Mode
            <select value={mode} onChange={(e) => setMode(e.target.value as any)} className="ml-2 text-sm">
              <option value="over">Over</option>
              <option value="side">Side</option>
            </select>
          </label>
          <label className="text-sm">Preset
            <select value={preset} onChange={(e) => setPreset(e.target.value as Preset)} className="ml-2 text-sm">
              <option value="muted">muted</option>
              <option value="primary">primary</option>
              <option value="success">success</option>
              <option value="danger">danger</option>
              <option value="warning">warning</option>
              <option value="info">info</option>
            </select>
          </label>
          {useCustom && <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />}
          <label className="text-sm">Backdrop <input className="ml-2" type="checkbox" checked={backdrop} onChange={(e) => setBackdrop(e.target.checked)} /></label>
          <label className="text-sm">Width <input type="range" min={200} max={720} value={width} onChange={(e) => setWidth(Number(e.target.value))} /></label>
          <label className="text-sm">Height <input type="range" min={120} max={640} value={height} onChange={(e) => setHeight(Number(e.target.value))} /></label>
        </div>
      )}
      snippet={(<CodePreview code={`<DrawerContainer open={open} onClose={() => setOpen(false)} position="${position}" mode="${mode}" width={${width}} height={${height}} ${useCustom ? `color="${color}"` : `preset="${preset}"`}>
      <Drawer />
      <DrawerContent />
    </DrawerContainer>`} />)}
    />
  );
}
