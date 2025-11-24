"use client";
import React, { useState } from 'react';
import { CodePreview } from '@/components/ui';
import { useI18n } from '@/hooks/useI18n';
import PreviewLayout from '@/components/preview/PreviewLayout';

interface Props {
  code?: string;
}

export default function CodePreviewPreview({ code: defaultCode = 'npx create-react-app my-app' }: Props): React.ReactElement {
  const { t } = useI18n();
  const [code, setCode] = useState<string>(defaultCode);
  const [language, setLanguage] = useState<string>('bash');
  const [showCopy, setShowCopy] = useState(true);

  const preview = (
    <CodePreview code={code} language={language} showCopy={showCopy} />
  );

  const controls = (
    <div className="space-y-2">
      <div className="flex gap-3 items-center">
        <label className="text-sm">{t('preview.code.language')}
          <select className="ml-2 rounded p-1 border text-sm" value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="bash">bash</option>
            <option value="json">json</option>
            <option value="tsx">tsx</option>
            <option value="ts">ts</option>
            <option value="js">js</option>
          </select>
        </label>
        <label className="text-sm">{t('preview.code.showCopy')}
          <input className="ml-2" type="checkbox" checked={showCopy} onChange={(e) => setShowCopy(e.target.checked)} />
        </label>
      </div>
      <div className="mt-2">
        <textarea className="w-full p-2 border rounded text-xs font-mono" rows={6} value={code} onChange={(e) => setCode(e.target.value)} />
      </div>
    </div>
  );

  const snippetStr = `<CodePreview code={${JSON.stringify(code)}} language="${language}" showCopy={${showCopy}} />`;
  const snippet = (
    <CodePreview code={snippetStr} language="tsx" showCopy={true} />
  );

  return (
    <PreviewLayout title={t('code')} preview={preview} controls={controls} snippet={snippet} />
  );
}
