"use client";
import React from "react";
import Cloud3D from "./index";

/**
 * Example usage of Cloud3D component
 * 
 * This file demonstrates various ways to use the Cloud3D component
 * with different sizes, shapes, and configurations.
 */

export default function Cloud3DExamples() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {/* Small Puffy Cloud */}
      <div className="h-64 border rounded">
        <Cloud3D size="small" shape="puffy" color="#ffffff" />
      </div>

      {/* Medium Cumulus Cloud */}
      <div className="h-64 border rounded">
        <Cloud3D 
          size="medium" 
          shape="cumulus" 
          color="#e0e0e0"
          position={[0, 0, 0]}
          animated={true}
        />
      </div>

      {/* Large Flat Cloud */}
      <div className="h-64 border rounded">
        <Cloud3D 
          size="large" 
          shape="flat" 
          color="#d0d0d0"
          opacity={0.8}
        />
      </div>

      {/* Stratus Cloud */}
      <div className="h-64 border rounded">
        <Cloud3D 
          size="medium" 
          shape="stratus" 
          color="#c0c0c0"
          rotation={[0, Math.PI / 4, 0]}
        />
      </div>

      {/* Nimbus Cloud (Dark) */}
      <div className="h-64 border rounded bg-gray-800">
        <Cloud3D 
          size="large" 
          shape="nimbus" 
          color="#808080"
          opacity={0.9}
        />
      </div>

      {/* Scattered Clouds */}
      <div className="h-64 border rounded">
        <Cloud3D 
          size="medium" 
          shape="scattered" 
          color="#ffffff"
          count={5}
          showControls={true}
        />
      </div>

      {/* Custom Size */}
      <div className="h-64 border rounded">
        <Cloud3D 
          size={2.5} 
          shape="puffy" 
          color="#f0f0f0"
          position={[0, 1, 0]}
        />
      </div>

      {/* Colored Cloud */}
      <div className="h-64 border rounded bg-blue-100">
        <Cloud3D 
          size="medium" 
          shape="cumulus" 
          color="#87ceeb"
          opacity={0.85}
        />
      </div>
    </div>
  );
}


