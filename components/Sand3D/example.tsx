"use client";
import React from "react";
import Sand3D, { HeightMap } from "./index";

/**
 * Example usage of Sand3D component
 * 
 * This file demonstrates various ways to use the Sand3D component
 * with different height maps and color configurations.
 */

export default function Sand3DExamples() {
  // Ví dụ 1: Mặt cát phẳng
  const flatSand: HeightMap = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ];

  // Ví dụ 2: Mặt cát với đồi nhỏ
  const smallHills: HeightMap = [
    [0, 0.1, 0.2, 0.1, 0],
    [0.1, 0.3, 0.4, 0.3, 0.1],
    [0.2, 0.4, 0.5, 0.4, 0.2],
    [0.1, 0.3, 0.4, 0.3, 0.1],
    [0, 0.1, 0.2, 0.1, 0],
  ];

  // Ví dụ 3: Mặt cát với nhiều gợn sóng
  const waves: HeightMap = [
    [0.1, 0.2, 0.1, 0.2, 0.1],
    [0.2, 0.1, 0.2, 0.1, 0.2],
    [0.1, 0.2, 0.1, 0.2, 0.1],
    [0.2, 0.1, 0.2, 0.1, 0.2],
    [0.1, 0.2, 0.1, 0.2, 0.1],
  ];

  // Ví dụ 4: Mặt cát với hố và đồi
  const valleysAndHills: HeightMap = [
    [-0.2, -0.1, 0, 0.1, 0.2],
    [-0.1, 0, 0.1, 0.2, 0.1],
    [0, 0.1, 0.3, 0.1, 0],
    [0.1, 0.2, 0.1, 0, -0.1],
    [0.2, 0.1, 0, -0.1, -0.2],
  ];

  // Ví dụ 5: Mặt cát chi tiết hơn (10x10)
  const detailedSand: HeightMap = Array.from({ length: 10 }, (_, i) =>
    Array.from({ length: 10 }, (_, j) => {
      const x = (i - 5) / 5;
      const z = (j - 5) / 5;
      return Math.sin(x * 2) * Math.cos(z * 2) * 0.3;
    })
  );

  // Function để tính màu theo độ cao
  const heightColorFunction = (height: number, maxHeight: number, minHeight: number) => {
    const normalized = (height - minHeight) / (maxHeight - minHeight || 1);
    // Màu từ vàng nhạt (thấp) đến nâu (cao)
    if (normalized < 0.3) return "#F4D03F"; // Vàng nhạt
    if (normalized < 0.6) return "#F7DC6F"; // Vàng
    return "#D4AC0D"; // Vàng đậm/nâu
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {/* Mặt cát phẳng */}
      <div className="h-64 border rounded">
        <Sand3D heightMap={flatSand} color="#F4D03F" size={8} showControls={true} />
      </div>

      {/* Mặt cát với đồi nhỏ */}
      <div className="h-64 border rounded">
        <Sand3D 
          heightMap={smallHills} 
          color="#F7DC6F" 
          size={8}
          heightScale={2}
          showControls={true}
        />
      </div>

      {/* Mặt cát với gợn sóng */}
      <div className="h-64 border rounded">
        <Sand3D 
          heightMap={waves} 
          color="#F9E79F" 
          size={8}
          heightScale={1.5}
          showControls={true}
        />
      </div>

      {/* Mặt cát với hố và đồi */}
      <div className="h-64 border rounded">
        <Sand3D 
          heightMap={valleysAndHills} 
          color={heightColorFunction}
          size={8}
          heightScale={2}
          showControls={true}
        />
      </div>

      {/* Mặt cát chi tiết */}
      <div className="h-64 border rounded">
        <Sand3D 
          heightMap={detailedSand} 
          color="#D4AC0D" 
          size={10}
          heightScale={1.5}
          showControls={true}
        />
      </div>

      {/* Mặt cát với wireframe */}
      <div className="h-64 border rounded">
        <Sand3D 
          heightMap={smallHills} 
          color="#F4D03F" 
          size={8}
          heightScale={2}
          wireframe={true}
          showControls={true}
        />
      </div>
    </div>
  );
}

