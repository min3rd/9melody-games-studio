export const PRESET_MAP = {
  primary: '#3b82f6',
  success: '#16a34a',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#06b6d4',
  muted: '#94a3b8',
  cottonCandy: '#f9a8d4',
  peachFizz: '#fbb1a8',
  mauveBloom: '#d6a6ff',
  sugarMist: '#fdf2f8',
} as const;

export type Preset = keyof typeof PRESET_MAP;

/**
 * Pattern types for background effects
 * - pixel: Classic pixel grid with animated wave
 * - pixel3d: 3D falling pixel blocks
 * - neon: Neon glow particles with flicker
 * - bubble: Floating bubble particles
 */
export type Pattern = 'pixel' | 'pixel3d' | 'neon' | 'bubble';

export default PRESET_MAP;

/*
 Shared size classes and helpers for UI components.
 Components should import the specific mapping they need, for example:
 import { BUTTON_SIZE_CLASSES, INDICATOR_SIZE_CLASSES, PILL_PADDING_MAP, ROUND_CLASSES } from '@/components/ui/presets'
 */
export const BUTTON_SIZE_CLASSES = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base',
} as const;

export const INDICATOR_SIZE_CLASSES = {
  sm: 'w-2 h-2 text-xs',
  md: 'w-3 h-3 text-sm',
  lg: 'w-4 h-4 text-base',
} as const;

export const PILL_PADDING_MAP = {
  sm: 'px-1 py-[1px] text-[10px]',
  md: 'px-2 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
} as const;

export const ROUND_CLASSES = {
  full: 'rounded-full',
  sm: 'rounded-sm',
  none: 'rounded-none',
} as const;

export type UISize = keyof typeof BUTTON_SIZE_CLASSES;
export type UIRound = keyof typeof ROUND_CLASSES;

export const TOGGLE_SIZE_MAP = {
  sm: { track: 'w-10 h-6', knob: 'w-4 h-4', knobTranslate: 'translateX(14px)' },
  md: { track: 'w-12 h-7', knob: 'w-5 h-5', knobTranslate: 'translateX(20px)' },
  lg: { track: 'w-14 h-8', knob: 'w-6 h-6', knobTranslate: 'translateX(24px)' },
} as const;

export type UIToggleSize = keyof typeof TOGGLE_SIZE_MAP;

export const AVATAR_SIZE_CLASSES = {
  sm: 'w-6 h-6 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-16 h-16 text-lg',
} as const;

export type UIAvatarSize = keyof typeof AVATAR_SIZE_CLASSES;
 
export const CARD_PADDING_MAP = {
  sm: 'px-3 py-2',
  md: 'px-4 py-3',
  lg: 'px-6 py-4',
} as const;

export type UICardSize = keyof typeof CARD_PADDING_MAP;

