"use client";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import SandSurface from "./SandSurface";

export type HeightMap = number[][]; // Ma trận 2D các độ cao
export type ColorFunction = (height: number, maxHeight: number, minHeight: number) => string;
export type ColorMap = string | ColorFunction; // Màu sắc hoặc function để tính màu theo độ cao

export interface Sand3DProps {
  heightMap: HeightMap; // Ma trận độ cao [row][col]
  color?: ColorMap; // Màu sắc hoặc function để tính màu theo độ cao
  size?: number; // Kích thước mặt cát
  heightScale?: number; // Scale cho độ cao (nhân với giá trị trong heightMap)
  position?: [number, number, number];
  rotation?: [number, number, number];
  animated?: boolean;
  className?: string;
  showControls?: boolean;
  wireframe?: boolean; // Hiển thị wireframe để debug
}

export default function Sand3D({
  heightMap,
  color = "#F4D03F", // Màu cát vàng mặc định
  size = 10,
  heightScale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  animated = false,
  className = "",
  showControls = false,
  wireframe = false,
}: Sand3DProps) {
  // Validate heightMap
  if (!heightMap || heightMap.length === 0 || heightMap[0].length === 0) {
    console.warn("Sand3D: heightMap is empty or invalid");
    return null;
  }

  const rows = heightMap.length;
  const cols = heightMap[0].length;

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, size * 0.8, size * 1.2], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} />
        <directionalLight position={[-5, 5, -5]} intensity={0.3} />

        {showControls && (
          <>
            <PerspectiveCamera makeDefault position={[0, size * 0.8, size * 1.2]} />
            <OrbitControls enableZoom={true} enablePan={true} />
          </>
        )}

        <SandSurface
          heightMap={heightMap}
          color={color}
          size={size}
          heightScale={heightScale}
          position={position}
          rotation={rotation}
          animated={animated}
          wireframe={wireframe}
        />
      </Canvas>
    </div>
  );
}

