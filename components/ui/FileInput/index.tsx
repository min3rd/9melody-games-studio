"use client";
import React, { useRef, useState } from 'react';
import { useI18n } from '@/hooks/useI18n';
import clsx from 'clsx';
import { PRESET_MAP, type Preset, type UISize } from '../presets';

export interface FileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'size' | 'title'> {
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
  preset?: Preset;
  color?: string;
  size?: UISize;
  withPreview?: boolean; // show file names
  onFilesChange?: (files: FileList | null) => void;
  placeholder?: string;
  buttonLabel?: string;
  showClear?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  hint?: React.ReactNode;
}

export default function FileInput({
  multiple = false,
  accept,
  disabled = false,
  preset = 'muted',
  color,
  size = 'md',
  withPreview = true,
  onFilesChange,
  placeholder = 'No file selected',
  buttonLabel,
  showClear = true,
  title,
  description,
  hint,
  className = '',
  ...rest
}: FileInputProps): React.ReactElement {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const { t } = useI18n();
  const presetColor = preset ? PRESET_MAP[preset] : undefined;
  const chooseLabel = buttonLabel ?? t('fileInput.chooseFile');
  const clearLabel = t('fileInput.clear');
  const activeColor = color ?? presetColor ?? PRESET_MAP.primary;
  const sizeClass = size === 'sm' ? 'text-sm py-2 px-3' : size === 'lg' ? 'text-base py-3 px-4' : 'text-sm py-2 px-3';

  function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newFiles = e.target.files && e.target.files.length ? e.target.files : null;
    setFiles(newFiles);
    onFilesChange?.(newFiles);
  }

  function openDialog() {
    if (disabled) return;
    inputRef.current?.click();
  }

  function clearFiles(e?: React.MouseEvent) {
    e?.stopPropagation();
    if (disabled) return;
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setFiles(null);
    onFilesChange?.(null);
  }

  const fileNames = files && files.length ? Array.from(files).map((f) => f.name).join(', ') : '';

  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      {title && <div className="text-sm font-medium">{title}</div>}
      {description && <div className="text-xs text-neutral-500 dark:text-neutral-400">{description}</div>}

      <div
        className={clsx(
          'relative flex items-center gap-3 rounded border',
          disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
          'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800',
          sizeClass
        )}
        onClick={openDialog}
        role="button"
        aria-disabled={disabled}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleFilesChange}
          className="sr-only"
          {...rest}
        />

        <div className="flex-1 text-sm text-neutral-700 dark:text-neutral-200 truncate">{files && files.length ? fileNames : (placeholder ?? t('fileInput.noFileSelected'))}</div>

        <div className="flex items-center gap-2">
          {showClear && files && (
            <button
              type="button"
              onClick={clearFiles}
              className="text-xs px-2 py-1 rounded border border-neutral-200 dark:border-neutral-700 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-700"
            >
              {clearLabel}
            </button>
          )}

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); openDialog(); }}
            className="text-xs font-medium rounded px-3 py-1"
            style={{ backgroundColor: activeColor, color: 'white' }}
          >
            {chooseLabel}
          </button>
        </div>
      </div>

      {hint && <div className="text-xs text-neutral-500 dark:text-neutral-400">{hint}</div>}
      {withPreview && files && files.length > 0 && (
        <div className="mt-2 text-xs text-neutral-600 dark:text-neutral-300">
          {files.length === 1 ? (
            <div>{t('fileInput.filesSelectedOne', { name: files[0].name })}</div>
          ) : (
            <div>{t('fileInput.filesSelectedMultiple', { count: files.length })}</div>
          )}
        </div>
      )}
    </div>
  );
}
