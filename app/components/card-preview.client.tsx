"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter, CardTitle, CardThumbnail } from '@/components/ui/Card';
import { Button } from '@/components/ui';
import type { Preset, UICardSize } from '@/components/ui/presets';

export default function CardPreview() {
  const [size, setSize] = useState<UICardSize>('md');
  const [preset, setPreset] = useState<Preset | 'custom' | 'none'>('muted');
  const [color, setColor] = useState<string>('#3b82f6');
  const [rounded, setRounded] = useState(true);
  const [withEffects, setWithEffects] = useState(true);
  const [elevation, setElevation] = useState<'none'|'sm'|'md'|'lg'>('sm');

  const presetProp: Preset | undefined = preset === 'custom' || preset === 'none' ? undefined : (preset as Preset);
  const colorProp = preset === 'custom' ? color : undefined;

  return (
    <div className="space-y-4">
      <section>
        <div className="flex items-center gap-4 mb-3">
          <label className="text-sm">Size
            <select className="ml-2 text-sm rounded p-1 border" value={size} onChange={(e) => setSize(e.target.value as UICardSize)}>
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </label>

          <label className="text-sm">Preset
            <select className="ml-2 text-sm rounded p-1 border" value={preset} onChange={(e) => setPreset(e.target.value as Preset | 'custom' | 'none')}>
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

          <label className="text-sm">Rounded
            <input className="ml-2" type="checkbox" checked={rounded} onChange={(e) => setRounded(e.target.checked)} />
          </label>

          <label className="text-sm">Effects
            <input className="ml-2" type="checkbox" checked={withEffects} onChange={(e) => setWithEffects(e.target.checked)} />
          </label>

          <label className="text-sm">Elevation
            <select className="ml-2 text-sm rounded p-1 border" value={elevation} onChange={(e) => setElevation(e.target.value as 'none'|'sm'|'md'|'lg')}>
              <option value="none">None</option>
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </label>
        </div>

        <Card className="max-w-md" size={size} preset={presetProp} color={colorProp} rounded={rounded} withEffects={withEffects} elevation={elevation}>
          <CardThumbnail src="/next.svg" alt="Thumbnail" />
          <CardHeader heading={<CardTitle>Card Title</CardTitle>} subtitle={"Subtitle text"} actions={<Button variant="ghost">Action</Button>} />
          <CardBody>
            <p className="text-sm text-neutral-700 dark:text-neutral-200">This is a card body. It can hold text, lists, or other elements.</p>
          </CardBody>
          <CardFooter>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost">Cancel</Button>
              <Button>Confirm</Button>
            </div>
          </CardFooter>
        </Card>
      </section>

      <section>
        <Card className="max-w-sm" size={size} elevation={elevation} withEffects={withEffects} rounded={rounded}>
          <CardHeader heading={<CardTitle>Compact Card</CardTitle>} />
          <CardBody>
            <p className="text-sm">Compact body content. Multiple components can be placed inside.</p>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
