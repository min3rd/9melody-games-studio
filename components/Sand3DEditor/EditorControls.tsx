"use client";
import React from "react";
import { HeightMap } from "../Sand3D";

interface EditorControlsProps {
  heightMap: HeightMap;
  size: number;
  heightScale: number;
  color: string;
  selectedPoint: { row: number; col: number } | null;
  editMode: "edit" | "add" | "delete";
  onSizeChange: (size: number) => void;
  onHeightScaleChange: (scale: number) => void;
  onColorChange: (color: string) => void;
  onHeightChange: (row: number, col: number, height: number) => void;
  onPointSelect: (point: { row: number; col: number } | null) => void;
  onEditModeChange: (mode: "edit" | "add" | "delete") => void;
  onAddRow: () => void;
  onAddCol: () => void;
  onRemoveRow: () => void;
  onRemoveCol: () => void;
  onExport: () => void;
}

export default function EditorControls({
  heightMap,
  size,
  heightScale,
  color,
  selectedPoint,
  editMode,
  onSizeChange,
  onHeightScaleChange,
  onColorChange,
  onHeightChange,
  onPointSelect,
  onEditModeChange,
  onAddRow,
  onAddCol,
  onRemoveRow,
  onRemoveCol,
  onExport,
}: EditorControlsProps) {
  const rows = heightMap.length;
  const cols = heightMap[0].length;

  return (
    <div className="border rounded bg-white dark:bg-neutral-800 p-4 space-y-4 overflow-y-auto">
      <h3 className="text-lg font-semibold">Sand3D Editor</h3>

      {/* Edit Mode */}
      <div>
        <label className="text-sm font-medium mb-2 block">Edit Mode</label>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 text-xs rounded ${
              editMode === "edit"
                ? "bg-blue-500 text-white"
                : "bg-neutral-200 dark:bg-neutral-700"
            }`}
            onClick={() => onEditModeChange("edit")}
          >
            Edit
          </button>
          <button
            className={`px-3 py-1 text-xs rounded ${
              editMode === "add"
                ? "bg-green-500 text-white"
                : "bg-neutral-200 dark:bg-neutral-700"
            }`}
            onClick={() => onEditModeChange("add")}
          >
            Add
          </button>
          <button
            className={`px-3 py-1 text-xs rounded ${
              editMode === "delete"
                ? "bg-red-500 text-white"
                : "bg-neutral-200 dark:bg-neutral-700"
            }`}
            onClick={() => onEditModeChange("delete")}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Size Controls */}
      <div>
        <label className="text-sm font-medium mb-2 block">Size</label>
        <input
          type="number"
          min="1"
          max="20"
          step="0.5"
          className="w-full rounded border px-2 py-1 text-sm"
          value={size}
          onChange={(e) => onSizeChange(parseFloat(e.target.value) || 8)}
        />
      </div>

      {/* Height Scale */}
      <div>
        <label className="text-sm font-medium mb-2 block">
          Height Scale: {heightScale}
        </label>
        <input
          type="range"
          min="0.5"
          max="5"
          step="0.1"
          className="w-full"
          value={heightScale}
          onChange={(e) => onHeightScaleChange(parseFloat(e.target.value))}
        />
      </div>

      {/* Color */}
      <div>
        <label className="text-sm font-medium mb-2 block">Color</label>
        <input
          type="color"
          className="w-full h-10 cursor-pointer rounded border"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
        />
      </div>

      {/* Grid Size */}
      <div>
        <label className="text-sm font-medium mb-2 block">Grid Size: {rows} x {cols}</label>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded"
            onClick={onAddRow}
          >
            + Row
          </button>
          <button
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded"
            onClick={onAddCol}
          >
            + Col
          </button>
          <button
            className="px-3 py-1 text-xs bg-red-500 text-white rounded"
            onClick={onRemoveRow}
            disabled={rows <= 1}
          >
            - Row
          </button>
          <button
            className="px-3 py-1 text-xs bg-red-500 text-white rounded"
            onClick={onRemoveCol}
            disabled={cols <= 1}
          >
            - Col
          </button>
        </div>
      </div>

      {/* Height Map Editor */}
      <div>
        <label className="text-sm font-medium mb-2 block">Height Map</label>
        <div className="border rounded p-2 bg-neutral-50 dark:bg-neutral-900 max-h-64 overflow-auto">
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
            {heightMap.map((row, rowIdx) =>
              row.map((height, colIdx) => {
                const isSelected = selectedPoint?.row === rowIdx && selectedPoint?.col === colIdx;
                return (
                  <input
                    key={`${rowIdx}-${colIdx}`}
                    type="number"
                    step="0.1"
                    className={`w-full px-1 py-1 text-xs rounded border ${
                      isSelected
                        ? "bg-blue-200 dark:bg-blue-800 border-blue-500"
                        : "bg-white dark:bg-neutral-800"
                    }`}
                    value={height.toFixed(1)}
                    onChange={(e) =>
                      onHeightChange(rowIdx, colIdx, parseFloat(e.target.value) || 0)
                    }
                    onClick={() => onPointSelect({ row: rowIdx, col: colIdx })}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Selected Point Editor */}
      {selectedPoint && (
        <div>
          <label className="text-sm font-medium mb-2 block">
            Selected Point: [{selectedPoint.row}, {selectedPoint.col}]
          </label>
          <input
            type="number"
            step="0.1"
            className="w-full rounded border px-2 py-1 text-sm"
            value={heightMap[selectedPoint.row][selectedPoint.col].toFixed(2)}
            onChange={(e) =>
              onHeightChange(
                selectedPoint.row,
                selectedPoint.col,
                parseFloat(e.target.value) || 0
              )
            }
          />
        </div>
      )}

      {/* Export */}
      <div>
        <button
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={onExport}
        >
          Export Configuration
        </button>
      </div>

      {/* JSON Preview */}
      <div>
        <label className="text-sm font-medium mb-2 block">Height Map JSON</label>
        <pre className="text-xs bg-neutral-100 dark:bg-neutral-900 p-2 rounded overflow-auto max-h-32">
          {JSON.stringify(heightMap, null, 2)}
        </pre>
      </div>
    </div>
  );
}

