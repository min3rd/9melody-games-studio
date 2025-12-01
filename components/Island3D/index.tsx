"use client";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

import LargeRegion from "./LargeRegion";
import Ocean from "./Ocean";
import SceneSky from "./Sky";

// Main 3D Island Scene Component
export default function Island3D() {
  return (
    <div className="w-full h-screen bg-linear-to-b from-sky-300 to-sky-100 dark:from-sky-900 dark:to-sky-700 overflow-hidden">
      <Canvas shadows camera={{ position: [8, 5, 8], fov: 45 }}>
        {/* New atmospheric sky and lighting (also provides exponential fog) */}
        <SceneSky
          sunPosition={[5, 3, -2]}
          turbidity={8}
          rayleigh={0.5}
          mieCoefficient={0.005}
          mieDirectionalG={0.8}
          fogColor="#cfeeff"
          fogDensity={0.0028}
        />
        {/* Camera */}
        <PerspectiveCamera makeDefault position={[8, 5, 8]} />
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          minDistance={5}
          maxDistance={15}
          maxPolarAngle={Math.PI - 0.1} // allow camera to look up near overhead
          minPolarAngle={0.02} // prevent exact upside-down
        />

        {/* Scene elements */}
        <LargeRegion
          size={14}
          detail={96}
          jaggedness={0.6}
          height={1.2}
          groundY={-1.1}
          color="#F6F3EE"
        />
        <Ocean />
      </Canvas>
    </div>
  );
}