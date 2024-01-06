'use strict';

// @ts-check
import { test, expect } from '@playwright/test';

import { writeFile } from 'fs/promises';

import makeToolTable from '../../../../../src/controllers/tables/dimension/github/make_tool_table.mjs';

test('Valid data is obtained from make tool table.', async () => {
  test.setTimeout(7200000);
  try {
    const allRecord = await makeToolTable(0);
    await expect(allRecord.length).not.toEqual(0);
    await expect(allRecord[0].tool_id).not.toBeUndefined();
    await expect(allRecord[0].tool_id).not.toBeNaN();
    await expect(allRecord[0].name).not.toBeUndefined();
    await expect(allRecord[0].author_company).not.toBeUndefined();
    await expect(allRecord[0].specialization).not.toBeUndefined();
    await expect(allRecord[0].type).not.toBeUndefined();
  } catch (error) {
    console.log('there was an error ' + error);
    throw error;
  }
});
