"use client";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import OceanSurface from "./OceanSurface";

export type OceanSize = "small" | "medium" | "large" | "xlarge" | number;
export type WaveIntensity = "calm" | "moderate" | "rough" | "stormy" | number;

export interface Ocean3DProps {
  size?: OceanSize;
  waveIntensity?: WaveIntensity;
  shallowColor?: string; // Màu nước nông
  deepColor?: string; // Màu nước sâu
  foamColor?: string; // Màu bọt trắng
  position?: [number, number, number];
  animated?: boolean;
  segments?: number; // Độ chi tiết của mesh
  className?: string;
  showControls?: boolean;
}

const SIZE_MAP: Record<string, number> = {
  small: 10,
  medium: 20,
  large: 30,
  xlarge: 50,
};

const WAVE_INTENSITY_MAP: Record<string, number> = {
  calm: 0.3,
  moderate: 0.6,
  rough: 1.0,
  stormy: 1.5,
};

export default function Ocean3D({
  size = "medium",
  waveIntensity = "moderate",
  shallowColor = "#78B9B5", // Xanh ngọc nhạt
  deepColor = "#065084", // Xanh đậm
  foamColor = "#ffffff",
  position = [0, 0, 0],
  animated = true,
  segments = 50,
  className = "",
  showControls = false,
}: Ocean3DProps) {
  const sizeValue = typeof size === "number" ? size : SIZE_MAP[size] || SIZE_MAP.medium;
  const waveIntensityValue =
    typeof waveIntensity === "number"
      ? waveIntensity
      : WAVE_INTENSITY_MAP[waveIntensity] || WAVE_INTENSITY_MAP.moderate;

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 5, sizeValue * 0.8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} />
        <directionalLight position={[-5, 5, -5]} intensity={0.3} />

        {showControls && (
          <>
            <PerspectiveCamera makeDefault position={[0, 5, sizeValue * 0.8]} />
            <OrbitControls enableZoom={true} enablePan={true} />
          </>
        )}

        <OceanSurface
          size={sizeValue}
          waveIntensity={waveIntensityValue}
          shallowColor={shallowColor}
          deepColor={deepColor}
          foamColor={foamColor}
          position={position}
          animated={animated}
          segments={segments}
        />
      </Canvas>
    </div>
  );
}

