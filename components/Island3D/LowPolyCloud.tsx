"use client";
import React, { useMemo, useRef, useEffect } from 'react';
// deterministic pseudo-random helper (hash based on coordinates)
function pseudoRandom(x: number, y: number, z: number) {
  // sin hash
  const v = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
  return v - Math.floor(v);
}
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function LowPolyCloud({
  size = 1.0,
  color = '#ffffff',
  flatness = 0.2,
  detail = 0,
  wobble = 0.12,
  elongation = 1.4,
  bumpAmplitude = 0.12,
  bumpFrequency = 0.8,
  ...props
}: React.ComponentPropsWithoutRef<'mesh'> & {
  size?: number;
  color?: string;
  flatness?: number; // how flat (scale on Y)
  detail?: number; // geometry detail for icosahedron
  wobble?: number; // per-vertex jitter
  elongation?: number;
  bumpAmplitude?: number;
  bumpFrequency?: number;
}) {
  const geometry = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(1, detail);
    // flatten on Y for pancake effect
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      // flatten Y and apply slight deterministic wobble per vertex position
      const key0 = `${x.toFixed(4)}:${y.toFixed(4)}:${z.toFixed(4)}`;
      const seed0 = pseudoRandom(x + 7.3, y + 2.1, z + 3.3);
      const ny = y * (1 - flatness) + (seed0 * 2 - 1) * 0.02 * wobble;
      pos.setXYZ(i, x, ny, z);
    }
    // Add small displacement to give low-poly facets, using deterministic jitter per vertex position
    const displacementMap: Record<string, number> = {};
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const key = `${x.toFixed(4)}:${y.toFixed(4)}:${z.toFixed(4)}`;
      let jitterSeed = displacementMap[key];
      if (jitterSeed === undefined) {
        jitterSeed = pseudoRandom(x, y, z);
        displacementMap[key] = jitterSeed;
      }
      const dx = x + (jitterSeed * 2 - 1) * 0.08 * wobble;
      const dy = y + (pseudoRandom(x + 1, y + 1, z + 1) * 2 - 1) * 0.06 * wobble;
      const dz = z + (pseudoRandom(x + 2, y + 2, z + 2) * 2 - 1) * 0.08 * wobble;
      pos.setXYZ(i, dx, dy, dz);
    }
    // Recompute normals after displacement
    g.computeVertexNormals();
    return g;
  }, [flatness, detail, wobble]);

  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.95,
    metalness: 0.0,
    flatShading: true,
    side: THREE.DoubleSide,
  }), [color]);

  // dynamic animation refs
  const meshRef = useRef<THREE.Mesh | null>(null);
  const basePositionsRef = useRef<Float32Array | null>(null);
  const phasesRef = useRef<Float32Array | null>(null);

  useEffect(() => {
    if (!geometry) return;
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    basePositionsRef.current = new Float32Array(pos.array.length);
    basePositionsRef.current.set(pos.array);
    const base = basePositionsRef.current;
    phasesRef.current = new Float32Array(pos.count);
    for (let i = 0; i < pos.count; i++) {
      const bx = base[i * 3 + 0];
      const by = base[i * 3 + 1];
      const bz = base[i * 3 + 2];
      phasesRef.current[i] = pseudoRandom(bx + 0.5, by + 0.5, bz + 0.5) * Math.PI * 2;
    }
  }, [geometry]);

  useFrame((state, delta) => {
    if (!meshRef.current || !geometry || !basePositionsRef.current || !phasesRef.current) return;
    const time = state.clock.getElapsedTime();
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    const base = basePositionsRef.current;
    const phases = phasesRef.current;
    const el = Math.max(1, elongation);
    const amp = bumpAmplitude;
    const freq = bumpFrequency;
    for (let i = 0; i < pos.count; i++) {
      const bx = base[i * 3 + 0];
      const by = base[i * 3 + 1];
      const bz = base[i * 3 + 2];
      const nx = bx / 1.25; // normalized x-distance
      const falloff = Math.max(0, 1 - Math.abs(nx));
      const bulge = 1 + falloff * 0.55; // center bigger
      const phase = phases[i];
      const bump = Math.sin(phase + time * freq) * amp * falloff;
      const newX = bx * (1 + (el - 1) * falloff);
      const newZ = bz * (1 + (el - 1) * (falloff * 0.5));
      const newY = by * bulge + bump;
      pos.setXYZ(i, newX, newY, newZ);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geometry} material={mat} scale={[size * 1.2, size * (1 - flatness) * 0.6, size * 1.2]} {...props}>
      {/* use geometry and material created above */}
    </mesh>
  );
}
