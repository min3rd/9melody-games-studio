"use client";
import React, { useRef } from 'react';
import { TransformControls } from '@react-three/drei';
import * as THREE from 'three';

export interface Object3DData {
  id: string;
  name: string;
  type: 'box' | 'sphere' | 'cylinder' | 'light' | 'island' | 'sand' | 'ocean' | 'cloud' | 'rock' | 'wind';
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color?: string;
  wireframe?: boolean;
  intensity?: number;
}

export interface Scene3DObjectProps {
  data: Object3DData;
  selected: boolean;
  onSelect: () => void;
  onTransform?: (property: string, value: any) => void;
}

/**
 * Scene3DObject - Renders a single 3D object in the editor viewport
 * Supports basic primitives and custom 3D components
 */
export default function Scene3DObject({
  data,
  selected,
  onSelect,
  onTransform,
}: Scene3DObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const renderGeometry = () => {
    const color = data.color || '#3b82f6';
    const wireframe = data.wireframe || false;

    switch (data.type) {
      case 'box':
        return (
          <mesh
            ref={meshRef}
            position={data.position}
            rotation={data.rotation}
            scale={data.scale}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={color} wireframe={wireframe} />
          </mesh>
        );

      case 'sphere':
        return (
          <mesh
            ref={meshRef}
            position={data.position}
            rotation={data.rotation}
            scale={data.scale}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color={color} wireframe={wireframe} />
          </mesh>
        );

      case 'cylinder':
        return (
          <mesh
            ref={meshRef}
            position={data.position}
            rotation={data.rotation}
            scale={data.scale}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
            <meshStandardMaterial color={color} wireframe={wireframe} />
          </mesh>
        );

      case 'light':
        return (
          <group position={data.position} rotation={data.rotation} scale={data.scale}>
            <pointLight intensity={data.intensity || 1} color={color} />
            {/* Helper to visualize the light */}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
            >
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshBasicMaterial color={color} wireframe />
            </mesh>
          </group>
        );

      default:
        // Placeholder for custom components (island, sand, ocean, etc.)
        return (
          <mesh
            ref={meshRef}
            position={data.position}
            rotation={data.rotation}
            scale={data.scale}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#9CA3AF" wireframe />
          </mesh>
        );
    }
  };

  return (
    <>
      {renderGeometry()}
      {selected && meshRef.current && (
        <TransformControls
          object={meshRef.current}
          mode="translate"
          onObjectChange={(e) => {
            if (meshRef.current) {
              const pos = meshRef.current.position;
              const rot = meshRef.current.rotation;
              const scl = meshRef.current.scale;
              onTransform?.('position', [pos.x, pos.y, pos.z]);
              onTransform?.('rotation', [rot.x, rot.y, rot.z]);
              onTransform?.('scale', [scl.x, scl.y, scl.z]);
            }
          }}
        />
      )}
    </>
  );
}
