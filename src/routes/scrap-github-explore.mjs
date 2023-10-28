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

export default crawler = new PlaywrightCrawler({
  headless: true,
  navigationTimeoutSecs: 100000,
  requestHandlerTimeoutSecs: 100000,
  browserPoolOptions: {
    closeInactiveBrowserAfterSecs: 100000,
    operationTimeoutSecs: 100000,
  },
  async requestHandler({ page, request, enqueueLinks, infiniteScroll }) {
    await purgeDefaultStorages();
    const topicTitleContainer =
        await page.waitForSelector('.gutter-md .d-flex.flex-1 .h1')
    const topicTitleHandler = await topicTitleContainer.textContent();
    const topicTitle = topicTitleHandler.trim();
    console.log('Title: ' + topicTitle);
    const AMOUNT_OF_RESULTS = await extractAmountOfResults(page);
    console.log('Amount of results: ' + AMOUNT_OF_RESULTS);
    let amount = 0;
    await infiniteScroll({
      buttonSelector: 'text=Load more',
      stopScrollCallback: async () => {
        console.log(`Pressed button ${amount++}`);
        const repos = await page.$$('article.border');
        return amount >= 100;
      }
    });
    console.log('Reached the end of infinite scroll');
    const mapNameAndAuthor = await makeArrayOfUsefulInfo(page);
    mapNameAndAuthor.forEach((e) => console.log(`${e.name}/${e.author}`));
  },
});

async function makeArrayOfUsefulInfo(page) {
  const h3 = page.getByRole('heading').filter({ hasText: '/' });
  return await h3.evaluateAll((h) => {
    const outputArray = [];
    h.forEach((headerDOM) => {
      const children = headerDOM.children;
      const toText = (node) => node && node.textContent.trim();
      outputArray.push({ name: toText(children[0]), author: toText(children[1])});
    });
    return outputArray;
  });
}

async function extractAmountOfResults(page) {
  const handlerOfTextWithAmount = await page.$('h2.h3.color-fg-muted');
  const TEXT_WITH_AMOUNT_OF_RESULTS = await handlerOfTextWithAmount.textContent();
  const AMOUNT_OF_RESULTS = parseFloat(
      TEXT_WITH_AMOUNT_OF_RESULTS.replace(/,/g, '').match(/\d+/g)
    );
  return AMOUNT_OF_RESULTS;
}

crawler.run(['https://github.com/topics/frontend']);
