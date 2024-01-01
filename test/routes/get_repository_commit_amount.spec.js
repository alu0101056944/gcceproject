'use strict';

// @ts-check
import { test, expect } from '@playwright/test';

import fetchAllCommitAmount from '../../src/routes/get_repository_commit_amount.mjs';

test('Result is correct; Everything is a number', async () => {
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
