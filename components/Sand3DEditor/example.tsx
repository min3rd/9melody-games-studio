"use client";
import React, { useState } from "react";
import Sand3DEditor from "./index";
import Sand3D, { HeightMap } from "../Sand3D";

/**
 * Example usage of Sand3DEditor component
 * 
 * This file demonstrates how to use the Sand3DEditor to create and edit sand surfaces.
 */

export default function Sand3DEditorExample() {
  const [exportedConfig, setExportedConfig] = useState<{
    heightMap: HeightMap;
    size: number;
    heightScale: number;
    color: string;
  } | null>(null);

  const handleExport = (config: {
    heightMap: HeightMap;
    size: number;
    heightScale: number;
    color: string;
  }) => {
    setExportedConfig(config);
    console.log("Exported config:", config);
    alert("Configuration exported! Check console for details.");
  };

  return (
    <div className="space-y-4 p-4">
      <div className="h-[600px] border rounded">
        <Sand3DEditor
          initialHeightMap={[
            [0, 0, 0, 0, 0],
            [0, 0.1, 0.1, 0.1, 0],
            [0, 0.1, 0.2, 0.1, 0],
            [0, 0.1, 0.1, 0.1, 0],
            [0, 0, 0, 0, 0],
          ]}
          initialSize={8}
          initialHeightScale={2}
          initialColor="#F4D03F"
          onExport={handleExport}
        />
      </div>

      {exportedConfig && (
        <div className="border rounded p-4 bg-white dark:bg-neutral-800">
          <h3 className="text-lg font-semibold mb-2">Exported Configuration</h3>
          <div className="h-64 border rounded">
            <Sand3D
              heightMap={exportedConfig.heightMap}
              color={exportedConfig.color}
              size={exportedConfig.size}
              heightScale={exportedConfig.heightScale}
              showControls={true}
            />
          </div>
          <pre className="mt-4 text-xs bg-neutral-100 dark:bg-neutral-900 p-2 rounded overflow-auto">
            {JSON.stringify(exportedConfig, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

