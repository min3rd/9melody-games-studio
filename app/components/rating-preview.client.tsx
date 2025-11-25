"use client";
import React, { useState } from "react";
import { Rating } from "@/components/ui";
import PreviewLayout from '@/components/preview/PreviewLayout';
import { CodePreview } from '@/components/ui';
import { useI18n } from '@/hooks/useI18n';

export default function RatingPreview() {
  const { t } = useI18n();
  const [value, setValue] = useState(3);
  const preview = (
    <div className="p-4 bg-white dark:bg-neutral-800 rounded">
      <div className="flex flex-col gap-4">
        <div>
          <span className="block mb-1 font-medium">{t('preview.common.default') ?? 'Default'}</span>
          <Rating value={value} onChange={setValue} />
        </div>
        <div>
          <span className="block mb-1 font-medium">{t('preview.rating.customPreset') ?? 'Custom Preset (success), Size lg'}</span>
          <Rating value={value} onChange={setValue} preset="success" size="lg" />
        </div>
        <div>
          <span className="block mb-1 font-medium">{t('preview.rating.customColor') ?? 'Custom Color, Size sm, No Effects'}</span>
          <Rating value={value} onChange={setValue} color="#f59e42" size="sm" withEffects={false} />
        </div>
        <div>
          <span className="block mb-1 font-medium">{t('preview.rating.readOnly') ?? 'Read Only'}</span>
          <Rating value={4} readOnly />
        </div>
      </div>
      <div>
        <span className="block text-sm text-gray-500 dark:text-gray-400">{t('preview.rating.current') ?? 'Current value'}: {value}</span>
      </div>
    </div>
  );

  const controls = (
    <div className="flex items-center gap-3">
      <label className="text-sm">{t('preview.rating.value') ?? 'Value'}
        <input type="range" min={0} max={5} value={value} onChange={(e) => setValue(Number(e.target.value))} className="ml-2" />
      </label>
    </div>
  );

  const snippetCode = `import { Rating } from '@/components/ui';\n\n<Rating value={${value}} onChange={setValue} />`;

  const snippet = <CodePreview language="tsx" code={snippetCode} />;

  return (
    <PreviewLayout title="Rating" preview={preview} controls={controls} snippet={snippet} />
  );
}
