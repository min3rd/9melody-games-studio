"use client";
import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface OceanSurfaceProps {
  size: number;
  waveIntensity: number;
  shallowColor: string;
  deepColor: string;
  foamColor: string;
  position: [number, number, number];
  animated: boolean;
  segments: number;
}

export default function OceanSurface({
  size,
  waveIntensity,
  shallowColor,
  deepColor,
  foamColor,
  position,
  animated,
  segments,
}: OceanSurfaceProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Tạo geometry cho mặt biển
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    geo.rotateX(-Math.PI / 2); // Xoay để nằm ngang

    const position = geo.attributes.position as THREE.BufferAttribute;
    const vertexCount = position.count;

    // Tạo mảng màu cho vertex colors (gradient theo độ sâu)
    const colors = new Float32Array(vertexCount * 3);
    const shallowColorObj = new THREE.Color(shallowColor);
    const deepColorObj = new THREE.Color(deepColor);

    // Tính toán màu dựa trên khoảng cách từ trung tâm
    const maxDistance = size * 0.5;
    
    for (let i = 0; i < vertexCount; i++) {
      const x = position.getX(i);
      const z = position.getZ(i);
      const distance = Math.sqrt(x * x + z * z);
      
      // Gradient từ nông (trung tâm) đến sâu (ngoài rìa)
      const depthFactor = Math.min(distance / maxDistance, 1);
      
      // Interpolate màu
      const r = shallowColorObj.r + (deepColorObj.r - shallowColorObj.r) * depthFactor;
      const g = shallowColorObj.g + (deepColorObj.g - shallowColorObj.g) * depthFactor;
      const b = shallowColorObj.b + (deepColorObj.b - shallowColorObj.b) * depthFactor;
      
      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }

    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Tạo UV coordinates cho bọt
    const uvs = new Float32Array(vertexCount * 2);
    for (let i = 0; i < vertexCount; i++) {
      const x = position.getX(i);
      const z = position.getZ(i);
      uvs[i * 2] = (x / size + 0.5);
      uvs[i * 2 + 1] = (z / size + 0.5);
    }
    geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

    geo.computeVertexNormals();
    return geo;
  }, [size, segments, shallowColor, deepColor]);

  // Seeded random function để tránh lỗi impure
  const seededRandom = React.useCallback((seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }, []);

  // Material với vertex colors và bọt
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.1,
        metalness: 0.1,
        flatShading: false,
        side: THREE.DoubleSide,
      }),
    []
  );

  // Tạo bọt trắng trên các đỉnh sóng
  const foamData = useMemo(() => {
    const foamPoints: Array<{ position: THREE.Vector3; size: number; seed: number }> = [];
    const foamCount = Math.floor(segments * segments * 0.1); // 10% số điểm

    for (let i = 0; i < foamCount; i++) {
      const seed = i * 123.456; // Seed dựa trên index
      const x = (seededRandom(seed) - 0.5) * size * 0.8;
      const z = (seededRandom(seed + 1) - 0.5) * size * 0.8;
      const foamSize = 0.1 + seededRandom(seed + 2) * 0.15;
      foamPoints.push({
        position: new THREE.Vector3(x, 0, z),
        size: foamSize,
        seed: seed,
      });
    }

    return foamPoints;
  }, [size, segments, seededRandom]);

  // Animation sóng
  useFrame((state) => {
    if (animated && meshRef.current) {
      const geometry = meshRef.current.geometry as THREE.PlaneGeometry;
      const position = geometry.attributes.position as THREE.BufferAttribute;
      const t = state.clock.elapsedTime;

      // Tạo sóng với nhiều tần số khác nhau
      for (let i = 0; i < position.count; i++) {
        const x = position.getX(i);
        const z = position.getZ(i);

        // Sóng chính
        const wave1 = Math.sin(x * 0.2 + t * 0.8) * Math.cos(z * 0.2 + t * 0.6);
        const wave2 = Math.sin(x * 0.3 + z * 0.3 + t * 1.0) * 0.5;
        const wave3 = Math.cos(x * 0.15 - z * 0.2 + t * 0.7) * 0.3;

        // Kết hợp các sóng
        const height = (wave1 + wave2 + wave3) * waveIntensity * 0.3;

        position.setY(i, height);
      }

      position.needsUpdate = true;
      geometry.computeVertexNormals();
    }
  });

  // Tạo geometry cho bọt
  const foamGeometries = useMemo(() => {
    return foamData.map((foam) => {
      const geo = new THREE.IcosahedronGeometry(foam.size, 1);
      
      // Làm mờ các cạnh để giống bọt
      const pos = geo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);
        const noise = (seededRandom(foam.seed + i) - 0.5) * 0.2;
        pos.setXYZ(i, x * (1 + noise), y * (1 + noise), z * (1 + noise));
      }
      
      geo.computeVertexNormals();
      return geo;
    });
  }, [foamData, seededRandom]);

  // Animation cho bọt
  const foamRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    if (animated) {
      foamRefs.current.forEach((foamMesh, index) => {
        if (foamMesh && foamData[index]) {
          const point = foamData[index].position;
          const t = state.clock.elapsedTime;
          
          // Di chuyển bọt theo sóng
          const x = point.x;
          const z = point.z;
          const wave1 = Math.sin(x * 0.2 + t * 0.8) * Math.cos(z * 0.2 + t * 0.6);
          const wave2 = Math.sin(x * 0.3 + z * 0.3 + t * 1.0) * 0.5;
          const height = (wave1 + wave2) * waveIntensity * 0.3;
          
          foamMesh.position.y = height + 0.1; // Bọt nổi trên sóng
          
          // Xoay nhẹ
          foamMesh.rotation.y += 0.01;
        }
      });
    }
  });

  const foamMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: foamColor,
        roughness: 0.9,
        metalness: 0.0,
        flatShading: true,
        transparent: true,
        opacity: 0.8,
      }),
    [foamColor]
  );

  return (
    <group position={position}>
      {/* Mặt biển chính */}
      <mesh ref={meshRef} geometry={geometry} material={material} receiveShadow castShadow />

      {/* Bọt trắng */}
      {foamGeometries.map((geo, index) => (
        <mesh
          key={index}
          ref={(el) => {
            foamRefs.current[index] = el;
          }}
          geometry={geo}
          material={foamMaterial}
          position={[foamData[index].position.x, 0, foamData[index].position.z]}
        />
      ))}
    </group>
  );
}

