"use client";
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Ocean() {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    // Large plane so ocean covers entire viewport (and beyond)
    const size = 600; // wide enough to cover most viewports
    const segments = 120;
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    geo.rotateX(-Math.PI / 2);

    const position = geo.attributes.position as THREE.BufferAttribute;
    const vertexCount = position.count;
    // Build vertex color array and compute distance-based depth fraction
    const colors = new Float32Array(vertexCount * 3);
    const maxDistance = size * 0.5; // distance at which color is the deepest
    // Hex color stops for shallow -> deep
    const colorStops = ['#78B9B5', '#0F828C', '#065084', '#320A6B'];
    const parsedColors = colorStops.map((h) => {
      const c = new THREE.Color(h);
      return [c.r, c.g, c.b];
    });

    for (let i = 0; i < vertexCount; i++) {
      const x = position.getX(i);
      const z = position.getZ(i);
      const noise =
        Math.sin(x * 0.15) * 0.3 +
        Math.cos(z * 0.18) * 0.25 +
        Math.sin((x + z) * 0.1) * 0.15;
      position.setY(i, noise);

      // compute normalized distance from center (island at 0,0): 0 => shallow, 1 => deep
      const d = Math.sqrt(x * x + z * z);
      const t = Math.min(d / maxDistance, 1);
      // map t across 4 color stops
      const scaled = t * (parsedColors.length - 1);
      const idx = Math.floor(scaled);
      const weight = scaled - idx;
      const c1 = parsedColors[idx];
      const c2 = parsedColors[Math.min(idx + 1, parsedColors.length - 1)];
      const r = c1[0] + (c2[0] - c1[0]) * weight;
      const g = c1[1] + (c2[1] - c1[1]) * weight;
      const b = c1[2] + (c2[2] - c1[2]) * weight;
      colors[i * 3 + 0] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }

    position.needsUpdate = true;
    geo.computeVertexNormals();
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return geo;
  }, []);

  // Subtle wave animation
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const position = (meshRef.current?.geometry as THREE.PlaneGeometry)
      ?.attributes.position as THREE.BufferAttribute | undefined;
    if (!position) return;

    const vertexCount = position.count;
    for (let i = 0; i < vertexCount; i++) {
      const x = position.getX(i);
      const z = position.getZ(i);
      const base =
        Math.sin(x * 0.15) * 0.3 +
        Math.cos(z * 0.18) * 0.25 +
        Math.sin((x + z) * 0.1) * 0.15;
      const wave = Math.sin(t * 0.6 + x * 0.25 + z * 0.3) * 0.12;
      position.setY(i, base + wave);
    }
    position.needsUpdate = true;
    // Update normals after vertex displacement so lighting and colors render correctly
    const geom = meshRef.current?.geometry as THREE.BufferGeometry | undefined;
    if (geom) {
      geom.computeVertexNormals();
      if ((geom.attributes as any).normal) (geom.attributes as any).normal.needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -2.8, 0]} receiveShadow>
      <primitive object={geometry} attach="geometry" />
      {/* MeshBasicMaterial ignores lighting and shows vertex colors reliably */}
      <meshBasicMaterial vertexColors={true} side={THREE.DoubleSide} />
    </mesh>
  );
}
