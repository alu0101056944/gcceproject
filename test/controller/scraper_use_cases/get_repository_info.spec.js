'use strict';

// @ts-check
import { test, expect } from '@playwright/test';

import getInfo from '../../../src/controllers/scraper_use_cases/get_repository_info.mjs';

test('Can get the version number', async () => {
  const allRepoInfo = ['facebook/react'];
  const nameToAmount = await getInfo(allRepoInfo);
  const VERSION = Object.values(nameToAmount)?.[0].version;
  await expect(VERSION).not.toBeUndefined();
});
