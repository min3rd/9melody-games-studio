import React from 'react';
import { PRESET_MAP, type Preset, ROUND_CLASSES } from '../presets';

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  preset?: Preset;
  color?: string;
  withEffects?: boolean;
  rounded?: boolean;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLElement> {
  heading?: React.ReactNode; // header title (avoid using name `title` to prevent collision with DOM attribute)
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}

export type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

export type CardBodyProps = React.HTMLAttributes<HTMLDivElement>;

export type CardFooterProps = React.HTMLAttributes<HTMLElement>;

export interface CardThumbnailProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
}

function elevationClasses(e: CardProps['elevation']) {
  switch (e) {
    case 'sm':
      return 'shadow-sm';
    case 'md':
      return 'shadow-md';
    case 'lg':
      return 'shadow-lg';
    default:
      return 'shadow-none';
  }
}

export function Card({
  preset = 'muted',
  color,
  withEffects = true,
  rounded = true,
  elevation = 'sm',
  className = '',
  children,
  ...rest
}: Readonly<CardProps>) {
  const bg = color ?? undefined; // we avoid setting background color on card by default
  const presetAccent = preset ? { borderTop: `4px solid ${PRESET_MAP[preset]}` } : {};
  const roundClass = rounded ? ROUND_CLASSES.sm : ROUND_CLASSES.none;
  const effects = withEffects ? 'transition-transform duration-150 ease-[cubic-bezier(.2,.9,.2,1)] hover:-translate-y-0.5' : '';

  return (
    <article
      {...rest}
      className={`bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 ${roundClass} ${elevationClasses(elevation)} ${effects} ${className}`.trim()}
      style={{ ...(bg ? { backgroundColor: bg } : {}), ...presetAccent, ...(rest.style ?? {}) }}
    >
      {children}
    </article>
  );
}

export function CardHeader({ heading, subtitle, actions, className = '', children, ...rest }: Readonly<CardHeaderProps>) {
  return (
    <header {...rest} className={`flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 ${className}`.trim()}>
      <div className="flex flex-col">
        {heading && <div className="text-sm font-semibold truncate">{heading}</div>}
        {subtitle && <div className="text-xs text-neutral-500 dark:text-neutral-400">{subtitle}</div>}
      </div>
      {actions && <div className="ml-4">{actions}</div>}
      {children}
    </header>
  );
}

export function CardTitle({ children, className = '', ...rest }: Readonly<CardTitleProps>) {
  return (
    <h3 {...rest} className={`text-lg font-semibold ${className}`.trim()}>
      {children}
    </h3>
  );
}

export function CardBody({ children, className = '', ...rest }: Readonly<CardBodyProps>) {
  return (
    <div {...rest} className={`px-4 py-3 ${className}`.trim()}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...rest }: Readonly<CardFooterProps>) {
  return (
    <footer {...rest} className={`px-4 py-3 border-t border-neutral-100 dark:border-neutral-800 ${className}`.trim()}>
      {children}
    </footer>
  );
}

export function CardThumbnail({ src, alt, className = '', ...rest }: Readonly<CardThumbnailProps>) {
  if (!src) return null;
  return (
    <div className={`w-full overflow-hidden ${className}`.trim()}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="w-full h-auto object-cover" {...rest} />
    </div>
  );
}

export default Card;
