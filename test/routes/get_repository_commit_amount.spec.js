'use strict';

// @ts-check
import { test, expect } from '@playwright/test';

import fetchAllCommitAmount from '../../src/controllers/scraper_use_cases/get_repository_commit_amount.mjs';

test('Can get the commit amount', async () => {
  const allRepoInfo = [
      {
        authorCompany: 'facebook',
        name: 'react',
      }
    ];
  const nameToAmount = await fetchAllCommitAmount(allRepoInfo);
  const NAME = Object.getOwnPropertyNames(nameToAmount)?.[0];
  await expect(nameToAmount[NAME]).not.toBeUndefined();
});
