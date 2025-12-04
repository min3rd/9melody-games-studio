"use client";
import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WindStyle } from "./index";

interface WindStreamlinesProps {
  direction: [number, number, number];
  intensity: number;
  style: WindStyle;
  color: string;
  position: [number, number, number];
  count: number;
  length: number;
  width: number;
  opacity: number;
  animated: boolean;
  showArrow: boolean;
}

export default function WindStreamlines({
  direction,
  intensity,
  style,
  color,
  position,
  count,
  length,
  width,
  opacity,
  animated,
  showArrow,
}: WindStreamlinesProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Tạo các điểm bắt đầu cho streamlines
  const startPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const spacing = length / count;
    
    // Tạo grid 2D các điểm bắt đầu
    const gridSize = Math.ceil(Math.sqrt(count));
    for (let i = 0; i < count; i++) {
      const x = (i % gridSize - gridSize / 2) * spacing * 0.8;
      const z = (Math.floor(i / gridSize) - gridSize / 2) * spacing * 0.8;
      const y = (Math.random() - 0.5) * spacing * 0.5;
      points.push(new THREE.Vector3(x, y, z));
    }
    return points;
  }, [count, length]);

  // Tạo streamlines dựa trên style
  const streamlines = useMemo(() => {
    return startPoints.map((startPoint, index) => {
      const curves: THREE.Curve<THREE.Vector3>[] = [];
      
      switch (style) {
        case "streamlines": {
          // Đường thẳng với độ cong nhẹ
          const endPoint = new THREE.Vector3(
            startPoint.x + direction[0] * length * intensity,
            startPoint.y + direction[1] * length * intensity,
            startPoint.z + direction[2] * length * intensity
          );
          
          // Thêm một điểm giữa để tạo độ cong
          const midPoint = new THREE.Vector3().lerpVectors(startPoint, endPoint, 0.5);
          midPoint.y += (Math.random() - 0.5) * 0.3;
          midPoint.x += (Math.random() - 0.5) * 0.3;
          midPoint.z += (Math.random() - 0.5) * 0.3;
          
          const curve = new THREE.QuadraticBezierCurve3(startPoint, midPoint, endPoint);
          curves.push(curve);
          break;
        }

        case "particles": {
          // Nhiều đoạn ngắn tạo hiệu ứng hạt
          const segments = 6;
          let currentPoint = startPoint.clone();
          
          for (let i = 0; i < segments; i++) {
            const segmentLength = (length * intensity) / segments;
            const nextPoint = new THREE.Vector3(
              currentPoint.x + direction[0] * segmentLength + (Math.random() - 0.5) * 0.2,
              currentPoint.y + direction[1] * segmentLength + (Math.random() - 0.5) * 0.2,
              currentPoint.z + direction[2] * segmentLength + (Math.random() - 0.5) * 0.2
            );
            
            const curve = new THREE.LineCurve3(currentPoint, nextPoint);
            curves.push(curve);
            currentPoint = nextPoint;
          }
          break;
        }

        case "smoke": {
          // Đường cong mượt như khói
          const endPoint = new THREE.Vector3(
            startPoint.x + direction[0] * length * intensity,
            startPoint.y + direction[1] * length * intensity + Math.random() * 0.5,
            startPoint.z + direction[2] * length * intensity
          );
          
          // Tạo đường cong CatmullRom với nhiều điểm
          const controlPoints = [
            startPoint,
            new THREE.Vector3(
              startPoint.x + direction[0] * length * 0.25 * intensity,
              startPoint.y + direction[1] * length * 0.25 * intensity + (Math.random() - 0.5) * 0.3,
              startPoint.z + direction[2] * length * 0.25 * intensity
            ),
            new THREE.Vector3(
              startPoint.x + direction[0] * length * 0.5 * intensity,
              startPoint.y + direction[1] * length * 0.5 * intensity + (Math.random() - 0.5) * 0.4,
              startPoint.z + direction[2] * length * 0.5 * intensity
            ),
            new THREE.Vector3(
              startPoint.x + direction[0] * length * 0.75 * intensity,
              startPoint.y + direction[1] * length * 0.75 * intensity + (Math.random() - 0.5) * 0.3,
              startPoint.z + direction[2] * length * 0.75 * intensity
            ),
            endPoint,
          ];
          
          const curve = new THREE.CatmullRomCurve3(controlPoints);
          curves.push(curve);
          break;
        }

        case "cloud-trails": {
          // Đường với các khối mây nhỏ
          const segments = 4;
          let currentPoint = startPoint.clone();
          
          for (let i = 0; i < segments; i++) {
            const segmentLength = (length * intensity) / segments;
            const nextPoint = new THREE.Vector3(
              currentPoint.x + direction[0] * segmentLength,
              currentPoint.y + direction[1] * segmentLength + (Math.random() - 0.5) * 0.4,
              currentPoint.z + direction[2] * segmentLength
            );
            
            const curve = new THREE.LineCurve3(currentPoint, nextPoint);
            curves.push(curve);
            currentPoint = nextPoint;
          }
          break;
        }
      }

      return { curves, startPoint, index };
    });
  }, [startPoints, direction, length, intensity, style]);

  // Tạo geometry cho streamlines
  const geometries = useMemo(() => {
    return streamlines.map(({ curves }) => {
      const geometries: THREE.BufferGeometry[] = [];
      
      curves.forEach((curve) => {
        const points = curve.getPoints(20); // Số điểm trên đường cong
        
        if (style === "particles" || style === "cloud-trails") {
          // Tạo các khối nhỏ dọc theo đường
          points.forEach((point, i) => {
            if (i % 2 === 0) {
              // Tạo khối mây/khói nhỏ
              const size = width * (0.3 + Math.random() * 0.2);
              const geo = new THREE.IcosahedronGeometry(size, 1);
              
              // Làm mờ các cạnh
              const pos = geo.attributes.position as THREE.BufferAttribute;
              for (let j = 0; j < pos.count; j++) {
                const x = pos.getX(j);
                const y = pos.getY(j);
                const z = pos.getZ(j);
                const noise = (Math.random() - 0.5) * 0.15;
                pos.setXYZ(j, x * (1 + noise), y * (1 + noise), z * (1 + noise));
              }
              
              geo.computeVertexNormals();
              geo.translate(point.x, point.y, point.z);
              geometries.push(geo);
            }
          });
        } else {
          // Tạo tube geometry cho đường mượt
          const tubeGeometry = new THREE.TubeGeometry(curve, 20, width, 6, false);
          geometries.push(tubeGeometry);
        }
      });

      // Merge tất cả geometries
      if (geometries.length === 1) {
        return geometries[0];
      }

      // Merge multiple geometries
      const merged = new THREE.BufferGeometry();
      const positions: number[] = [];
      const normals: number[] = [];
      let offset = 0;
      const indices: number[] = [];

      geometries.forEach((geo) => {
        const pos = geo.attributes.position;
        const norm = geo.attributes.normal;

        for (let i = 0; i < pos.count; i++) {
          positions.push(pos.getX(i), pos.getY(i), pos.getZ(i));
          if (norm) {
            normals.push(norm.getX(i), norm.getY(i), norm.getZ(i));
          }
        }

        if (geo.index) {
          const geoIndices = geo.index.array;
          for (let i = 0; i < geoIndices.length; i++) {
            indices.push(geoIndices[i] + offset);
          }
          offset += pos.count;
        }
      });

      merged.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      if (normals.length > 0) {
        merged.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
      }
      merged.setIndex(indices);
      merged.computeVertexNormals();
      
      return merged;
    });
  }, [streamlines, width, style]);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: color,
        opacity: opacity,
        transparent: opacity < 1,
        roughness: 0.8,
        metalness: 0.0,
        flatShading: style === "particles" || style === "cloud-trails",
      }),
    [color, opacity, style]
  );

  // Animation: di chuyển streamlines theo hướng gió
  const animationOffsets = useRef(
    streamlines.map(() => ({
      offset: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.5,
    }))
  );

  useFrame((state) => {
    if (animated && groupRef.current) {
      // Tạo hiệu ứng sóng/di chuyển
      geometries.forEach((geo, index) => {
        if (geo && geo.attributes.position) {
          const pos = geo.attributes.position as THREE.BufferAttribute;
          const offset = animationOffsets.current[index];
          const time = state.clock.elapsedTime * offset.speed + offset.offset;
          
          // Thêm chuyển động nhẹ
          for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            const z = pos.getZ(i);
            
            // Thêm sóng nhẹ theo hướng vuông góc với gió
            const wave = Math.sin(time + i * 0.1) * 0.05;
            pos.setY(i, y + wave);
          }
          
          pos.needsUpdate = true;
          geo.computeVertexNormals();
        }
      });
    }
  });

  // Tạo mũi tên chỉ hướng gió
  const arrowGeometries = useMemo(() => {
    if (!showArrow) return null;
    
    const dir = new THREE.Vector3(...direction).normalize();
    const arrowLength = length * intensity * 1.2;
    const shaftLength = arrowLength * 0.75;
    const headLength = arrowLength * 0.25;
    const headWidth = arrowLength * 0.15;
    const shaftRadius = headWidth * 0.15;
    
    // Tạo trục mũi tên (cylinder) - mặc định hướng theo trục Y
    const shaftGeo = new THREE.CylinderGeometry(shaftRadius, shaftRadius, shaftLength, 8);
    shaftGeo.rotateX(Math.PI / 2); // Xoay để trục dọc theo Y
    shaftGeo.translate(0, shaftLength / 2, 0);
    
    // Tạo đầu mũi tên (cone) - mặc định hướng theo trục Y
    const headGeo = new THREE.ConeGeometry(headWidth, headLength, 8);
    headGeo.rotateX(Math.PI / 2);
    headGeo.translate(0, arrowLength - headLength / 2, 0);
    
    // Xoay theo hướng gió
    const up = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, dir);
    const rotationMatrix = new THREE.Matrix4().makeRotationFromQuaternion(quaternion);
    
    shaftGeo.applyMatrix4(rotationMatrix);
    headGeo.applyMatrix4(rotationMatrix);
    
    return { shaft: shaftGeo, head: headGeo };
  }, [direction, length, intensity, showArrow]);

  const arrowMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: color,
        opacity: opacity * 1.2 > 1 ? 1 : opacity * 1.2,
        transparent: true,
        roughness: 0.7,
        metalness: 0.0,
      }),
    [color, opacity]
  );

  return (
    <group ref={groupRef} position={position}>
      {geometries.map((geo, index) => (
        <mesh key={index} geometry={geo} material={material} castShadow receiveShadow />
      ))}
      {arrowGeometries && (
        <>
          <mesh geometry={arrowGeometries.shaft} material={arrowMaterial} />
          <mesh geometry={arrowGeometries.head} material={arrowMaterial} />
        </>
      )}
    </group>
  );
}

