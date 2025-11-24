"use client";
import React, { useState } from 'react';
import Pagination from '@/components/ui/Pagination';
import { type Preset } from '@/components/ui/presets';
import type { UISize } from '@/components/ui/presets';

export default function PaginationPreview(): React.ReactElement {
  const [size, setSize] = useState<UISize>('md');
  const [preset, setPreset] = useState<Preset>('muted');
  const [useCustom, setUseCustom] = useState(false);
  const [color, setColor] = useState('#3b82f6');
  const [withEffects, setWithEffects] = useState(true);
  const [currentPage, setCurrentPage] = useState(4);
  const [totalPages, setTotalPages] = useState(12);

  return (
    <div className="space-y-4 bg-white dark:bg-neutral-800 rounded-lg shadow text-neutral-900 dark:text-neutral-100">
      <div className="flex items-center gap-4">
        <label className="text-sm">Size
          <select className="ml-2 rounded p-1 border text-sm" value={size} onChange={(e) => setSize(e.target.value as UISize)}>
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </label>

        <label className="text-sm">With Effects
          <input className="ml-2" type="checkbox" checked={withEffects} onChange={(e) => setWithEffects(e.target.checked)} />
        </label>

        <label className="text-sm">Custom color
          <input className="ml-2" type="checkbox" checked={useCustom} onChange={(e) => setUseCustom(e.target.checked)} />
        </label>
        {useCustom && (
          <label className="text-sm">Color
            <input className="ml-2" type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </label>
        )}

        <label className="text-sm">Preset
          <select className="ml-2 rounded p-1 border text-sm" value={preset} onChange={(e) => setPreset(e.target.value as Preset)}>
            <option value="muted">muted</option>
            <option value="primary">primary</option>
            <option value="success">success</option>
            <option value="danger">danger</option>
            <option value="warning">warning</option>
            <option value="info">info</option>
          </select>
        </label>

        <label className="text-sm">Total
          <input type="number" className="ml-2 rounded p-1 border w-20 text-sm" value={totalPages} min={1} max={100} onChange={(e) => setTotalPages(parseInt(e.target.value || '1', 10))} />
        </label>
      </div>

      <div className="p-4 bg-white dark:bg-neutral-800 rounded">
        <p className="mb-2 text-sm">Current page: {currentPage}</p>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(p) => setCurrentPage(p)} size={size} preset={preset} color={useCustom ? color : undefined} withEffects={withEffects} />
      </div>
    </div>
  );
}
