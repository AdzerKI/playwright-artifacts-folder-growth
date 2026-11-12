Trace files of discarded chunks and temporary screenshots of passed tests stay in `.playwright-artifacts-N` until the worker exits.

```
npm ci
npx playwright install chromium
npm run repro
```

100 passing tests in one worker with `trace: 'retain-on-failure'` and `screenshot: 'only-on-failure'`. A worker fixture prints what is left in the worker artifacts folder before the worker exits.

Output with @playwright/test 1.65.0:

```
Artifacts folder before worker exit: test-results/.playwright-artifacts-0
  .png: 100 files, 0.7 MB
  .network: 200 files, 0.0 MB
  .trace: 200 files, 0.6 MB
  screencast frames: 136 files, 0.4 MB
  100 passed (18.3s)
```
