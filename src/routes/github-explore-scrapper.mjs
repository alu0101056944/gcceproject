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
    const requestHandler = this.#myHandler.bind(this);
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
    let amountOfClicks = 0;
    await infiniteScroll({
      buttonSelector: 'text=Load more',
      stopScrollCallback: async () => {
        console.log(`Pressed button ${amountOfClicks++}`);
        return amountOfClicks >= 4;
      }
    });
    console.log('Reached the end of infinite scroll');
    const headersInfo = await this.#arrayOfHeadersInfo(page);
    headersInfo.forEach((e) => console.log(`${e.name}/${e.author},${e.url}`));
    const arraysOfTags = await this.#arraysOfTags(page);
  };

  async #arrayOfHeadersInfo(page) {
    const h3 = page.getByRole('heading').filter({ hasText: '/' });
    return await h3.evaluateAll((h) => {
      const outputArray = [];
      h.forEach((headerDOM) => {
        const childrenElements = headerDOM.children;
        const urlToRepository =
            'github.com' + childrenElements[1].getAttribute('href');
        const toText = (node) => node && node.textContent.trim();
        outputArray.push({
          name: toText(childrenElements[0]),
          author: toText(childrenElements[1]),
          url: urlToRepository,
        });
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

  async #arraysOfTags(page) {
    const allTagsArrays = [];
    const articleLocators = await page.locator('article.border').all();
    for (const articleLocator of articleLocators) {
      const tagLocator = articleLocator.locator('a.topic-tag');
      allTagsArrays.push(await tagLocator.allInnerTexts());
    }
    return allTagsArrays;
  }

  getTypeFromTags(tags) {
    const types = [
      'language',
      'testing',
      'db',
      'editor',
      { 'ai': ['machine-learning', 'deep-learning', 'deep-neural-networks'] },
      'code-quality',
      'code-review',
      'compiler',
      'continuous-integration',
      'devops',
      'documentation',
    ];
    tags.forEach((tag) => {
      types.forEach((type) => {
        if (typeof type === 'object') {
          for (const finalType of Object.getOwnPropertyNames(type)) {
            type[finalType].forEach((possibleTag) => {
              if (tag === possibleTag) {
                return finalType;
              }
            });
          }
        } else {
          if (tag === type) {
            return type;
          }
        }
      });
    });
    return null;
  }

  run() {
    this.#scrapper.run([this.#url]);
  }
}
