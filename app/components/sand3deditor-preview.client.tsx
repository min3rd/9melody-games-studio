"use client";
import React, { useState } from "react";
import Sand3DEditor from "@/components/Sand3DEditor";
import Sand3D, { HeightMap } from "@/components/Sand3D";
import PreviewLayout from "@/components/preview/PreviewLayout";
import { CodePreview } from "@/components/ui";

export default function Sand3DEditorPreview(): React.ReactElement {
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
  };

  const snippet = `<Sand3DEditor
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
  onExport={(config) => {
    console.log("Exported:", config);
  }}
/>`;

  return (
    <PreviewLayout
      title="Sand3DEditor - 3D Sand Surface Editor"
      preview={
        <div className="space-y-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            Component editor 3D để chỉnh sửa tham số đầu vào cho Sand3D. Cho phép chỉnh sửa kích thước, tọa độ các điểm, thêm/xóa điểm từ một mặt phẳng để tạo hình dạng cho mặt cát.
          </p>
          <div className="h-[500px] border rounded bg-gradient-to-b from-amber-50 to-amber-100 dark:from-amber-900 dark:to-amber-800">
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
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Exported Result:</h4>
              <div className="h-48 border rounded">
                <Sand3D
                  heightMap={exportedConfig.heightMap}
                  color={exportedConfig.color}
                  size={exportedConfig.size}
                  heightScale={exportedConfig.heightScale}
                  showControls={true}
                />
              </div>
            </div>
          )}
        </div>
      }
      controls={
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">Features:</h4>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Edit mode: Click points to select and edit height</li>
              <li>Add mode: Add new rows/columns</li>
              <li>Delete mode: Remove points or rows/columns</li>
              <li>Real-time 3D preview</li>
              <li>Export configuration</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Usage:</h4>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Select edit mode (Edit/Add/Delete)</li>
              <li>Click on points in 3D view or grid to select</li>
              <li>Adjust height values in the grid or input field</li>
              <li>Use +Row/+Col to add, -Row/-Col to remove</li>
              <li>Click Export to get the configuration</li>
            </ol>
          </div>
        </div>
      }
      snippet={<CodePreview code={snippet} />}
    />
  );
}

