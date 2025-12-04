"use client";
import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface IslandTerrainProps {
  size: number;
  mountainCount: number;
  sandColor: string;
  rockColor: string;
  position: [number, number, number];
  rotation: [number, number, number];
  animated: boolean;
}

// Seeded random function để tránh lỗi impure
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export default function IslandTerrain({
  size,
  mountainCount,
  sandColor,
  rockColor,
  position,
  rotation,
  animated,
}: IslandTerrainProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Tạo nền cát (hình trụ dẹt với độ không đều)
  const sandGeometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(size, size * 1.2, 0.3, 32);
    
    // Thêm độ không đều cho nền cát để tự nhiên hơn
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = pos.getY(i);
      
      // Chỉ thay đổi các điểm trên mặt trên (y > 0)
      if (y > 0.1) {
        const distance = Math.sqrt(x * x + z * z);
        const noise = (seededRandom(i * 456.789) - 0.5) * 0.05;
        const newY = y + noise * (1 - distance / (size * 1.2));
        pos.setY(i, newY);
      }
    }
    
    geo.computeVertexNormals();
    return geo;
  }, [size]);

  const sandMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: sandColor,
        roughness: 0.9,
        metalness: 0.0,
        flatShading: true,
      }),
    [sandColor]
  );

  // Tạo các núi đá
  const mountains = useMemo(() => {
    const mountainData: Array<{
      position: THREE.Vector3;
      height: number;
      baseRadius: number;
      seed: number;
    }> = [];

    for (let i = 0; i < mountainCount; i++) {
      const seed = i * 789.123; // Seed dựa trên index
      
      // Vị trí ngẫu nhiên trên đảo (trong phạm vi 80% kích thước)
      const angle = seededRandom(seed) * Math.PI * 2;
      const radius = seededRandom(seed + 1) * size * 0.4;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      // Kích thước núi ngẫu nhiên
      const baseRadius = 0.4 + seededRandom(seed + 2) * 0.6;
      const height = 0.8 + seededRandom(seed + 3) * 1.2;
      
      mountainData.push({
        position: new THREE.Vector3(x, height / 2 + 0.15, z),
        height,
        baseRadius,
        seed,
      });
    }

    return mountainData;
  }, [mountainCount, size]);

  // Tạo geometry cho các núi đá
  const mountainGeometries = useMemo(() => {
    return mountains.map((mountain) => {
      // Sử dụng ConeGeometry để tạo núi dạng nón
      const geo = new THREE.ConeGeometry(mountain.baseRadius, mountain.height, 8, 1);
      
      // Thêm noise để tạo hình dạng tự nhiên hơn
      const pos = geo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);
        
        // Thêm noise dựa trên vị trí
        const noiseX = (seededRandom(mountain.seed + i) - 0.5) * 0.15;
        const noiseZ = (seededRandom(mountain.seed + i + 100) - 0.5) * 0.15;
        const noiseY = y > 0 ? (seededRandom(mountain.seed + i + 200) - 0.5) * 0.1 : 0;
        
        pos.setXYZ(i, x + noiseX, y + noiseY, z + noiseZ);
      }
      
      geo.computeVertexNormals();
      geo.translate(mountain.position.x, mountain.position.y, mountain.position.z);
      
      return { geometry: geo, position: mountain.position };
    });
  }, [mountains]);

  const rockMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: rockColor,
        roughness: 0.95,
        metalness: 0.0,
        flatShading: true,
      }),
    [rockColor]
  );

  // Animation nhẹ (nếu cần)
  useFrame((state) => {
    if (animated && groupRef.current) {
      // Có thể thêm animation nhẹ như xoay chậm hoặc di chuyển nhẹ
      groupRef.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Nền cát */}
      <mesh geometry={sandGeometry} material={sandMaterial} receiveShadow castShadow />

      {/* Các núi đá */}
      {mountainGeometries.map((mountain, index) => (
        <mesh
          key={index}
          geometry={mountain.geometry}
          material={rockMaterial}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
}

