"use client";
import React, { useMemo } from "react";
import * as THREE from "three";

export default function LargeRegion({
  size = 12,
  detail = 32,
  jaggedness = 0.6,
  height = 1.0,
  groundY = -1.2,
  color = "#F6F3EE",
}: {
  size?: number;
  detail?: number;
  jaggedness?: number;
  height?: number;
  groundY?: number;
  color?: string;
}) {
  // Generate a low-poly irregular circular region (blob) as the land
  const outline = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    const segments = detail;
    for (let i = 0; i < segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      // radius with jaggedness noise
      const baseR = size;
      const noise =
        (Math.sin(theta * 3.0) * 0.2 + Math.cos(theta * 5.0) * 0.1) *
        jaggedness;
      const r = baseR * (1 - 0.25 * jaggedness + noise);
      const x = Math.cos(theta) * r;
      const y = Math.sin(theta) * r;
      pts.push(new THREE.Vector2(x, y));
    }
    return pts;
  }, [size, detail, jaggedness]);

  const geometry = useMemo(() => {
    const shape = new THREE.Shape(outline);
    const subdivisions = Math.max(4, Math.floor(detail / 4));
    const g = new THREE.ShapeGeometry(shape, subdivisions);
    // rotate so Y is up
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position as THREE.BufferAttribute;
    // Displace vertices to create gentle height + small noise
    const maxD = size * 1.2;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const d = Math.sqrt(x * x + z * z);
      // falloff to edges
      const t = 1 - Math.min(d / maxD, 1);
      const h =
        (height * 0.8 + (Math.random() * 0.2 - 0.1) * height) *
        Math.pow(t, 1.2);
      pos.setY(i, Math.max(0.01, h));
    }
    g.computeVertexNormals();
    return g;
  }, [outline, size, detail, height]);

  const matColor = useMemo(() => new THREE.Color(color), [color]);

  return (
    <group>
      <mesh geometry={geometry} position={[0, groundY, 0]} receiveShadow>
        <meshStandardMaterial
          color={matColor}
          roughness={0.9}
          metalness={0.02}
          flatShading
        />
      </mesh>
    </group>
  );
}
