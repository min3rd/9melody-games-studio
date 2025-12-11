"use client";
import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Object3DData } from '@/components/editor3d';

interface SceneObjectRenderer {
  data: Object3DData;
}

/**
 * SceneObjectRenderer - Renders a 3D object from scene configuration
 * Similar to Scene3DObject but without editor controls
 */
function SceneObjectRenderer({ data }: SceneObjectRenderer) {
  const renderGeometry = () => {
    const color = data.color || '#3b82f6';
    const wireframe = data.wireframe || false;

    switch (data.type) {
      case 'box':
        return (
          <mesh position={data.position} rotation={data.rotation} scale={data.scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={color} wireframe={wireframe} />
          </mesh>
        );

      case 'sphere':
        return (
          <mesh position={data.position} rotation={data.rotation} scale={data.scale}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color={color} wireframe={wireframe} />
          </mesh>
        );

      case 'cylinder':
        return (
          <mesh position={data.position} rotation={data.rotation} scale={data.scale}>
            <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
            <meshStandardMaterial color={color} wireframe={wireframe} />
          </mesh>
        );

      case 'light':
        return (
          <group position={data.position} rotation={data.rotation} scale={data.scale}>
            <pointLight intensity={data.intensity || 1} color={color} />
          </group>
        );

      default:
        // Placeholder for custom components
        return (
          <mesh position={data.position} rotation={data.rotation} scale={data.scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#9CA3AF" wireframe />
          </mesh>
        );
    }
  };

  return <>{renderGeometry()}</>;
}

export interface HomepageScene3DProps {
  className?: string;
  enableControls?: boolean;
}

/**
 * HomepageScene3D - Displays the 3D scene configured in the editor
 * Loads scene configuration from localStorage and renders it
 */
export default function HomepageScene3D({
  className = '',
  enableControls = false,
}: HomepageScene3DProps) {
  const [sceneData, setSceneData] = useState<Record<string, Object3DData>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load scene configuration from localStorage
    const loadScene = () => {
      try {
        const savedConfig = localStorage.getItem('homepage-scene-config');
        if (savedConfig) {
          const config = JSON.parse(savedConfig);
          setSceneData(config.objectData || {});
        }
      } catch (error) {
        console.error('Failed to load scene configuration:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadScene();
  }, []);

  if (isLoading) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-b from-sky-200 to-sky-100 dark:from-sky-900 dark:to-sky-800 ${className}`}>
        <div className="text-center">
          <div className="text-2xl mb-2">🎮</div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">Loading scene...</div>
        </div>
      </div>
    );
  }

  const hasObjects = Object.keys(sceneData).length > 0;

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [8, 6, 8], fov: 50 }}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />

        {/* Camera */}
        <PerspectiveCamera makeDefault position={[8, 6, 8]} />
        
        {/* Controls (optional) */}
        {enableControls && <OrbitControls enableZoom enablePan />}

        {/* Render scene objects */}
        {hasObjects ? (
          Object.entries(sceneData).map(([id, data]) => (
            <SceneObjectRenderer key={id} data={data} />
          ))
        ) : (
          // Default scene if no configuration is saved
          <>
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[2, 2, 2]} />
              <meshStandardMaterial color="#3b82f6" />
            </mesh>
            <mesh position={[3, 0.5, 0]}>
              <sphereGeometry args={[1, 32, 32]} />
              <meshStandardMaterial color="#ef4444" />
            </mesh>
            <mesh position={[-3, 0.5, 0]}>
              <cylinderGeometry args={[0.8, 0.8, 2, 32]} />
              <meshStandardMaterial color="#10b981" />
            </mesh>
          </>
        )}

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#9CA3AF" opacity={0.3} transparent />
        </mesh>
      </Canvas>

      {!hasObjects && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 dark:bg-neutral-800/90 px-4 py-2 rounded-sm text-xs backdrop-blur-sm">
          No scene configured. Use the 3D Editor to create one.
        </div>
      )}
    </div>
  );
}
