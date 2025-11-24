"use client";
import React, { useState } from "react";
import { Accordion } from "@/components/ui";
import type { Preset } from "@/components/ui/presets";
import { CodePreview } from "@/components/ui";
import PreviewLayout from "@/components/preview/PreviewLayout";

export default function AccordionPreview() {
  const [open, setOpen] = useState(false);
  type UIAccordionPreset = Preset | "custom" | "none";
  const [preset, setPreset] = useState<UIAccordionPreset>("primary");
  const [color, setColor] = useState<string>("#3b82f6");
  const [disabled, setDisabled] = useState(false);
  const [withIcon, setWithIcon] = useState(true);

  const icon = (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L2 7l10 5 10-5-10-5z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 17l10 5 10-5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12l10 5 10-5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const preview = (
    <Accordion
      defaultOpen={open}
      onOpenChange={(o) => setOpen(o)}
      disabled={disabled}
      {...(preset === "custom" ? { color } : {})}
      {...(preset !== "custom" && preset !== "none" ? { preset } : {})}
      icon={withIcon ? icon : undefined}
      title={<div>Accordion Title</div>}
      description="A concise description"
    >
      <div className="text-sm text-neutral-700 dark:text-neutral-300">
        This is the content of the accordion. Add any components inside.
      </div>
    </Accordion>
  );

  const controls = (
    <div className="flex gap-2 items-center">
      <button
        className="px-3 py-2 rounded bg-foreground text-background"
        onClick={() => setOpen((o) => !o)}
      >
        Toggle open
      </button>
      <label className="text-sm">
        <input
          type="checkbox"
          checked={disabled}
          onChange={(e) => setDisabled(e.target.checked)}
        />{" "}
        Disabled
      </label>
      <label className="text-sm ml-2">
        Preset
        <select
          className="ml-2 text-sm rounded p-1 border"
          value={preset}
          onChange={(e) => setPreset(e.target.value as UIAccordionPreset)}
        >
          <option value="primary">Primary</option>
          <option value="success">Success</option>
          <option value="danger">Danger</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
          <option value="muted">Muted</option>
          <option value="custom">Custom</option>
          <option value="none">None</option>
        </select>
      </label>
      {preset === "custom" && (
        <label className="text-sm ml-2">
          Custom
          <input
            type="color"
            className="ml-2"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </label>
      )}

      <label className="text-sm ml-2">
        <input
          type="checkbox"
          checked={withIcon}
          onChange={(e) => setWithIcon(e.target.checked)}
        />{" "}
        Icon
      </label>
    </div>
  );

  const snippet = (
    <CodePreview
      code={`<Accordion title={"Accordion Title"} ${
        preset === "custom"
          ? `color={"${color}"}`
          : preset !== "none"
          ? `preset={"${preset}"}`
          : ""
      } ${disabled ? "disabled " : ""}>...</Accordion>`}
    />
  );

  return (
    <PreviewLayout
      title="Accordion"
      preview={preview}
      controls={controls}
      snippet={snippet}
    />
  );
}
