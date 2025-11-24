"use client";
import React, { useState } from "react";
import TextRotate from "@/components/ui/TextRotate";
import { type Preset } from "@/components/ui/presets";
import type { UISize } from "@/components/ui/presets";

export default function TextRotatePreview(): React.ReactElement {
  const [preset] = useState<Preset>("muted");
  const [color, setColor] = useState<string>("#3b82f6");
  const [size, setSize] = useState<UISize>("md");
  const [interval, setIntervalMs] = useState<number>(2000);
  const [animation, setAnimation] = useState<"slide" | "fade" | "flip">(
    "slide"
  );
  const [direction, setDirection] = useState<"up" | "down">("up");
  const [loop, setLoop] = useState(true);
  const [pauseOnHover, setPauseOnHover] = useState(true);
  const [useCustom, setUseCustom] = useState(false);
  const [fontFamily, setFontFamily] = useState<string>("");
  const [textSize, setTextSize] = useState<"sm" | "md" | "lg">("md");
  const [useBg, setUseBg] = useState(false);
  const [bgColor, setBgColor] = useState("#ffffff");

  const items = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon"];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <label className="text-sm">
          Size
          <select
            className="ml-2 text-sm rounded p-1 border"
            value={size}
            onChange={(e) => setSize(e.target.value as UISize)}
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </label>
        <label className="text-sm">
          Animation
          <select
            className="ml-2 text-sm rounded p-1 border"
            value={animation}
            onChange={(e) =>
              setAnimation(e.target.value as "slide" | "fade" | "flip")
            }
          >
            <option value="slide">Slide</option>
            <option value="fade">Fade</option>
            <option value="flip">Flip</option>
          </select>
        </label>
        <label className="text-sm">
          Direction
          <select
            className="ml-2 text-sm rounded p-1 border"
            value={direction}
            onChange={(e) => setDirection(e.target.value as "up" | "down")}
          >
            <option value="up">Up</option>
            <option value="down">Down</option>
          </select>
        </label>
        <label className="text-sm">
          Interval
          <input
            className="ml-2"
            type="range"
            min="500"
            max="5000"
            value={interval}
            onChange={(e) => setIntervalMs(Number(e.target.value))}
          />
        </label>
        <label className="text-sm">
          Loop
          <input
            className="ml-2"
            type="checkbox"
            checked={loop}
            onChange={(e) => setLoop(e.target.checked)}
          />
        </label>
        <label className="text-sm">
          Pause on hover
          <input
            className="ml-2"
            type="checkbox"
            checked={pauseOnHover}
            onChange={(e) => setPauseOnHover(e.target.checked)}
          />
        </label>
        <label className="text-sm">
          Use custom color
          <input
            className="ml-2"
            type="checkbox"
            checked={useCustom}
            onChange={(e) => setUseCustom(e.target.checked)}
          />
        </label>
        {useCustom && (
          <label className="text-sm">
            Color
            <input
              className="ml-2"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </label>
        )}
        <label className="text-sm">
          Font
          <select
            className="ml-2 text-sm rounded p-1 border"
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
          >
            <option value="">System</option>
            <option value="Inter, system-ui, -apple-system">Inter</option>
            <option value="Roboto, system-ui">Roboto</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="monospace">Monospace</option>
          </select>
        </label>
        <label className="text-sm">
          Text size
          <select
            className="ml-2 text-sm rounded p-1 border"
            value={textSize}
            onChange={(e) => setTextSize(e.target.value as "sm" | "md" | "lg")}
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </label>
        <label className="text-sm">
          Use background
          <input
            className="ml-2"
            type="checkbox"
            checked={useBg}
            onChange={(e) => setUseBg(e.target.checked)}
          />
        </label>
        {useBg && (
          <label className="text-sm">
            Background
            <input
              className="ml-2"
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
            />
          </label>
        )}
      </div>

      <div
        className="p-3"
        style={{ backgroundColor: useBg ? bgColor : undefined }}
      >
        <TextRotate
          items={items}
          interval={interval}
          animation={animation}
          direction={direction}
          size={size}
          textSize={textSize}
          fontFamily={fontFamily || undefined}
          preset={preset as Preset}
          color={useCustom ? color : undefined}
          loop={loop}
          pauseOnHover={pauseOnHover}
        />
      </div>
    </div>
  );
}
