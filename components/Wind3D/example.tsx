"use client";
import React from "react";
import Wind3D from "./index";

/**
 * Example usage of Wind3D component
 * 
 * This file demonstrates various ways to use the Wind3D component
 * with different directions, intensities, styles, and configurations.
 */

export default function Wind3DExamples() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {/* Gió nhẹ theo hướng X */}
      <div className="h-64 border rounded">
        <Wind3D 
          direction={[1, 0, 0]} 
          intensity="light" 
          style="streamlines"
          color="#e0e0e0"
          count={6}
        />
      </div>

      {/* Gió mạnh theo hướng Y (lên trên) */}
      <div className="h-64 border rounded">
        <Wind3D 
          direction={[0, 1, 0]} 
          intensity="strong" 
          style="smoke"
          color="#d0d0d0"
          count={8}
          showArrow={true}
        />
      </div>

      {/* Gió theo hướng chéo với particles */}
      <div className="h-64 border rounded">
        <Wind3D 
          direction={[1, 0.3, 0.5]} 
          intensity="medium" 
          style="particles"
          color="#c0c0c0"
          count={10}
          length={4}
        />
      </div>

      {/* Gió với cloud trails */}
      <div className="h-64 border rounded">
        <Wind3D 
          direction={[-1, 0, 0]} 
          intensity="medium" 
          style="cloud-trails"
          color="#f0f0f0"
          count={6}
          opacity={0.8}
        />
      </div>

      {/* Gió rất mạnh với streamlines */}
      <div className="h-64 border rounded">
        <Wind3D 
          direction={[0.7, 0.2, -0.5]} 
          intensity="very-strong" 
          style="streamlines"
          color="#b0b0b0"
          count={12}
          showArrow={true}
          showControls={true}
        />
      </div>

      {/* Gió với màu xanh */}
      <div className="h-64 border rounded bg-blue-50">
        <Wind3D 
          direction={[1, 0.1, 0]} 
          intensity="medium" 
          style="smoke"
          color="#87ceeb"
          count={8}
          opacity={0.7}
        />
      </div>

      {/* Gió với intensity tùy chỉnh */}
      <div className="h-64 border rounded">
        <Wind3D 
          direction={[0, 0, 1]} 
          intensity={2.0} 
          style="streamlines"
          color="#a0a0a0"
          count={10}
          length={6}
          width={0.4}
        />
      </div>

      {/* Gió với nhiều streamlines */}
      <div className="h-64 border rounded">
        <Wind3D 
          direction={[0.5, -0.3, 0.8]} 
          intensity="strong" 
          style="particles"
          color="#d0d0d0"
          count={15}
          animated={true}
          showArrow={true}
        />
      </div>
    </div>
  );
}

