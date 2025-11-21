"use client";
import React, { useState } from 'react';
import { Modal } from '@/components/ui';
import { CodePreview } from '@/components/ui';

export default function ModalPreview(): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [backdrop, setBackdrop] = useState(true);
  const [allowMove, setAllowMove] = useState(true);
  const [allowResize, setAllowResize] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <button className="px-3 py-2 rounded bg-foreground text-background" onClick={() => setOpen(true)}>Open Modal</button>
        <label className="text-sm"><input type="checkbox" checked={backdrop} onChange={(e) => setBackdrop(e.target.checked)} /> Backdrop</label>
        <label className="text-sm"><input type="checkbox" checked={allowMove} onChange={(e) => setAllowMove(e.target.checked)} /> Movable</label>
        <label className="text-sm"><input type="checkbox" checked={allowResize} onChange={(e) => setAllowResize(e.target.checked)} /> Resizable</label>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        backdrop={backdrop}
        allowMove={allowMove}
        allowResize={allowResize}
        title="Modal Preview"
        width={520}
        height={180}
      >
        <div className="space-y-2">
          <div className="text-sm text-neutral-700 dark:text-neutral-300">This is a preview of the modal content. Try moving or resizing it with the options enabled.</div>
          <CodePreview code={`<Modal \n  open={open} \n  onClose={() => setOpen(false)} \n  backdrop={${backdrop}} \n  allowMove={${allowMove}} \n  allowResize={${allowResize}} \n/>`} />
        </div>
      </Modal>
    </div>
  );
}
