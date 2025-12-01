"use client";
import React, { useMemo } from 'react';
import * as THREE from 'three';

export type SandShape = 'circle' | 'oval' | 'irregular';

export default function Sand({
  shape = 'irregular',
  radius = 4,
  height = 0.6,
  color = '#F6F3EE',
}: {
  shape?: SandShape;
  radius?: number;
  height?: number;
  color?: string;
}) {
  const geometry = useMemo(() => {
    const segments = 64;
    // Use CircleGeometry as base; for oval we scale in X
    const g = new THREE.CircleGeometry(radius, segments);
    g.rotateX(-Math.PI / 2);

    const pos = g.attributes.position as THREE.BufferAttribute;
    const count = pos.count;
    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const d = Math.sqrt(x * x + z * z) / radius; // 0..1
      // Choose a profile based on shape
      let y = 0;
      if (shape === 'circle') {
        y = height * Math.max(0, 1 - d * d);
      } else if (shape === 'oval') {
        // scale x by factor to produce an oval
        const s = 1.4; // oval factor
        const ds = Math.sqrt((x / s) * (x / s) + z * z) / radius;
        y = height * Math.max(0, 1 - ds * ds);
      } else {
        // irregular: small perturbations + radial falloff
        const noise = (Math.sin(x * 2.5) + Math.cos(z * 2.3)) * 0.08;
        y = Math.max(0, height * (1 - d * d) + noise);
      }
      pos.setY(i, y);
    }
    g.computeVertexNormals();
    return g;
  }, [shape, radius, height]);

  // Expose a color for material only; no vertex color yet
  const sandColor = useMemo(() => new THREE.Color(color), [color]);

  return (
    <mesh geometry={geometry} position={[0, -1.2, 0]} receiveShadow>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial
        color={sandColor}
        roughness={0.9}
        metalness={0.05}
        flatShading
      />
    </mesh>
  );
}
