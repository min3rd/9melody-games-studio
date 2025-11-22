"use client";
import React, { useState } from 'react';
import Navbar, { type NavbarPlacement, type NavbarDisplay } from '@/components/ui/Navbar';
import { type Preset } from '@/components/ui/presets';
import type { UISize } from '@/components/ui/presets';

export default function NavbarPreview(): React.ReactElement {
  const [placement, setPlacement] = useState<NavbarPlacement>('left');
  const [display, setDisplay] = useState<NavbarDisplay>('side');
  const [size, setSize] = useState<UISize>('md');
  const [preset] = useState<Preset>('muted');
  const [useCustom, setUseCustom] = useState(false);
  const [color, setColor] = useState('#3b82f6');
  const [withEffects, setWithEffects] = useState(true);

  const items = [
    { label: 'Home', href: '#home' },
    { label: 'Games', href: '#games' },
    { label: 'Blog', href: '#blog' },
    { label: 'Contact', href: '#contact' },
  ];

  const sampleContent = (
      <div className="p-6">
      <h2 className="text-2xl font-semibold">Mock app content</h2>
      <p className="mt-2 text-neutral-600 dark:text-neutral-300">Use the controls to change the Navbar placement and rendering behaviour.</p>
      <div className="mt-4 space-y-4">
        <div className="p-4 bg-white dark:bg-neutral-800 border rounded">Content block 1</div>
        <div className="p-4 bg-white dark:bg-neutral-800 border rounded">Content block 2</div>
        <div className="p-4 bg-white dark:bg-neutral-800 border rounded">Content block 3</div>
      </div>
    </div>
  );

  // wrapperClasses no longer used — we render explicit structures per placement

  const navEl = (
    <Navbar items={items} placement={placement} display={display} size={size} preset={preset} color={useCustom ? color : undefined} withEffects={withEffects} />
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm">Placement
          <select className="ml-2 rounded p-1 border text-sm" value={placement} onChange={(e) => setPlacement(e.target.value as NavbarPlacement)}>
            <option value="left">Left</option>
            <option value="right">Right</option>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
          </select>
        </label>

        <label className="text-sm">Display mode
          <select className="ml-2 rounded p-1 border text-sm" value={display} onChange={(e) => setDisplay(e.target.value as NavbarDisplay)}>
            <option value="side">Side (push content)</option>
            <option value="over">Over (overlay)</option>
          </select>
        </label>

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
      </div>

      <div className="mt-4 bg-neutral-50 dark:bg-neutral-900 border rounded p-3">
        {/* Side display (push content) */}
        {display === 'side' && placement === 'left' && (
          <div className="flex">
            {navEl}
            <div className="flex-1">{sampleContent}</div>
          </div>
        )}
        {display === 'side' && placement === 'right' && (
          <div className="flex">
            <div className="flex-1">{sampleContent}</div>
            {navEl}
          </div>
        )}
        {display === 'side' && placement === 'top' && (
          <div>
            {navEl}
            {sampleContent}
          </div>
        )}
        {display === 'side' && placement === 'bottom' && (
          <div>
            {sampleContent}
            {navEl}
          </div>
        )}

        {/* Overlay display (overlay on top of content) */}
        {display === 'over' && (placement === 'left' || placement === 'right') && (
          <div className="relative">
            {sampleContent}
            <div className="absolute inset-0 pointer-events-auto">{navEl}</div>
          </div>
        )}

        {display === 'over' && (placement === 'top' || placement === 'bottom') && (
          <div className="relative">
            {navEl}
            {sampleContent}
          </div>
        )}
      </div>
    </div>
  );
}
