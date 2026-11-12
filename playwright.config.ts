import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  workers: 1,
  reporter: 'line',
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
});
