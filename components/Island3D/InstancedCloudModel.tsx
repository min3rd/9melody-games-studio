"use client";
import React, { useMemo, useEffect, useRef } from 'react';
import { useFBX } from '@react-three/drei';
import * as THREE from 'three';

export default function InstancedCloudModel({
  transforms = [],
  path = '/files/3d/clouds/cloud3.fbx',
  size = 1.0,
  colorOverride = undefined,
  castShadow = true,
  receiveShadow = true,
  ...props
}: {
  transforms?: Array<{ position: [number, number, number]; rotationY?: number; scale?: number; color?: string }>;
  path?: string;
  size?: number;
  colorOverride?: string | undefined;
  castShadow?: boolean;
  receiveShadow?: boolean;
}) {
  const fbx = useFBX(path);
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const { geometry, material } = useMemo(() => {
    if (!fbx) return { geometry: null, material: null };
    // find a mesh inside the fbx with geometry
    let foundGeom: THREE.BufferGeometry | null = null;
    let foundMat: THREE.Material | null = null;
    fbx.traverse((child: any) => {
      if (child.isMesh && !foundGeom) {
        foundGeom = child.geometry as THREE.BufferGeometry;
        foundMat = child.material as THREE.Material;
      }
    });
    return { geometry: foundGeom, material: foundMat };
  }, [fbx]);

  // create a material clone to allow modifications
  const mat = useMemo(() => {
    if (!material) return null;
    const m = (material as any).clone ? (material as any).clone() : material;
    try {
      if (m) {
        (m as any).flatShading = true;
        (m as any).transparent = true;
        (m as any).opacity = (m as any).opacity ?? 1;
        (m as any).side = THREE.DoubleSide;
        (m as any).roughness = (m as any).roughness ?? 0.95;
      }
      if (colorOverride && m) {
        (m as any).color = new THREE.Color(colorOverride);
      }
    } catch (e) {}
    // enable vertex colors for instanced color usage
    if (m && (m as any).vertexColors === undefined) (m as any).vertexColors = true;
    return m as THREE.Material;
  }, [material, colorOverride]);

  // compute normalization scale factor for geometry (keep consistent size across models)
  const modelScaleFactor = useMemo(() => {
    if (!geometry) return 1;
    const bbox = geometry.boundingBox || (geometry.computeBoundingBox(), geometry.boundingBox);
    if (!bbox) return 1;
    const sizeVec = new THREE.Vector3();
    bbox.getSize(sizeVec);
    const maxSide = Math.max(sizeVec.x, sizeVec.y, sizeVec.z) || 1;
    return 1 / maxSide;
  }, [geometry]);

  useEffect(() => {
    if (!meshRef.current || !geometry) return;
    const mesh = meshRef.current;
    const tempMat = new THREE.Matrix4();
    const tempPos = new THREE.Vector3();
    const tempQuat = new THREE.Quaternion();
    const tempScale = new THREE.Vector3();
    transforms.forEach((t, i) => {
      const [x, y, z] = t.position;
      const s = (t.scale ?? 1) * size * modelScaleFactor;
      tempPos.set(x, y, z);
      tempQuat.setFromEuler(new THREE.Euler(0, t.rotationY ?? 0, 0));
      tempScale.set(s, s, s);
      tempMat.compose(tempPos, tempQuat, tempScale);
      mesh.setMatrixAt(i, tempMat);
      if ((mesh as any).setColorAt && t.color) {
        (mesh as any).setColorAt(i, new THREE.Color(t.color));
      }
    });
    mesh.instanceMatrix.needsUpdate = true;
    if ((mesh as any).instanceColor) (mesh as any).instanceColor.needsUpdate = true;
  }, [transforms, size, geometry]);

  if (!geometry || !mat) {
    return null;
  }

  return (
    <instancedMesh ref={meshRef} args={[geometry, mat, transforms.length]} {...props}>
      {/* InstancedMesh created */}
    </instancedMesh>
  );
}
