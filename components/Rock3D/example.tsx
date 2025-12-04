"use client";
import React from "react";
import Rock3D, { RockMap } from "./index";

/**
 * Example usage of Rock3D component
 * 
 * This file demonstrates various ways to use the Rock3D component
 * with different rock configurations using vertex maps.
 */

export default function Rock3DExamples() {
  // Ví dụ 1: Hòn đá đơn giản với 6 đỉnh
  const simpleRock: RockMap = {
    rock1: [
      [0, 0, 0],
      [1, 0, 0],
      [0.5, 1, 0],
      [0, 0, 1],
      [1, 0, 1],
      [0.5, 0.8, 1],
    ],
  };

  // Ví dụ 2: Hòn đá phức tạp hơn
  const complexRock: RockMap = {
    rock2: [
      [-0.5, 0, -0.5],
      [0.5, 0, -0.5],
      [0.5, 0, 0.5],
      [-0.5, 0, 0.5],
      [0, 1.5, 0],
      [-0.3, 1.2, -0.3],
      [0.3, 1.2, -0.3],
      [0.3, 1.2, 0.3],
      [-0.3, 1.2, 0.3],
    ],
  };

  // Ví dụ 3: Nhiều hòn đá với hình dạng khác nhau
  const multipleRocks: RockMap = {
    smallRock: [
      [0, 0, 0],
      [0.3, 0, 0],
      [0.15, 0.4, 0],
      [0, 0, 0.3],
      [0.3, 0, 0.3],
      [0.15, 0.35, 0.3],
    ],
    mediumRock: [
      [-0.4, 0, -0.4],
      [0.4, 0, -0.4],
      [0.4, 0, 0.4],
      [-0.4, 0, 0.4],
      [0, 0.8, 0],
    ],
    largeRock: [
      [-0.6, 0, -0.6],
      [0.6, 0, -0.6],
      [0.6, 0, 0.6],
      [-0.6, 0, 0.6],
      [-0.2, 1.2, -0.2],
      [0.2, 1.2, -0.2],
      [0.2, 1.2, 0.2],
      [-0.2, 1.2, 0.2],
      [0, 1.5, 0],
    ],
  };

  // Ví dụ 4: Hòn đá với màu sắc khác nhau
  const coloredRocks: RockMap = {
    grayRock: [
      [0, 0, 0],
      [0.5, 0, 0],
      [0.25, 0.6, 0],
      [0, 0, 0.5],
      [0.5, 0, 0.5],
      [0.25, 0.5, 0.5],
    ],
    brownRock: [
      [-0.4, 0, -0.4],
      [0.4, 0, -0.4],
      [0.4, 0, 0.4],
      [-0.4, 0, 0.4],
      [0, 0.7, 0],
    ],
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {/* Hòn đá đơn giản */}
      <div className="h-64 border rounded">
        <Rock3D rocks={simpleRock} color="#7F8C8D" showControls={true} />
      </div>

      {/* Hòn đá phức tạp */}
      <div className="h-64 border rounded">
        <Rock3D rocks={complexRock} color="#566573" showControls={true} />
      </div>

      {/* Nhiều hòn đá */}
      <div className="h-64 border rounded">
        <Rock3D 
          rocks={multipleRocks} 
          color="#7F8C8D"
          scale={1}
          showControls={true}
        />
      </div>

      {/* Hòn đá với màu sắc khác nhau */}
      <div className="h-64 border rounded">
        <Rock3D 
          rocks={coloredRocks} 
          color={{
            grayRock: "#7F8C8D",
            brownRock: "#8B4513",
          }}
          showControls={true}
        />
      </div>

      {/* Hòn đá với scale khác nhau */}
      <div className="h-64 border rounded">
        <Rock3D 
          rocks={multipleRocks} 
          color="#5D6D7E"
          scale={{
            smallRock: 0.8,
            mediumRock: 1.2,
            largeRock: 1.5,
          }}
          showControls={true}
        />
      </div>

      {/* Hòn đá với opacity */}
      <div className="h-64 border rounded bg-gray-900">
        <Rock3D 
          rocks={complexRock} 
          color="#95A5A6"
          opacity={0.8}
          showControls={true}
        />
      </div>
    </div>
  );
}

