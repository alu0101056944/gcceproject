'use strict';

// @ts-check
import { test, expect } from '@playwright/test';

import LinkedinMentionsScraper from '../../src/routes/scrapers/linkedin-mentions-scraper.mjs';

test('Can surf the linkeding publications properly', async () => {
  const allToolName = [
    'react',
    'vue',
    'vuejs',
    'gastby',
    'gastbyjs',
    'next',
    'nextjs',
    'c++',
    'javascript',
    'java',
  ];
  const scraper = new LinkedinMentionsScraper(allToolName);
  const toolNameToMentionAmount = await scraper.run();
  await expect(Object.keys(toolNameToMentionAmount).length).toBe(10);
  for (const toolName of allToolName) {
    await expect(toolNameToMentionAmount[toolName]).not.toBeUndefined();
    await expect(toolNameToMentionAmount[toolName]).not.toBeNaN();
  }
});
