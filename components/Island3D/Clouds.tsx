"use client";
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Clouds() {
  const cloudsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0002;
    }
  });

  return (
    <group ref={cloudsRef}>
      {[...Array(6)].map((_, i) => (
        <mesh 
          key={i}
          position={[
            Math.cos((i * Math.PI * 2) / 6) * 6,
            3 + Math.sin(i) * 0.5,
            Math.sin((i * Math.PI * 2) / 6) * 6
          ]}
        >
          <sphereGeometry args={[0.5, 8, 8]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}
