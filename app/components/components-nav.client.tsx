"use client";
import React, { useEffect, useState } from 'react';

interface Props { items: string[] }

export default function ComponentsNav({ items }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const navRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!items || items.length === 0) return;
    const observers: IntersectionObserver[] = [];

    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          if (id) setActive(id);
        }
      });
    };

    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '-20% 0px -40% 0px',
      threshold: 0,
    };

    const observe = (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(callback, options);
      obs.observe(el);
      observers.push(obs);
    };

    items.forEach((it) => observe(it.toLowerCase()));

    // initial active detection
    requestAnimationFrame(() => {
      for (const it of items) {
        const el = document.getElementById(it.toLowerCase());
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top >= 0 && rect.top < window.innerHeight * 0.6) {
          setActive(it.toLowerCase());
          break;
        }
      }
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [items]);

  // Ensure the active nav item is visible in the overflow container
  useEffect(() => {
    if (!active || !navRef.current) return;
    const a = navRef.current.querySelector(`a[href="#${active}"]`) as HTMLElement | null;
    if (a) {
      a.scrollIntoView({ block: 'nearest' });
    }
  }, [active]);

  function onClick(e: React.MouseEvent, id: string) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // also set active immediately for snappy UI update
    setActive(id);
  }

  return (
    <nav className="sticky top-6 space-y-2">
      <h3 className="text-sm font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Components</h3>
      {items.length === 0 && (
        <div className="text-sm text-neutral-500">No components</div>
      )}
      <div ref={navRef} className="flex flex-col gap-1 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
        {items.map((c) => {
          const id = c.toLowerCase();
          const isActive = active === id;
            return (
            <a
              key={c}
              href={`#${id}`}
              onClick={(e) => onClick(e, id)}
              aria-current={isActive || undefined}
              className={`block p-2 rounded text-neutral-800 dark:text-neutral-100 ${isActive ? 'bg-neutral-100 dark:bg-neutral-800 font-medium' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
            >
              {c}
            </a>
          );
        })}
      </div>
      {/* keep the active link visible within the scrollable nav */}
    </nav>
  );
}
