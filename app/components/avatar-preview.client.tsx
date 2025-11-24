"use client";
import React, { useState } from 'react';
import { Avatar, AvatarGroup } from '@/components/ui';
import PreviewLayout from '@/components/preview/PreviewLayout';
import type { Preset } from '@/components/ui/presets';

type UIPreset = Preset | 'custom' | 'none';

export default function AvatarPreview(): React.ReactElement {
  const [preset, setPreset] = useState<UIPreset>('muted');
  const [color, setColor] = useState<string>('#3b82f6');
  const [size, setSize] = useState<'sm'|'md'|'lg'>('md');
  const [withEffects, setWithEffects] = useState(true);
  const [rounded, setRounded] = useState(true);
  const [showIndicator, setShowIndicator] = useState(true);
  const [groupPreset, setGroupPreset] = useState<UIPreset>('muted');
  const [groupColor, setGroupColor] = useState<string>('#3b82f6');
  const [groupRounded, setGroupRounded] = useState(true);
  const groupPresetProp: Preset | undefined = groupPreset === 'custom' || groupPreset === 'none' ? undefined : (groupPreset as Preset);

  const avatars: Array<{ src?: string; name: string; preset?: Preset; alt?: string; color?: string }> = [
    { src: '/next.svg', name: 'Next' },
    { src: undefined, name: 'Elaine', preset: 'success' },
    { src: undefined, name: 'Minh', preset: 'warning' },
    { src: undefined, name: 'Tom', preset: 'info' },
  ];

  const presetProp: Preset | undefined = preset === 'custom' || preset === 'none' ? undefined : (preset as Preset);
  const colorProp = preset === 'custom' ? color : undefined;

  return (
    <PreviewLayout
      title="Avatar"
      preview={(
        <div className="flex items-center gap-3">
          <Avatar src="/next.svg" name="Next" size={size} rounded={rounded} withEffects={withEffects} indicator={showIndicator} />
          <Avatar name="Elaine K." size={size} rounded={rounded} withEffects={withEffects} preset={presetProp} color={colorProp} indicator={showIndicator} />
          <Avatar name="Minh Vu" size={size} rounded={rounded} withEffects={withEffects} preset={presetProp} color={colorProp} indicator={showIndicator} />
        </div>
      )}
      controls={(
        <div className="space-y-3">
          <div className="flex items-center gap-2">
        <label className="text-sm">Size
          <select className="ml-2 text-sm rounded p-1 border" value={size} onChange={(e) => setSize(e.target.value as 'sm'|'md'|'lg')}>
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </label>

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
          <label className="text-sm">Custom color
            <input className="ml-2" type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </label>
        )}
      </div>

      <div className="flex gap-4 items-center">
        <label className="text-sm">Rounded
          <input className="ml-2" type="checkbox" checked={rounded} onChange={(e) => setRounded(e.target.checked)} />
        </label>

        <label className="text-sm">Effects
          <input className="ml-2" type="checkbox" checked={withEffects} onChange={(e) => setWithEffects(e.target.checked)} />
        </label>

        <label className="text-sm">Indicator
          <input className="ml-2" type="checkbox" checked={showIndicator} onChange={(e) => setShowIndicator(e.target.checked)} />
        </label>
      </div>

      <div className="mt-4">
        <div className="font-medium mb-2">Group Example</div>
  <div className="flex items-center gap-3">
  <AvatarGroup avatars={avatars} size={size} max={3} preset={groupPresetProp} color={groupColor} rounded={groupRounded} />
    <div className="flex flex-col gap-2 ml-4">
      <label className="text-sm">Group Preset
      <select className="ml-2 text-sm rounded p-1 border" value={groupPreset} onChange={(e) => setGroupPreset(e.target.value as UIPreset)}>
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
      {groupPreset === 'custom' && (
        <label className="text-sm">Group Color
          <input className="ml-2" type="color" value={groupColor} onChange={(e) => setGroupColor(e.target.value)} />
        </label>
      )}
      <label className="text-sm">Group Rounded
        <input className="ml-2" type="checkbox" checked={groupRounded} onChange={(e) => setGroupRounded(e.target.checked)} />
      </label>
    </div>
  </div>
          </div>
        </div>
      )}
      snippet={(
        <pre className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded text-xs">{`<Avatar name="Minh Vu" size="${size}" preset="${presetProp ?? 'muted'}" color="${colorProp ?? ''}" rounded={${rounded}} indicator={${showIndicator}} />`}</pre>
      )}
    />
  );
}
