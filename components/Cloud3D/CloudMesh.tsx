"use client";
import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CloudShape } from "./index";

interface CloudMeshProps {
  size: number;
  shape: CloudShape;
  color: string;
  position: [number, number, number];
  rotation: [number, number, number];
  animated: boolean;
  opacity: number;
}

export default function CloudMesh({
  size,
  shape,
  color,
  position,
  rotation,
  animated,
  opacity,
}: CloudMeshProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Generate cloud geometries based on shape
  const cloudGeometries = useMemo(() => {
    const geometries: THREE.BufferGeometry[] = [];

    switch (shape) {
      case "puffy": {
        // Multiple overlapping spheres for puffy clouds
        const count = 5;
        for (let i = 0; i < count; i++) {
          const geo = new THREE.IcosahedronGeometry(
            size * (0.4 + Math.random() * 0.3),
            Math.floor(2 + Math.random() * 2)
          );
          
          // Add noise to vertices for organic look
          const pos = geo.attributes.position as THREE.BufferAttribute;
          for (let j = 0; j < pos.count; j++) {
            const x = pos.getX(j);
            const y = pos.getY(j);
            const z = pos.getZ(j);
            const noise = (Math.random() - 0.5) * 0.2;
            pos.setXYZ(j, x * (1 + noise), y * (1 + noise), z * (1 + noise));
          }
          
          geo.computeVertexNormals();
          geo.translate(
            (Math.random() - 0.5) * size * 1.2,
            (Math.random() - 0.5) * size * 0.8,
            (Math.random() - 0.5) * size * 1.2
          );
          geometries.push(geo);
        }
        break;
      }

      case "flat": {
        // Flattened, stretched clouds
        const count = 3;
        for (let i = 0; i < count; i++) {
          const geo = new THREE.IcosahedronGeometry(size * 0.6, 2);
          const pos = geo.attributes.position as THREE.BufferAttribute;
          
          // Flatten along Y axis
          for (let j = 0; j < pos.count; j++) {
            const x = pos.getX(j);
            const y = pos.getY(j) * 0.3; // Flatten
            const z = pos.getZ(j);
            pos.setXYZ(j, x, y, z);
          }
          
          geo.computeVertexNormals();
          geo.translate(
            (Math.random() - 0.5) * size * 1.5,
            (Math.random() - 0.5) * size * 0.3,
            (Math.random() - 0.5) * size * 1.5
          );
          geo.scale(1.5, 1, 1.5); // Stretch horizontally
          geometries.push(geo);
        }
        break;
      }

      case "cumulus": {
        // Classic cumulus: large base with smaller puffs on top
        // Base
        const baseGeo = new THREE.IcosahedronGeometry(size * 0.8, 2);
        const basePos = baseGeo.attributes.position as THREE.BufferAttribute;
        for (let j = 0; j < basePos.count; j++) {
          const y = basePos.getY(j);
          if (y > 0) {
            basePos.setY(j, y * 0.4); // Flatten top
          }
        }
        baseGeo.computeVertexNormals();
        baseGeo.translate(0, -size * 0.3, 0);
        geometries.push(baseGeo);

        // Top puffs
        for (let i = 0; i < 4; i++) {
          const geo = new THREE.IcosahedronGeometry(size * 0.4, 2);
          geo.computeVertexNormals();
          geo.translate(
            (Math.random() - 0.5) * size * 0.8,
            size * 0.2 + Math.random() * size * 0.3,
            (Math.random() - 0.5) * size * 0.8
          );
          geometries.push(geo);
        }
        break;
      }

      case "stratus": {
        // Long, horizontal stratus clouds
        const count = 4;
        for (let i = 0; i < count; i++) {
          const geo = new THREE.IcosahedronGeometry(size * 0.5, 1);
          const pos = geo.attributes.position as THREE.BufferAttribute;
          
          // Very flat
          for (let j = 0; j < pos.count; j++) {
            const x = pos.getX(j);
            const y = pos.getY(j) * 0.2;
            const z = pos.getZ(j);
            pos.setXYZ(j, x, y, z);
          }
          
          geo.computeVertexNormals();
          geo.translate(
            (Math.random() - 0.5) * size * 2,
            (Math.random() - 0.5) * size * 0.2,
            (Math.random() - 0.5) * size * 0.5
          );
          geo.scale(2.5, 1, 1.2);
          geometries.push(geo);
        }
        break;
      }

      case "nimbus": {
        // Dark, dense nimbus clouds with vertical development
        const count = 6;
        for (let i = 0; i < count; i++) {
          const geo = new THREE.IcosahedronGeometry(
            size * (0.5 + Math.random() * 0.3),
            2
          );
          const pos = geo.attributes.position as THREE.BufferAttribute;
          
          // Stretch vertically
          for (let j = 0; j < pos.count; j++) {
            const x = pos.getX(j);
            const y = pos.getY(j) * (1.5 + Math.random() * 0.5);
            const z = pos.getZ(j);
            pos.setXYZ(j, x, y, z);
          }
          
          geo.computeVertexNormals();
          geo.translate(
            (Math.random() - 0.5) * size * 1.2,
            (Math.random() - 0.5) * size * 0.5,
            (Math.random() - 0.5) * size * 1.2
          );
          geometries.push(geo);
        }
        break;
      }

      default: {
        // Default: simple puffy
        const geo = new THREE.IcosahedronGeometry(size, 2);
        geo.computeVertexNormals();
        geometries.push(geo);
      }
    }

    // Return geometries array - we'll render them as separate meshes
    return geometries;
  }, [size, shape]);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: color,
        opacity: opacity,
        transparent: opacity < 1,
        roughness: 0.9,
        metalness: 0.0,
        flatShading: true, // Low poly look
      }),
    [color, opacity]
  );

  // Gentle floating animation
  useFrame((state) => {
    if (animated && groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
    >
      {Array.isArray(cloudGeometries) ? (
        cloudGeometries.map((geo, index) => (
          <mesh key={index} geometry={geo} material={material} castShadow receiveShadow />
        ))
      ) : (
        <mesh geometry={cloudGeometries} material={material} castShadow receiveShadow />
      )}
    </group>
  );
}

