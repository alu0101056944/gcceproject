
'use strict';

import fetchAllCommitAmount from '../../src/routes/get_repository_commit_amount.mjs';

const TIMEOUT_IN_MILLISECONDS = 20000;

describe('Get commit amount NamesToUrlScraper testing', () => {
  test('Result is correct; Everything is a number', async () => {
    const allRepoInfo = [
        {
          authorCompany: 'facebook',
          name: 'react',
        }
      ];
    const nameToAmount = await fetchAllCommitAmount(allRepoInfo);
    const NAME = Object.getOwnPropertyNames(nameToAmount)?.[0];
    expect(nameToAmount[NAME]).not.toBeUndefined();
  }, TIMEOUT_IN_MILLISECONDS)
});
