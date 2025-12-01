"use client";
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import PalmTree from './PalmTree';

export default function Island() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create island geometry with height variation
  const geometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(3, 4, 2, 32, 1);
    const positions = geo.attributes.position as THREE.BufferAttribute;
    
    // Add variation to create natural island shape
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      
      // Add noise-like variation to top vertices
      if (y > 0) {
        const heightVariation = Math.sin(x * 2) * Math.cos(z * 2) * 0.3;
        positions.setY(i, y + heightVariation);
      }
    }
    
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Gentle rotation animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group>
      {/* Main island terrain */}
      <mesh ref={meshRef} geometry={geometry} position={[0, -1, 0]} castShadow receiveShadow>
        <meshStandardMaterial 
          color="#4a9d5f"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      {/* Sand/beach ring */}
      <mesh position={[0, -1.9, 0]} receiveShadow>
        <cylinderGeometry args={[4.2, 4.5, 0.3, 32]} />
        <meshStandardMaterial color="#f4d03f" roughness={0.9} />
      </mesh>
      
      {/* Water base */}
      <mesh position={[0, -2.5, 0]} receiveShadow>
        <cylinderGeometry args={[8, 8, 0.5, 32]} />
        <meshStandardMaterial 
          color="#1e90ff" 
          transparent 
          opacity={0.7}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>

      {/* Palm trees */}
      <PalmTree position={[1.5, 0.2, 1]} />
      <PalmTree position={[-1.8, 0.1, -0.5]} scale={0.8} />
      <PalmTree position={[0.5, 0.3, -2]} scale={1.1} />
    </group>
  );
}
