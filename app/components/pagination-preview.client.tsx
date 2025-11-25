"use client";
import React, { useState } from 'react';
import Pagination from '@/components/ui/Pagination';
import { type Preset } from '@/components/ui/presets';
import type { UISize } from '@/components/ui/presets';
import PreviewLayout from '@/components/preview/PreviewLayout';
import { useI18n } from '@/hooks/useI18n';
import { CodePreview } from '@/components/ui';

export default function PaginationPreview(): React.ReactElement {
  const { t } = useI18n();
  const [size, setSize] = useState<UISize>('md');
  const [preset, setPreset] = useState<Preset>('muted');
  const [useCustom, setUseCustom] = useState(false);
  const [color, setColor] = useState<string>('#3b82f6');
  const [withEffects, setWithEffects] = useState(true);
  const [currentPage, setCurrentPage] = useState(4);
  const [totalPages, setTotalPages] = useState(12);
  const [showPrevNext, setShowPrevNext] = useState(true);
  const [showFirstLast, setShowFirstLast] = useState(false);
  const [siblingsCount, setSiblingsCount] = useState(1);
  const [boundaryCount, setBoundaryCount] = useState(1);

  const preview = (
    <div className="p-4 bg-white dark:bg-neutral-800 rounded">
      <p className="mb-2 text-sm">{t('preview.pagination.description') ?? 'Pagination component visual demonstration.'}</p>
      <div className="mb-2 text-sm">{t('preview.pagination.current') ?? 'Current page'}: {currentPage}</div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(p) => setCurrentPage(p)} size={size} preset={preset} color={useCustom ? color : undefined} withEffects={withEffects} showPrevNext={showPrevNext} showFirstLast={showFirstLast} siblingsCount={siblingsCount} boundaryCount={boundaryCount} />
    </div>
  );

  const controls = (
    <div className="flex flex-wrap items-center gap-3">
      <label className="text-sm">{t('preview.common.size')}
          <select className="ml-2 rounded p-1 border text-sm" value={size} onChange={(e) => setSize(e.target.value as UISize)}>
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </label>

      <label className="text-sm">{t('preview.common.withEffects') ?? 'With Effects'}
          <input className="ml-2" type="checkbox" checked={withEffects} onChange={(e) => setWithEffects(e.target.checked)} />
        </label>

      <label className="text-sm">{t('preview.common.customColor') ?? 'Custom color'}
          <input className="ml-2" type="checkbox" checked={useCustom} onChange={(e) => setUseCustom(e.target.checked)} />
        </label>
        {useCustom && (
          <label className="text-sm">Color
            <input className="ml-2" type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </label>
        )}

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

      <label className="text-sm">{t('preview.pagination.total') ?? 'Total'}
          <input type="number" className="ml-2 rounded p-1 border w-20 text-sm" value={totalPages} min={1} max={100} onChange={(e) => setTotalPages(parseInt(e.target.value || '1', 10))} />
        </label>
      <label className="text-sm">{t('preview.pagination.prevNext') ?? 'Prev/Next'}
        <input className="ml-2" type="checkbox" checked={showPrevNext} onChange={(e) => setShowPrevNext(e.target.checked)} />
      </label>

      <label className="text-sm">{t('preview.pagination.firstLast') ?? 'First/Last'}
        <input className="ml-2" type="checkbox" checked={showFirstLast} onChange={(e) => setShowFirstLast(e.target.checked)} />
      </label>

      <label className="text-sm">{t('preview.pagination.siblings') ?? 'Siblings'}
        <input type="number" className="ml-2 rounded p-1 border w-20 text-sm" value={siblingsCount} min={0} max={5} onChange={(e) => setSiblingsCount(Math.max(0, Math.min(5, parseInt(e.target.value || '0', 10))))} />
      </label>

      <label className="text-sm">{t('preview.pagination.boundary') ?? 'Boundary'}
        <input type="number" className="ml-2 rounded p-1 border w-20 text-sm" value={boundaryCount} min={0} max={5} onChange={(e) => setBoundaryCount(Math.max(0, Math.min(5, parseInt(e.target.value || '0', 10))))} />
      </label>
    </div>
  );

  const snippetCode = `import { Pagination } from '@/components/ui';\n\n<Pagination currentPage={${currentPage}} totalPages={${totalPages}} onPageChange={(p) => console.log(p)} size="${size}" preset="${preset}"${useCustom ? ` color="${color}"` : ''}${showPrevNext ? ' showPrevNext={true}' : ''}${showFirstLast ? ' showFirstLast={true}' : ''} siblingsCount={${siblingsCount}} boundaryCount={${boundaryCount}} />`;

  const snippet = (
    <CodePreview language="tsx" code={snippetCode} />
  );

  return (
    <PreviewLayout
      title="Pagination"
      preview={preview}
      controls={controls}
      snippet={snippet}
    />
  );
}
