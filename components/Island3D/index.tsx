"use client";
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';

import LargeRegion from './LargeRegion';
import Clouds from './Clouds';
import Ocean from './Ocean';

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
          maxPolarAngle={Math.PI / 2.2}
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, 5, -10]} intensity={0.3} color="#ffa500" />
        
        {/* Scene elements */}
        <LargeRegion size={14} detail={96} jaggedness={0.6} height={1.2} groundY={-1.1} color="#F6F3EE" />
        <Ocean />
      </Canvas>
    </div>
  );
}
