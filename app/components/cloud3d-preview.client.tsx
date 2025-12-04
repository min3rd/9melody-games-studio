"use client";
import React, { useState } from "react";
import Cloud3D, { CloudSize, CloudShape } from "@/components/Cloud3D";
import PreviewLayout from "@/components/preview/PreviewLayout";
import { CodePreview } from "@/components/ui";

export default function Cloud3DPreview(): React.ReactElement {
  const [size, setSize] = useState<CloudSize>("medium");
  const [shape, setShape] = useState<CloudShape>("puffy");
  const [color, setColor] = useState<string>("#ffffff");
  const [animated, setAnimated] = useState(true);
  const [opacity, setOpacity] = useState(0.9);
  const [showControls, setShowControls] = useState(false);

  const snippet = `<Cloud3D 
  size="${size}" 
  shape="${shape}" 
  color="${color}"
  animated={${animated}}
  opacity={${opacity}}
  showControls={${showControls}}
/>`;

  return (
    <PreviewLayout
      title="Cloud3D - 3D Cloud Component"
      preview={
        <div className="space-y-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            Component 3D đám mây với nhiều tùy chọn về kích thước và hình dạng theo style low poly.
          </p>
          <div className="h-64 border rounded bg-gradient-to-b from-sky-200 to-sky-100 dark:from-sky-900 dark:to-sky-700">
            <Cloud3D
              size={size}
              shape={shape}
              color={color}
              animated={animated}
              opacity={opacity}
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
                onChange={(e) => setSize(e.target.value as CloudSize)}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="xlarge">XLarge</option>
              </select>
            </label>
            <label className="flex items-center gap-2">
              <span>Shape</span>
              <select
                className="rounded border px-2 py-1 text-xs"
                value={shape}
                onChange={(e) => setShape(e.target.value as CloudShape)}
              >
                <option value="puffy">Puffy</option>
                <option value="flat">Flat</option>
                <option value="cumulus">Cumulus</option>
                <option value="stratus">Stratus</option>
                <option value="nimbus">Nimbus</option>
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
              <span>Opacity</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                className="w-20"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
              />
              <span className="text-xs">{opacity}</span>
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

