/**
 * @author Marcos Barrios
 * @since 20_10_2023
 * @desc Scrap items from any Github Explore topic.
 *
 * @see {@link https://github.com/topics/frontend} for the webpage it was tested
 *  on.
 * @see {@link https://blog.apify.com/how-to-scrape-the-web-with-playwright-ece1ced75f73/}
 *    for a github explore playwright scrap example.
 */

'use strict';

import { PlaywrightCrawler, purgeDefaultStorages } from 'crawlee';
import { expect } from 'playwright/test';

const crawler = new PlaywrightCrawler({
  headless: true,
  navigationTimeoutSecs: 100000,
  requestHandlerTimeoutSecs: 100000,
  browserPoolOptions: {
    closeInactiveBrowserAfterSecs: 100000,
    operationTimeoutSecs: 100000,
  },
  async requestHandler({ page, request, enqueueLinks, infiniteScroll }) {
    await purgeDefaultStorages();
    const h3 = page.getByRole('heading').filter({ hasText: '/' });
    const array = await h3.evaluateAll((h) => {
      const outputArray = [];
      h.forEach((headerDOM) => {
        const children = headerDOM.children;
        const toText = (node) => node && node.textContent.trim();
        outputArray.push({ name: toText(children[0]), author: toText(children[1])});
      });
      return outputArray;
    });
    array.forEach((e) => console.log(e));
  },
});

crawler.run(['https://github.com/topics/frontend']);
