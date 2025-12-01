"use client";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

import LargeRegion from "./LargeRegion";
import Ocean from "./Ocean";
import CloudField from "./CloudField";
import DayCycle from "./DayCycle";
import WindStreaks from "./WindStreaks";

// Main 3D Island Scene Component
export default function Island3D() {
  return (
    <div className="w-full h-screen bg-linear-to-b from-sky-300 to-sky-100 dark:from-sky-900 dark:to-sky-700 overflow-hidden">
      <Canvas shadows camera={{ position: [8, 5, 8], fov: 45 }}>
        <PerspectiveCamera makeDefault position={[8, 5, 8]} />
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          minDistance={5}
          maxDistance={15}
          maxPolarAngle={Math.PI - 0.1} // allow camera to look up near overhead
          minPolarAngle={0.02} // prevent exact upside-down
        />

        {/* Time of day lighting & stars */}
        <DayCycle cycleDuration={60} />

        {/* Scene elements */}
        <LargeRegion
          size={14}
          detail={96}
          jaggedness={0.6}
          height={1.2}
          groundY={-1.1}
          color="#F6F3EE"
        />
        {/* Faint wind streaks that follow the wind direction */}
        <WindStreaks
          count={140}
          areaRadius={26}
          minY={2.6}
          maxY={6.8}
          windDirection={[0.9, 0, 0.35]}
          speed={0.85}
          color="#ffffff"
          opacity={0.2}
          length={3.2}
          width={0.14}
          curve={0.28}
        />
        <CloudField
          useModel={false}
          count={10}
          radius={24}
          minY={3.5}
          maxY={7.0}
          colors={["#ffffff", "#ffd7e0"]}
          minSize={1.0}
          maxSize={3.2}
          driftSpeed={0.03}
          elongation={1.6}
          bumpAmplitude={0.13}
          bumpFrequency={0.9}
        />
        <Ocean />
      </Canvas>
    </div>
  );
}
