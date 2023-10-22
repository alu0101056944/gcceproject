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
        // return repos.length >= AMOUNT_OF_RESULTS;
        return repos.length >= 10;
      }
    });
    console.log('Reached the end of infinite scroll');
    const mapNameAndAuthor = await makeArrayOfUsefulInfo(page);
    mapNameAndAuthor.forEach((e) => console.log(`${e.name}/${e.author}`));
  },
});

async function makeArrayOfUsefulInfo(page) {
  const allArticleLocators = await page.getByRole('article');
  const allH3Locators = await allArticleLocators.getByRole('h3');
  const repositoryInfo = allH3Locators.evaluateAll((allDOMNodes) => {
      const array = [];
      allDOMNodes.forEach((node) => {
        const children = node.children;
        const toText = (element) => element && element.innerText.trim();
        array.push({ name: toText(children[0]), author: toText(children[2]) });
      });
      return array;
    });
  return repositoryInfo;
}

async function extractAmountOfResults(page) {
  const handlerOfTextWithAmount = await page.$('h2.h3.color-fg-muted');
  const TEXT_WITH_AMOUNT_OF_RESULTS = await handlerOfTextWithAmount.textContent();
  const AMOUNT_OF_RESULTS = parseFloat(
      TEXT_WITH_AMOUNT_OF_RESULTS.replace(',', '').match(/\d+/g)
    );
  return AMOUNT_OF_RESULTS;
}

crawler.run(['https://github.com/topics/frontend']);
