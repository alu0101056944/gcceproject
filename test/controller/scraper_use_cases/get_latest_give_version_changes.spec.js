'use strict';

// @ts-check
import { test, expect } from '@playwright/test';

import getAllLatestVersionChanges from '../../../src/controllers/scraper_use_cases/get_latest_five_version_changes';

test('Can the latest five releases', async () => {
  const allRepoInfo = ['facebook/react'];
  const output = await getAllLatestVersionChanges(allRepoInfo);
  await expect(output['facebook/react']?.length).toEqual(5);
  for (const version of output['facebook/react']) {
    await expect(typeof version).toEqual('string');
  }
});
