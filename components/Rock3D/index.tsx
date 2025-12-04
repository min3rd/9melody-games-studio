"use client";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import RockMesh from "./RockMesh";

export type RockVertices = [number, number, number][]; // Array of [x, y, z] points
export type RockMap = Record<string, RockVertices>; // Map of rock name to vertices

export interface Rock3DProps {
  rocks?: RockMap; // Map các hòn đá với đỉnh
  color?: string | Record<string, string>; // Màu chung hoặc map màu cho từng hòn đá
  position?: [number, number, number];
  rotation?: [number, number, number];
  animated?: boolean;
  opacity?: number | Record<string, number>;
  className?: string;
  showControls?: boolean;
  scale?: number | Record<string, number>; // Scale chung hoặc map scale cho từng hòn đá
}

export default function Rock3D({
  rocks = {},
  color = "#7F8C8D",
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  animated = false,
  opacity = 1,
  className = "",
  showControls = false,
  scale = 1,
}: Rock3DProps) {
  // Nếu không có rocks, tạo một hòn đá mặc định
  const defaultRocks: RockMap = Object.keys(rocks).length === 0 
    ? {
        default: [
          [0, 0, 0],
          [1, 0, 0],
          [0.5, 1, 0],
          [0, 0, 1],
          [1, 0, 1],
          [0.5, 0.8, 1],
        ],
      }
    : rocks;

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} />
        <directionalLight position={[-5, 5, -5]} intensity={0.3} />

        {showControls && (
          <>
            <PerspectiveCamera makeDefault position={[0, 2, 5]} />
            <OrbitControls enableZoom={true} enablePan={true} />
          </>
        )}

        {Object.entries(defaultRocks).map(([name, vertices], index) => {
          const rockColor = typeof color === "string" ? color : color[name] || "#7F8C8D";
          const rockOpacity = typeof opacity === "number" ? opacity : opacity[name] ?? 1;
          const rockScale = typeof scale === "number" ? scale : scale[name] ?? 1;
          
          // Tính toán vị trí để phân bố các hòn đá
          const rockPosition: [number, number, number] = [
            position[0] + (index % 3 - 1) * 2,
            position[1],
            position[2] + Math.floor(index / 3) * 2,
          ];

          return (
            <RockMesh
              key={name}
              name={name}
              vertices={vertices}
              color={rockColor}
              position={rockPosition}
              rotation={rotation}
              animated={animated}
              opacity={rockOpacity}
              scale={rockScale}
            />
          );
        })}
      </Canvas>
    </div>
  );
}

