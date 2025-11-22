import React from 'react';
import { PRESET_MAP, type Preset, AVATAR_SIZE_CLASSES, ROUND_CLASSES, type UISize } from '../presets';
import Indicator from '../Indicator';

export type AvatarSize = keyof typeof AVATAR_SIZE_CLASSES;

export interface AvatarIndicatorProps {
  preset?: Preset;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  placement?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  withEffects?: boolean;
}

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  name?: string; // used for initials when src is missing
  alt?: string;
  size?: AvatarSize;
  preset?: Preset; // fallback background color preset (if no image)
  color?: string; // custom background color
  rounded?: boolean;
  withEffects?: boolean;
  indicator?: boolean | AvatarIndicatorProps; // whether to show presence/indicator
}

const placementStyles: Record<NonNullable<AvatarIndicatorProps['placement']>, React.CSSProperties> = {
  'bottom-right': { right: 0, bottom: 0, transform: 'translate(30%, 30%)' },
  'bottom-left': { left: 0, bottom: 0, transform: 'translate(-30%, 30%)' },
  'top-left': { left: 0, top: 0, transform: 'translate(-30%, -30%)' },
  'top-right': { right: 0, top: 0, transform: 'translate(30%, -30%)' },
};

function getInitials(nameOrAlt?: string) {
  if (!nameOrAlt) return '';
  const parts = nameOrAlt.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Avatar({
  src,
  name,
  alt,
  size = 'md',
  preset = 'muted',
  color,
  rounded = true,
  withEffects = true,
  indicator,
  className = '',
  ...rest
}: Readonly<AvatarProps>) {
  const sizeClass = AVATAR_SIZE_CLASSES[size] ?? AVATAR_SIZE_CLASSES.md;
  const roundClass = rounded ? ROUND_CLASSES.full : ROUND_CLASSES.sm;
  const effects = withEffects ? 'transition-transform duration-150 ease-[cubic-bezier(.2,.9,.2,1)] hover:scale-105 hover:shadow-sm' : '';

  const fallbackColor = color ?? PRESET_MAP[preset];
  const initials = getInitials(name ?? alt);

  const showIndicator = indicator !== undefined && indicator !== false;
  const indicatorConfig: AvatarIndicatorProps = typeof indicator === 'object' && indicator !== null
    ? (indicator as AvatarIndicatorProps)
    : { preset: 'success', size: 'sm', placement: 'bottom-right', withEffects: withEffects };

  const indicatorSize = indicatorConfig.size ?? 'sm';
  const indicatorPreset = indicatorConfig.preset ?? 'success';
  const indicatorColor = indicatorConfig.color;
  const imageElement = src ? (
    <div className={`relative w-full h-full ${roundClass}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src!} alt={alt ?? name} className={`object-cover w-full h-full ${roundClass}`} />
    </div>
  ) : null;

  return (
    <div
      {...rest}
      role={src ? undefined : 'img'}
      aria-label={src ? undefined : (alt ?? name)}
      className={`relative inline-flex items-center justify-center overflow-hidden ${sizeClass} ${roundClass} ${effects} ${className}`.trim()}
      style={{ backgroundColor: src ? undefined : fallbackColor }}
    >
      {imageElement ? imageElement : (
        // initials
        <span className={`text-white font-medium ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-lg' : 'text-base'}`}>{initials}</span>
      )}

      {showIndicator && (
        <span
          aria-hidden={true}
          className="absolute z-10"
          style={placementStyles[indicatorConfig.placement ?? 'bottom-right']}
        >
          <Indicator preset={indicatorPreset} color={indicatorColor} size={indicatorSize as UISize} withEffects={!!indicatorConfig.withEffects} />
        </span>
      )}
    </div>
  );
}

export function AvatarGroup({
  avatars,
  size = 'md',
  max = 3,
  overlap = true,
  rounded = true,
  withEffects = true,
  preset: groupPreset,
  color: groupColor,
  className = '',
}: {
  avatars: Array<{ src?: string; alt?: string; name?: string; color?: string; preset?: Preset }>; // minimal avatar info
  size?: AvatarSize;
  max?: number;
  overlap?: boolean;
  rounded?: boolean;
  withEffects?: boolean;
  preset?: Preset;
  color?: string;
  className?: string;
}) {
  const visible = avatars.slice(0, max);
  const extra = avatars.length - max;

  const overlapClass = overlap ? (size === 'sm' ? '-ml-2' : size === 'lg' ? '-ml-4' : '-ml-3') : 'ml-2';

  return (
    <div className={`flex items-center ${className}`.trim()}>
      {visible.map((a, i) => (
        <div key={i} className={`${i !== 0 ? overlapClass : ''}`} style={{ zIndex: 100 + i }}>
          <Avatar src={a.src} name={a.name} alt={a.alt} preset={a.preset ?? groupPreset} color={a.color ?? groupColor} size={size} rounded={rounded} withEffects={withEffects} />
        </div>
      ))}
      {extra > 0 && (
        <div className={`${overlap ? overlapClass : 'ml-2'}`}>
          <div
            className={`inline-flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 ${ROUND_CLASSES.full} ${AVATAR_SIZE_CLASSES[size]} font-medium`}
          >
            +{extra}
          </div>
        </div>
      )}
    </div>
  );
}
