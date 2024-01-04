'use strict';

// @ts-check
import { test, expect } from '@playwright/test';

import RedditPostsScrapper from '../../src/routes/scrapers/reddit-posts-scraper.mjs';

test('Can get a bunch of comments', async () => {
  test.setTimeout(7200000);
  const INITIAL_URL = 'https://www.reddit.com/r/programming/search/?q=react&restrict_sr=1&sort=new';
  const scraper = new RedditPostsScrapper(INITIAL_URL);
  const allMeanSentiment = await scraper.run();
  for (const sentiment of allMeanSentiment) {
    console.log(sentiment);
    await expect(sentiment).not.toBeUndefined();
    await expect(sentiment).not.toBeNaN();
  }
});
