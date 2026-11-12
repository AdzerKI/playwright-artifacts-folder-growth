import fs from 'fs';
import path from 'path';
import { test as base } from '@playwright/test';

function files(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? files(file) : [file];
  });
}

const test = base.extend<{}, { artifactsReport: void }>({
  artifactsReport: [async ({}, use, workerInfo) => {
    await use();
    const dir = path.join(workerInfo.project.outputDir, `.playwright-artifacts-${workerInfo.workerIndex}`);
    const kinds = new Map<string, { count: number, bytes: number }>();
    for (const file of files(dir)) {
      const relative = path.relative(dir, file);
      const kind = relative.includes('/screencast/') ? 'screencast frames'
        : relative.includes('/resources/') ? 'resources'
          : path.extname(file);
      const entry = kinds.get(kind) ?? { count: 0, bytes: 0 };
      entry.count++;
      entry.bytes += fs.statSync(file).size;
      kinds.set(kind, entry);
    }
    console.log(`Artifacts folder before worker exit: ${dir}`);
    for (const [kind, { count, bytes }] of kinds)
      console.log(`  ${kind}: ${count} files, ${(bytes / 1024 / 1024).toFixed(1)} MB`);
  }, { scope: 'worker', auto: true }],
});

for (let i = 0; i < 100; i++) {
  test(`passing test ${i}`, async ({ page }) => {
    await page.setContent(`<h1>Test ${i}</h1><button onclick="this.textContent = 'clicked'">click</button>`);
    await page.getByRole('button').click();
    await page.getByText('clicked').waitFor();
  });
}
