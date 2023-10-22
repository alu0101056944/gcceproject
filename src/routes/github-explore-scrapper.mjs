/**
 * @author Marcos Barrios
 * @since 22_10_2023
 * @desc Scrapper for a github explore topic webpage.
 *
 */

'use strict';

import { PlaywrightCrawler, purgeDefaultStorages } from 'crawlee';

export default class GithubExploreScrapper {
  /** @private @constant  */
  #scrapper = undefined;
  #url = undefined;
  #processedInfoObject = undefined;

  constructor(url) {
    this.#url = url;
    this.#processedInfoObject = {};
    const requestHandler = myHandler.bind(this);
    this.#scrapper = new PlaywrightCrawler({
      headless: true,
      navigationTimeoutSecs: 100000,
      requestHandlerTimeoutSecs: 100000,
      browserPoolOptions: {
        closeInactiveBrowserAfterSecs: 100000,
        operationTimeoutSecs: 100000,
      },
      requestHandler,
    });
  }

  async #myHandler({ page, request, enqueueLinks, infiniteScroll}) {
    await purgeDefaultStorages();
    const topicTitleContainer =
        await page.waitForSelector('.gutter-md .d-flex.flex-1 .h1')
    const topicTitleHandler = await topicTitleContainer.textContent();
    const topicTitle = topicTitleHandler.trim();
    console.log('Title: ' + topicTitle);
    
    const AMOUNT_OF_RESULTS = await this.#extractAmountOfResults(page);
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
    const mapNameAndAuthor = await this.#makeArrayOfUsefulInfo(page);
    mapNameAndAuthor.forEach((e) => console.log(`${e.name}/${e.author}`));
  };

  async #makeArrayOfUsefulInfo(page) {
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
  
  async #extractAmountOfResults(page) {
    const handlerOfTextWithAmount = await page.$('h2.h3.color-fg-muted');
    const TEXT_WITH_AMOUNT_OF_RESULTS = await handlerOfTextWithAmount.textContent();
    const AMOUNT_OF_RESULTS = parseFloat(
        TEXT_WITH_AMOUNT_OF_RESULTS.replace(',', '').match(/\d+/g)
      );
    return AMOUNT_OF_RESULTS;
  }

  run() {
    this.#scrapper.run([this.#url]);
  }
}
