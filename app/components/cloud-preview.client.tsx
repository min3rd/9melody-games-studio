"use client";
import React, { useMemo, useState } from "react";
import { Cloud, CodePreview } from "@/components/ui";
import type { Preset } from "@/components/ui/presets";
import type { CloudVariant } from "@/components/ui/Cloud";
import PreviewLayout from "@/components/preview/PreviewLayout";
import { useI18n } from "@/hooks/useI18n";

type UIPreset = Preset | "custom";

const SWEET_PRESETS: Preset[] = [
  "cottonCandy",
  "peachFizz",
  "mauveBloom",
  "sugarMist",
];

export default function CloudPreview(): React.ReactElement {
  const { t } = useI18n();
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [variant, setVariant] = useState<CloudVariant>("layered");
  const [preset, setPreset] = useState<UIPreset>("cottonCandy");
  const [color, setColor] = useState<string>("#f9a8d4");
  const [rounded, setRounded] = useState(false);
  const [withEffects, setWithEffects] = useState(true);

  const presetValue = preset === "custom" ? undefined : (preset as Preset);
  const colorValue = preset === "custom" ? color : undefined;

  const accentClouds = useMemo(() => {
    return SWEET_PRESETS.filter((p) => p !== presetValue).map((palette, index) => ({
      palette,
      size: (["sm", "md", "lg"] as const)[index % 3],
      variant: (index % 2 === 0 ? "clustered" : "layered") as CloudVariant,
    }));
  }, [presetValue]);

  const snippet = `<Cloud size="${size}" variant="${variant}"${
    presetValue ? ` preset="${presetValue}"` : ""
  }${colorValue ? ` color="${colorValue}"` : ""} rounded={${rounded}} withEffects={${withEffects}} />`;

  return (
    <PreviewLayout
      title={t("preview.cloud.title")}
      preview={(
        <div className="space-y-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            {t("preview.cloud.description")}
          </p>
          <div className="rounded-xl border border-rose-100/60 dark:border-fuchsia-900/40 bg-gradient-to-br from-rose-50 via-pink-50 to-violet-50 dark:from-fuchsia-950 dark:via-rose-900/30 dark:to-violet-950 p-6 flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Cloud
                size={size}
                variant={variant}
                preset={presetValue}
                color={colorValue}
                rounded={rounded}
                withEffects={withEffects}
                aria-label={t("preview.cloud.ariaDemo")}
              />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {accentClouds.map(({ palette, size: accentSize, variant: accentVariant }) => (
                <div key={`${palette}-${accentVariant}-${accentSize}`} className="flex flex-col items-center gap-2 text-xs uppercase tracking-wide text-rose-500/80 dark:text-pink-200">
                  <Cloud
                    size={accentSize}
                    variant={accentVariant}
                    preset={palette}
                    withEffects={false}
                    rounded
                    aria-hidden={true}
                  />
                  <span>{t(`preview.cloud.palettes.${palette}`)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      controls={(
        <div className="space-y-4 text-sm">
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2">
              <span>{t("preview.common.size")}</span>
              <select
                className="rounded border px-2 py-1 text-xs"
                value={size}
                onChange={(event) => setSize(event.target.value as "sm" | "md" | "lg")}
              >
                <option value="sm">{t("preview.common.small")}</option>
                <option value="md">{t("preview.common.medium")}</option>
                <option value="lg">{t("preview.common.large")}</option>
              </select>
            </label>
            <label className="flex items-center gap-2">
              <span>{t("preview.common.variant")}</span>
              <select
                className="rounded border px-2 py-1 text-xs"
                value={variant}
                onChange={(event) => setVariant(event.target.value as CloudVariant)}
              >
                <option value="layered">{t("preview.cloud.variant.layered")}</option>
                <option value="clustered">{t("preview.cloud.variant.clustered")}</option>
              </select>
            </label>
            <label className="flex items-center gap-2">
              <span>{t("preview.common.preset")}</span>
              <select
                className="rounded border px-2 py-1 text-xs"
                value={preset}
                onChange={(event) => setPreset(event.target.value as UIPreset)}
              >
                {SWEET_PRESETS.map((palette) => (
                  <option key={palette} value={palette}>
                    {t(`preview.cloud.palettes.${palette}`)}
                  </option>
                ))}
                <option value="custom">{t("preview.common.custom")}</option>
              </select>
            </label>
            {preset === "custom" && (
              <label className="flex items-center gap-2">
                <span>{t("preview.common.customColor")}</span>
                <input
                  type="color"
                  className="h-7 w-12 cursor-pointer rounded border"
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                />
              </label>
            )}
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rounded}
                onChange={(event) => setRounded(event.target.checked)}
              />
              <span>{t("preview.cloud.rounded")}</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={withEffects}
                onChange={(event) => setWithEffects(event.target.checked)}
              />
              <span>{t("preview.cloud.effects")}</span>
            </label>
          </div>
        </div>
      )}
      snippet={<CodePreview code={snippet} />}
    />
  );
}
