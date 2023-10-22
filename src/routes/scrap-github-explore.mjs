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
  async requestHandler({ page, request, enqueueLinks, infiniteScroll }) {
    await purgeDefaultStorages();
    const topicTitleContainer =
        await page.waitForSelector('.gutter-md .d-flex.flex-1 .h1')
    const topicTitleHandler = await topicTitleContainer.textContent();
    const topicTitle = topicTitleHandler.trim();
    console.log('Title: ' + topicTitle);
    const AMOUNT_OF_RESULTS = await extractAmountOfResults(page);
    console.log('Amount of results: ' + AMOUNT_OF_RESULTS);
    await infiniteScroll({
      buttonSelector: 'text=Load more',
      stopScrollCallback: async () => {
        const repos = await page.$$('article.border');
        return repos.length >= AMOUNT_OF_RESULTS;
      }
    })
    const mapNameAndAuthor = await makeArrayOfUsefulInfo(page);
    mapNameAndAuthor.forEach((e) => console.log(`${e.name}/${e.author}`));
  },
});

async function makeArrayOfUsefulInfo(page) {
  const allNameAndAuthorHandlers = await page.$$('article div.d-flex.flex-1 h3')
  const mapNameAndAuthor = await Promise.all(
    allNameAndAuthorHandlers.map((elementHandler) => {
      return (async () => {
        const allHandlersOfLink = await elementHandler.$$('a');
        const nameLinkHandler = await allHandlersOfLink[0].textContent();
        const name = nameLinkHandler.trim();
        const authorLinkHandler = await allHandlersOfLink[1].textContent();
        const author = authorLinkHandler.trim();
        return { name, author };
      })();
    })
  );
  return mapNameAndAuthor;
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
