"use client";
import React, { useState } from "react";
import { useI18n } from "@/hooks/useI18n";

export interface CodePreviewProps {
  code: string;
  language?: string;
  showCopy?: boolean;
}

export default function CodePreview({
  code,
  language = "bash",
  showCopy = true,
}: Readonly<CodePreviewProps>) {
  const [copied, setCopied] = useState(false);
  const { t } = useI18n();

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore silently
    }
  }

  return (
    <div className="relative w-full overflow-hidden">
      {showCopy && (
        <button
          onClick={copy}
          aria-label={copied ? t("copied") : t("copy")}
          className={`absolute right-1 top-1 px-2 py-1 rounded-sm text-xs bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 ${
            copied ? "text-green-600 dark:text-green-400" : "text-neutral-800 dark:text-neutral-100"
          }`}
        >
          {copied ? t("copied") : t("copy")}
        </button>
      )}

      <pre className="rounded px-3 py-2 bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-mono text-sm overflow-auto whitespace-pre custom-scrollbar">
        <code lang={language}>{code}</code>
      </pre>
    </div>
  );
}
