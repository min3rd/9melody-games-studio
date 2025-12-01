"use client";
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Clouds({
  count = 8,
  radius = 6,
  height = 3.0,
  colors = ['#ffffff', '#ffc0cb'], // white & pink
  minParts = 12,
  maxParts = 80,
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
      const pinkColor = new THREE.Color(colors.length > 1 ? colors[1] : colors[0]);
      const whiteColor = new THREE.Color(colors[0]);
      // base part count scaled by cloud size s; helps big clouds have more puffs
      const basePartCount = Math.floor(minParts + Math.random() * (maxParts - minParts + 1));
      const sizeScaled = Math.floor(basePartCount * (1 + (s - 0.9) * 1.2));
      const partCount = Math.max(minParts, Math.min(maxParts * 3, sizeScaled)); // increased potential upper bound
      // decide if center has 1 or 2 big puffs
      const centerCount = Math.random() < 0.5 ? 1 : 2;
      const parts: Array<any> = [];
      // create center big puffs and ensure they don't overlap
      const centerScales: number[] = [];
      const centerPositions: Array<{px:number,pz:number}> = [];
      for (let ci = 0; ci < centerCount; ci++) {
        // pick a radial spot near center but ensure it's separated from other centers
        let px = (Math.random() * 2 - 1) * (s * 0.18);
        let pz = (Math.random() * 2 - 1) * (s * 0.18);
        // ensure central puffs don't overlap by adjusting until a minimal distance is met
        const maxAttempts = 8;
        let attempts = 0;
        const minCenterSeparation = Math.max(0.4 * s, s * 0.25);
        while (attempts < maxAttempts) {
          let tooClose = false;
          for (const cp of centerPositions) {
            const dx = px - cp.px;
            const dz = pz - cp.pz;
            if (Math.sqrt(dx * dx + dz * dz) < minCenterSeparation) {
              tooClose = true;
              break;
            }
          }
          if (!tooClose) break;
          px = (Math.random() * 2 - 1) * (s * 0.18);
          pz = (Math.random() * 2 - 1) * (s * 0.18);
          attempts++;
        }
        centerPositions.push({px, pz});
        const py = (Math.random() * 0.25 - 0.125) * s;
        const scale = s * (1.05 + Math.random() * 0.6); // slightly larger center puffs
        centerScales.push(scale);
        // center parts are pinker
        const pc = new THREE.Color();
        pc.lerpColors(pinkColor, whiteColor, 0); // pink
        parts.push({ px, py, pz, scale, color: `#${pc.getHexString()}` });
      }
      // create outer smaller puffs
      const centerMaxScale = centerScales.length > 0 ? Math.max(...centerScales) : s;
      const centerMaxRadius = centerMaxScale * 0.6; // geometry radius approx
      const outerMaxScale = Math.max(centerMaxScale / 3, centerMaxScale * 0.30); // outer <= ~1/3 center
      // compute an outer radius that keeps outer puffs closer to cloud center
      const centerMaxR = centerMaxRadius * 1.0;
      const outerRadiusBase = Math.max(centerMaxR + 0.1, s * 0.5);
      for (let oi = 0; oi < Math.max(0, partCount - centerCount); oi++) {
        const angle = Math.random() * Math.PI * 2;
        // random radial offset that's scaled relative to the center size, smaller than center
        const r = outerRadiusBase * (0.25 + Math.random() * 0.95);
        const px = Math.cos(angle) * r;
        const pz = Math.sin(angle) * r;
        // lift outer puffs slightly so they are not under central blobs
        const py = (0.03 + Math.random() * 0.25) * s;
        // calculate outer scale so it's <= outerMaxScale
        const scale = Math.min(outerMaxScale, outerMaxScale * (0.4 + Math.random() * 0.8));
        // color blends from pink at center to white at outer radius
        const d = Math.sqrt(px * px + pz * pz);
        const tBlend = Math.max(0, Math.min(1, 1 - d / (s * 1.05)));
        const pc = new THREE.Color();
        pc.lerpColors(pinkColor, whiteColor, 1 - tBlend);
        parts.push({ px, py, pz, scale, color: `#${pc.getHexString()}` });
      }
      // shuffle parts slightly so center parts not always first or last
      for (let k = parts.length - 1; k > 0; k--) {
        const j = Math.floor(Math.random() * (k + 1));
        [parts[k], parts[j]] = [parts[j], parts[k]];
      }
      return { x, y, z, s, parts };
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
              <meshStandardMaterial color={p.color} transparent opacity={0.92} roughness={0.9} metalness={0} side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
