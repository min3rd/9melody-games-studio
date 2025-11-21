"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui';

export default function ButtonPreview(): React.ReactElement {
  const [count, setCount] = useState(0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => setCount((c) => c + 1)}>Primary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button size="sm">Small</Button>
        <Button size="lg">Large</Button>
      </div>

      <div className="text-sm text-neutral-600 dark:text-neutral-300">Clicked: {count}</div>
    </div>
  );
}
