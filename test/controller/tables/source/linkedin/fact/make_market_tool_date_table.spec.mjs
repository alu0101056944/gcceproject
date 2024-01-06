'use strict';

// @ts-check
import { test, expect } from '@playwright/test';

import { inspect } from 'util';

import makeMarketToolDateTable from '../../../../../../src/controllers/tables/source/linkedin/fact/make_market_tool_date_table.mjs';


test('Able to make market-tool-date table', async () => {
  test.setTimeout(7200000)
  const marketTable = [
    { market_id: 1 },
    { market_id: 2 },
    { market_id: 3 }
  ];
  const toolTable = [
    {
      "name": "react",
      "author_company": "facebook",
      "specialization": "frontend",
      "type": "ui",
      "tool_id": 1
    },
    {
      "name": "vue",
      "author_company": "vuejs",
      "specialization": "frontend",
      "type": "framework",
      "tool_id": 2
    },
  ];
  const allRecord = await makeMarketToolDateTable(marketTable, toolTable, 5);
  await expect(allRecord.length).toBe(2);
  console.log(inspect(allRecord, {depth: null}));
  for (const [index, record] of allRecord.entries()) {
    await expect(record.market_id).toBe(1);
    await expect(record.tool_id).toBe(index + 1);
    await expect(record.date_id).toBe(5);
    await expect(record.amount_of_mentions).not.toBeUndefined();
    console.log('reached amount of mentions not be undefned');
    await expect(record.amount_of_mentions).not.toBeNaN();
    console.log('reached amount of mentions not be nan');
  }
});
