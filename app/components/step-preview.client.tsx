"use client";
import React, { useState } from 'react';
import Step from '@/components/ui/Step';
import { type Preset } from '@/components/ui/presets';
import type { UISize } from '@/components/ui/presets';

export default function StepPreview(): React.ReactElement {
  const [size, setSize] = useState<UISize>('md');
  const [preset, setPreset] = useState<Preset>('muted');
  const [useCustom, setUseCustom] = useState(false);
  const [color, setColor] = useState('#3b82f6');
  const [rounded, setRounded] = useState<'sm'|'full'|'none'>('sm');
  const [withEffects, setWithEffects] = useState(true);
  const [activeIndex, setActiveIndex] = useState(2);
  const [completedUntil, setCompletedUntil] = useState(1);
  const [showAction, setShowAction] = useState(true);
  const [actionLabel, setActionLabel] = useState('Go');
  const [actionPreset, setActionPreset] = useState<Preset>('muted');
  const [actionCustomColor, setActionCustomColor] = useState(false);
  const [actionColor, setActionColor] = useState('#3b82f6');

  const steps = [
    { label: 'Step One', description: 'Start here' },
    { label: 'Step Two', description: 'Continue' },
    { label: 'Step Three', description: 'Finish' },
  ];

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
        <label className="text-sm">Use custom color
          <input className="ml-2" type="checkbox" checked={useCustom} onChange={(e) => setUseCustom(e.target.checked)} />
        </label>
        {useCustom && (
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        )}
        <label className="text-sm">Rounded
          <select className="ml-2 rounded p-1 border text-sm" value={rounded} onChange={(e) => setRounded(e.target.value as 'sm'|'full'|'none')}>
            <option value="sm">sm</option>
            <option value="full">full</option>
            <option value="none">none</option>
          </select>
        </label>
        <label className="text-sm">Effects
          <input className="ml-2" type="checkbox" checked={withEffects} onChange={(e) => setWithEffects(e.target.checked)} />
        </label>
      </div>

      <div className="p-4 bg-white border rounded space-y-2">
        {steps.map((s, i) => (
          <Step key={i} index={i+1} label={s.label} description={s.description} active={i+1 === activeIndex} completed={i+1 <= completedUntil} preset={preset} color={useCustom ? color : undefined} size={size} rounded={rounded} withEffects={withEffects} action={showAction ? { label: actionLabel, onClick: () => alert(`Action for ${s.label}`), preset: actionPreset, color: actionCustomColor ? actionColor : undefined, size, withEffects, rounded } : undefined} />
        ))}

        <div className="mt-4 flex items-center gap-3">
          <label className="text-sm">Active
            <input type="number" className="ml-2 rounded p-1 border w-20 text-sm" value={activeIndex} min={1} max={steps.length} onChange={(e) => setActiveIndex(Math.max(1, Math.min(steps.length, Number(e.target.value || 1))))} />
          </label>
          <label className="text-sm">Completed until
            <input type="number" className="ml-2 rounded p-1 border w-20 text-sm" value={completedUntil} min={0} max={steps.length} onChange={(e) => setCompletedUntil(Math.max(0, Math.min(steps.length, Number(e.target.value || 0))))} />
          </label>
          <label className="text-sm">Show Action
            <input className="ml-2" type="checkbox" checked={showAction} onChange={(e) => setShowAction(e.target.checked)} />
          </label>
          {showAction && (
            <>
              <label className="text-sm">Action Label
                <input className="ml-2 rounded p-1 border text-sm" value={actionLabel} onChange={(e) => setActionLabel(e.target.value)} />
              </label>
              <label className="text-sm">Action Preset
                <select className="ml-2 rounded p-1 border text-sm" value={actionPreset} onChange={(e) => setActionPreset(e.target.value as Preset)}>
                  <option value="muted">muted</option>
                  <option value="primary">primary</option>
                  <option value="success">success</option>
                  <option value="danger">danger</option>
                  <option value="warning">warning</option>
                  <option value="info">info</option>
                </select>
              </label>
              <label className="text-sm">Action Custom Color
                <input className="ml-2" type="checkbox" checked={actionCustomColor} onChange={(e) => setActionCustomColor(e.target.checked)} />
              </label>
              {actionCustomColor && (
                <input type="color" value={actionColor} onChange={(e) => setActionColor(e.target.value)} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
