"use client";
import React from "react";
import Ocean3D from "./index";

/**
 * Example usage of Ocean3D component
 * 
 * This file demonstrates various ways to use the Ocean3D component
 * with different sizes, wave intensities, colors, and configurations.
 */

export default function Ocean3DExamples() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {/* Biển nhỏ, sóng nhẹ */}
      <div className="h-64 border rounded">
        <Ocean3D 
          size="small" 
          waveIntensity="calm"
          shallowColor="#78B9B5"
          deepColor="#065084"
        />
      </div>

      {/* Biển trung bình, sóng vừa */}
      <div className="h-64 border rounded">
        <Ocean3D 
          size="medium" 
          waveIntensity="moderate"
          shallowColor="#87CEEB"
          deepColor="#1E3A8A"
          showControls={true}
        />
      </div>

      {/* Biển lớn, sóng mạnh */}
      <div className="h-64 border rounded">
        <Ocean3D 
          size="large" 
          waveIntensity="rough"
          shallowColor="#4A90E2"
          deepColor="#0F172A"
          foamColor="#F0F8FF"
        />
      </div>

      {/* Biển với sóng bão */}
      <div className="h-64 border rounded bg-gray-900">
        <Ocean3D 
          size="medium" 
          waveIntensity="stormy"
          shallowColor="#2C5282"
          deepColor="#1A202C"
          foamColor="#E2E8F0"
          segments={60}
        />
      </div>

      {/* Biển nhiệt đới */}
      <div className="h-64 border rounded">
        <Ocean3D 
          size="large" 
          waveIntensity="moderate"
          shallowColor="#00CED1"
          deepColor="#006994"
          foamColor="#FFFFFF"
          animated={true}
        />
      </div>

      {/* Biển với độ chi tiết cao */}
      <div className="h-64 border rounded">
        <Ocean3D 
          size="medium" 
          waveIntensity="rough"
          shallowColor="#5F9EA0"
          deepColor="#2F4F4F"
          segments={80}
          showControls={true}
        />
      </div>

      {/* Biển với màu tùy chỉnh */}
      <div className="h-64 border rounded">
        <Ocean3D 
          size={25} 
          waveIntensity={1.2}
          shallowColor="#B0E0E6"
          deepColor="#191970"
          foamColor="#F5F5DC"
        />
      </div>

      {/* Biển sóng nhẹ, màu xanh ngọc */}
      <div className="h-64 border rounded bg-blue-50">
        <Ocean3D 
          size="medium" 
          waveIntensity="calm"
          shallowColor="#7FFFD4"
          deepColor="#008B8B"
          foamColor="#FFFFFF"
          animated={true}
        />
      </div>
    </div>
  );
}

