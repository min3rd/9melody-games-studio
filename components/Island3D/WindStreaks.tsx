"use client";
import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type WindStreaksProps = {
  count?: number;
  areaRadius?: number; // world-space wrap radius along wind axis
  minY?: number;
  maxY?: number;
  windDirection?: [number, number, number]; // normalized preferred
  speed?: number; // base speed units/sec
  color?: string;
  opacity?: number; // 0..1
  length?: number; // base length in world units
  width?: number; // base width in world units
  curve?: number; // base curvature amplitude in world units
};

export default function WindStreaks({
  count = 120,
  areaRadius = 26,
  minY = 2.2,
  maxY = 6.0,
  windDirection = [0.9, 0, 0.35],
  speed = 0.9,
  color = "#ffffff",
  opacity = 0.22,
  length = 3.2,
  width = 0.14,
  curve = 0.28,
}: WindStreaksProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const baseGeom = useMemo(() => new THREE.PlaneGeometry(1, 1, 16, 1), []);

  // uniforms + shader material
  const material = useMemo(() => {
    const uniforms = {
      uTime: new THREE.Uniform(0),
      uColor: new THREE.Uniform(new THREE.Color(color)),
      uOpacity: new THREE.Uniform(opacity),
    };
    const vert = /* glsl */`
      uniform float uTime;
      attribute mat4 instanceMatrix;
      attribute float aCurve; // per-instance curvature amplitude
      attribute float aSeed;  // 0..1
      attribute float aMix;   // 0..1 mix up/right direction
      varying vec2 vUv;
      varying float vT;
      void main(){
        vUv = uv;
        float t = uv.x; // along length
        vT = t;
        // position in local streak space (X along the streak, Y its width)
        vec3 p = position;
        // center plane vertically (width runs -0.5..0.5 in Y)
        p.y -= 0.5;
        // bend along local up/right depending on aMix
        vec3 upDir = vec3(0.0, 1.0, 0.0);
        vec3 rightDir = vec3(0.0, 0.0, 1.0);
        vec3 bendDir = mix(upDir, rightDir, aMix);
        float phase = aSeed * 6.2831853;
        float flutter = 0.05 * (sin(phase + t * 4.0 + uTime * 0.7) * 0.5 + 0.5);
        float arch = sin(t * 3.14159265);
        p += bendDir * (arch * aCurve + flutter * (uv.y - 0.5));
        // apply per-instance transform then camera
        vec4 worldPos = instanceMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `;
    const frag = /* glsl */`
      uniform vec3 uColor;
      uniform float uOpacity;
      varying vec2 vUv;
      varying float vT;
      void main(){
        // fade at head/tail
        float fadeHead = smoothstep(0.0, 0.08, vT);
        float fadeTail = 1.0 - smoothstep(0.92, 1.0, vT);
        float endFade = fadeHead * fadeTail;
        // side fade for soft edges
        float side = 1.0 - smoothstep(0.35, 0.5, abs(vUv.y - 0.5));
        float alpha = uOpacity * endFade * side;
        if(alpha <= 0.001) discard;
        gl_FragColor = vec4(uColor, alpha);
      }
    `;
    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return mat;
  }, [color, opacity]);

  // per-instance data/state
  const axis = useMemo(() => new THREE.Vector3().fromArray(windDirection).normalize(), [windDirection]);
  const qYaw = useMemo(() => {
    // rotate local +X to align with wind direction (xz plane)
    const angle = Math.atan2(axis.z, axis.x);
    const q = new THREE.Quaternion();
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
    return q;
  }, [axis]);

  const tmpObj = useMemo(() => new THREE.Object3D(), []);
  const positions = useMemo(() => Array.from({ length: count }, () => new THREE.Vector3()), [count]);
  const quaternions = useMemo(() => Array.from({ length: count }, () => new THREE.Quaternion()), [count]);
  const speeds = useMemo(() => new Float32Array(count), [count]);
  const lengths = useMemo(() => new Float32Array(count), [count]);
  const widths = useMemo(() => new Float32Array(count), [count]);
  const curves = useMemo(() => new Float32Array(count), [count]);
  const seeds = useMemo(() => new Float32Array(count), [count]);
  const mixes = useMemo(() => new Float32Array(count), [count]);

  // attributes
  useEffect(() => {
    if (!meshRef.current) return;
    // Allocate instanced attributes on geometry
    const g = meshRef.current.geometry as THREE.BufferGeometry;
    g.setAttribute("aCurve", new THREE.InstancedBufferAttribute(curves, 1));
    g.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seeds, 1));
    g.setAttribute("aMix", new THREE.InstancedBufferAttribute(mixes, 1));
  }, [curves, seeds, mixes]);

  // initial distribution
  useEffect(() => {
    const lateral = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);
    const right = new THREE.Vector3().crossVectors(axis, up).normalize();
    const forward = axis.clone();
    const rng = (i: number) => {
      const x = Math.sin(i * 12.9898) * 43758.5453;
      return x - Math.floor(x);
    };
    for (let i = 0; i < count; i++) {
      // random pos inside disk in plane perpendicular to Y, then project along forward by [-radius, radius]
      const r = Math.sqrt(rng(i) * rng(i + 17)) * areaRadius;
      const theta = rng(i + 1) * Math.PI * 2;
      lateral.copy(right).multiplyScalar(Math.cos(theta) * r).addScaledVector(new THREE.Vector3().crossVectors(up, right), Math.sin(theta) * r);
      const along = (rng(i + 2) * 2 - 1) * areaRadius;
      const y = minY + (maxY - minY) * rng(i + 3);
      positions[i].copy(lateral).addScaledVector(forward, along).setY(y);

      // per-instance params
      const len = length * (0.7 + 0.6 * rng(i + 4));
      const wid = width * (0.6 + 0.8 * rng(i + 5));
      const cur = curve * (0.5 + 0.9 * rng(i + 6));
      const spd = speed * (0.75 + 0.5 * rng(i + 7));
      const mix = rng(i + 8);
      const seed = rng(i + 9);
      lengths[i] = len;
      widths[i] = wid;
      curves[i] = cur;
      speeds[i] = spd;
      mixes[i] = mix;
      seeds[i] = seed;
    }
    // write initial matrices
    if (meshRef.current) {
      for (let i = 0; i < count; i++) {
        tmpObj.position.copy(positions[i]);
        // orient to wind yaw, add a tiny random tilt to avoid perfect alignment
        const tiltX = (seeds[i] - 0.5) * 0.12;
        const tiltZ = (seeds[i] * 1.37 - 0.5) * 0.12;
        const q = new THREE.Quaternion().multiply(qYaw).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(tiltX, 0, tiltZ)));
        quaternions[i].copy(q);
        tmpObj.quaternion.copy(quaternions[i]);
        tmpObj.scale.set(lengths[i], widths[i], 1);
        tmpObj.updateMatrix();
        meshRef.current.setMatrixAt(i, tmpObj.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
      const g = meshRef.current.geometry as THREE.BufferGeometry & { attributes: any };
      if (g.attributes.aCurve) g.attributes.aCurve.needsUpdate = true;
      if (g.attributes.aSeed) g.attributes.aSeed.needsUpdate = true;
      if (g.attributes.aMix) g.attributes.aMix.needsUpdate = true;
    }
  }, [count, areaRadius, minY, maxY, axis, qYaw, length, width, curve, speed]);

  // animate drift and wrap
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const forward = axis;
    const wrap = areaRadius;
    for (let i = 0; i < count; i++) {
      positions[i].addScaledVector(forward, speeds[i] * delta);
      // subtle vertical breathing
      const yOff = Math.sin((state.clock.elapsedTime + seeds[i] * 10.0) * 0.5) * 0.06;
      positions[i].y = THREE.MathUtils.clamp(positions[i].y + yOff * delta * 6.0, minY, maxY);
      // wrap along wind axis
      const along = positions[i].dot(forward);
      if (along > wrap) positions[i].addScaledVector(forward, -2 * wrap);
      else if (along < -wrap) positions[i].addScaledVector(forward, 2 * wrap);

      tmpObj.position.copy(positions[i]);
      tmpObj.quaternion.copy(quaternions[i]);
      tmpObj.scale.set(lengths[i], widths[i], 1);
      tmpObj.updateMatrix();
      meshRef.current.setMatrixAt(i, tmpObj.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    // advance shader time
    (material.uniforms.uTime as THREE.Uniform).value = state.clock.elapsedTime;
  });

  return (
    <instancedMesh ref={meshRef as any} args={[baseGeom, material as any, count] as any} frustumCulled={false}>
      {/* geometry and material are provided via args */}
    </instancedMesh>
  );
}
