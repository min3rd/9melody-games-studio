"use client";
import React, { useState } from 'react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { type Preset } from '@/components/ui/presets';
import type { UISize } from '@/components/ui/presets';

export default function BreadcrumbsPreview(): React.ReactElement {
  const [preset, setPreset] = useState<Preset>('muted');
  const [useCustom, setUseCustom] = useState(false);
  const [color, setColor] = useState('#3b82f6');
  const [size, setSize] = useState<UISize>('md');
  const [textSize, setTextSize] = useState<'sm'|'md'|'lg'>('md');
  const [separatorVariant, setSeparatorVariant] = useState<'slash'|'chevron'|'arrow'|'dot'|'none'>('slash');
  const [showIcon, setShowIcon] = useState(true);
  const [rounded, setRounded] = useState(true);

  const items = [
    { label: 'Home', href: '/', icon: <span className="w-3 h-3 rounded-full bg-neutral-300" /> },
    { label: 'Docs', href: '/docs', icon: <span className="w-3 h-3 rounded-full bg-neutral-400" /> },
    { label: 'Components', href: '/docs/components', icon: <span className="w-3 h-3 rounded-full bg-neutral-500" /> },
    { label: 'Breadcrumbs', icon: <span className="w-3 h-3 rounded-full bg-neutral-600" />, active: true },
  ];

  const presetProp: Preset | undefined = useCustom ? undefined : preset;
  const colorProp = useCustom ? color : undefined;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <label className="text-sm">Preset
          <select className="ml-2 text-sm rounded p-1 border" value={preset} onChange={(e) => setPreset(e.target.value as Preset)}>
            <option value="primary">Primary</option>
            <option value="success">Success</option>
            <option value="danger">Danger</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
            <option value="muted">Muted</option>
          </select>
        </label>
        <label className="text-sm">Use custom color
          <input className="ml-2" type="checkbox" checked={useCustom} onChange={(e) => setUseCustom(e.target.checked)} />
        </label>
        {useCustom && (
          <label className="text-sm">Color
            <input className="ml-2" type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </label>
        )}

        <label className="text-sm">Size
          <select className="ml-2 text-sm rounded p-1 border" value={size} onChange={(e) => setSize(e.target.value as UISize)}>
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </label>
        <label className="text-sm">Text size
          <select className="ml-2 text-sm rounded p-1 border" value={textSize} onChange={(e) => setTextSize(e.target.value as 'sm'|'md'|'lg')}>
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </label>
        <label className="text-sm">Separator
          <select className="ml-2 text-sm rounded p-1 border" value={separatorVariant} onChange={(e) => setSeparatorVariant(e.target.value as 'slash'|'chevron'|'arrow'|'dot'|'none')}>
            <option value="slash">Slash</option>
            <option value="chevron">Chevron</option>
            <option value="arrow">Arrow</option>
            <option value="dot">Dot</option>
            <option value="none">None</option>
          </select>
        </label>
        <label className="text-sm">Icons
          <input className="ml-2" type="checkbox" checked={showIcon} onChange={(e) => setShowIcon(e.target.checked)} />
        </label>
        <label className="text-sm">Rounded
          <input className="ml-2" type="checkbox" checked={rounded} onChange={(e) => setRounded(e.target.checked)} />
        </label>
      </div>

      <div className="mt-4">
  <Breadcrumbs items={items} preset={presetProp} color={colorProp} size={size} textSize={textSize} showIcon={showIcon} rounded={rounded} separatorVariant={separatorVariant} />
      </div>
    </div>
  );
}
