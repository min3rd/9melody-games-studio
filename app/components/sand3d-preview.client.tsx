"use client";
import React, { useState } from "react";
import Sand3D, { HeightMap } from "@/components/Sand3D";
import PreviewLayout from "@/components/preview/PreviewLayout";
import { CodePreview } from "@/components/ui";

export default function Sand3DPreview(): React.ReactElement {
  const [heightMap, setHeightMap] = useState<HeightMap>([
    [0, 0.1, 0.2, 0.1, 0],
    [0.1, 0.3, 0.4, 0.3, 0.1],
    [0.2, 0.4, 0.5, 0.4, 0.2],
    [0.1, 0.3, 0.4, 0.3, 0.1],
    [0, 0.1, 0.2, 0.1, 0],
  ]);

  const [color, setColor] = useState<string>("#F4D03F");
  const [useColorFunction, setUseColorFunction] = useState(false);
  const [size, setSize] = useState<number>(8);
  const [heightScale, setHeightScale] = useState<number>(2);
  const [animated, setAnimated] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [wireframe, setWireframe] = useState(false);

  const exampleMaps: Record<string, HeightMap> = {
    flat: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
    hills: [
      [0, 0.1, 0.2, 0.1, 0],
      [0.1, 0.3, 0.4, 0.3, 0.1],
      [0.2, 0.4, 0.5, 0.4, 0.2],
      [0.1, 0.3, 0.4, 0.3, 0.1],
      [0, 0.1, 0.2, 0.1, 0],
    ],
    waves: [
      [0.1, 0.2, 0.1, 0.2, 0.1],
      [0.2, 0.1, 0.2, 0.1, 0.2],
      [0.1, 0.2, 0.1, 0.2, 0.1],
      [0.2, 0.1, 0.2, 0.1, 0.2],
      [0.1, 0.2, 0.1, 0.2, 0.1],
    ],
    valleys: [
      [-0.2, -0.1, 0, 0.1, 0.2],
      [-0.1, 0, 0.1, 0.2, 0.1],
      [0, 0.1, 0.3, 0.1, 0],
      [0.1, 0.2, 0.1, 0, -0.1],
      [0.2, 0.1, 0, -0.1, -0.2],
    ],
  };

  const heightColorFunction = (height: number, maxHeight: number, minHeight: number) => {
    const normalized = (height - minHeight) / (maxHeight - minHeight || 1);
    if (normalized < 0.3) return "#F4D03F";
    if (normalized < 0.6) return "#F7DC6F";
    return "#D4AC0D";
  };

  const snippet = `const heightMap: HeightMap = [
  [0, 0.1, 0.2, 0.1, 0],
  [0.1, 0.3, 0.4, 0.3, 0.1],
  [0.2, 0.4, 0.5, 0.4, 0.2],
  [0.1, 0.3, 0.4, 0.3, 0.1],
  [0, 0.1, 0.2, 0.1, 0],
];

<Sand3D 
  heightMap={heightMap}
  color="${color}"
  size={${size}}
  heightScale={${heightScale}}
  animated={${animated}}
  showControls={${showControls}}
  wireframe={${wireframe}}
/>`;

  return (
    <PreviewLayout
      title="Sand3D - 3D Sand Surface Component"
      preview={
        <div className="space-y-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            Component 3D mặt cát với tham số truyền vào là ma trận vị trí các độ cao và màu sắc.
          </p>
          <div className="h-64 border rounded bg-gradient-to-b from-amber-50 to-amber-100 dark:from-amber-900 dark:to-amber-800">
            <Sand3D
              heightMap={heightMap}
              color={useColorFunction ? heightColorFunction : color}
              size={size}
              heightScale={heightScale}
              animated={animated}
              showControls={showControls}
              wireframe={wireframe}
            />
          </div>
        </div>
      }
      controls={
        <div className="space-y-4 text-sm">
          <div>
            <div className="text-xs font-medium mb-2">Example Height Maps</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(exampleMaps).map(([name, map]) => (
                <button
                  key={name}
                  className="px-3 py-1 text-xs border rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  onClick={() => setHeightMap(map)}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2">
              <span>Color</span>
              <input
                type="color"
                className="h-7 w-12 cursor-pointer rounded border"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                disabled={useColorFunction}
              />
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={useColorFunction}
                onChange={(e) => setUseColorFunction(e.target.checked)}
              />
              <span>Use Height-based Color</span>
            </label>
            <label className="flex items-center gap-2">
              <span>Size</span>
              <input
                type="number"
                min="1"
                max="20"
                step="1"
                className="w-16 rounded border px-2 py-1 text-xs"
                value={size}
                onChange={(e) => setSize(parseFloat(e.target.value) || 8)}
              />
            </label>
            <label className="flex items-center gap-2">
              <span>Height Scale</span>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.1"
                className="w-20"
                value={heightScale}
                onChange={(e) => setHeightScale(parseFloat(e.target.value))}
              />
              <span className="text-xs">{heightScale}</span>
            </label>
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={animated}
                onChange={(e) => setAnimated(e.target.checked)}
              />
              <span>Animated</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showControls}
                onChange={(e) => setShowControls(e.target.checked)}
              />
              <span>Show Controls</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={wireframe}
                onChange={(e) => setWireframe(e.target.checked)}
              />
              <span>Wireframe</span>
            </label>
          </div>
        </div>
      }
      snippet={<CodePreview code={snippet} />}
    />
  );
}

