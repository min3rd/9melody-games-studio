"use client";
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid } from '@react-three/drei';
import { ThemeToggle, UserMenu, LanguageSwitcher } from '@/components/ui';
import HierarchyPanel, { SceneObject } from './HierarchyPanel';
import PropertiesPanel from './PropertiesPanel';
import AssetLibraryPanel, { AssetItem } from './AssetLibraryPanel';
import EditorPanel from './EditorPanel';
import { useRouter } from 'next/navigation';

export interface Editor3DLayoutProps {
  translations: {
    viewport: {
      title: string;
      controls: {
        rotate: string;
        pan: string;
        zoom: string;
      };
    };
    hierarchy: {
      title: string;
      addObject: string;
      addLight: string;
      addGroup: string;
      noObjects: string;
      delete: string;
      rename: string;
    };
    properties: {
      title: string;
      noSelection: string;
      selectObject: string;
      transform: string;
      position: string;
      rotation: string;
      scale: string;
      appearance: string;
      color: string;
      wireframe: string;
      lightSettings: string;
      intensity: string;
    };
    assets: {
      title: string;
      search: string;
      newFolder: string;
      upload: string;
      refresh: string;
      grid: string;
      list: string;
      noAssets: string;
      dragDrop: string;
    };
  };
}

/**
 * Editor3DLayout - Main layout component for the 3D Editor
 * Provides a professional 3D editing interface with 4 main areas:
 * 1. 3D Viewport (center-left)
 * 2. Scene Hierarchy (left sidebar)
 * 3. Properties Panel (right sidebar)
 * 4. Asset Library (bottom panel)
 */
export default function Editor3DLayout({ translations }: Editor3DLayoutProps) {
  const router = useRouter();
  
  // Scene state
  const [sceneObjects, setSceneObjects] = useState<SceneObject[]>([
    { id: '1', name: 'Main Camera', type: 'object' },
    { id: '2', name: 'Directional Light', type: 'light' },
    { id: '3', name: 'Example Sand', type: 'object' },
  ]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  // Asset state
  const [assets] = useState<AssetItem[]>([
    { id: 'a1', name: 'Sand Textures', type: 'folder', path: '/textures/sand' },
    { id: 'a2', name: 'Rock Models', type: 'folder', path: '/models/rocks' },
    { id: 'a3', name: 'Cloud Models', type: 'folder', path: '/models/clouds' },
    { id: 'a4', name: 'sand_01.glb', type: 'file', path: '/models/sand_01.glb' },
    { id: 'a5', name: 'rock_01.glb', type: 'file', path: '/models/rock_01.glb' },
  ]);

  // Handlers
  const handleObjectSelect = (id: string) => {
    setSelectedObjectId(id);
  };

  const handleAddObject = (type: 'object' | 'light' | 'group') => {
    const newId = Date.now().toString();
    const typeName = type === 'light' ? 'Light' : type === 'group' ? 'Group' : 'Object';
    const newObject: SceneObject = {
      id: newId,
      name: `New ${typeName}`,
      type,
    };
    setSceneObjects([...sceneObjects, newObject]);
  };

  const handleDeleteObject = (id: string) => {
    setSceneObjects(sceneObjects.filter((obj) => obj.id !== id));
    if (selectedObjectId === id) {
      setSelectedObjectId(null);
    }
  };

  const handleRenameObject = (id: string, newName: string) => {
    setSceneObjects(
      sceneObjects.map((obj) => (obj.id === id ? { ...obj, name: newName } : obj))
    );
  };

  const handlePropertyChange = (property: string, value: any) => {
    console.log('Property changed:', property, value);
    // In a real implementation, this would update the selected object's properties
  };

  const selectedObject = sceneObjects.find((obj) => obj.id === selectedObjectId) || null;

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-900">
      {/* Left Sidebar - Navigation and Scene Hierarchy */}
      <div className="flex flex-col w-64 bg-neutral-800 dark:bg-neutral-900 border-r border-neutral-700">
        {/* Sidebar Header with Admin Title and Controls */}
        <div className="flex flex-col gap-3 p-4 border-b border-neutral-700">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/private/admin')}
              className="text-sm font-bold text-white hover:text-neutral-300 transition-colors"
            >
              ← Admin
            </button>
          </div>
          
          {/* Controls Row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
            <UserMenu />
          </div>
          
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
            3D Editor
          </div>
        </div>

        {/* Hierarchy Panel in Sidebar */}
        <div className="flex-1 overflow-hidden">
          <HierarchyPanel
            objects={sceneObjects}
            selectedId={selectedObjectId || undefined}
            onSelect={handleObjectSelect}
            onAdd={handleAddObject}
            onDelete={handleDeleteObject}
            onRename={handleRenameObject}
            translations={translations.hierarchy}
          />
        </div>
      </div>

      {/* Main Content Area - Full Height */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Toolbar */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 border-b border-neutral-300 dark:border-neutral-700 flex-shrink-0">
          <button className="px-3 py-1.5 text-xs bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-sm transition-colors">
            ↶ Undo
          </button>
          <button className="px-3 py-1.5 text-xs bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-sm transition-colors">
            ↷ Redo
          </button>
          <div className="h-6 w-px bg-neutral-300 dark:bg-neutral-700" />
          <button className="px-3 py-1.5 text-xs bg-primary-500 text-white hover:bg-primary-600 rounded-sm transition-colors">
            💾 Save
          </button>
          <button className="px-3 py-1.5 text-xs bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-sm transition-colors">
            📤 Export
          </button>
        </div>

        {/* Content Area with Viewport and Asset Library */}
        <div className="flex flex-1 overflow-hidden">
          {/* Center - Viewport and Asset Library */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* 3D Viewport */}
            <div className="flex-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-sky-100 dark:from-sky-900 dark:to-sky-800">
                <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[10, 10, 5]} intensity={0.8} />
                  <PerspectiveCamera makeDefault position={[5, 5, 5]} />
                  <OrbitControls enableZoom enablePan />
                  
                  {/* Grid helper */}
                  <Grid
                    args={[20, 20]}
                    cellSize={1}
                    cellThickness={0.5}
                    cellColor="#6b7280"
                    sectionSize={5}
                    sectionThickness={1}
                    sectionColor="#374151"
                    fadeDistance={25}
                    fadeStrength={1}
                    followCamera={false}
                  />

                  {/* Example objects */}
                  <mesh position={[0, 0.5, 0]}>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="#3b82f6" />
                  </mesh>

                  <mesh position={[2, 0.5, 0]}>
                    <sphereGeometry args={[0.5, 32, 32]} />
                    <meshStandardMaterial color="#ef4444" />
                  </mesh>
                </Canvas>
              </div>

              {/* Viewport Controls Info */}
              <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-neutral-800/90 px-3 py-2 rounded-sm text-xs space-y-1 backdrop-blur-sm">
                <div>{translations.viewport.controls.rotate}</div>
                <div>{translations.viewport.controls.pan}</div>
                <div>{translations.viewport.controls.zoom}</div>
              </div>
            </div>

            {/* Bottom Panel - Asset Library (Fixed Height) */}
            <div className="h-56 border-t border-neutral-300 dark:border-neutral-700 flex-shrink-0 overflow-hidden">
              <AssetLibraryPanel
                assets={assets}
                onAssetSelect={(asset) => console.log('Selected asset:', asset)}
                onAssetDragStart={(asset) => console.log('Drag started:', asset)}
                onNewFolder={(path) => console.log('New folder in:', path)}
                onUpload={() => console.log('Upload clicked')}
                onRefresh={() => console.log('Refresh clicked')}
                translations={translations.assets}
              />
            </div>
          </div>

          {/* Right Sidebar - Properties Panel */}
          <div className="w-80 border-l border-neutral-300 dark:border-neutral-700 flex-shrink-0 overflow-hidden">
            <PropertiesPanel
              selectedObject={selectedObject}
              onPropertyChange={handlePropertyChange}
              translations={translations.properties}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
