export const PRESET_MAP = {
  primary: '#3b82f6',
  success: '#16a34a',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#06b6d4',
  muted: '#94a3b8',
} as const;

export type Preset = keyof typeof PRESET_MAP;

export default PRESET_MAP;
