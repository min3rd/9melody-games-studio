"use client";
import React, { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { HeightMap } from "../Sand3D";

interface AxisGizmoProps {
  position: [number, number, number];
  heightMap: HeightMap;
  row: number;
  col: number;
  size: number;
  heightScale: number;
  onHeightChange: (row: number, col: number, newHeight: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export default function AxisGizmo({
  position,
  heightMap,
  row,
  col,
  size,
  heightScale,
  onHeightChange,
  onDragStart,
  onDragEnd,
}: AxisGizmoProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera, raycaster, gl } = useThree();
  const [dragging, setDragging] = useState<"x" | "y" | "z" | null>(null);
  const [dragStart, setDragStart] = useState<{
    mouse: THREE.Vector2;
    height: number;
    worldPos: THREE.Vector3;
  } | null>(null);
  const [mousePos, setMousePos] = useState(new THREE.Vector2());
  const axisRefs = {
    x: useRef<THREE.Mesh>(null),
    y: useRef<THREE.Mesh>(null),
    z: useRef<THREE.Mesh>(null),
  };

  // Track mouse position khi đang drag
  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      setMousePos(new THREE.Vector2(x, y));
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [dragging, gl.domElement]);

  const axisLength = size * 0.3;
  const axisRadius = size * 0.01;
  const arrowSize = size * 0.05;

  // Tạo geometry cho các trục
  const geometries = React.useMemo(() => {
    const xGeo = new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, 8);
    xGeo.rotateZ(-Math.PI / 2);
    
    const yGeo = new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, 8);
    // Y đã đúng hướng
    
    const zGeo = new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, 8);
    zGeo.rotateX(Math.PI / 2);

    const arrowGeo = new THREE.ConeGeometry(arrowSize, arrowSize * 2, 8);
    arrowGeo.rotateX(-Math.PI / 2);

    return { x: xGeo, y: yGeo, z: zGeo, arrow: arrowGeo };
  }, [axisRadius, axisLength, arrowSize]);

  const handlePointerDown = (
    e: React.PointerEvent,
    axis: "x" | "y" | "z"
  ) => {
    e.stopPropagation();
    if (axis === "y") {
      // Chỉ cho phép kéo trục Y để thay đổi độ cao
      setDragging(axis);
      const currentHeight = heightMap[row][col];
      
      // Lấy vị trí world của điểm
      const worldPos = new THREE.Vector3(...position);
      
      // Tính toán mouse position từ event
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      setDragStart({
        mouse: new THREE.Vector2(x, y),
        height: currentHeight,
        worldPos: worldPos.clone(),
      });
      setMousePos(new THREE.Vector2(x, y));
      gl.domElement.style.cursor = "grabbing";
      onDragStart?.();
    }
  };

  const handlePointerUp = () => {
    if (dragging) {
      setDragging(null);
      setDragStart(null);
      gl.domElement.style.cursor = "default";
      onDragEnd?.();
    }
  };

  // Xử lý drag để thay đổi độ cao
  useFrame(() => {
    if (dragging === "y" && dragStart) {
      // Sử dụng raycasting để tính toán vị trí trong world space
      raycaster.setFromCamera(mousePos, camera);
      
      // Tạo plane vuông góc với trục Y tại vị trí điểm
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -dragStart.worldPos.y);
      const intersection = new THREE.Vector3();
      
      if (raycaster.ray.intersectPlane(plane, intersection)) {
        // Tính delta dựa trên khoảng cách từ điểm bắt đầu
        const deltaY = intersection.y - dragStart.worldPos.y;
        const sensitivity = 1.0 / heightScale; // Điều chỉnh sensitivity dựa trên heightScale
        const newHeight = dragStart.height + deltaY * sensitivity;
        
        // Giới hạn độ cao hợp lý
        const clampedHeight = Math.max(-5, Math.min(5, newHeight));
        onHeightChange(row, col, clampedHeight);
      } else {
        // Fallback: sử dụng delta mouse
        const deltaY = (mousePos.y - dragStart.mouse.y) * 2;
        const sensitivity = 0.3;
        const newHeight = dragStart.height + deltaY * sensitivity;
        const clampedHeight = Math.max(-5, Math.min(5, newHeight));
        onHeightChange(row, col, clampedHeight);
      }
    }
  });

  // Thêm event listeners cho mouse up
  React.useEffect(() => {
    const handleMouseUp = () => {
      if (dragging) {
        handlePointerUp();
      }
    };

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragging]);

  return (
    <group ref={groupRef} position={position}>
      {/* Trục X - Màu đỏ */}
      <group position={[axisLength / 2, 0, 0]}>
        <mesh
          geometry={geometries.x}
          onPointerDown={(e) => handlePointerDown(e, "x")}
          onPointerUp={handlePointerUp}
          onPointerOver={() => {
            if (!dragging) gl.domElement.style.cursor = "grab";
          }}
          onPointerOut={() => {
            if (!dragging) gl.domElement.style.cursor = "default";
          }}
        >
          <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[axisLength / 2, 0, 0]} geometry={geometries.arrow}>
          <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Trục Y - Màu xanh lá (độ cao) */}
      <group position={[0, axisLength / 2, 0]}>
        <mesh
          ref={axisRefs.y}
          geometry={geometries.y}
          onPointerDown={(e) => handlePointerDown(e, "y")}
          onPointerUp={handlePointerUp}
          onPointerOver={() => {
            if (!dragging) gl.domElement.style.cursor = "grab";
          }}
          onPointerOut={() => {
            if (!dragging) gl.domElement.style.cursor = "default";
          }}
        >
          <meshStandardMaterial 
            color={dragging === "y" ? "#00ff00" : "#00cc00"} 
            emissive={dragging === "y" ? "#00ff00" : "#00cc00"} 
            emissiveIntensity={dragging === "y" ? 1.0 : 0.5} 
          />
        </mesh>
        <mesh position={[0, axisLength / 2, 0]} geometry={geometries.arrow}>
          <meshStandardMaterial 
            color={dragging === "y" ? "#00ff00" : "#00cc00"} 
            emissive={dragging === "y" ? "#00ff00" : "#00cc00"} 
            emissiveIntensity={dragging === "y" ? 1.0 : 0.5} 
          />
        </mesh>
      </group>

      {/* Trục Z - Màu xanh dương */}
      <group position={[0, 0, axisLength / 2]}>
        <mesh
          geometry={geometries.z}
          onPointerDown={(e) => handlePointerDown(e, "z")}
          onPointerUp={handlePointerUp}
          onPointerOver={() => {
            if (!dragging) gl.domElement.style.cursor = "grab";
          }}
          onPointerOut={() => {
            if (!dragging) gl.domElement.style.cursor = "default";
          }}
        >
          <meshStandardMaterial color="#0000ff" emissive="#0000ff" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0, 0, axisLength / 2]} geometry={geometries.arrow}>
          <meshStandardMaterial color="#0000ff" emissive="#0000ff" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Điểm trung tâm */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[size * 0.02, 8, 8]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

