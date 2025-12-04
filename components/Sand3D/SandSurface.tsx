"use client";
import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HeightMap, ColorMap, ColorFunction } from "./index";

interface SandSurfaceProps {
  heightMap: HeightMap;
  color: ColorMap;
  size: number;
  heightScale: number;
  position: [number, number, number];
  rotation: [number, number, number];
  animated: boolean;
  wireframe: boolean;
}

export default function SandSurface({
  heightMap,
  color,
  size,
  heightScale,
  position,
  rotation,
  animated,
  wireframe,
}: SandSurfaceProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const rows = heightMap.length;
  const cols = heightMap[0].length;

  // Tính min và max height
  const { minHeight, maxHeight } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const h = heightMap[i][j];
        min = Math.min(min, h);
        max = Math.max(max, h);
      }
    }
    return { minHeight: min, maxHeight: max };
  }, [heightMap, rows, cols]);

  // Tạo geometry từ height map
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(size, size, cols - 1, rows - 1);
    geo.rotateX(-Math.PI / 2); // Xoay để nằm ngang

    const position = geo.attributes.position as THREE.BufferAttribute;
    const vertexCount = position.count;

    // Điều chỉnh độ cao của các vertex dựa trên heightMap
    const stepX = size / (cols - 1);
    const stepZ = size / (rows - 1);
    const halfSize = size / 2;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        // Tìm index của vertex tương ứng
        const vertexIndex = i * cols + j;
        if (vertexIndex < vertexCount) {
          const x = j * stepX - halfSize;
          const z = i * stepZ - halfSize;
          const height = heightMap[i][j] * heightScale;

          position.setXYZ(vertexIndex, x, height, z);
        }
      }
    }

    // Tạo vertex colors nếu color là function hoặc string
    const colors = new Float32Array(vertexCount * 3);
    const isColorFunction = typeof color === "function";

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const vertexIndex = i * cols + j;
        if (vertexIndex < vertexCount) {
          const height = heightMap[i][j];
          let colorValue: string;

          if (isColorFunction) {
            colorValue = color(height, maxHeight, minHeight);
          } else {
            colorValue = color as string;
          }

          const colorObj = new THREE.Color(colorValue);
          colors[vertexIndex * 3] = colorObj.r;
          colors[vertexIndex * 3 + 1] = colorObj.g;
          colors[vertexIndex * 3 + 2] = colorObj.b;
        }
      }
    }

    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Tạo UV coordinates
    const uvs = new Float32Array(vertexCount * 2);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const vertexIndex = i * cols + j;
        if (vertexIndex < vertexCount) {
          uvs[vertexIndex * 2] = j / (cols - 1);
          uvs[vertexIndex * 2 + 1] = i / (rows - 1);
        }
      }
    }
    geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

    geo.computeVertexNormals();
    return geo;
  }, [heightMap, size, heightScale, color, rows, cols, minHeight, maxHeight]);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.9,
        metalness: 0.0,
        flatShading: false,
        side: THREE.DoubleSide,
        wireframe: wireframe,
      }),
    [wireframe]
  );

  // Animation nhẹ (nếu cần)
  useFrame((state) => {
    if (animated && meshRef.current) {
      // Có thể thêm animation nhẹ
      meshRef.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={position}
      rotation={rotation}
      receiveShadow
      castShadow
    />
  );
}

