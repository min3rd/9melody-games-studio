"use client";
import React from 'react';
import { CodePreview } from '@/components/ui';

export default function CodePreviewPreview(): React.ReactElement {
  const code = `npm i daisyui`;

  return (
    <div className="space-y-4">
      <h3 className="text-sm mb-2">Code</h3>
      <CodePreview code={code} />
    </div>
  );
}
