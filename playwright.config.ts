import { defineConfig, devices, ReporterDescription } from '@playwright/test';

/**
 * CI এনভায়রনমেন্ট চেক (Strict Boolean logic)
 * এখানে সরাসরি !! এর বদলে স্ট্রিং কম্পারিজন করা হয়েছে লিন্টার এরর এড়াতে।
 */
const isCI = process.env['CI'] !== undefined && process.env['CI'] !== '';

/**
 * Playwright Configuration
 * 4GB RAM এবং i3 3rd Gen সিস্টেমের জন্য অপ্টিমাইজড।
 */
export default defineConfig({
  testDir: './test/e2e',
  testMatch: '**/*.spec.ts',

  /* স্ট্যাবিলিটির জন্য ১টি ওয়ার্কার ব্যবহার করা হচ্ছে */
  workers: 1,
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,

  /**
   * টাইপ-সেফ রিপোর্টার কনফিগারেশন।
   */
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ...(isCI
      ? ([['junit', { outputFile: 'test-results/playwright-junit.xml' }]] as ReporterDescription[])
      : []),
  ] as ReporterDescription[],

  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
    },
  ],

  webServer: {
    command: 'npx http-server . -p 8080 -s',
    url: 'http://localhost:8080',
    reuseExistingServer: !isCI,
    timeout: 30_000,
  },
});
