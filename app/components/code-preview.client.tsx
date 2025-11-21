"use client";
import React from 'react';
import { CodePreview } from '@/components/ui';
import { useI18n } from '@/hooks/useI18n';

interface Props {
  code?: string;
}

export default function CodePreviewPreview({ code = 'npx create-react-app my-app' }: Props): React.ReactElement {
  const { t } = useI18n();
  return (
    <div className="space-y-4">
    <h3 className="text-sm mb-2">{t('code')}</h3>
      <CodePreview code={code} />
    </div>
  );
}
