"use client";
import React, { createContext, useContext, useRef } from 'react';
import { PRESET_MAP, type Preset, ROUND_CLASSES, CARD_PADDING_MAP, type UICardSize, type Pattern } from '../presets';
import PatternOverlay from '../patterns';

const CardContext = createContext<{ size: UICardSize } | undefined>(undefined);

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  preset?: Preset;
  color?: string;
  withEffects?: boolean;
  rounded?: boolean;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  size?: UICardSize;
  pattern?: Pattern;
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
  size = 'md',
  pattern,
  className = '',
  children,
  ...rest
}: Readonly<CardProps>) {
  const wrapperRef = useRef<HTMLElement | null>(null);
  const activeColor = color ?? PRESET_MAP[preset];
  const presetAccent = preset && !pattern ? { borderTop: `4px solid ${PRESET_MAP[preset]}` } : {};
  const roundClass = rounded ? ROUND_CLASSES.sm : ROUND_CLASSES.none;
  const effects = withEffects && !pattern ? 'transition-transform duration-150 ease-[cubic-bezier(.2,.9,.2,1)] hover:-translate-y-0.5' : '';
  
  const patternClass = pattern ? `card-pattern-${pattern}` : '';
  const baseClasses = pattern 
    ? 'border border-neutral-200 dark:border-neutral-800 overflow-hidden relative'
    : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800';

  const patternStyle = pattern === 'pixel' 
    ? { backgroundColor: '#071028', color: '#fff' }
    : pattern === 'neon'
    ? { backgroundColor: '#05060a', color: '#fff' }
    : pattern === 'pixel3d'
    ? { backgroundColor: '#1a1a2e', color: '#fff' }
    : pattern === 'bubble'
    ? { backgroundColor: 'transparent' }
    : {};

  return (
    <CardContext.Provider value={{ size }}>
    <article
      ref={wrapperRef}
      {...rest}
      className={`${baseClasses} ${roundClass} ${elevationClasses(elevation)} ${effects} ${patternClass} ${className}`.trim()}
      style={{ 
        ...(pattern ? patternStyle : {}),
        ...presetAccent, 
        ...(rest.style ?? {}) 
      }}
    >
      {pattern && (
        <PatternOverlay 
          pattern={pattern} 
          wrapperRef={wrapperRef} 
          activeColor={activeColor}
          classPrefix="card" 
        />
      )}
      {children}
    </article>
    </CardContext.Provider>
  );
}

export function CardHeader({ heading, subtitle, actions, className = '', children, ...rest }: Readonly<CardHeaderProps>) {
  const ctx = useContext(CardContext);
  const size = (ctx?.size ?? 'md') as UICardSize;
  return (
    <header {...rest} className={`flex items-center justify-between ${CARD_PADDING_MAP[size]} border-b border-neutral-100 dark:border-neutral-800 ${className}`.trim()}>
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
  const ctx = useContext(CardContext);
  const size = (ctx?.size ?? 'md') as UICardSize;
  return (
    <div {...rest} className={`${CARD_PADDING_MAP[size]} ${className}`.trim()}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...rest }: Readonly<CardFooterProps>) {
  const ctx = useContext(CardContext);
  const size = (ctx?.size ?? 'md') as UICardSize;
  return (
    <footer {...rest} className={`${CARD_PADDING_MAP[size]} border-t border-neutral-100 dark:border-neutral-800 ${className}`.trim()}>
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
