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
  const meshRef = useRef<THREE.Mesh | THREE.Group>(null);
  const transformControlsRef = useRef<any>(null);
  const isDraggingRef = useRef(false);

  // Handle TransformControls events to disable/enable OrbitControls
  useEffect(() => {
    const controls = transformControlsRef.current;
    if (!controls || !orbitControlsRef?.current) return;

    const handleDraggingChanged = (event: any) => {
      isDraggingRef.current = event.value;
      if (orbitControlsRef.current) {
        orbitControlsRef.current.enabled = !event.value;
      }
    };

    controls.addEventListener('dragging-changed', handleDraggingChanged);

    return () => {
      controls.removeEventListener('dragging-changed', handleDraggingChanged);
    };
  }, [orbitControlsRef]);

  // Sync mesh position/rotation/scale with data when NOT dragging
  useEffect(() => {
    if (!meshRef.current || isDraggingRef.current) return;
    
    const mesh = meshRef.current;
    const currentMeshPos: [number, number, number] = [mesh.position.x, mesh.position.y, mesh.position.z];
    const currentMeshRot: [number, number, number] = [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z];
    const currentMeshScale: [number, number, number] = [mesh.scale.x, mesh.scale.y, mesh.scale.z];
    
    // Only sync if data differs from current mesh state
    // This means the change came from input fields, not from dragging
    const posChanged = data.position[0] !== currentMeshPos[0] || 
                       data.position[1] !== currentMeshPos[1] || 
                       data.position[2] !== currentMeshPos[2];
    const rotChanged = data.rotation[0] !== currentMeshRot[0] || 
                       data.rotation[1] !== currentMeshRot[1] || 
                       data.rotation[2] !== currentMeshRot[2];
    const scaleChanged = data.scale[0] !== currentMeshScale[0] || 
                         data.scale[1] !== currentMeshScale[1] || 
                         data.scale[2] !== currentMeshScale[2];
    
    if (posChanged) {
      mesh.position.set(data.position[0], data.position[1], data.position[2]);
    }
    if (rotChanged) {
      mesh.rotation.set(data.rotation[0], data.rotation[1], data.rotation[2]);
    }
    if (scaleChanged) {
      mesh.scale.set(data.scale[0], data.scale[1], data.scale[2]);
    }
  }, [data.position, data.rotation, data.scale]);

  const renderGeometry = () => {
    const color = data.color || '#3b82f6';
    const wireframe = data.wireframe || false;

    switch (data.type) {
      case 'box':
        return (
          <mesh
            ref={meshRef}
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
          <group ref={meshRef}>
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
              // Update position values individually for proper state sync
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
