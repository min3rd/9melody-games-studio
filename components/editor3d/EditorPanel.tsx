"use client";
import React, { ReactNode } from 'react';
import clsx from 'clsx';

export interface EditorPanelProps {
  title?: string;
  children: ReactNode;
  className?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  headerActions?: ReactNode;
  resizable?: boolean;
}

/**
 * EditorPanel - A reusable panel component for the 3D Editor
 * Provides a consistent layout with optional header, collapsibility, and custom actions
 */
export default function EditorPanel({
  title,
  children,
  className = '',
  collapsible = false,
  collapsed = false,
  onToggleCollapse,
  headerActions,
  resizable = false,
}: EditorPanelProps) {
  return (
    <div
      className={clsx(
        'flex flex-col bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700',
        'overflow-hidden',
        resizable && 'resize-y',
        className
      )}
    >
      {/* Panel Header */}
      {(title || headerActions || collapsible) && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900">
          <div className="flex items-center gap-2 flex-1">
            {collapsible && (
              <button
                onClick={onToggleCollapse}
                className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-sm transition-colors"
                aria-label={collapsed ? 'Expand panel' : 'Collapse panel'}
              >
                <span className="text-xs">{collapsed ? '▶' : '▼'}</span>
              </button>
            )}
            {title && (
              <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                {title}
              </h3>
            )}
          </div>
          {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
        </div>
      )}

      {/* Panel Content */}
      {!collapsed && (
        <div className="flex-1 overflow-auto p-3">
          {children}
        </div>
      )}
    </div>
  );
}
