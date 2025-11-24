"use client";
import React, { useState } from 'react';
import { Carousel } from '@/components/ui';
import type { Preset } from '@/components/ui/presets';

type UIPreset = Preset | 'custom' | 'none';

export default function CarouselPreview(): React.ReactElement {
  const [preset, setPreset] = useState<UIPreset>('muted');
  const [color, setColor] = useState<string>('#ffffff');
  const [size, setSize] = useState<'sm'|'md'|'lg'>('md');
  const [round, setRound] = useState(true);
  const [autoNext, setAutoNext] = useState(true);
  const [autoDelay, setAutoDelay] = useState(4000);
  const [pagination, setPagination] = useState(true);
  const [showControls, setShowControls] = useState(true);

  const presetProp: Preset | undefined = preset === 'custom' || preset === 'none' ? undefined : (preset as Preset);
  const colorProp = preset === 'custom' ? color : undefined;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm">Preset
          <select className="ml-2 text-sm rounded p-1 border" value={preset} onChange={(e) => setPreset(e.target.value as UIPreset)}>
            <option value="primary">Primary</option>
            <option value="success">Success</option>
            <option value="danger">Danger</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
            <option value="muted">Muted</option>
            <option value="custom">Custom</option>
            <option value="none">None</option>
          </select>
        </label>

        {preset === 'custom' && (
          <label className="text-sm">Color
            <input className="ml-2" type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </label>
        )}

        <label className="text-sm">Size
          <select className="ml-2 text-sm rounded p-1 border" value={size} onChange={(e) => setSize(e.target.value as 'sm'|'md'|'lg')}>
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </label>

        <label className="text-sm">Round
          <input className="ml-2" type="checkbox" checked={round} onChange={(e) => setRound(e.target.checked)} />
        </label>
      </div>

      <div className="flex gap-4 items-center">
        <label className="text-sm">Auto Next
          <input className="ml-2" type="checkbox" checked={autoNext} onChange={(e) => setAutoNext(e.target.checked)} />
        </label>
        <label className="text-sm">Delay ms
          <input type="number" className="ml-2 p-1 text-sm border rounded" value={autoDelay} onChange={(e) => setAutoDelay(Number(e.target.value))} />
        </label>
        <label className="text-sm">Pagination
          <input className="ml-2" type="checkbox" checked={pagination} onChange={(e) => setPagination(e.target.checked)} />
        </label>
        <label className="text-sm">Controls
          <input className="ml-2" type="checkbox" checked={showControls} onChange={(e) => setShowControls(e.target.checked)} />
        </label>
      </div>

      <div className="mt-6">
        <Carousel size={size} preset={presetProp} color={colorProp} round={round} autoNext={autoNext} autoDelay={autoDelay} pagination={pagination} showControls={showControls} className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center h-full bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 text-white">Slide 1</div>
          <div className="flex items-center justify-center h-full bg-gradient-to-r from-green-400 via-teal-400 to-blue-400 text-white">Slide 2</div>
          <div className="flex items-center justify-center h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white">Slide 3</div>
        </Carousel>
      </div>
    </div>
  );
}
