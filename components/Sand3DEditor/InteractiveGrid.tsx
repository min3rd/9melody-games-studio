"use client";
import React, { useMemo } from "react";
import * as THREE from "three";
import { HeightMap } from "../Sand3D";

interface InteractiveGridProps {
  heightMap: HeightMap;
  size: number;
  heightScale: number;
  selectedPoint: { row: number; col: number } | null;
  onPointClick: (row: number, col: number) => void;
}

export default function InteractiveGrid({
  heightMap,
  size,
  heightScale,
  selectedPoint,
  onPointClick,
}: InteractiveGridProps) {
  const rows = heightMap.length;
  const cols = heightMap[0].length;

  // Tạo các điểm có thể click
  const points = useMemo(() => {
    const stepX = size / (cols - 1);
    const stepZ = size / (rows - 1);
    const halfSize = size / 2;
    const pointSize = size * 0.05;

    return heightMap.flatMap((row, rowIdx) =>
      row.map((height, colIdx) => {
        const x = colIdx * stepX - halfSize;
        const z = rowIdx * stepZ - halfSize;
        const y = height * heightScale;

        return {
          position: [x, y, z] as [number, number, number],
          row: rowIdx,
          col: colIdx,
          isSelected: selectedPoint !== null && selectedPoint.row === rowIdx && selectedPoint.col === colIdx,
        };
      })
    );
  }, [heightMap, size, heightScale, rows, cols, selectedPoint]);

  // Tính toán kích thước điểm dựa trên size của mặt cát
  const pointSize = Math.max(size * 0.015, 0.1);

  return (
    <group>
      {points.map((point, index) => (
        <mesh
          key={`${point.row}-${point.col}`}
          position={point.position}
          onClick={(e) => {
            e.stopPropagation();
            onPointClick(point.row, point.col);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            if (e.object) {
              (e.object as THREE.Mesh).scale.set(1.5, 1.5, 1.5);
            }
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={(e) => {
            if (e.object) {
              (e.object as THREE.Mesh).scale.set(1, 1, 1);
            }
            document.body.style.cursor = "default";
          }}
        >
          <sphereGeometry args={[pointSize, 8, 8]} />
          <meshStandardMaterial
            color={point.isSelected ? "#ff0000" : "#00ff00"}
            emissive={point.isSelected ? "#ff0000" : "#00ff00"}
            emissiveIntensity={point.isSelected ? 0.8 : 0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

