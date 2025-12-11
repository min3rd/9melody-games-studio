"use client";
import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid } from '@react-three/drei';
import * as THREE from 'three';
import HierarchyPanel, { SceneObject } from './HierarchyPanel';
import PropertiesPanel from './PropertiesPanel';
import AssetLibraryPanel, { AssetItem } from './AssetLibraryPanel';
import EditorPanel from './EditorPanel';
import Scene3DObject, { Object3DData } from './Scene3DObject';

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
  // Scene state - now includes full 3D object data
  const [sceneObjects, setSceneObjects] = useState<SceneObject[]>([
    { id: '1', name: 'Main Camera', type: 'object' },
    { id: '2', name: 'Directional Light', type: 'light' },
  ]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  // 3D object data (position, rotation, scale, etc.)
  const [objectData, setObjectData] = useState<Record<string, Object3DData>>({
    '2': {
      id: '2',
      name: 'Directional Light',
      type: 'light',
      position: [5, 5, 5],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: '#ffffff',
      intensity: 0.8,
    },
  });

  // Asset state - Include 3D component types
  const [assets] = useState<AssetItem[]>([
    { id: 'primitives', name: 'Primitives', type: 'folder', path: '/primitives' },
    { id: 'components', name: '3D Components', type: 'folder', path: '/components' },
    { id: 'box', name: 'Box', type: 'file', path: '/primitives/box' },
    { id: 'sphere', name: 'Sphere', type: 'file', path: '/primitives/sphere' },
    { id: 'cylinder', name: 'Cylinder', type: 'file', path: '/primitives/cylinder' },
    { id: 'island', name: 'Island 3D', type: 'file', path: '/components/island' },
    { id: 'sand', name: 'Sand 3D', type: 'file', path: '/components/sand' },
    { id: 'ocean', name: 'Ocean 3D', type: 'file', path: '/components/ocean' },
    { id: 'cloud', name: 'Cloud 3D', type: 'file', path: '/components/cloud' },
    { id: 'rock', name: 'Rock 3D', type: 'file', path: '/components/rock' },
    { id: 'wind', name: 'Wind 3D', type: 'file', path: '/components/wind' },
  ]);

  // Panel collapse state
  const [hierarchyCollapsed, setHierarchyCollapsed] = useState(false);
  const [propertiesCollapsed, setPropertiesCollapsed] = useState(false);
  const [assetsCollapsed, setAssetsCollapsed] = useState(false);

  // Ref for OrbitControls to disable during transform
  const orbitControlsRef = useRef<any>(null);

  // Handlers
  const handleObjectSelect = (id: string) => {
    setSelectedObjectId(id);
  };

  const handleAddObject = (type: 'object' | 'light' | 'group') => {
    const newId = Date.now().toString();
    const typeName = type === 'light' ? 'Light' : type === 'group' ? 'Group' : 'Cube';
    const newObject: SceneObject = {
      id: newId,
      name: `New ${typeName}`,
      type,
    };
    setSceneObjects([...sceneObjects, newObject]);

    // Add default 3D data for objects and lights
    if (type === 'object') {
      setObjectData({
        ...objectData,
        [newId]: {
          id: newId,
          name: `New ${typeName}`,
          type: 'box',
          position: [0, 0.5, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
          color: '#3b82f6',
          wireframe: false,
        },
      });
    } else if (type === 'light') {
      setObjectData({
        ...objectData,
        [newId]: {
          id: newId,
          name: `New ${typeName}`,
          type: 'light',
          position: [5, 5, 5],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
          color: '#ffffff',
          intensity: 1,
        },
      });
    }
  };

  const handleDeleteObject = (id: string) => {
    setSceneObjects(sceneObjects.filter((obj) => obj.id !== id));
    // Remove from objectData as well
    const newObjectData = { ...objectData };
    delete newObjectData[id];
    setObjectData(newObjectData);
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
    if (!selectedObjectId || !objectData[selectedObjectId]) return;

    const updatedData = { ...objectData[selectedObjectId] };

    // Handle different property types
    if (property === 'name') {
      updatedData.name = value;
      handleRenameObject(selectedObjectId, value);
    } else if (property.startsWith('position')) {
      const axis = property.replace('position', '').toLowerCase();
      const axisIndex = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
      const newPosition = [...updatedData.position] as [number, number, number];
      newPosition[axisIndex] = value;
      updatedData.position = newPosition;
    } else if (property.startsWith('rotation')) {
      const axis = property.replace('rotation', '').toLowerCase();
      const axisIndex = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
      const newRotation = [...updatedData.rotation] as [number, number, number];
      newRotation[axisIndex] = value;
      updatedData.rotation = newRotation;
    } else if (property.startsWith('scale')) {
      const axis = property.replace('scale', '').toLowerCase();
      const axisIndex = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
      const newScale = [...updatedData.scale] as [number, number, number];
      newScale[axisIndex] = value;
      updatedData.scale = newScale;
    } else if (property === 'color') {
      updatedData.color = value;
    } else if (property === 'wireframe') {
      updatedData.wireframe = value;
    } else if (property === 'intensity') {
      updatedData.intensity = value;
    }

    setObjectData({
      ...objectData,
      [selectedObjectId]: updatedData,
    });
  };

  const selectedObject = sceneObjects.find((obj) => obj.id === selectedObjectId) || null;

  // Handle asset drag and create new object
  const handleAssetDragStart = (asset: AssetItem) => {
    console.log('Asset drag started:', asset);
  };

  const handleAssetSelect = (asset: AssetItem) => {
    // When user selects an asset, add it to the scene
    const assetType = asset.id as Object3DData['type'];
    if (['box', 'sphere', 'cylinder', 'light', 'island', 'sand', 'ocean', 'cloud', 'rock', 'wind'].includes(assetType)) {
      const newId = Date.now().toString();
      const newObject: SceneObject = {
        id: newId,
        name: asset.name,
        type: assetType === 'light' ? 'light' : 'object',
      };
      setSceneObjects([...sceneObjects, newObject]);

      // Set default 3D data based on asset type
      const defaultData: Object3DData = {
        id: newId,
        name: asset.name,
        type: assetType,
        position: [0, assetType === 'light' ? 5 : 0.5, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        color: assetType === 'light' ? '#ffffff' : '#3b82f6',
        wireframe: false,
        intensity: assetType === 'light' ? 1 : undefined,
      };

      setObjectData({
        ...objectData,
        [newId]: defaultData,
      });

      // Auto-select the new object
      setSelectedObjectId(newId);
    }
  };

  // Save scene configuration
  const handleSaveScene = () => {
    const sceneConfig = {
      objects: sceneObjects.filter(obj => obj.id !== '1'), // Exclude camera
      objectData: Object.fromEntries(
        Object.entries(objectData).filter(([id]) => id !== '1')
      ),
      timestamp: new Date().toISOString(),
    };
    
    // Save to localStorage for now (can be replaced with API call)
    localStorage.setItem('homepage-scene-config', JSON.stringify(sceneConfig));
    console.log('Scene saved:', sceneConfig);
    alert('Scene saved successfully!');
  };

  // Load scene configuration
  const handleLoadScene = () => {
    const savedConfig = localStorage.getItem('homepage-scene-config');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setSceneObjects([
          { id: '1', name: 'Main Camera', type: 'object' },
          ...config.objects,
        ]);
        setObjectData(config.objectData);
        console.log('Scene loaded:', config);
        alert('Scene loaded successfully!');
      } catch (error) {
        console.error('Failed to load scene:', error);
        alert('Failed to load scene configuration');
      }
    } else {
      alert('No saved scene found');
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 flex-shrink-0">
        <button className="px-3 py-1.5 text-xs bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-sm transition-colors">
          ↶ Undo
        </button>
        <button className="px-3 py-1.5 text-xs bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-sm transition-colors">
          ↷ Redo
        </button>
        <div className="h-6 w-px bg-neutral-300 dark:border-neutral-600" />
        <button 
          onClick={handleSaveScene}
          className="px-3 py-1.5 text-xs bg-primary-500 text-white hover:bg-primary-600 rounded-sm transition-colors"
        >
          💾 Save
        </button>
        <button 
          onClick={handleLoadScene}
          className="px-3 py-1.5 text-xs bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-sm transition-colors"
        >
          📂 Load
        </button>
        <button className="px-3 py-1.5 text-xs bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-sm transition-colors">
          📤 Export
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 min-h-0 overflow-hidden bg-neutral-50 dark:bg-neutral-900">
        {/* Left Sidebar - Scene Hierarchy */}
        <div
          className={`${
            hierarchyCollapsed ? 'w-12' : 'w-64'
          } transition-all duration-300 overflow-hidden`}
        >
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

        {/* Center Area - Viewport and Asset Library */}
        <div className="flex-1 flex flex-col overflow-hidden border-x border-neutral-200 dark:border-neutral-700">
          {/* 3D Viewport */}
          <div className="flex-1 min-h-0">
            <EditorPanel title={translations.viewport.title} className="h-full">
              <div className="h-full bg-gradient-to-b from-sky-200 to-sky-100 dark:from-sky-900 dark:to-sky-800 rounded-sm overflow-hidden">
                <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[10, 10, 5]} intensity={0.8} />
                  <PerspectiveCamera makeDefault position={[5, 5, 5]} />
                  <OrbitControls 
                    ref={orbitControlsRef}
                    enableZoom 
                    enablePan 
                    mouseButtons={{
                      LEFT: undefined,
                      MIDDLE: THREE.MOUSE.PAN,
                      RIGHT: THREE.MOUSE.ROTATE
                    }}
                  />
                  
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

                  {/* Render scene objects */}
                  {Object.entries(objectData).map(([id, data]) => (
                    <Scene3DObject
                      key={id}
                      data={data}
                      selected={selectedObjectId === id}
                      onSelect={() => handleObjectSelect(id)}
                      onTransform={(property, value) => {
                        handlePropertyChange(property, value);
                      }}
                      orbitControlsRef={orbitControlsRef}
                    />
                  ))}
                </Canvas>
              </div>

              {/* Viewport Controls Info */}
              <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-neutral-800/90 px-3 py-2 rounded-sm text-xs space-y-1 backdrop-blur-sm">
                <div>{translations.viewport.controls.rotate}</div>
                <div>{translations.viewport.controls.pan}</div>
                <div>{translations.viewport.controls.zoom}</div>
              </div>
            </EditorPanel>
          </div>

          {/* Bottom Panel - Asset Library */}
          <div
            className={`${
              assetsCollapsed ? 'h-12' : 'h-64'
            } transition-all duration-300 border-t border-neutral-200 dark:border-neutral-700 overflow-hidden`}
          >
            <AssetLibraryPanel
              assets={assets}
              onAssetSelect={handleAssetSelect}
              onAssetDragStart={handleAssetDragStart}
              onNewFolder={(path) => console.log('New folder in:', path)}
              onUpload={() => console.log('Upload clicked')}
              onRefresh={() => console.log('Refresh clicked')}
              translations={translations.assets}
            />
          </div>
        </div>

        {/* Right Sidebar - Properties Panel */}
        <div
          className={`${
            propertiesCollapsed ? 'w-12' : 'w-80'
          } transition-all duration-300 overflow-hidden`}
        >
          <PropertiesPanel
            selectedObject={selectedObject}
            objectData={selectedObjectId ? objectData[selectedObjectId] : undefined}
            onPropertyChange={handlePropertyChange}
            translations={translations.properties}
          />
        </div>
      </div>
    </div>
  );
}
