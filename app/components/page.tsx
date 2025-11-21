import fs from 'fs';
import path from 'path';
import ButtonPreview from './button-preview.client';

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

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-4 gap-6">
        <aside className="col-span-1">
          <nav className="sticky top-6 space-y-2">
            <h3 className="text-sm font-semibold mb-2">Components</h3>
            {components.length === 0 && (
              <div className="text-sm text-neutral-500">No components found</div>
            )}
            {components.map((c) => (
              <a
                key={c}
                href={`#${c.toLowerCase()}`}
                className="block p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                {c}
              </a>
            ))}
          </nav>
        </aside>

        <main className="col-span-3 space-y-8">
          {components.includes('Button') && (
            <section id="button" className="p-4 border rounded">
              <h2 className="text-lg font-semibold mb-2">Button</h2>
              <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-300">
                The `Button` component is the primary clickable element used across the app. It
                supports `variant` and `size` props for common cases.
              </p>

              <div className="mb-4">
                <ButtonPreview />
              </div>

              <div className="text-sm">
                <div className="font-medium mb-2">Usage</div>
                <pre className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded text-sm overflow-auto">
                  {`import { Button } from '@/components/ui'

<Button variant="primary" size="md">Save</Button>`}
                </pre>
              </div>
            </section>
          )}

          {components
            .filter((c) => c !== 'Button')
            .map((c) => (
              <section id={c.toLowerCase()} key={c} className="p-4 border rounded">
                <h2 className="text-lg font-semibold mb-2">{c}</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">No preview available yet.</p>
              </section>
            ))}
        </main>
      </div>
    </div>
  );
}
