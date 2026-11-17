import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig } from '@playwright/test';

function resolveLocalChromium(): string | undefined {
  const localAppData = process.env.LOCALAPPDATA;
  if (localAppData) {
    for (const rev of ['chromium-1254', 'chromium-1194']) {
      const candidate = join(localAppData, 'ms-playwright', rev, 'chrome-win64', 'chrome.exe');
      if (existsSync(candidate)) return candidate;
    }
  }
  if (existsSync('/usr/bin/chromium')) return '/usr/bin/chromium';
  return undefined;
}

const executablePath = resolveLocalChromium();
const PORT = 4179;

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  fullyParallel: false,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    headless: true,
    trace: 'on-first-retry',
    viewport: { width: 1280, height: 860 },
    launchOptions: executablePath ? { executablePath } : undefined
  },
  webServer: {
    command: 'node scripts/server.mjs',
    port: PORT,
    reuseExistingServer: false,
    env: {
      PORT: String(PORT),
      HOST: '127.0.0.1'
    }
  }
});
