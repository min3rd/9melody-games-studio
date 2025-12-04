"use client";
import React from "react";
import Island3D from "./index";

/**
 * Example usage of Island3D component
 * 
 * This file demonstrates various ways to use the Island3D component
 * with different sizes, mountain counts, colors, and configurations.
 */

export default function Island3DExamples() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {/* Đảo nhỏ với ít núi */}
      <div className="h-64 border rounded">
        <Island3D 
          size="small" 
          mountainCount="few"
          sandColor="#F4D03F"
          rockColor="#7F8C8D"
        />
      </div>

      {/* Đảo trung bình với núi vừa */}
      <div className="h-64 border rounded">
        <Island3D 
          size="medium" 
          mountainCount="medium"
          sandColor="#F7DC6F"
          rockColor="#566573"
          showControls={true}
        />
      </div>

      {/* Đảo lớn với nhiều núi */}
      <div className="h-64 border rounded">
        <Island3D 
          size="large" 
          mountainCount="many"
          sandColor="#F8C471"
          rockColor="#5D6D7E"
        />
      </div>

      {/* Đảo với màu cát đỏ */}
      <div className="h-64 border rounded">
        <Island3D 
          size="medium" 
          mountainCount="medium"
          sandColor="#E67E22"
          rockColor="#34495E"
        />
      </div>

      {/* Đảo với màu cát trắng */}
      <div className="h-64 border rounded bg-blue-50">
        <Island3D 
          size="large" 
          mountainCount="many"
          sandColor="#FDFEFE"
          rockColor="#85929E"
          animated={true}
        />
      </div>

      {/* Đảo với núi tùy chỉnh */}
      <div className="h-64 border rounded">
        <Island3D 
          size={6} 
          mountainCount={7}
          sandColor="#F9E79F"
          rockColor="#7F8C8D"
          showControls={true}
        />
      </div>

      {/* Đảo với màu đá đen */}
      <div className="h-64 border rounded">
        <Island3D 
          size="medium" 
          mountainCount="medium"
          sandColor="#F4D03F"
          rockColor="#2C3E50"
        />
      </div>

      {/* Đảo lớn với màu cát vàng đậm */}
      <div className="h-64 border rounded">
        <Island3D 
          size="xlarge" 
          mountainCount="many"
          sandColor="#D4AC0D"
          rockColor="#566573"
          animated={true}
        />
      </div>
    </div>
  );
}

