"use client";
import React from 'react';

export default function PreviewLayout({
  title,
  preview,
  controls,
  snippet,
  className = '',
}: {
  title?: string;
  preview: React.ReactNode;
  controls?: React.ReactNode;
  snippet?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {title && <h3 className="text-lg font-medium">{title}</h3>}
      <div>
        <div className="text-sm font-medium mb-2">Preview</div>
        <div className="preview rounded p-4 bg-neutral-100 dark:bg-neutral-900">{preview}</div>
      </div>
      {controls && (
        <div>
          <div className="text-sm font-medium mb-2">Options</div>
          <div className="preview-controls rounded p-3 border dark:border-neutral-700 bg-white dark:bg-neutral-800">
            {controls}
          </div>
        </div>
      )}
      {snippet && (
        <div>
          <div className="text-sm font-medium mb-2">Usage</div>
          <div className="preview-usage rounded p-3 bg-neutral-50 dark:bg-neutral-950 text-xs">
            {snippet}
          </div>
        </div>
      )}
    </div>
  );
}
