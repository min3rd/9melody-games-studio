"use client";
import React, { useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import SandSurface from "../Sand3D/SandSurface";
import { HeightMap } from "../Sand3D";
import EditorControls from "./EditorControls";
import InteractiveGrid from "./InteractiveGrid";

export interface Sand3DEditorProps {
  initialHeightMap?: HeightMap;
  initialSize?: number;
  initialHeightScale?: number;
  initialColor?: string;
  onHeightMapChange?: (heightMap: HeightMap) => void;
  onExport?: (config: {
    heightMap: HeightMap;
    size: number;
    heightScale: number;
    color: string;
  }) => void;
  className?: string;
}

export default function Sand3DEditor({
  initialHeightMap = [
    [0, 0, 0, 0, 0],
    [0, 0.1, 0.1, 0.1, 0],
    [0, 0.1, 0.2, 0.1, 0],
    [0, 0.1, 0.1, 0.1, 0],
    [0, 0, 0, 0, 0],
  ],
  initialSize = 8,
  initialHeightScale = 2,
  initialColor = "#F4D03F",
  onHeightMapChange,
  onExport,
  className = "",
}: Sand3DEditorProps) {
  const [heightMap, setHeightMap] = useState<HeightMap>(initialHeightMap);
  const [size, setSize] = useState<number>(initialSize);
  const [heightScale, setHeightScale] = useState<number>(initialHeightScale);
  const [color, setColor] = useState<string>(initialColor);
  const [selectedPoint, setSelectedPoint] = useState<{ row: number; col: number } | null>(null);
  const [editMode, setEditMode] = useState<"edit" | "add" | "delete">("edit");

  const handleHeightMapChange = useCallback(
    (newHeightMap: HeightMap) => {
      setHeightMap(newHeightMap);
      onHeightMapChange?.(newHeightMap);
    },
    [onHeightMapChange]
  );

  const handlePointClick = useCallback(
    (row: number, col: number) => {
      if (editMode === "delete") {
        // Xóa điểm bằng cách set về 0 hoặc xóa hàng/cột
        const newHeightMap = heightMap.map((r, rIdx) =>
          rIdx === row ? r.map((_, cIdx) => (cIdx === col ? 0 : r[cIdx])) : r
        );
        handleHeightMapChange(newHeightMap);
      } else if (editMode === "add") {
        // Thêm điểm mới (thêm hàng hoặc cột)
        // Tạm thời chỉ set selected point
        setSelectedPoint({ row, col });
      } else {
        // Edit mode - select point để chỉnh sửa
        setSelectedPoint({ row, col });
      }
    },
    [editMode, heightMap, handleHeightMapChange]
  );

  const handleHeightChange = useCallback(
    (row: number, col: number, newHeight: number) => {
      const newHeightMap = heightMap.map((r, rIdx) =>
        rIdx === row ? r.map((h, cIdx) => (cIdx === col ? newHeight : h)) : r
      );
      handleHeightMapChange(newHeightMap);
    },
    [heightMap, handleHeightMapChange]
  );

  const handleAddRow = useCallback(() => {
    const cols = heightMap[0].length;
    const newRow = new Array(cols).fill(0);
    handleHeightMapChange([...heightMap, newRow]);
  }, [heightMap, handleHeightMapChange]);

  const handleAddCol = useCallback(() => {
    handleHeightMapChange(heightMap.map((row) => [...row, 0]));
  }, [heightMap, handleHeightMapChange]);

  const handleRemoveRow = useCallback(() => {
    if (heightMap.length > 1) {
      handleHeightMapChange(heightMap.slice(0, -1));
    }
  }, [heightMap, handleHeightMapChange]);

  const handleRemoveCol = useCallback(() => {
    if (heightMap[0].length > 1) {
      handleHeightMapChange(heightMap.map((row) => row.slice(0, -1)));
    }
  }, [heightMap, handleHeightMapChange]);

  const handleExport = useCallback(() => {
    onExport?.({
      heightMap,
      size,
      heightScale,
      color,
    });
  }, [heightMap, size, heightScale, color, onExport]);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex-1 grid grid-cols-2 gap-4 p-4">
        {/* Preview 3D */}
        <div className="border rounded bg-gradient-to-b from-amber-50 to-amber-100 dark:from-amber-900 dark:to-amber-800">
          <div className="h-full">
            <Canvas camera={{ position: [0, size * 0.8, size * 1.2], fov: 50 }}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 10, 5]} intensity={0.8} />
              <directionalLight position={[-5, 5, -5]} intensity={0.3} />
              <PerspectiveCamera makeDefault position={[0, size * 0.8, size * 1.2]} />
              <OrbitControls enableZoom={true} enablePan={true} />

              <SandSurface
                heightMap={heightMap}
                color={color}
                size={size}
                heightScale={heightScale}
                position={[0, 0, 0]}
                rotation={[0, 0, 0]}
                animated={false}
                wireframe={false}
              />

              {/* Hiển thị điểm được chọn */}
              {selectedPoint && (
                <InteractiveGrid
                  heightMap={heightMap}
                  size={size}
                  heightScale={heightScale}
                  selectedPoint={selectedPoint}
                  onPointClick={handlePointClick}
                />
              )}
            </Canvas>
          </div>
        </div>

        {/* Editor Controls */}
        <EditorControls
          heightMap={heightMap}
          size={size}
          heightScale={heightScale}
          color={color}
          selectedPoint={selectedPoint}
          editMode={editMode}
          onSizeChange={setSize}
          onHeightScaleChange={setHeightScale}
          onColorChange={setColor}
          onHeightChange={handleHeightChange}
          onPointSelect={setSelectedPoint}
          onEditModeChange={setEditMode}
          onAddRow={handleAddRow}
          onAddCol={handleAddCol}
          onRemoveRow={handleRemoveRow}
          onRemoveCol={handleRemoveCol}
          onExport={handleExport}
        />
      </div>
    </div>
  );
}

