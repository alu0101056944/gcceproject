'use strict';

// @ts-check
import { test, expect } from '@playwright/test';
import GoogleTrendsScraper from '../../src/routes/scrapers/google-trends-scraper.mjs';

test('Can get the amount of market offers for Software enginener', async () => {
  const scraper = new GoogleTrendsScraper(['foo', 'rafa nadal']);
  const allInterest = await scraper.run();
  console.log(JSON.stringify(allInterest, null, 2));
});
