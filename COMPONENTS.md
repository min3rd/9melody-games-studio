# Component Structure Standards

This document defines the standardized structure, naming conventions, and configuration options for all UI components in the 9melody Games Studio project.

## Overview

All components in `components/ui/` follow a consistent structure to ensure maintainability, reusability, and a cohesive user experience with a pixel-art aesthetic.

## Component Organization

### Folder Structure
```
components/ui/
├── ComponentName/
│   └── index.tsx          # Main component file
├── patterns/
│   └── index.tsx          # Pattern overlay component (shared)
├── presets.ts             # Shared presets, sizes, and type definitions
└── index.ts               # Barrel export file
```

### Naming Conventions
- **Component folders**: PascalCase (e.g., `Button`, `TextInput`, `RadialProgress`)
- **Component files**: Always `index.tsx` inside the component folder
- **Export pattern**: Default export for main component, named exports for sub-components
- **Type names**: `ComponentNameProps` for props interface (e.g., `ButtonProps`, `CardProps`)

## Standard Props Interface

All components MUST support the following standard configuration props:

### Required Standard Props

```typescript
export interface StandardComponentProps {
  // Size variants
  size?: UISize;              // 'sm' | 'md' | 'lg'
  
  // Color customization
  preset?: Preset;            // Predefined color from PRESET_MAP
  color?: string;             // Custom color override (hex or CSS color)
  
  // Visual options
  rounded?: boolean;          // Enable/disable rounded corners
  withEffects?: boolean;      // Enable/disable hover/active effects
  
  // Pattern backgrounds (for interactive components)
  pattern?: Pattern;          // 'pixel' | 'pixel3d' | 'neon' | 'bubble'
  
  // Standard React props
  className?: string;
  children?: React.ReactNode;
}
```

### Size Standards (UISize)
Components should use shared size classes from `presets.ts`:
- `sm`: Small/compact variant
- `md`: Medium/default variant (default)
- `lg`: Large variant

Import from presets:
```typescript
import { BUTTON_SIZE_CLASSES, type UISize } from '../presets';
```

### Color Standards (Preset)
Use the shared `PRESET_MAP` for consistent theming:
- `primary`: Blue (#3b82f6)
- `success`: Green (#16a34a)
- `danger`: Red (#ef4444)
- `warning`: Orange (#f59e0b)
- `info`: Cyan (#06b6d4)
- `muted`: Gray (#94a3b8)
- `cottonCandy`: Pink (#f9a8d4)
- `peachFizz`: Peach (#fbb1a8)
- `mauveBloom`: Purple (#d6a6ff)
- `sugarMist`: Light pink (#fdf2f8)

Import from presets:
```typescript
import { PRESET_MAP, type Preset } from '../presets';
```

### Pattern Backgrounds

Four interactive pattern backgrounds are available for enhanced visual appeal:

1. **pixel**: Classic pixel grid with animated wave effect
2. **pixel3d**: 3D falling pixel blocks effect
3. **neon**: Neon glow particles with flicker animation
4. **bubble**: Floating bubble particles

Components that should support patterns:
- Button ✅
- TextInput ✅
- Card (recommended)
- Alert (recommended)
- Badge (optional)
- Modal (optional)

Pattern implementation uses the shared `PatternOverlay` component:
```typescript
import PatternOverlay, { type Pattern } from '../patterns';

// In component render:
{pattern && (
  <PatternOverlay 
    pattern={pattern} 
    wrapperRef={wrapperRef} 
    activeColor={activeColor}
    classPrefix="component-name" 
  />
)}
```

## Prop Priority and Defaults

### Color Resolution Priority
1. Custom `color` prop (highest priority)
2. `preset` mapped color from PRESET_MAP
3. Component default preset (usually 'muted' or 'primary')

### Effect Defaults
- `withEffects`: Default `true` (effects enabled)
- `rounded`: Varies by component (typically `false` for pixel-art aesthetic, `true` for modern components)
- `size`: Default `'md'`
- `preset`: Varies by component context

## Component Categories

### 1. Form Components
Input-related components with user interaction:
- TextInput, TextArea, Select, Checkbox, Radio, Toggle, Range, Rating, FileInput

**Additional required props:**
- `disabled?: boolean`
- `error?: React.ReactNode`
- `hint?: React.ReactNode`
- `label?: React.ReactNode`

### 2. Display Components
Visual components without direct user input:
- Badge, Avatar, Indicator, Loading, Progress, RadialProgress

**Focus on:**
- Visual clarity
- Size variants
- Color customization

### 3. Layout Components
Structural components for organizing content:
- Card, Modal, Drawer, Accordion, Tabs, Timeline

**Additional features:**
- Composition (sub-components like CardHeader, CardBody)
- Context API for shared state
- Size affects internal spacing

### 4. Navigation Components
Components for navigation and actions:
- Button, Dropdown, Menu, Navbar, Breadcrumbs, Pagination, Dock

**Focus on:**
- Click/hover effects
- Active states
- Keyboard accessibility

### 5. Feedback Components
Components for user feedback:
- Alert, Loading, Progress

**Additional props:**
- `dismissible?: boolean`
- `onClose?: () => void`

## Accessibility Requirements

All components MUST:
1. Support keyboard navigation where applicable
2. Include proper ARIA attributes
3. Provide semantic HTML elements
4. Support focus management
5. Include aria-labels for icon-only elements

## Performance Considerations

1. **Use refs for frequently updating values** in animations/interactions
2. **Memoize expensive calculations** with `useMemo`
3. **Avoid inline function creation** in render for event handlers
4. **Use CSS animations** instead of JavaScript where possible
5. **Lazy load pattern overlays** only when pattern prop is set

## Dark Mode Support

All components MUST support both light and dark themes:
- Use Tailwind's `dark:` variant for dark mode styles
- Test components in both themes
- Ensure sufficient contrast ratios
- Use CSS variables for theme-dependent values where appropriate

## Localization (i18n)

Components must NOT contain hardcoded strings:
- Accept text content via props (`label`, `title`, `description`, etc.)
- Use `children` prop for flexible content
- Allow parent components to pass translated strings

## TypeScript Standards

1. **Props interface**: Always define and export props interface
2. **Type safety**: Use strict typing, avoid `any`
3. **Generics**: Use where appropriate (e.g., form values)
4. **Readonly props**: Mark props as `Readonly<PropsType>`
5. **Exported types**: Export prop types and preset aliases

Example:
```typescript
export type ButtonPreset = Preset;
export type ButtonSize = UISize;

export interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  size?: ButtonSize;
  preset?: ButtonPreset;
  // ... other props
}
```

## Component Template

Use this template when creating new components:

```typescript
"use client";
import React from 'react';
import clsx from 'clsx';
import { 
  PRESET_MAP, 
  type Preset, 
  BUTTON_SIZE_CLASSES, 
  ROUND_CLASSES,
  type UISize 
} from '../presets';
import PatternOverlay, { type Pattern } from '../patterns';

export interface ComponentNameProps extends React.HTMLAttributes<HTMLElement> {
  size?: UISize;
  preset?: Preset;
  color?: string;
  rounded?: boolean;
  withEffects?: boolean;
  pattern?: Pattern;
  // Component-specific props...
}

export default function ComponentName({
  size = 'md',
  preset = 'muted',
  color,
  rounded = false,
  withEffects = true,
  pattern,
  className = '',
  children,
  ...rest
}: Readonly<ComponentNameProps>) {
  // Refs
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // Derived values
  const activeColor = color ?? PRESET_MAP[preset];
  const sizeClass = BUTTON_SIZE_CLASSES[size];
  const roundClass = rounded ? ROUND_CLASSES.sm : ROUND_CLASSES.none;
  const effectClass = withEffects 
    ? 'transition-transform duration-150 hover:scale-105' 
    : '';
  
  // Classes
  const classes = clsx(
    'component-base-classes',
    sizeClass,
    roundClass,
    effectClass,
    className
  );
  
  return (
    <div ref={wrapperRef} className={classes} {...rest}>
      {pattern && (
        <PatternOverlay 
          pattern={pattern}
          wrapperRef={wrapperRef}
          activeColor={activeColor}
          classPrefix="component"
        />
      )}
      {children}
    </div>
  );
}
```

## Testing Standards

Components should be tested for:
1. Renders with default props
2. Applies custom className
3. Respects size variants (sm, md, lg)
4. Applies preset colors correctly
5. Custom color override works
6. Effects toggle works (withEffects)
7. Pattern backgrounds render when specified
8. Dark mode variants work
9. Accessibility (keyboard, ARIA)

## Documentation Requirements

Each component should have:
1. **Props table**: Document all props with types and defaults
2. **Usage examples**: Basic and advanced use cases
3. **Preview page**: Live demo at `/components/[component-name]`
4. **Pattern examples**: Show all 4 pattern variants if supported

## Migration Checklist

When updating existing components to meet standards:

- [ ] Add missing standard props (size, preset, color, rounded, withEffects)
- [ ] Import and use shared presets from `presets.ts`
- [ ] Add pattern support if component is interactive
- [ ] Ensure dark mode support
- [ ] Add TypeScript prop interface
- [ ] Export prop types
- [ ] Update component to use `clsx` for class composition
- [ ] Add accessibility attributes
- [ ] Test in both light and dark modes
- [ ] Create/update preview page
- [ ] Add to barrel export in `components/ui/index.ts`

## Notes

- **Pixel-art aesthetic**: Default to `rounded={false}` to preserve crisp edges
- **Effects**: Default to `withEffects={true}` for engaging interactions
- **Modern look**: Can be achieved with `rounded={true}` and smooth transitions
- **Pattern performance**: Patterns use CSS animations and optimized React patterns for 60fps
- **Color consistency**: Always derive colors from PRESET_MAP when possible for theme coherence
