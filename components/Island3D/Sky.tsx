"use client";
import React from "react";
import { Sky } from "@react-three/drei";
import { DirectionalLight, HemisphereLight } from "three";

export type SceneSkyProps = {
  sunPosition?: [number, number, number];
  turbidity?: number;
  rayleigh?: number;
  mieCoefficient?: number;
  mieDirectionalG?: number;
  elevation?: number;
  azimuth?: number;
  fogColor?: string;
  fogDensity?: number; // exponential fog density
  showHelpers?: boolean;
};

export default function SceneSky({
  sunPosition = [5, 3, -2],
  turbidity = 8,
  rayleigh = 0.5,
  mieCoefficient = 0.005,
  mieDirectionalG = 0.8,
  elevation = 25,
  azimuth = 180,
  fogColor = "#cfeeff",
  fogDensity = 0.0025,
  showHelpers = false,
}: SceneSkyProps) {
  // Helper for debugging light direction (optional)
  const dirLightRef = React.useRef<DirectionalLight | null>(null);

  return (
    <group>
      {/* Sky from drei adds an atmospheric background and sun position */}
      <Sky
        distance={450000}
        sunPosition={sunPosition}
        turbidity={turbidity}
        rayleigh={rayleigh}
        mieCoefficient={mieCoefficient}
        mieDirectionalG={mieDirectionalG}
        inclination={0.4}
        azimuth={azimuth}
      />

      {/* Hemisphere light provides ambient sky/ground blending */}
      <hemisphereLight
        args={["#f0f6ff", "#6b4d2a", 0.45]}
        position={[0, 50, 0]}
        receiveShadow={false}
      />

      {/* Directional light as the sun with soft shadows */}
      <directionalLight
        ref={dirLightRef as any}
        castShadow
        intensity={1.08}
        position={[sunPosition[0] * 2, sunPosition[1] * 3, sunPosition[2] * 2]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-camera-near={0.5}
        shadow-camera-far={200}
        color="#fff2d8"
      />

      {/* Optional subtle fill light to reduce harsh contrast */}
      <directionalLight intensity={0.12} position={[0, -1, 0]} />

      {/* Ground-level horizon fog: a soft haze near the ocean/ground */}
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow={false}
      >
        <planeGeometry args={[600, 600, 1, 1]} />
        <meshBasicMaterial
          color={fogColor}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
}
