"use client";
import React from 'react';

export default function PalmTree({ position = [0, 0, 0], scale = 1 }: { position?: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 1.6, 8]} />
        <meshStandardMaterial color="#8b4513" roughness={0.9} />
      </mesh>

      {/* Palm leaves */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[0, 1.6, 0]}
          rotation={[Math.PI / 6, (i * Math.PI * 2) / 5, 0]}
          castShadow
        >
          <boxGeometry args={[0.1, 0.8, 0.05]} />
          <meshStandardMaterial color="#228b22" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}
