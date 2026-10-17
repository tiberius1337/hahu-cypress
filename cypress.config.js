const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.hasznaltauto.hu',
    viewportWidth: 1440,
    viewportHeight: 900,
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36',
    defaultCommandTimeout: 5000,
    pageLoadTimeout: 30000,
    retries: { runMode: 2, openMode: 0 },
    blockHosts: [
      '*.googletagmanager.com',
      '*.google-analytics.com',
      '*.google.hu',
      '*.doubleclick.net',
      '*.googleadservices.com',
      '*.facebook.net',
      '*.facebook.com',
      '*.tiktok.com',
      '*.tiktokw.us',
      '*.hotjar.com',
      '*.clarity.ms',
      '*.bing.com',
      '*.taboola.com',
      '*.gemius.pl',
      '*.abtasty.com',
      '*.useinsider.com',
      '*.openai.com',
      '*.creativecdn.com',
      '*.adform.net',
      'challenges.cloudflare.com',
    ],
  },
});
