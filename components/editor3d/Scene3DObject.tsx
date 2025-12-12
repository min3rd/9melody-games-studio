"use client";
import React, { useRef, useEffect } from 'react';
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
  orbitControlsRef?: React.RefObject<any>;
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
  orbitControlsRef,
}: Scene3DObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const transformControlsRef = useRef<any>(null);

  // Handle TransformControls events to disable/enable OrbitControls
  useEffect(() => {
    const controls = transformControlsRef.current;
    if (!controls || !orbitControlsRef?.current) return;

    const handleDraggingChanged = (event: any) => {
      if (orbitControlsRef.current) {
        orbitControlsRef.current.enabled = !event.value;
      }
    };

    controls.addEventListener('dragging-changed', handleDraggingChanged);

    return () => {
      controls.removeEventListener('dragging-changed', handleDraggingChanged);
    };
  }, [orbitControlsRef]);

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
          ref={transformControlsRef}
          object={meshRef.current}
          mode="translate"
          size={0.8}
          showX
          showY
          showZ
          onObjectChange={(e) => {
            if (meshRef.current) {
              const pos = meshRef.current.position;
              // Only update position when in translate mode
              onTransform?.('positionX', pos.x);
              onTransform?.('positionY', pos.y);
              onTransform?.('positionZ', pos.z);
            }
          }}
        />
      )}
    </>
  );
}
