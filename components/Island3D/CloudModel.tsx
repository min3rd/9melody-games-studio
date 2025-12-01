"use client";
import React, { useMemo } from 'react';
import { useFBX } from '@react-three/drei';
import * as THREE from 'three';

export default function CloudModel({
  path = '/files/3d/clouds/cloud3.fbx',
  // thanks to "https://sketchfab.com/3d-models/cloud-3-low-poly-aaf34de8ee2f42ca9e843d3b557266a7"
  size = 1.0,
  color = undefined,
  flatness = 0.36,
  castShadow = true,
  receiveShadow = true,
  rotation = [0, 0, 0],
  ...props
}: {
  path?: string;
  size?: number;
  color?: string | undefined;
  flatness?: number;
  castShadow?: boolean;
  receiveShadow?: boolean;
  rotation?: [number, number, number];
} & React.ComponentPropsWithoutRef<'group'>) {
  const fbx = useFBX(path);

  // quick normalize the model: scale it to unit and flatten on Y if requested
  const mesh = useMemo(() => {
    if (!fbx) return null;
    const group = fbx.clone();

    // optional color override and material tweaks
    group.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = castShadow;
        child.receiveShadow = receiveShadow;
        if (child.material) {
          // keep existing material but set flat shading for low poly effect
          child.material.flatShading = true;
          child.material.transparent = true;
          child.material.opacity = child.material.opacity ?? 1;
          child.material.side = THREE.DoubleSide;
          // override color if provided
          if (color) child.material.color = new THREE.Color(color);
        }
      }
    });

    // normalize scale: approximate bounding box scale to get a sane size
    const bbox = new THREE.Box3().setFromObject(group);
    const sizeVec = new THREE.Vector3();
    bbox.getSize(sizeVec);
    // avoid division by zero
    const maxSide = Math.max(sizeVec.x, sizeVec.y, sizeVec.z) || 1;
    const scaleFactor = size / maxSide;
    group.scale.setScalar(scaleFactor);

    return group;
  }, [fbx, size, color, castShadow, receiveShadow]);

  return (
    <group rotation={rotation} {...props}>
      {mesh ? <primitive object={mesh} /> : null}
    </group>
  );
}
