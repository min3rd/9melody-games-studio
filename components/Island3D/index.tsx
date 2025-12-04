"use client";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import IslandTerrain from "./IslandTerrain";

export type IslandSize = "small" | "medium" | "large" | "xlarge" | number;
export type MountainCount = "few" | "medium" | "many" | number;

export interface Island3DProps {
  size?: IslandSize;
  mountainCount?: MountainCount;
  sandColor?: string;
  rockColor?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  animated?: boolean;
  className?: string;
  showControls?: boolean;
}

const SIZE_MAP: Record<string, number> = {
  small: 3,
  medium: 5,
  large: 7,
  xlarge: 10,
};

const MOUNTAIN_COUNT_MAP: Record<string, number> = {
  few: 3,
  medium: 5,
  many: 8,
};

export default function Island3D({
  size = "medium",
  mountainCount = "medium",
  sandColor = "#F4D03F", // Màu cát vàng
  rockColor = "#7F8C8D", // Màu đá xám
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  animated = false,
  className = "",
  showControls = false,
}: Island3DProps) {
  const sizeValue = typeof size === "number" ? size : SIZE_MAP[size] || SIZE_MAP.medium;
  const mountainCountValue =
    typeof mountainCount === "number"
      ? mountainCount
      : MOUNTAIN_COUNT_MAP[mountainCount] || MOUNTAIN_COUNT_MAP.medium;

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, sizeValue * 1.5, sizeValue * 1.5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} />
        <directionalLight position={[-5, 5, -5]} intensity={0.3} />

        {showControls && (
          <>
            <PerspectiveCamera makeDefault position={[0, sizeValue * 1.5, sizeValue * 1.5]} />
            <OrbitControls enableZoom={true} enablePan={true} />
          </>
        )}

        <IslandTerrain
          size={sizeValue}
          mountainCount={mountainCountValue}
          sandColor={sandColor}
          rockColor={rockColor}
          position={position}
          rotation={rotation}
          animated={animated}
        />
      </Canvas>
    </div>
  );
}

