"use client";
import React, { useState } from 'react';
import { Modal } from '@/components/ui';
import { CodePreview } from '@/components/ui';

export default function ModalPreview(): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [backdrop, setBackdrop] = useState(true);
  const [allowMove, setAllowMove] = useState(true);
  const [allowResize, setAllowResize] = useState(true);
  const [animationDuration, setAnimationDuration] = useState(140);
  type ModalOrigin = 'top-left'|'top-right'|'bottom-left'|'bottom-right'|'center';
  const [origin, setOrigin] = useState<ModalOrigin>('center');
  const [autoSize, setAutoSize] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <button className="px-3 py-2 rounded bg-foreground text-background" onClick={() => setOpen(true)}>Open Modal</button>
        <label className="text-sm"><input type="checkbox" checked={backdrop} onChange={(e) => setBackdrop(e.target.checked)} /> Backdrop</label>
        <label className="text-sm"><input type="checkbox" checked={allowMove} onChange={(e) => setAllowMove(e.target.checked)} /> Movable</label>
        <label className="text-sm"><input type="checkbox" checked={allowResize} onChange={(e) => setAllowResize(e.target.checked)} /> Resizable</label>
        <label className="text-sm"><input type="checkbox" checked={autoSize} onChange={(e) => setAutoSize(e.target.checked)} /> Auto-size</label>
        <label className="text-sm">Origin
          <select value={origin} onChange={(e) => setOrigin(e.target.value as ModalOrigin)} className="ml-2 text-sm">
            <option value="center">Center</option>
            <option value="top-left">Top Left</option>
            <option value="top-right">Top Right</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="bottom-right">Bottom Right</option>
          </select>
        </label>
        <label className="text-sm">Duration (ms)
          <input className="ml-2 w-24 text-sm rounded p-1 border" type="number" value={animationDuration} onChange={(e) => setAnimationDuration(Number(e.target.value))} />
        </label>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        backdrop={backdrop}
        allowMove={allowMove}
        allowResize={allowResize}
        title="Modal Preview"
        origin={origin}
        width={autoSize ? undefined : 520}
        height={autoSize ? undefined : 180}
        animationDuration={animationDuration}
      >
        <div className="space-y-2">
          <div className="text-sm text-neutral-700 dark:text-neutral-300">This is a preview of the modal content. Try moving or resizing it with the options enabled.</div>
          <CodePreview code={`<Modal \n  open={open} \n  onClose={() => setOpen(false)} \n  backdrop={${backdrop}} \n  allowMove={${allowMove}} \n  allowResize={${allowResize}} \n/>`} />
        </div>
      </Modal>
    </div>
  );
}
