"use client";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import WindStreamlines from "./WindStreamlines";

export type WindIntensity = "light" | "medium" | "strong" | "very-strong" | number;
export type WindStyle = "streamlines" | "particles" | "smoke" | "cloud-trails";

export interface Wind3DProps {
  direction?: [number, number, number]; // Hướng gió [x, y, z]
  intensity?: WindIntensity;
  style?: WindStyle;
  color?: string;
  position?: [number, number, number];
  count?: number; // Số lượng đường dòng chảy
  length?: number; // Độ dài đường dòng chảy
  width?: number; // Độ rộng/độ dày
  opacity?: number;
  animated?: boolean;
  className?: string;
  showControls?: boolean;
  showArrow?: boolean; // Hiển thị mũi tên chỉ hướng gió
}

const INTENSITY_MAP: Record<string, number> = {
  light: 0.5,
  medium: 1.0,
  strong: 1.5,
  "very-strong": 2.5,
};

export default function Wind3D({
  direction = [1, 0, 0], // Mặc định gió thổi theo trục X
  intensity = "medium",
  style = "streamlines",
  color = "#e0e0e0",
  position = [0, 0, 0],
  count = 8,
  length = 5,
  width = 0.3,
  opacity = 0.7,
  animated = true,
  className = "",
  showControls = false,
  showArrow = false,
}: Wind3DProps) {
  const intensityValue =
    typeof intensity === "number" ? intensity : INTENSITY_MAP[intensity] || INTENSITY_MAP.medium;

  // Normalize direction vector
  const dirLength = Math.sqrt(
    direction[0] * direction[0] + direction[1] * direction[1] + direction[2] * direction[2]
  );
  const normalizedDirection: [number, number, number] = [
    direction[0] / dirLength,
    direction[1] / dirLength,
    direction[2] / dirLength,
  ];

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.7} />
        <directionalLight position={[-5, 3, -5]} intensity={0.3} />

        {showControls && (
          <>
            <PerspectiveCamera makeDefault position={[0, 0, 8]} />
            <OrbitControls enableZoom={true} enablePan={true} />
          </>
        )}

        <WindStreamlines
          direction={normalizedDirection}
          intensity={intensityValue}
          style={style}
          color={color}
          position={position}
          count={count}
          length={length}
          width={width}
          opacity={opacity}
          animated={animated}
          showArrow={showArrow}
        />
      </Canvas>
    </div>
  );
}

