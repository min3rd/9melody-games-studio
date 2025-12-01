"use client";
import React from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";

const SWEET_COLORS = ["#f9a8d4", "#fbb1a8", "#d6a6ff", "#ffffff", "#fdf2f8"] as const;

type SweetColor = typeof SWEET_COLORS[number];

type CloudConfig = {
  id: string;
  position: [number, number, number];
  baseScale: number;
  driftRadius: number;
  seed: number;
  colors: SweetColor[];
};

type LobeConfig = {
  id: string;
  offset: [number, number, number];
  scale: number;
  color: string;
  delay: number;
};

export interface CloudsProps {
  count?: number;
  spread?: number;
  minHeight?: number;
  maxHeight?: number;
}

export default function Clouds({
  count = 7,
  spread = 18,
  minHeight = 3.4,
  maxHeight = 6,
}: Readonly<CloudsProps>) {
  const configs = React.useMemo<CloudConfig[]>(() => {
    const rng = createRng(0x9ab1cde);
    return Array.from({ length: count }, (_, idx) => {
      const radius = spread * 0.4 + rng() * spread * 0.6;
      const angle = rng() * Math.PI * 2;
      const height = minHeight + rng() * (maxHeight - minHeight);
      const palette = pickPalette(rng);
      return {
        id: `cloud-${idx}`,
        position: [Math.cos(angle) * radius, height, Math.sin(angle) * radius],
        baseScale: 0.8 + rng() * 0.5,
        driftRadius: 0.6 + rng() * 0.6,
        seed: rng() * Math.PI * 2,
        colors: palette,
      };
    });
  }, [count, spread, minHeight, maxHeight]);

  return (
    <group>
      {configs.map((config) => (
        <CloudCluster key={config.id} config={config} />
      ))}
    </group>
  );
}

function CloudCluster({ config }: { config: CloudConfig }) {
  const groupRef = React.useRef<Group>(null);
  const lobes = React.useMemo(() => createLobes(config), [config]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const wobble = 1 + Math.sin(t * 0.35 + config.seed) * 0.08;
    groupRef.current.scale.setScalar(config.baseScale * wobble);
    groupRef.current.rotation.y = Math.sin(t * 0.12 + config.seed) * 0.3;
    groupRef.current.position.x = config.position[0] + Math.cos(t * 0.08 + config.seed) * config.driftRadius;
    groupRef.current.position.z = config.position[2] + Math.sin(t * 0.08 + config.seed * 1.3) * config.driftRadius;
    groupRef.current.position.y = config.position[1] + Math.sin(t * 0.25 + config.seed) * 0.45;
  });

  return (
    <group ref={groupRef} position={config.position} castShadow={false} receiveShadow={false}>
      {lobes.map((lobe) => (
        <CloudLobe key={lobe.id} {...lobe} />
      ))}
      <CloudGlow color={config.colors[0]} />
    </group>
  );
}

function CloudLobe({ offset, scale, color, delay }: LobeConfig) {
  const meshRef = React.useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const pulse = 1 + Math.sin(t * 0.9 + delay) * 0.15;
    meshRef.current.scale.setScalar(scale * pulse);
  });

  return (
    <mesh ref={meshRef} position={offset} castShadow={false} receiveShadow={false}>
      <icosahedronGeometry args={[0.6, 0]} />
      <meshStandardMaterial
        color={color}
        flatShading
        roughness={0.65}
        metalness={0.02}
        emissive={color}
        emissiveIntensity={0.08}
      />
    </mesh>
  );
}

function CloudGlow({ color }: { color: string }) {
  return (
    <mesh renderOrder={-1}>
      <sphereGeometry args={[0.9, 12, 12]} />
      <meshBasicMaterial color={color} transparent opacity={0.12} />
    </mesh>
  );
}

function createLobes(config: CloudConfig): LobeConfig[] {
  const rng = createRng(config.seed * 1000);
  const lobeCount = 4 + Math.floor(rng() * 3);
  return Array.from({ length: lobeCount }, (_, idx) => ({
    id: `${config.id}-lobe-${idx}`,
    offset: [
      (rng() - 0.5) * 2.2,
      (rng() - 0.3) * 1.2,
      (rng() - 0.5) * 1.8,
    ],
    scale: 0.55 + rng() * 0.65,
    color: tintColor(config.colors[idx % config.colors.length], rng() * 0.2 - 0.1),
    delay: rng() * Math.PI * 2,
  }));
}

function pickPalette(rng: () => number): SweetColor[] {
  const base = SWEET_COLORS[Math.floor(rng() * SWEET_COLORS.length)];
  const secondary = SWEET_COLORS[Math.floor(rng() * SWEET_COLORS.length)];
  return [base, secondary];
}

function tintColor(hex: string, delta: number) {
  const [r, g, b] = hexToRgb(hex);
  const adjust = (value: number) => {
    const next = value + delta * 255;
    return Math.max(0, Math.min(255, Math.round(next)));
  };
  return rgbToHex(adjust(r), adjust(g), adjust(b));
}

function hexToRgb(hex: string): [number, number, number] {
  const raw = hex.replace("#", "");
  const bigint = parseInt(raw.length === 3 ? raw.repeat(2) : raw, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
}

function createRng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
