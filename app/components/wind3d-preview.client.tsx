"use client";
import React, { useState } from "react";
import Wind3D, { WindIntensity, WindStyle } from "@/components/Wind3D";
import PreviewLayout from "@/components/preview/PreviewLayout";
import { CodePreview } from "@/components/ui";

export default function Wind3DPreview(): React.ReactElement {
  const [intensity, setIntensity] = useState<WindIntensity>("medium");
  const [style, setStyle] = useState<WindStyle>("streamlines");
  const [color, setColor] = useState<string>("#e0e0e0");
  const [directionX, setDirectionX] = useState(1);
  const [directionY, setDirectionY] = useState(0);
  const [directionZ, setDirectionZ] = useState(0);
  const [count, setCount] = useState(8);
  const [showArrow, setShowArrow] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const snippet = `<Wind3D 
  direction={[${directionX}, ${directionY}, ${directionZ}]}
  intensity="${intensity}" 
  style="${style}" 
  color="${color}"
  count={${count}}
  showArrow={${showArrow}}
  showControls={${showControls}}
/>`;

  return (
    <PreviewLayout
      title="Wind3D - 3D Wind Component"
      preview={
        <div className="space-y-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            Component 3D mô phỏng gió với các đường dòng chảy thể hiện hướng gió bằng khói/mây.
          </p>
          <div className="h-64 border rounded bg-gradient-to-b from-sky-100 to-sky-50 dark:from-sky-950 dark:to-sky-900">
            <Wind3D
              direction={[directionX, directionY, directionZ]}
              intensity={intensity}
              style={style}
              color={color}
              count={count}
              showArrow={showArrow}
              showControls={showControls}
            />
          </div>
        </div>
      }
      controls={
        <div className="space-y-4 text-sm">
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2">
              <span>Intensity</span>
              <select
                className="rounded border px-2 py-1 text-xs"
                value={intensity}
                onChange={(e) => setIntensity(e.target.value as WindIntensity)}
              >
                <option value="light">Light</option>
                <option value="medium">Medium</option>
                <option value="strong">Strong</option>
                <option value="very-strong">Very Strong</option>
              </select>
            </label>
            <label className="flex items-center gap-2">
              <span>Style</span>
              <select
                className="rounded border px-2 py-1 text-xs"
                value={style}
                onChange={(e) => setStyle(e.target.value as WindStyle)}
              >
                <option value="streamlines">Streamlines</option>
                <option value="particles">Particles</option>
                <option value="smoke">Smoke</option>
                <option value="cloud-trails">Cloud Trails</option>
              </select>
            </label>
            <label className="flex items-center gap-2">
              <span>Color</span>
              <input
                type="color"
                className="h-7 w-12 cursor-pointer rounded border"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </label>
            <label className="flex items-center gap-2">
              <span>Count</span>
              <input
                type="number"
                min="3"
                max="20"
                className="w-16 rounded border px-2 py-1 text-xs"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 8)}
              />
            </label>
          </div>
          <div className="space-y-2">
            <div className="text-xs font-medium">Direction (X, Y, Z)</div>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.1"
                className="w-20 rounded border px-2 py-1 text-xs"
                value={directionX}
                onChange={(e) => setDirectionX(parseFloat(e.target.value) || 0)}
              />
              <input
                type="number"
                step="0.1"
                className="w-20 rounded border px-2 py-1 text-xs"
                value={directionY}
                onChange={(e) => setDirectionY(parseFloat(e.target.value) || 0)}
              />
              <input
                type="number"
                step="0.1"
                className="w-20 rounded border px-2 py-1 text-xs"
                value={directionZ}
                onChange={(e) => setDirectionZ(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showArrow}
                onChange={(e) => setShowArrow(e.target.checked)}
              />
              <span>Show Arrow</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showControls}
                onChange={(e) => setShowControls(e.target.checked)}
              />
              <span>Show Controls</span>
            </label>
          </div>
        </div>
      }
      snippet={<CodePreview code={snippet} />}
    />
  );
}

