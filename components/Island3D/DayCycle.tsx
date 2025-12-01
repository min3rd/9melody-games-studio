"use client";
import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Stars } from '@react-three/drei';

export default function DayCycle({ cycleDuration = 60 }: { cycleDuration?: number }) {
  const dirRef = useRef<THREE.DirectionalLight>(null);
  const hemiRef = useRef<THREE.HemisphereLight>(null);
  const sunRef = useRef<THREE.PointLight>(null);
  const starsRef = useRef<any>(null);
  const starOpacityRef = useRef<number>(0);
  const { scene } = useThree();

  useEffect(() => {
    // Initialize scene background
    scene.background = new THREE.Color('#87CEEB');
    scene.fog = new THREE.Fog('#87CEEB', 8, 40);
  }, [scene]);

  function lerpColor(a: string, b: string, t: number) {
    const ca = new THREE.Color(a);
    const cb = new THREE.Color(b);
    return ca.lerp(cb, t);
  }

  useFrame((state, delta) => {
    const t = (state.clock.getElapsedTime() % cycleDuration) / cycleDuration; // 0-1
    // angle in radians for sun path
    const angle = t * Math.PI * 2;
    if (dirRef.current) {
      dirRef.current.position.set(Math.cos(angle) * 10, Math.sin(angle) * 10, 5);
      dirRef.current.target.position.set(0, 0, 0);
    }

    // Map t to skies/colors
    // We'll define some key colors and intensities
    // Night (0.85..1.0 and 0.0..0.15) -> Deep bluish
    // Dawn (0.15..0.25) -> warm orange
    // Day (0.25..0.75) -> bright
    // Dusk (0.75..0.85) -> warm purple/orange

    // Useful helper to normalize in ranges
    function norm(a: number, b: number, x: number) {
      if (x <= a) return 0;
      if (x >= b) return 1;
      return (x - a) / (b - a);
    }

    const isNight = (x: number) => x < 0.15 || x > 0.85;

    // sky colors
    const skyNight = '#061022';
    const skyDawn = '#FFDED0';
    const skyDay = '#87CEEB';
    const skyDusk = '#FFBBCC';

    // sun / directional light
    const sunNight = '#9BB0FF';
    const sunDawn = '#FFCBA4';
    const sunDay = '#FFF6DF';
    const sunDusk = '#FF9AA2';

    // ambient
    const ambNight = '#0a1220';
    const ambDawn = '#f7e6d6';
    const ambDay = '#bcd9ff';
    const ambDusk = '#efd0ff';

    // choose phase blend
    let sky = new THREE.Color(skyDay);
    let sunColor = new THREE.Color(sunDay);
    let ambColor = new THREE.Color(ambDay);
    let dirIntensity = 1.0;
    let ambIntensity = 0.5;
    let starIntensity = 0.0;

    // Night -> Dawn (0..0.15 -> 0) and (0.15 -> 0.25 -> dawn)
    if (t < 0.15) {
      // deep night -> dawn (0 -> 0.15)
      const p = t / 0.15; // 0..1
      sky = lerpColor(skyNight, skyDawn, p);
      sunColor = lerpColor(sunNight, sunDawn, p);
      ambColor = lerpColor(ambNight, ambDawn, p);
      dirIntensity = 0.15 + p * 0.6;
      ambIntensity = 0.05 + p * 0.45;
      starIntensity = 1 - p;
    } else if (t < 0.25) {
      // dawn phase 0.15->0.25
      const nt = norm(0.15, 0.25, t);
      sky = lerpColor(skyDawn, skyDay, nt);
      sunColor = lerpColor(sunDawn, sunDay, nt);
      ambColor = lerpColor(ambDawn, ambDay, nt);
      dirIntensity = 0.2 + nt * 0.8;
      ambIntensity = 0.2 + nt * 0.5;
      starIntensity = 1 - nt;
    } else if (t < 0.75) {
      // day 0.25->0.75
      const nt = norm(0.25, 0.75, t);
      sky = lerpColor(skyDay, skyDay, nt); // constant
      sunColor = lerpColor(sunDay, sunDay, nt);
      ambColor = lerpColor(ambDay, ambDay, nt);
      dirIntensity = 0.8 + 0.2 * Math.max(0, 1 - Math.abs(0.5 - nt) * 2); // small variation
      ambIntensity = 0.4 + 0.2 * (1 - Math.abs(0.5 - nt) * 2);
      starIntensity = 0.0;
    } else if (t < 0.85) {
      // dusk 0.75->0.85
      const nt = norm(0.75, 0.85, t);
      sky = lerpColor(skyDay, skyDusk, nt);
      sunColor = lerpColor(sunDay, sunDusk, nt);
      ambColor = lerpColor(ambDay, ambDusk, nt);
      dirIntensity = 1 - nt * 0.8;
      ambIntensity = 0.6 - nt * 0.5;
      starIntensity = nt;
    } else {
      // late dusk -> night 0.85 -> 1.0
      const nt = norm(0.85, 1.0, t);
      sky = lerpColor(skyDusk, skyNight, nt);
      sunColor = lerpColor(sunDusk, sunNight, nt);
      ambColor = lerpColor(ambDusk, ambNight, nt);
      dirIntensity = 0.2;
      ambIntensity = 0.05;
      starIntensity = 1.0;
    }

    // update scene colors
    if (dirRef.current) {
      dirRef.current.color.copy(sunColor);
      dirRef.current.intensity = dirIntensity;
    }
    if (hemiRef.current) {
      hemiRef.current.color.copy(ambColor);
      hemiRef.current.intensity = ambIntensity;
    }
    if (sunRef.current) {
      sunRef.current.color.copy(sunColor);
      sunRef.current.intensity = dirIntensity * 0.6;
    }
    if (starsRef.current) {
      try {
        // Smooth opacity transition for stars
        const speed = 2.5; // increase for faster fade
        const prev = starOpacityRef.current;
        // use an exponential smoothing factor for frame-rate independence
        const factor = 1 - Math.exp(-speed * delta);
        const next = THREE.MathUtils.lerp(prev, starIntensity, factor);
        starOpacityRef.current = next;

        // Set visibility based on a small threshold so they don't render during day
        starsRef.current.visible = next > 0.01;
        if (starsRef.current.material) {
          (starsRef.current.material as any).transparent = next < 0.999;
          (starsRef.current.material as any).opacity = Math.max(0, Math.min(1, next));
          (starsRef.current.material as any).needsUpdate = true;
        }
      } catch (e) {}
    }

    // scene background and fog update
    if (scene) {
      // assign new background color using Color instance
      scene.background = sky;
    }
    if (scene) {
      if (!scene.fog) scene.fog = new THREE.Fog(sky.getHex(), 8, 40);
      const fogColor = new THREE.Color(sky);
      scene.fog.color.copy(fogColor);
    }
  });

  return (
    <group>
      <hemisphereLight ref={hemiRef} color={'#bde0ff'} groundColor={'#7aa5ff'} intensity={0.5} />
      <directionalLight ref={dirRef} castShadow position={[10, 10, 5]} intensity={0.8} shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <pointLight ref={sunRef} position={[2, 8, 1]} intensity={0.4} color={'#fff6df'} />
      <Stars ref={starsRef} radius={60} depth={50} count={4000} factor={7} saturation={0} fade={true} />
    </group>
  );
}
