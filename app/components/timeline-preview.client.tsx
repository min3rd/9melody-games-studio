"use client";
import React, { useState } from 'react';
import { Timeline, TimelineItem } from '@/components/ui';
import PreviewLayout from '@/components/preview/PreviewLayout';
import { CodePreview } from '@/components/ui';
import { useI18n } from '@/hooks/useI18n';
import type { Preset } from '@/components/ui/presets';
import type { UISize } from '@/components/ui/presets';

type UIPreset = Preset | 'custom' | 'none';

export default function TimelinePreview(): React.ReactElement {
  const { t } = useI18n();
  const [preset, setPreset] = useState<UIPreset>('muted');
  const [color, setColor] = useState<string>('#06b6d4');
  const [size, setSize] = useState<UISize>('md');
  const [rounded, setRounded] = useState(true);

  const presetProp: Preset | undefined = preset === 'custom' || preset === 'none' ? undefined : (preset as Preset);
  const colorProp = preset === 'custom' ? color : undefined;

  type TimelineStatus = 'pending' | 'active' | 'done' | 'warning' | 'danger' | 'info';
  const [statusOne, setStatusOne] = useState<TimelineStatus>('done');
  const [statusTwo, setStatusTwo] = useState<TimelineStatus>('active');
  const [statusThree, setStatusThree] = useState<TimelineStatus>('pending');

  const preview = (
    <div className="p-4">
      <div className="flex items-center gap-4">
        <label className="text-sm">Size
          <select className="ml-2 text-sm rounded p-1 border" value={size} onChange={(e) => setSize(e.target.value as UISize)}>
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
          <label className="text-sm">Color
            <input className="ml-2" type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </label>
        )}

        <label className="text-sm">Rounded
          <input className="ml-2" type="checkbox" checked={rounded} onChange={(e) => setRounded(e.target.checked)} />
        </label>
      </div>

      <div className="flex gap-4 items-center">
        <label className="text-sm">Item 1
          <select className="ml-2 text-sm rounded p-1 border" value={statusOne} onChange={(e) => setStatusOne(e.target.value as TimelineStatus)}>
            <option value="done">Done</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="warning">Warning</option>
            <option value="danger">Danger</option>
            <option value="info">Info</option>
          </select>
        </label>
        <label className="text-sm">Item 2
          <select className="ml-2 text-sm rounded p-1 border" value={statusTwo} onChange={(e) => setStatusTwo(e.target.value as TimelineStatus)}>
            <option value="done">Done</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="warning">Warning</option>
            <option value="danger">Danger</option>
            <option value="info">Info</option>
          </select>
        </label>
        <label className="text-sm">Item 3
          <select className="ml-2 text-sm rounded p-1 border" value={statusThree} onChange={(e) => setStatusThree(e.target.value as TimelineStatus)}>
            <option value="done">Done</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="warning">Warning</option>
            <option value="danger">Danger</option>
            <option value="info">Info</option>
          </select>
        </label>
      </div>

      <Timeline>
        <TimelineItem heading="Project kickoff" short="Initial planning" description="We held a kickoff meeting to align stakeholders, goals and timing." size={size} preset={presetProp} color={colorProp} rounded={rounded} status={statusOne} />
        <TimelineItem heading="Design phase" short="Wireframes and mocks" description="UX and UI designs were created and reviewed by the team." size={size} preset={presetProp} color={colorProp} rounded={rounded} status={statusTwo} />
        <TimelineItem heading="Development" short="Implement features" description="Development sprint work started, initial features implemented." size={size} preset={presetProp} color={colorProp} rounded={rounded} status={statusThree} />
      </Timeline>
    </div>
  );

  const snippetCode = `import { Timeline, TimelineItem } from '@/components/ui';\n\n<Timeline><TimelineItem heading="Project kickoff" short="Initial planning" description="We held a kickoff meeting" /></Timeline>`;

  const snippet = <CodePreview language="tsx" code={snippetCode} />;

  const controls = (
    <div className="flex flex-wrap items-center gap-3">
      <label className="text-sm">{t('preview.common.size')}
        <select className="ml-2 text-sm rounded p-1 border" value={size} onChange={(e) => setSize(e.target.value as UISize)}>
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
        </select>
      </label>
      <label className="text-sm">{t('preview.common.preset')}
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
        <label className="text-sm">{t('preview.common.color') ?? 'Color'}
          <input className="ml-2" type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </label>
      )}
      <label className="text-sm">{t('preview.common.rounded')}
        <input className="ml-2" type="checkbox" checked={rounded} onChange={(e) => setRounded(e.target.checked)} />
      </label>
    </div>
  );

  return (
    <PreviewLayout title="Timeline" preview={preview} controls={controls} snippet={snippet} />
  );
}
