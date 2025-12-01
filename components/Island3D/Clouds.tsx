"use client";
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Clouds({
  count = 8,
  radius = 6,
  height = 3.0,
  colors = ['#ffffff', '#ffc0cb'], // white & pink
  minParts = 3,
  maxParts = 6,
  flattenY = 0.65,
}:{
  count?: number;
  radius?: number;
  height?: number;
  colors?: string[];
  minParts?: number;
  maxParts?: number;
  flattenY?: number;
}) {
  const cloudsRef = useRef<THREE.Group>(null);
  const cloudDefs = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const a = (i / count) * Math.PI * 2;
      const x = Math.cos(a) * (radius + (Math.random() * radius * 0.2 - radius * 0.1));
      const z = Math.sin(a) * (radius + (Math.random() * radius * 0.2 - radius * 0.1));
      const y = height + (Math.random() * 1.2 - 0.6);
      const s = 0.9 + Math.random() * 1.6; // base size scale
      const color = colors[Math.floor(Math.random() * colors.length)];
      const partCount = Math.floor(minParts + Math.random() * (maxParts - minParts + 1));
      const parts = Array.from({ length: partCount }).map(() => {
        const px = (Math.random() * 2 - 1) * (s * 0.6);
        const pz = (Math.random() * 2 - 1) * (s * 0.35);
        const py = (Math.random() * 0.3 - 0.15) * s; // slight vertical offsets
        const scale = s * (0.6 + Math.random() * 1.1);
        return { px, py, pz, scale };
      });
      return { x, y, z, s, color, parts };
    });
  }, [count, radius, height, colors, minParts, maxParts]);

  useFrame((state, delta) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.02 * delta; // rotate faster so it's visible
      // gentle bobbing
      const t = state.clock.getElapsedTime();
      cloudsRef.current.children.forEach((c: any, idx) => {
        const def = cloudDefs[idx];
        if (!def) return;
        const bob = Math.sin(t * 0.5 + idx) * 0.08;
        c.position.y = def.y + bob;
        // subtle breathing for whole cloud group
        const s = def.s + Math.sin(t * 0.8 + idx) * 0.02;
        c.scale.set(s, s * flattenY, s);
      });
    }
  });

  return (
    <group ref={cloudsRef}>
      {cloudDefs.map((c, i) => (
        <group key={i} position={[c.x, c.y, c.z]}>
          {c.parts.map((p: any, j: number) => (
            <mesh key={`part-${i}-${j}`} position={[p.px, p.py, p.pz]} scale={[p.scale, p.scale * flattenY, p.scale]}>
              <sphereGeometry args={[0.6, 16, 12]} />
              <meshStandardMaterial color={c.color} transparent opacity={0.92} roughness={0.9} metalness={0} side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
