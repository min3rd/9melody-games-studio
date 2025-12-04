"use client";
import React, { useState } from "react";
import Rock3D, { RockMap } from "@/components/Rock3D";
import PreviewLayout from "@/components/preview/PreviewLayout";
import { CodePreview } from "@/components/ui";

export default function Rock3DPreview(): React.ReactElement {
  const [rocks, setRocks] = useState<RockMap>({
    rock1: [
      [0, 0, 0],
      [1, 0, 0],
      [0.5, 1, 0],
      [0, 0, 1],
      [1, 0, 1],
      [0.5, 0.8, 1],
    ],
  });

  const [color, setColor] = useState<string>("#7F8C8D");
  const [opacity, setOpacity] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [animated, setAnimated] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const snippet = `const rocks: RockMap = {
  rock1: [
    [0, 0, 0],
    [1, 0, 0],
    [0.5, 1, 0],
    [0, 0, 1],
    [1, 0, 1],
    [0.5, 0.8, 1],
  ],
};

<Rock3D 
  rocks={rocks}
  color="${color}"
  opacity={${opacity}}
  scale={${scale}}
  animated={${animated}}
  showControls={${showControls}}
/>`;

  const exampleRocks: Record<string, RockMap> = {
    simple: {
      rock1: [
        [0, 0, 0],
        [1, 0, 0],
        [0.5, 1, 0],
        [0, 0, 1],
        [1, 0, 1],
        [0.5, 0.8, 1],
      ],
    },
    pyramid: {
      rock2: [
        [-0.5, 0, -0.5],
        [0.5, 0, -0.5],
        [0.5, 0, 0.5],
        [-0.5, 0, 0.5],
        [0, 1.5, 0],
      ],
    },
    complex: {
      rock3: [
        [-0.4, 0, -0.4],
        [0.4, 0, -0.4],
        [0.4, 0, 0.4],
        [-0.4, 0, 0.4],
        [-0.3, 1.2, -0.3],
        [0.3, 1.2, -0.3],
        [0.3, 1.2, 0.3],
        [-0.3, 1.2, 0.3],
        [0, 1.5, 0],
      ],
    },
    multiple: {
      smallRock: [
        [0, 0, 0],
        [0.3, 0, 0],
        [0.15, 0.4, 0],
        [0, 0, 0.3],
        [0.3, 0, 0.3],
        [0.15, 0.35, 0.3],
      ],
      mediumRock: [
        [-0.4, 0, -0.4],
        [0.4, 0, -0.4],
        [0.4, 0, 0.4],
        [-0.4, 0, 0.4],
        [0, 0.8, 0],
      ],
    },
  };

  return (
    <PreviewLayout
      title="Rock3D - 3D Rock Component"
      preview={
        <div className="space-y-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            Component 3D để tạo các hòn đá với khả năng truyền vào map các đỉnh để tùy chỉnh hình dạng.
          </p>
          <div className="h-64 border rounded bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
            <Rock3D
              rocks={rocks}
              color={color}
              opacity={opacity}
              scale={scale}
              animated={animated}
              showControls={showControls}
            />
          </div>
        </div>
      }
      controls={
        <div className="space-y-4 text-sm">
          <div>
            <div className="text-xs font-medium mb-2">Example Rock Shapes</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(exampleRocks).map(([name, rockMap]) => (
                <button
                  key={name}
                  className="px-3 py-1 text-xs border rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  onClick={() => setRocks(rockMap)}
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
            <label className="flex items-center gap-2">
              <span>Scale</span>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                className="w-20"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
              />
              <span className="text-xs">{scale}</span>
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

