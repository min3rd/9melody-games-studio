"use client";
import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Stars } from '@react-three/drei';

export default function DayCycle({ cycleDuration = 60 }: { cycleDuration?: number }) {
  const dirRef = useRef<THREE.DirectionalLight>(null);
  const hemiRef = useRef<THREE.HemisphereLight>(null);
  const sunRef = useRef<THREE.PointLight>(null);
  const moonRef = useRef<THREE.DirectionalLight>(null);
  const moonFillRef = useRef<THREE.PointLight>(null);
  const starsRef = useRef<any>(null);
  const starOpacityRef = useRef<number>(0);
  const starScaleRef = useRef<number>(0);
  const starYRef = useRef<number>(0);
  const sunMeshRef = useRef<THREE.Mesh>(null);
  const moonMeshRef = useRef<THREE.Mesh>(null);
  const sunGlowRef = useRef<THREE.Sprite>(null);
  const moonGlowRef = useRef<THREE.Sprite>(null);
  const { scene } = useThree();

  useEffect(() => {
    // Initialize scene background
    scene.background = new THREE.Color('#87CEEB');
    scene.fog = new THREE.Fog('#87CEEB', 8, 40);
  }, [scene]);

  const orbGeo = useMemo(() => new THREE.SphereGeometry(1, 24, 16), []);
  const sunMat = useMemo(() => new THREE.MeshBasicMaterial({ color: new THREE.Color('#fff6df'), transparent: true, opacity: 1, blending: THREE.AdditiveBlending }), []);
  const moonMat = useMemo(() => new THREE.MeshBasicMaterial({ color: new THREE.Color('#e8f2ff'), transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending }), []);
  const createRadial = (hex: string, innerAlpha = 1.0) => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const grd = ctx.createRadialGradient(size/2, size/2, 2, size/2, size/2, size/2);
    const c = new THREE.Color(hex);
    const rgb = `rgba(${Math.round(c.r*255)}, ${Math.round(c.g*255)}, ${Math.round(c.b*255)}, `;
    grd.addColorStop(0.0, rgb + `${innerAlpha})`);
    grd.addColorStop(0.5, rgb + `${innerAlpha*0.6})`);
    grd.addColorStop(1.0, rgb + `0)`);
    ctx.fillStyle = grd;
    ctx.fillRect(0,0,size,size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  };
  const sunGlowTex = useMemo(() => createRadial('#fff6df', 0.95), []);
  const moonGlowTex = useMemo(() => createRadial('#e8f2ff', 0.85), []);

  function lerpColor(a: string, b: string, t: number) {
    const ca = new THREE.Color(a);
    const cb = new THREE.Color(b);
    return ca.lerp(cb, t);
  }

  useFrame((state, delta) => {
    const t = (state.clock.getElapsedTime() % cycleDuration) / cycleDuration; // 0-1
    // angle in radians for sun path
    const angle = t * Math.PI * 2;
    const SUN_DISTANCE = 220; // far away from the terrain
    const MOON_DISTANCE = 220;
    if (dirRef.current) {
      dirRef.current.position.set(Math.cos(angle) * SUN_DISTANCE, Math.sin(angle) * SUN_DISTANCE, 0);
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
    // subtle ambient tint at night from moon: mix moon color into hemisphere when starIntensity is high
    if (hemiRef.current) {
      const moonTint = new THREE.Color('#dfefff');
      const hi = Math.max(0, Math.min(1, starIntensity));
      // lerp hemisphere color slightly towards moon tint at night
      const newHemi = new THREE.Color(hemiRef.current.color.getHex()).lerp(moonTint, hi * 0.08);
      hemiRef.current.color.copy(newHemi);
    }
    // moon light (opposite the sun)
    const moonColor = new THREE.Color('#dfefff');
    const moonIntensity = Math.max(0, starIntensity * 0.85); // follow star intensity for night
    const moonFillIntensity = Math.max(0, starIntensity * 0.25);
    const moonAngle = angle + Math.PI; // opposite side of sun
    if (moonRef.current) {
      moonRef.current.color.copy(moonColor);
      moonRef.current.intensity = moonIntensity;
      moonRef.current.position.set(Math.cos(moonAngle) * MOON_DISTANCE, Math.sin(moonAngle) * MOON_DISTANCE, 0);
      moonRef.current.target.position.set(0, 0, 0);
    }
    if (moonFillRef.current) {
      moonFillRef.current.color.copy(moonColor);
      moonFillRef.current.intensity = moonFillIntensity;
      // place the fill light far away but slightly elevated to light the scene softly
      moonFillRef.current.position.set(Math.cos(moonAngle) * (MOON_DISTANCE * 0.6), Math.max(1, Math.sin(moonAngle) * (MOON_DISTANCE * 0.35)) + 10, -8);
    }
    // sync the sun and moon visible orbs with their light positions and intensities
    if (sunMeshRef.current && dirRef.current) {
      sunMeshRef.current.position.copy(dirRef.current.position);
      sunMeshRef.current.visible = dirIntensity > 0.05;
      (sunMeshRef.current.material as any).opacity = Math.max(0.1, Math.min(1, dirIntensity));
      const sScale = 0.6 + dirIntensity * 0.8;
      sunMeshRef.current.scale.setScalar(sScale);
    }
    if (sunGlowRef.current && dirRef.current) {
      sunGlowRef.current.position.copy(dirRef.current.position);
      const gScale = 20 + dirIntensity * 140;
      sunGlowRef.current.scale.set(gScale, gScale, gScale);
      (sunGlowRef.current.material as any).opacity = Math.max(0, Math.min(0.9, dirIntensity * 0.95));
    }
    if (moonMeshRef.current && moonRef.current) {
      moonMeshRef.current.position.copy(moonRef.current.position);
      moonMeshRef.current.visible = moonIntensity > 0.02;
      (moonMeshRef.current.material as any).opacity = Math.max(0.06, Math.min(0.9, moonIntensity * 1.2));
      const mScale = 0.45 + moonIntensity * 0.6;
      moonMeshRef.current.scale.setScalar(mScale);
    }
    if (moonGlowRef.current && moonRef.current) {
      moonGlowRef.current.position.copy(moonRef.current.position);
      const mgScale = 14 + moonIntensity * 80;
      moonGlowRef.current.scale.set(mgScale, mgScale, mgScale);
      (moonGlowRef.current.material as any).opacity = Math.max(0, Math.min(0.8, moonIntensity * 0.9));
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
          // grow/shrink star size at dawn/dusk using a smoothed scale
          const minStarSize = 0.1;
          const maxStarSize = 1.8;
          const sizeTarget = minStarSize + Math.pow(next, 0.6) * (maxStarSize - minStarSize);
          const prevScale = starScaleRef.current;
          const scaleFactor = 1 - Math.exp(-3.0 * delta);
          const nextScale = THREE.MathUtils.lerp(prevScale, sizeTarget, scaleFactor);
          starScaleRef.current = nextScale;
          // if the material has size and sizeAttenuation use them
          if (typeof (starsRef.current.material as any).size !== 'undefined') {
            (starsRef.current.material as any).size = nextScale;
            (starsRef.current.material as any).sizeAttenuation = true;
          }
          // vertical rise/fall effect: move the starsGroup up as they fade in, down as they fade out
          const minY = -1.2; // below origin
          const maxY = 0.4; // above origin a bit
          const yTarget = minY + Math.pow(next, 0.9) * (maxY - minY);
          const prevY = starYRef.current;
          const yNext = THREE.MathUtils.lerp(prevY, yTarget, scaleFactor);
          starYRef.current = yNext;
          if (starsRef.current.position) {
            starsRef.current.position.y = yNext;
          }
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
      <directionalLight ref={moonRef} position={[-10, 10, -6]} intensity={0} color={'#dfefff'} />
      <pointLight ref={moonFillRef} position={[1, 4, -8]} intensity={0} color={'#dfefff'} />
      <mesh ref={sunMeshRef} geometry={orbGeo} material={sunMat} position={[2, 8, 1]} scale={[1,1,1]} visible />
      <sprite ref={sunGlowRef} position={[2, 8, 1]} scale={[60, 60, 60] as any}>
        <spriteMaterial attach="material" map={sunGlowTex} color={new THREE.Color('#fff6df')} depthTest={false} depthWrite={false} blending={THREE.AdditiveBlending} transparent={true} opacity={0.8} />
      </sprite>
      <mesh ref={moonMeshRef} geometry={orbGeo} material={moonMat} position={[-10, 10, -6]} scale={[0.6,0.6,0.6]} visible />
      <sprite ref={moonGlowRef} position={[-10, 10, -6]} scale={[40, 40, 40] as any}>
        <spriteMaterial attach="material" map={moonGlowTex} color={new THREE.Color('#e8f2ff')} depthTest={false} depthWrite={false} blending={THREE.AdditiveBlending} transparent={true} opacity={0.6} />
      </sprite>
      <Stars ref={starsRef} radius={60} depth={50} count={4000} factor={7} saturation={0} fade={true} />
    </group>
  );
}
