"use client";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import CloudMesh from "./CloudMesh";

export type CloudSize = "small" | "medium" | "large" | "xlarge" | number;
export type CloudShape = "puffy" | "flat" | "cumulus" | "stratus" | "nimbus" | "scattered";

export interface Cloud3DProps {
  size?: CloudSize;
  shape?: CloudShape;
  color?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  animated?: boolean;
  opacity?: number;
  count?: number; // For scattered clouds
  className?: string;
  showControls?: boolean;
}

const SIZE_MAP: Record<string, number> = {
  small: 0.5,
  medium: 1.0,
  large: 1.5,
  xlarge: 2.0,
};

export default function Cloud3D({
  size = "medium",
  shape = "puffy",
  color = "#ffffff",
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  animated = true,
  opacity = 0.9,
  count = 1,
  className = "",
  showControls = false,
}: Cloud3DProps) {
  const sizeValue = typeof size === "number" ? size : SIZE_MAP[size] || SIZE_MAP.medium;

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, 3, -5]} intensity={0.4} />
        
        {showControls && (
          <>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <OrbitControls enableZoom={true} enablePan={true} />
          </>
        )}

        {shape === "scattered" ? (
          // Render multiple clouds in scattered pattern
          Array.from({ length: count }).map((_, i) => {
            const angle = (i / count) * Math.PI * 2;
            const radius = sizeValue * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = (Math.random() - 0.5) * sizeValue;
            const cloudSize = sizeValue * (0.6 + Math.random() * 0.4);
            const cloudShape = ["puffy", "flat", "cumulus"][Math.floor(Math.random() * 3)] as CloudShape;

            return (
              <CloudMesh
                key={i}
                size={cloudSize}
                shape={cloudShape}
                color={color}
                position={[x + position[0], y + position[1], z + position[2]]}
                rotation={[
                  rotation[0] + (Math.random() - 0.5) * 0.5,
                  rotation[1] + (Math.random() - 0.5) * 0.5,
                  rotation[2] + (Math.random() - 0.5) * 0.5,
                ]}
                animated={animated}
                opacity={opacity}
              />
            );
          })
        ) : (
          <CloudMesh
            size={sizeValue}
            shape={shape}
            color={color}
            position={position}
            rotation={rotation}
            animated={animated}
            opacity={opacity}
          />
        )}
      </Canvas>
    </div>
  );
}

