'use strict';

// @ts-check
import { test, expect } from '@playwright/test';

import makeCompanyTable from '../../../../../../src/controllers/tables/source/github/dimension/make_company_table.mjs';

test('Valid data is obtained from make company table.', async () => {
  test.setTimeout(7200000);
  const toolTable = [
    {
      "name": "react",
      "author_company": "facebook",
      "specialization": "frontend",
      "type": "ui",
      "tool_id": 2
    },
  ]
  try {
    const allRecord = await makeCompanyTable(toolTable, 0);
    await expect(allRecord.length).toEqual(1);
    await expect(allRecord[0].company_id).toEqual(1);
    await expect(allRecord[0].name).not.toBeUndefined();
    await expect(allRecord[0].employee_amount).not.toBeUndefined();
    await expect(allRecord[0].employee_amount).not.toBeNaN();
    await expect(allRecord[0].amount_of_searches).not.toBeUndefined();
    await expect(allRecord[0].amount_of_searches).not.toBeNaN();
    await expect(allRecord[0].type).not.toBeUndefined();
  } catch (error) {
    console.log('there was an error ' + error);
    throw error;
  }
});
