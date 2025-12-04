"use client";
import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RockVertices } from "./index";

interface RockMeshProps {
  name: string;
  vertices: RockVertices;
  color: string;
  position: [number, number, number];
  rotation: [number, number, number];
  animated: boolean;
  opacity: number;
  scale: number;
}

export default function RockMesh({
  name,
  vertices,
  color,
  position,
  rotation,
  animated,
  opacity,
  scale,
}: RockMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Tạo geometry từ các đỉnh
  const geometry = useMemo(() => {
    if (vertices.length < 3) {
      // Nếu không đủ đỉnh, tạo một hình cầu đơn giản
      const geo = new THREE.IcosahedronGeometry(0.5 * scale, 1);
      geo.computeVertexNormals();
      return geo;
    }

    // Chuyển đổi vertices thành Vector3 và scale
    const points = vertices.map(([x, y, z]) => 
      new THREE.Vector3(x * scale, y * scale, z * scale)
    );

    // Tính center để căn chỉnh
    const center = new THREE.Vector3();
    points.forEach((p) => center.add(p));
    center.divideScalar(points.length);

    // Tạo BufferGeometry từ các điểm
    const geo = new THREE.BufferGeometry();
    const positions: number[] = [];
    const indices: number[] = [];

    // Thêm tất cả các điểm vào positions (đã offset về center)
    points.forEach((point) => {
      const offset = point.clone().sub(center);
      positions.push(offset.x, offset.y, offset.z);
    });

    // Tạo convex hull đơn giản bằng cách tạo faces
    // Phương pháp: tạo faces từ điểm đầu tiên (apex) đến các cặp điểm liên tiếp
    if (points.length >= 3) {
      // Tìm điểm thấp nhất (có thể dùng làm base)
      let lowestIndex = 0;
      let lowestY = points[0].y;
      for (let i = 1; i < points.length; i++) {
        if (points[i].y < lowestY) {
          lowestY = points[i].y;
          lowestIndex = i;
        }
      }

      // Tạo base từ các điểm khác (loại trừ điểm thấp nhất)
      const basePoints: number[] = [];
      for (let i = 0; i < points.length; i++) {
        if (i !== lowestIndex) {
          basePoints.push(i);
        }
      }

      // Tạo faces từ điểm thấp nhất đến các cặp điểm base
      for (let i = 0; i < basePoints.length; i++) {
        const next = (i + 1) % basePoints.length;
        indices.push(lowestIndex, basePoints[i], basePoints[next]);
      }

      // Tạo top faces nếu có nhiều hơn 4 điểm
      if (points.length > 4) {
        // Tìm điểm cao nhất
        let highestIndex = 0;
        let highestY = points[0].y;
        for (let i = 1; i < points.length; i++) {
          if (points[i].y > highestY) {
            highestY = points[i].y;
            highestIndex = i;
          }
        }

        // Tạo faces từ điểm cao nhất đến các cặp điểm khác (không phải lowest)
        const topBasePoints: number[] = [];
        for (let i = 0; i < points.length; i++) {
          if (i !== lowestIndex && i !== highestIndex) {
            topBasePoints.push(i);
          }
        }

        if (topBasePoints.length >= 2) {
          for (let i = 0; i < topBasePoints.length; i++) {
            const next = (i + 1) % topBasePoints.length;
            indices.push(highestIndex, topBasePoints[i], topBasePoints[next]);
          }
        }
      }
    }

    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    if (indices.length > 0) {
      geo.setIndex(indices);
    }
    geo.computeVertexNormals();

    return geo;
  }, [vertices, scale]);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: color,
        opacity: opacity,
        transparent: opacity < 1,
        roughness: 0.95,
        metalness: 0.0,
        flatShading: true, // Low poly look
      }),
    [color, opacity]
  );

  // Animation nhẹ (nếu cần)
  useFrame((state) => {
    if (animated && meshRef.current) {
      // Có thể thêm animation nhẹ như xoay chậm
      meshRef.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
    />
  );
}

