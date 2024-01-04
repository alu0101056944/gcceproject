'use strict';

// @ts-check
import { test, expect } from '@playwright/test';

import getAmountOfOffers from '../../src/controllers/scraper_use_cases/get_market_offers.mjs';

test('Can get the amount of market offers for Software enginener', async () => {
  const allSearchTerm = [
    'Software Engineer'
  ];
  const objectWithCountProperty = await getAmountOfOffers(allSearchTerm);
  await expect(objectWithCountProperty.count).not.toBeUndefined();
  await expect(objectWithCountProperty.count).not.toBeNaN();
});
