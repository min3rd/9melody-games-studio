"use client";
import React, { useEffect, useState } from "react";
import i18n from "@/lib/i18n";
import { PRESET_MAP, type Preset } from "../presets";
import Dropdown, { type DropdownItem } from "../Dropdown";

// A simple luminance-based contrast helper. Returns either `#000` or `#fff`.
function getContrastColor(hex?: string) {
  if (!hex) return "#fff";
  const h = hex.trim();
  const hexMatch = h.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  let r = 255, g = 255, b = 255;
  if (hexMatch) {
    let hexValue = hexMatch[1];
    if (hexValue.length === 3) {
      hexValue = hexValue.split("").map((c) => c + c).join("");
    }
    r = parseInt(hexValue.substring(0, 2), 16);
    g = parseInt(hexValue.substring(2, 4), 16);
    b = parseInt(hexValue.substring(4, 6), 16);
  } else {
    const rgbMatch = h.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (rgbMatch) {
      r = parseInt(rgbMatch[1], 10);
      g = parseInt(rgbMatch[2], 10);
      b = parseInt(rgbMatch[3], 10);
    }
  }
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#000" : "#fff";
}

export default function LanguageSwitcher({
  preset,
  color,
  // extra languages that will be shown in the dropdown (code + label)
  popularLanguages,
}: { preset?: Preset; color?: string; popularLanguages?: { code: string; label: string }[] } = {}) {
  // Accept any language code string; default is en
  const [lang, setLang] = useState<string>("en");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("lang");
      if (stored) setLang(stored);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("lang", lang);
    } catch {}
    try {
      const maxAge = 60 * 60 * 24 * 365; // 1 year
      document.cookie = `lang=${lang}; path=/; max-age=${maxAge}; samesite=lax`;
    } catch {}
    if (typeof document !== "undefined") document.documentElement.lang = lang;
    if (i18n && i18n.language !== lang) i18n.changeLanguage(lang);
  }, [lang]);

  function setLanguage(l: string) {
    setLang(l);
  }

  // Default list of popular languages shown in dropdown (excluding en/vi)
  const defaultPopular = [
    { code: "es", label: "🇪🇸 Español" },
    { code: "fr", label: "🇫🇷 Français" },
    { code: "de", label: "🇩🇪 Deutsch" },
    { code: "ja", label: "🇯🇵 日本語" },
    { code: "ko", label: "🇰🇷 한국어" },
    { code: "zh", label: "🇨🇳 中文" },
  ];

  const extras = (popularLanguages && popularLanguages.length ? popularLanguages : defaultPopular).filter((p) => p.code !== "en" && p.code !== "vi");
  const isExtraActive = extras.some((p) => p.code === lang);
  const activeBaseColor = color ?? (preset ? PRESET_MAP[preset] : undefined);
  const textForActiveBase = getContrastColor(activeBaseColor);

  return (
    <div
      suppressHydrationWarning
      className="inline-flex items-center gap-2 rounded-sm border border-neutral-200 dark:border-neutral-800 p-1 bg-white dark:bg-neutral-900"
    >
      <button
        onClick={() => setLanguage("en")}
        className={`px-2 py-1 text-xs rounded-sm transition-colors duration-150 ${lang === 'en' ? `shadow-sm ring-1 ring-black/5 dark:ring-white/5 ${activeBaseColor ? '' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'}` : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100'}`}
        style={lang === 'en' && activeBaseColor ? { background: activeBaseColor, color: textForActiveBase } : undefined}
        aria-pressed={lang === "en"}
        aria-label="Select English"
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("vi")}
        className={`px-2 py-1 text-xs rounded-sm transition-colors duration-150 ${lang === 'vi' ? `shadow-sm ring-1 ring-black/5 dark:ring-white/5 ${activeBaseColor ? '' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'}` : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100'}`}
        style={lang === 'vi' && activeBaseColor ? { background: activeBaseColor, color: textForActiveBase } : undefined}
        aria-pressed={lang === "vi"}
        aria-label="Select Vietnamese"
      >
        VI
      </button>
      {extras.length > 0 && (
        <Dropdown
          compact
          align="right"
          items={extras.map<DropdownItem>((p) => ({
            key: p.code,
            label: (
              <div className="flex items-center justify-between">
                <span className="truncate">{p.label}</span>
                {lang === p.code && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="opacity-80">
                    <path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            ),
            onClick: () => setLanguage(p.code),
          }))}
          label={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="opacity-80">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
          preset={preset}
          color={color}
          buttonClassName={`${isExtraActive ? `shadow-sm ring-1 ring-black/5 dark:ring-white/5 ${activeBaseColor ? '' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'}` : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100'}`}
          buttonStyle={isExtraActive && activeBaseColor ? { background: activeBaseColor, color: textForActiveBase } : undefined}
        />
      )}
    </div>
  );
}
