'use strict';

// @ts-check
import { test, expect } from '@playwright/test';

import makeMarketDateTable from '../../../../../../src/controllers/tables/source/linkedin/fact/make_market_date_table.mjs';

test('Able to make market-date table', async () => {
  const marketTable = [
    { market_id: 1 },
    { market_id: 2 },
    { market_id: 3 }
  ];
  const allRecord = await makeMarketDateTable(marketTable, 5);
  await expect(allRecord.length).toBe(3);
  for (const [index, record] of allRecord.entries()) {
    await expect(record.market_id).toBe(index + 1);
    await expect(record.total_amount_of_offers).not.toBeUndefined();
  }
});
