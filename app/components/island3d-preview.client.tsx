"use client";
import React, { useState } from "react";
import Island3D, { IslandSize, MountainCount } from "@/components/Island3D";
import PreviewLayout from "@/components/preview/PreviewLayout";
import { CodePreview } from "@/components/ui";

export default function Island3DPreview(): React.ReactElement {
  const [size, setSize] = useState<IslandSize>("medium");
  const [mountainCount, setMountainCount] = useState<MountainCount>("medium");
  const [sandColor, setSandColor] = useState<string>("#F4D03F");
  const [rockColor, setRockColor] = useState<string>("#7F8C8D");
  const [animated, setAnimated] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const snippet = `<Island3D 
  size="${size}" 
  mountainCount="${mountainCount}" 
  sandColor="${sandColor}"
  rockColor="${rockColor}"
  animated={${animated}}
  showControls={${showControls}}
/>`;

  return (
    <PreviewLayout
      title="Island3D - 3D Island Component"
      preview={
        <div className="space-y-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            Component 3D hòn đảo với nền cát và các núi đá theo style low poly.
          </p>
          <div className="h-64 border rounded bg-gradient-to-b from-sky-200 to-sky-100 dark:from-sky-900 dark:to-sky-700">
            <Island3D
              size={size}
              mountainCount={mountainCount}
              sandColor={sandColor}
              rockColor={rockColor}
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
                onChange={(e) => setSize(e.target.value as IslandSize)}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="xlarge">XLarge</option>
              </select>
            </label>
            <label className="flex items-center gap-2">
              <span>Mountain Count</span>
              <select
                className="rounded border px-2 py-1 text-xs"
                value={mountainCount}
                onChange={(e) => setMountainCount(e.target.value as MountainCount)}
              >
                <option value="few">Few (3)</option>
                <option value="medium">Medium (5)</option>
                <option value="many">Many (8)</option>
              </select>
            </label>
          </div>
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2">
              <span>Sand Color</span>
              <input
                type="color"
                className="h-7 w-12 cursor-pointer rounded border"
                value={sandColor}
                onChange={(e) => setSandColor(e.target.value)}
              />
            </label>
            <label className="flex items-center gap-2">
              <span>Rock Color</span>
              <input
                type="color"
                className="h-7 w-12 cursor-pointer rounded border"
                value={rockColor}
                onChange={(e) => setRockColor(e.target.value)}
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

