
'use strict';

import getCommitAmount from '../../src/routes/get_repository_commit_amount.mjs';

describe('Get commit amount NamesToUrlScrapper testing', () => {
  test('Result is correct', async () => {
    const allRepository = [
        {
          authorCompany: 'facebook',
          name: 'react',
        }
      ];
    const amounts = await getCommitAmount(allRepository);
    for (const amount of Object.getOwnPropertyNames(amounts)) {
      const IS_NUMBER = typeof amount === 'number' && !isNaN(amount);
      expect(IS_NUMBER).toBe(true);
    }
  })
});
