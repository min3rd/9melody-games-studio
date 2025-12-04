"use client";
import React, { useState } from "react";
import Ocean3D, { OceanSize, WaveIntensity } from "@/components/Ocean3D";
import PreviewLayout from "@/components/preview/PreviewLayout";
import { CodePreview } from "@/components/ui";

export default function Ocean3DPreview(): React.ReactElement {
  const [size, setSize] = useState<OceanSize>("medium");
  const [waveIntensity, setWaveIntensity] = useState<WaveIntensity>("moderate");
  const [shallowColor, setShallowColor] = useState<string>("#78B9B5");
  const [deepColor, setDeepColor] = useState<string>("#065084");
  const [foamColor, setFoamColor] = useState<string>("#ffffff");
  const [animated, setAnimated] = useState(true);
  const [showControls, setShowControls] = useState(false);

  const snippet = `<Ocean3D 
  size="${size}" 
  waveIntensity="${waveIntensity}" 
  shallowColor="${shallowColor}"
  deepColor="${deepColor}"
  foamColor="${foamColor}"
  animated={${animated}}
  showControls={${showControls}}
/>`;

  return (
    <PreviewLayout
      title="Ocean3D - 3D Ocean Component"
      preview={
        <div className="space-y-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            Component 3D mặt biển với màu sắc theo độ sâu, gợn sóng và bọt trắng.
          </p>
          <div className="h-64 border rounded bg-gradient-to-b from-sky-200 to-blue-100 dark:from-sky-900 dark:to-blue-900">
            <Ocean3D
              size={size}
              waveIntensity={waveIntensity}
              shallowColor={shallowColor}
              deepColor={deepColor}
              foamColor={foamColor}
              animated={animated}
              showControls={showControls}
            />
          </div>
        </div>
      }
      controls={
        <div className="space-y-4 text-sm">
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2">
              <span>Size</span>
              <select
                className="rounded border px-2 py-1 text-xs"
                value={size}
                onChange={(e) => setSize(e.target.value as OceanSize)}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="xlarge">XLarge</option>
              </select>
            </label>
            <label className="flex items-center gap-2">
              <span>Wave Intensity</span>
              <select
                className="rounded border px-2 py-1 text-xs"
                value={waveIntensity}
                onChange={(e) => setWaveIntensity(e.target.value as WaveIntensity)}
              >
                <option value="calm">Calm</option>
                <option value="moderate">Moderate</option>
                <option value="rough">Rough</option>
                <option value="stormy">Stormy</option>
              </select>
            </label>
          </div>
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2">
              <span>Shallow Color</span>
              <input
                type="color"
                className="h-7 w-12 cursor-pointer rounded border"
                value={shallowColor}
                onChange={(e) => setShallowColor(e.target.value)}
              />
            </label>
            <label className="flex items-center gap-2">
              <span>Deep Color</span>
              <input
                type="color"
                className="h-7 w-12 cursor-pointer rounded border"
                value={deepColor}
                onChange={(e) => setDeepColor(e.target.value)}
              />
            </label>
            <label className="flex items-center gap-2">
              <span>Foam Color</span>
              <input
                type="color"
                className="h-7 w-12 cursor-pointer rounded border"
                value={foamColor}
                onChange={(e) => setFoamColor(e.target.value)}
              />
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
          </div>
        </div>
      }
      snippet={<CodePreview code={snippet} />}
    />
  );
}

