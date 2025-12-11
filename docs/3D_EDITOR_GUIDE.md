# 3D Editor for Homepage Scene

This feature provides a comprehensive 3D editor for creating and customizing 3D scenes that are displayed on the homepage.

## Overview

The 3D Editor is located at `/private/admin/3d-editor` and provides a professional interface for managing 3D scenes with the following features:

### Key Features

1. **Scene Hierarchy Panel** (Left Sidebar)
   - View all objects in the scene
   - Add new objects (📦), lights (💡), or groups (📁)
   - Select, rename, or delete objects
   - Visual hierarchy with icons

2. **3D Viewport** (Center)
   - Real-time 3D rendering using React Three Fiber
   - Interactive camera controls:
     - **Rotate**: Left click + drag
     - **Pan**: Right click + drag
     - **Zoom**: Scroll wheel
   - Grid helper for spatial reference
   - Transform controls for selected objects

3. **Properties Panel** (Right Sidebar)
   - Edit object properties:
     - **Transform**: Position (X, Y, Z), Rotation (X, Y, Z), Scale (X, Y, Z)
     - **Appearance**: Color, Wireframe mode (for objects)
     - **Light Settings**: Intensity, Color (for lights)
   - Real-time updates in the viewport

4. **Asset Library** (Bottom Panel)
   - Browse available 3D assets
   - **Primitives**: Box, Sphere, Cylinder
   - **3D Components**: Island, Sand, Ocean, Cloud, Rock, Wind
   - Click on an asset to add it to the scene
   - Grid/List view toggle
   - Search functionality

## Usage Guide

### Creating a Scene

1. **Access the Editor**
   - Navigate to `/private/admin/3d-editor` (requires admin authentication)

2. **Add Objects to the Scene**
   - **Method 1**: Click the `+ 📦` button in the Hierarchy Panel
   - **Method 2**: Click on an asset in the Asset Library panel
   - The object will appear in the viewport and hierarchy

3. **Position and Transform Objects**
   - Click on an object in the viewport or hierarchy to select it
   - Use the Properties Panel to adjust:
     - Position: Move the object in 3D space
     - Rotation: Rotate the object around X, Y, Z axes
     - Scale: Change the object's size
   - Or use transform controls directly in the viewport (when available)

4. **Customize Appearance**
   - Select an object
   - In the Properties Panel, adjust:
     - **Color**: Click the color picker to choose a color
     - **Wireframe**: Toggle to show object as wireframe

5. **Add Lighting**
   - Click `+ 💡` in the Hierarchy Panel
   - Adjust light position and intensity in the Properties Panel
   - Change light color for different effects

6. **Save Your Scene**
   - Click the **💾 Save** button in the top toolbar
   - The scene configuration is saved to browser localStorage
   - You'll see a confirmation message

7. **Load a Saved Scene**
   - Click the **📂 Load** button in the top toolbar
   - Previously saved scene will be restored

### Viewing on Homepage

The saved 3D scene is automatically displayed on the homepage (`/`):

- The scene loads from the saved configuration
- Interactive controls are enabled (users can rotate and zoom the view)
- If no scene is configured, a default scene with basic shapes is shown

### Scene Persistence

- **Storage**: Scene configurations are currently stored in browser `localStorage`
- **Key**: `homepage-scene-config`
- **Data Structure**:
  ```json
  {
    "objects": [...],
    "objectData": {
      "objectId": {
        "id": "...",
        "name": "...",
        "type": "box|sphere|cylinder|light|...",
        "position": [x, y, z],
        "rotation": [x, y, z],
        "scale": [x, y, z],
        "color": "#hex",
        "wireframe": boolean,
        "intensity": number
      }
    },
    "timestamp": "ISO date string"
  }
  ```

### Future Enhancements (Potential)

- **Persistence**: Move from localStorage to database/API for multi-user support
- **3D Component Integration**: Full integration with Island3D, Sand3D, Ocean3D, etc.
- **Advanced Controls**:
  - Undo/Redo functionality
  - Copy/Paste objects
  - Parent-child relationships (groups)
  - Snap to grid
- **Asset Management**:
  - Upload custom 3D models (.glb, .gltf)
  - Texture management
  - Material editor
- **Export Options**:
  - Export scene as JSON
  - Export as .glb file
  - Share scene configurations between users

## Technical Details

### Components

1. **Editor3DLayout** (`components/editor3d/Editor3DLayout.tsx`)
   - Main layout component
   - Manages scene state and object data
   - Coordinates between all panels

2. **Scene3DObject** (`components/editor3d/Scene3DObject.tsx`)
   - Renders individual 3D objects in the editor
   - Handles object selection
   - Integrates TransformControls for manipulation

3. **HomepageScene3D** (`components/HomepageScene3D/index.tsx`)
   - Displays the saved scene on the homepage
   - Loads configuration from localStorage
   - Renders objects without editor controls

### Dependencies

- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Useful helpers for React Three Fiber
- **three**: 3D graphics library

### Supported Object Types

- **Primitives**: `box`, `sphere`, `cylinder`
- **Lights**: `light` (point light with visualization)
- **Custom Components** (planned): `island`, `sand`, `ocean`, `cloud`, `rock`, `wind`

## Internationalization

The editor supports multiple languages:

- **English** (`locales/en/editor3d.json`)
- **Vietnamese** (`locales/vi/editor3d.json`)

All UI text is localized and switches based on user language preference.

## Troubleshooting

### Scene not saving
- Check browser console for errors
- Ensure localStorage is enabled in your browser
- Try clearing localStorage and creating a new scene

### Objects not appearing in viewport
- Check that the object has valid position coordinates
- Ensure the camera can see the object (adjust zoom/position)
- Verify the object data is properly stored in state

### Transform controls not working
- Ensure the object is properly selected
- Check that the object has a mesh reference
- Verify TransformControls are properly mounted

## API Reference

### Editor3DLayout Props

```typescript
interface Editor3DLayoutProps {
  translations: {
    viewport: { ... },
    hierarchy: { ... },
    properties: { ... },
    assets: { ... }
  };
}
```

### HomepageScene3D Props

```typescript
interface HomepageScene3DProps {
  className?: string;        // Additional CSS classes
  enableControls?: boolean;  // Enable camera controls (default: false)
}
```

---

**Note**: This is an initial implementation. The editor provides core functionality for creating and managing 3D scenes. Additional features and improvements can be added based on user feedback and requirements.
