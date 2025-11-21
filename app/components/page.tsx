import fs from 'fs';
import path from 'path';
import ButtonPreview from './button-preview.client';
import DropdownPreview from './dropdown-preview.client';
import CodePreviewPreview from './code-preview.client';

export const metadata = {
  title: 'Components',
  description: 'In-house UI components catalog and usage examples',
};

export default function ComponentsPage() {
  const uiDir = path.join(process.cwd(), 'components', 'ui');
  let components: string[] = [];

  try {
    components = fs
      .readdirSync(uiDir)
      .filter((name) => fs.statSync(path.join(uiDir, name)).isDirectory());
  } catch (e) {
    components = [];
  }

  function renderPreview(name: string) {
    switch (name) {
      case 'Button':
        return <ButtonPreview />;
      case 'Dropdown':
        return <DropdownPreview />;
      case 'CodePreview':
        return <CodePreviewPreview />;
      default:
        return <div className="text-sm text-neutral-600 dark:text-neutral-300">No preview available yet.</div>;
    }
  }

  return (
    <div className="min-h-screen p-6 bg-zinc-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto grid grid-cols-4 gap-6">
        <aside className="col-span-1">
          <nav className="sticky top-6 space-y-2">
            <h3 className="text-sm font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Components</h3>
            {components.length === 0 && (
              <div className="text-sm text-neutral-500">No components found</div>
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
                <div className="font-medium mb-2">Usage</div>
                <pre className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded text-sm overflow-auto">
                  {`import { ${c} } from '@/components/ui'

<${c} />`}
                </pre>
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
