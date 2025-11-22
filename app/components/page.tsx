import fs from "fs";
import path from "path";
import ButtonPreview from "./button-preview.client";
import AvatarPreview from "./avatar-preview.client";
import CardPreview from "./card-preview.client";
import CarouselPreview from "./carousel-preview.client";
import KbdPreview from "./kbd-preview.client";
import IndicatorPreview from "./indicator-preview.client";
import BadgePreview from "./badge-preview.client";
import DropdownPreview from "./dropdown-preview.client";
import CodePreviewPreview from "./code-preview.client";
import i18n from "@/lib/i18n";
import LanguageSwitcherPreview from "./language-switcher-preview.client";
import ModalPreview from "./modal-preview.client";
import TogglePreview from "./toggle-preview.client";
import AccordionPreview from "./accordion-preview.client";
import { CodePreview } from "@/components/ui";
import ListPreview from "./list-preview.client";

export const metadata = {
  title: "Components",
  description: "In-house UI components catalog and usage examples",
};

export default function ComponentsPage() {
  const uiDir = path.join(process.cwd(), "components", "ui");
  let components: string[] = [];

  try {
    components = fs
      .readdirSync(uiDir)
      .filter((name) => fs.statSync(path.join(uiDir, name)).isDirectory());
  } catch {
    components = [];
  }

  function renderPreview(name: string) {
    switch (name) {
      case "Kbd":
        return <KbdPreview />;

      case "Carousel":
        return <CarouselPreview />;

      case "Card":
        return <CardPreview />;

      case "Badge":
        return <BadgePreview />;

      case "Avatar":
        return <AvatarPreview />;

      case "Button":
        return <ButtonPreview />;
      case "Dropdown":
        return <DropdownPreview />;
      case "CodePreview":
      case "Code Preview":
        return <CodePreviewPreview />;
      case "LanguageSwitcher":
      case "Language Switcher":
        return <LanguageSwitcherPreview />;
      case "List":
        return <ListPreview />;
      case "Modal":
      case "Modal Component":
        return <ModalPreview />;
      case "Accordion":
        return <AccordionPreview />;
      case "Toggle":
        return <TogglePreview />;
      case "Indicator":
        return <IndicatorPreview />;
      default:
        return (
          <div className="text-sm text-neutral-600 dark:text-neutral-300">
            {i18n.t("noPreview")}
          </div>
        );
    }
  }

  return (
    <div className="min-h-screen p-6 bg-zinc-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto grid grid-cols-4 gap-6">
        <aside className="col-span-1">
          <nav className="sticky top-6 space-y-2">
            <h3 className="text-sm font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
              {i18n.t("components")}
            </h3>
            {components.length === 0 && (
              <div className="text-sm text-neutral-500">
                {i18n.t("noComponents")}
              </div>
            )}
            {components.map((c) => (
              <a
                key={c}
                href={`#${c.toLowerCase()}`}
                className="block p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-100"
              >
                {c}
              </a>
            ))}
          </nav>
        </aside>

        <main className="col-span-3 space-y-8">
          {components.map((c) => (
            <section
              id={c.toLowerCase()}
              key={c}
              className="p-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded text-neutral-900 dark:text-neutral-100"
            >
              <h2 className="text-lg font-semibold mb-2">{c}</h2>
              <div className="mb-4">{renderPreview(c)}</div>

              <div className="text-sm">
                <div className="font-medium mb-2">{i18n.t("usage")}</div>
                <CodePreview
                  code={`import { ${c} } from '@/components/ui'\n\n<${c} />`}
                />
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
