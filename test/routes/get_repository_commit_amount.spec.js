
'use strict';

import fetchAllCommitAmount from '../../src/routes/get_repository_commit_amount.mjs';

const TIMEOUT_IN_MILLISECONDS = 20000;

describe('Get commit amount NamesToUrlScrapper testing', () => {
  test('Result is correct; Everything is a number', async () => {
    const allRepoInfo = [
        {
          authorCompany: 'facebook',
          name: 'react',
        }
      ];
    const allAmount = await fetchAllCommitAmount(allRepoInfo);
    for (const name of Object.getOwnPropertyNames(allAmount)) {
      const AMOUNT_VALUE = allAmount[name];
      const IS_NUMBER = typeof AMOUNT_VALUE === 'number' && !isNaN(AMOUNT_VALUE);
      expect(IS_NUMBER).toBe(true);
    }
  }, TIMEOUT_IN_MILLISECONDS)
});
