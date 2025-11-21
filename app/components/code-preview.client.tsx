"use client";
import React from 'react';
import { CodePreview } from '@/components/ui';

interface Props {
  code?: string;
}

export default function CodePreviewPreview({ code = '' }: Props): React.ReactElement {
  return (
    <div className="space-y-4">
      <h3 className="text-sm mb-2">Code</h3>
      <CodePreview code={code} />
    </div>
  );
}
