"use client";
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import LowPolyCloud from './LowPolyCloud';
import CloudModel from './CloudModel';
import InstancedCloudModel from './InstancedCloudModel';
import * as THREE from 'three';

export default function CloudField({
  count = 8,
  radius = 20,
  minY = 2.5,
  maxY = 8.0,
  colors = ['#ffffff', '#ffccd6'],
  minSize = 0.8,
  maxSize = 3.0,
  driftSpeed = 0.02,
  detail = 0,
  useModel = true,
  useInstancedModel = true,
  // animation tuning for low-poly morph
  elongation = 1.4,
  bumpAmplitude = 0.12,
  bumpFrequency = 0.8,
}: {
  count?: number;
  radius?: number;
  minY?: number;
  maxY?: number;
  colors?: string[]; // color[0] default, color[1] pink
  minSize?: number;
  maxSize?: number;
  driftSpeed?: number;
  detail?: number;
  useModel?: boolean;
  useInstancedModel?: boolean;
  elongation?: number;
  bumpAmplitude?: number;
  bumpFrequency?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Precompute cloud placements and properties
  const clouds = useMemo(() => {
    const arr: Array<any> = [];
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * radius;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      const y = minY + Math.random() * (maxY - minY);
      const s = minSize + Math.random() * (maxSize - minSize);
      const color = colors[Math.floor(Math.random() * colors.length)];
      const rot = Math.random() * Math.PI * 2;
      const speed = driftSpeed * (0.5 + Math.random());
      arr.push({ x, y, z, s, color, rot, speed, id: i });
    }
    return arr;
  }, [count, radius, minY, maxY, colors, minSize, maxSize, driftSpeed]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.children.forEach((c: any, idx) => {
      const def = clouds[idx];
      if (!def) return;
      // drift horizontally based on speed and index offset
      def.rot += def.speed * delta * 0.2;
      const dx = Math.cos(def.rot) * def.speed * delta * 0.3;
      const dz = Math.sin(def.rot) * def.speed * delta * 0.3;
      c.position.x += dx;
      c.position.z += dz;
      // wrap around the radius
      const dist = Math.sqrt(c.position.x * c.position.x + c.position.z * c.position.z);
      if (dist > radius + 5) {
        // push back inside
        const angle = Math.random() * Math.PI * 2;
        c.position.set(Math.cos(angle) * radius * 0.6, c.position.y, Math.sin(angle) * radius * 0.6);
      }
      // subtle bobbing
      c.position.y = def.y + Math.sin(t * (0.15 + (idx % 6) * 0.05) + idx) * 0.12;
      // removed auto-rotation (shape morphing replaces rotation for LowPolyCloud)
    });
  });

  // If using instanced model, return a single `InstancedCloudModel` with transforms
  if (useModel && useInstancedModel) {
    const transforms = clouds.map((c) => ({ position: [c.x, c.y, c.z] as [number, number, number], rotationY: c.rot, scale: c.s, color: c.color }));
    return <InstancedCloudModel transforms={transforms} path={'/files/3d/clouds/cloud3.fbx'} size={1.0} />;
  }

  return (
    <group ref={groupRef}>
      {clouds.map((c) => (
        <group key={c.id} position={[c.x, c.y, c.z]} rotation={[0, c.rot, 0]}>
          {useModel ? (
            <CloudModel path={'/files/3d/clouds/cloud3.fbx'} size={c.s * 0.9} color={c.color} flatness={0.36} />
          ) : (
            <LowPolyCloud size={c.s} color={c.color} detail={detail} flatness={0.36} wobble={0.14} elongation={elongation} bumpAmplitude={bumpAmplitude} bumpFrequency={bumpFrequency} />
          )}
        </group>
      ))}
    </group>
  );
}
