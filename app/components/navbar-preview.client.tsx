"use client";
import React, { useState } from 'react';
import Navbar, { type NavbarPlacement, type NavbarDisplay } from '@/components/ui/Navbar';
import { type Preset } from '@/components/ui/presets';
import type { UISize } from '@/components/ui/presets';
import PreviewLayout from '@/components/preview/PreviewLayout';
import { useI18n } from '@/hooks/useI18n';

export default function NavbarPreview(): React.ReactElement {
  const { t } = useI18n();
  const [placement, setPlacement] = useState<NavbarPlacement>('left');
  const [display, setDisplay] = useState<NavbarDisplay>('side');
  const [size, setSize] = useState<UISize>('md');
  const [preset, setPreset] = useState<Preset>('muted');
  const [useCustom, setUseCustom] = useState(false);
  const [color, setColor] = useState<string>('#3b82f6');
  const [withEffects, setWithEffects] = useState(true);

  const items = [
    { label: 'Home', href: '#home' },
    { label: 'Games', href: '#games' },
    { label: 'Blog', href: '#blog' },
    { label: 'Contact', href: '#contact' },
  ];

  const sampleContent = (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">{t('example_text') ?? 'Mock app content'}</h2>
      <p className="mt-2 text-neutral-600 dark:text-neutral-300">{t('preview.navbar.description') ?? 'Use the controls to change the Navbar placement and rendering behaviour.'}</p>
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

  const preview = (
    <div className="mt-2 bg-neutral-50 dark:bg-neutral-900 border rounded p-3">
      {/* Side display (push content) */}
      {display === 'side' && placement === 'left' && (
        <div className="flex">
          <Navbar items={items} placement={placement} display={display} size={size} preset={preset} color={useCustom ? color : undefined} withEffects={withEffects} />
          <div className="flex-1">{sampleContent}</div>
        </div>
      )}
      {display === 'side' && placement === 'right' && (
        <div className="flex">
          <div className="flex-1">{sampleContent}</div>
          <Navbar items={items} placement={placement} display={display} size={size} preset={preset} color={useCustom ? color : undefined} withEffects={withEffects} />
        </div>
      )}
      {display === 'side' && placement === 'top' && (
        <div>
          <Navbar items={items} placement={placement} display={display} size={size} preset={preset} color={useCustom ? color : undefined} withEffects={withEffects} />
          {sampleContent}
        </div>
      )}
      {display === 'side' && placement === 'bottom' && (
        <div>
          {sampleContent}
          <Navbar items={items} placement={placement} display={display} size={size} preset={preset} color={useCustom ? color : undefined} withEffects={withEffects} />
        </div>
      )}

      {/* Overlay display (overlay on top of content) */}
      {display === 'over' && (placement === 'left' || placement === 'right') && (
        <div className="relative">
          {sampleContent}
          <div className="absolute inset-0 pointer-events-auto"><Navbar items={items} placement={placement} display={display} size={size} preset={preset} color={useCustom ? color : undefined} withEffects={withEffects} /></div>
        </div>
      )}

      {display === 'over' && (placement === 'top' || placement === 'bottom') && (
        <div className="relative">
          <Navbar items={items} placement={placement} display={display} size={size} preset={preset} color={useCustom ? color : undefined} withEffects={withEffects} />
          {sampleContent}
        </div>
      )}
    </div>
  );

  const controls = (
    <div className="flex flex-wrap items-center gap-3">
      <label className="text-sm">{t('preview.common.size')}
        <select className="ml-2 rounded p-1 border text-sm" value={size} onChange={(e) => setSize(e.target.value as UISize)}>
          <option value="sm">{t('preview.common.small') ?? 'Small'}</option>
          <option value="md">{t('preview.common.medium') ?? 'Medium'}</option>
          <option value="lg">{t('preview.common.large') ?? 'Large'}</option>
        </select>
      </label>
      <label className="text-sm">{t('preview.common.preset')}
        <select className="ml-2 rounded p-1 border text-sm" value={preset} onChange={(e) => setPreset(e.target.value as Preset)}>
          <option value="muted">muted</option>
          <option value="primary">primary</option>
          <option value="success">success</option>
          <option value="danger">danger</option>
          <option value="warning">warning</option>
          <option value="info">info</option>
        </select>
      </label>
      <label className="text-sm">{t('preview.common.customColor') ?? 'Custom Color'}
        <input className="ml-2" type="checkbox" checked={useCustom} onChange={(e) => setUseCustom(e.target.checked)} />
      </label>
      {useCustom && <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />}
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
      <label className="text-sm">With Effects
        <input className="ml-2" type="checkbox" checked={withEffects} onChange={(e) => setWithEffects(e.target.checked)} />
      </label>
    </div>
  );

  const snippet = (
    <pre className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded text-xs">{`import { Navbar } from '@/components/ui';

<Navbar items={[{label: 'Home', href:'#'}]} placement="${placement}" display="${display}" size="${size}" preset="${preset}" ${useCustom ? `color="${color}"` : ''} />`}</pre>
  );
        <label className="text-sm">Placement
          <select className="ml-2 rounded p-1 border text-sm" value={placement} onChange={(e) => setPlacement(e.target.value as NavbarPlacement)}>
            <option value="left">Left</option>
            <option value="right">Right</option>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
          </select>
        </label>
  return (
    <PreviewLayout
      title="Navbar"
      preview={preview}
      controls={controls}
      snippet={snippet}
    />
  );
}