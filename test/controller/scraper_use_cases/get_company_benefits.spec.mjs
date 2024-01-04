'use strict';

// @ts-check
import { test, expect } from '@playwright/test';

import getStocks from '../../../src/controllers/scraper_use_cases/get_company_benefits.mjs';

test('Can get companies daily stock delta.', async () => {
  const allCompanyName = ['facebook'];
  const companyNameToDelta = await getStocks(allCompanyName);
  await expect(Object.keys(companyNameToDelta).length).toBe(1);
  await expect(companyNameToDelta['facebook']).not.toBeUndefined();
  await expect(companyNameToDelta['facebook']).not.toBeNaN();
});
