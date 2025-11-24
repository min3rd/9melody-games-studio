"use client";
import React, { useState } from 'react';
import FileInput from '@/components/ui/FileInput';
import { type Preset } from '@/components/ui/presets';

export default function FileInputPreview(): React.ReactElement {
  const [files, setFiles] = useState<FileList | null>(null);
  const [preset, setPreset] = useState<Preset>('muted');
  const [useCustom, setUseCustom] = useState(false);
  const [color, setColor] = useState('#06b6d4');
  const [multiple, setMultiple] = useState(false);
  const [accept, setAccept] = useState('');
  const [showPreview, setShowPreview] = useState(true);

  return (
    <div className="space-y-4 bg-white dark:bg-neutral-800 rounded-lg shadow text-neutral-900 dark:text-neutral-100">
      <div className="flex gap-4 items-center flex-wrap">
        <label className="text-sm">Multiple
          <input className="ml-2" type="checkbox" checked={multiple} onChange={(e) => setMultiple(e.target.checked)} />
        </label>
        <label className="text-sm">Accept
          <input className="ml-2 rounded p-1 border text-sm" value={accept} onChange={(e) => setAccept(e.target.value)} placeholder="image/*" />
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
        <label className="text-sm">Custom Color
          <input className="ml-2" type="checkbox" checked={useCustom} onChange={(e) => setUseCustom(e.target.checked)} />
        </label>
        {useCustom && <input className="ml-2" type="color" value={color} onChange={(e) => setColor(e.target.value)} />}
      </div>

      <div className="p-4 bg-white dark:bg-neutral-800 rounded">
        <FileInput
          multiple={multiple}
          accept={accept || undefined}
          preset={preset}
          color={useCustom ? color : undefined}
          onFilesChange={(f) => setFiles(f)}
          buttonLabel="Upload"
          showClear={true}
          withPreview={showPreview}
          title={<span>Upload file</span>}
          description={multiple ? 'You can select multiple files' : 'Select a file to upload'}
        />

        {files && (
          <div className="mt-2 text-xs">
            <div>Selected files:</div>
            <ul className="list-disc pl-6">
              {Array.from(files).map((f) => (
                <li key={f.name} className="truncate">{f.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
