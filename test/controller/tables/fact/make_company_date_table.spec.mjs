'use strict';

// @ts-check
import { test, expect } from '@playwright/test';

import makeCompanyDate from '../../../../src/controllers/tables/fact/make_company_date_table.mjs';

test('Able to make a company-date table', async () => {
  test.setTimeout(7200000)
  const companyTable = [
    {
      company_id: 1,
      name: 'facebook',
      employee_amount: 78,
      amount_of_searches: 99,
      type: 'foo',
    }
  ];
  const allRecord = await makeCompanyDate(companyTable, 5);
  await expect(allRecord.length).toBe(1);
  for (const [index, record] of allRecord.entries()) {
    await expect(record.company_id).toBe(index + 1);
    await expect(record.date_id).toBe(5);
    await expect(record.benefit).not.toBeUndefined();
    await expect(record.benefit).not.toBeNaN();
    await expect(record.year).toBe(new Date().getFullYear());
    await expect(record.quarter === 1 || record.quearter === 2 ||
        record.quarter === 3).toBe(true);
  }
});
