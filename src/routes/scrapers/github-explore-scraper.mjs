/**
 * @author Marcos Barrios
 * @since 22_10_2023
 * @desc Scraper for a github explore topic webpage.
 *
 */

'use strict';

import { PlaywrightCrawler, log } from 'crawlee';

export default class GithubExploreScraper {
  /** @private */
  #maximumAmountOfClicks = undefined;

  /** @private @constant  */
  #scraper = undefined;
  #url = undefined;
  #outputObject = undefined;
  #repositoryUrls = undefined;

  constructor(url) {
    this.#url = url;
    this.#outputObject = {};
    this.#maximumAmountOfClicks = 20;

    const requestHandler = this.#myHandler.bind(this);
    this.#scraper = new PlaywrightCrawler({
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

  async #myHandler({ page, infiniteScroll}) {
    const topicTitleContainer =
        await page.waitForSelector('.gutter-md .d-flex.flex-1 .h1');
    const topicTitleHandler = await topicTitleContainer.textContent();
    const topicTitle = topicTitleHandler.trim();
    console.log('Title: ' + topicTitle);
    
    const AMOUNT_OF_RESULTS = await this.#extractAmountOfResults(page);
    console.log('Amount of results: ' + AMOUNT_OF_RESULTS);

    let amountOfClicks = 0;
    await infiniteScroll({
      buttonSelector: 'text=Load more',
      stopScrollCallback: async () => {
        amountOfClicks++;
        return amountOfClicks >= this.#maximumAmountOfClicks;
      }
    });

    // Update README.md on changes ******************************************

    try {
      const headersInfo = await this.#arrayOfHeadersInfo(page);
      const tagsPerRepo = await this.#arraysOfTags(page);
      const typesPerRepo = tagsPerRepo.map(tags => this.getTypeFromTags(tags));
      log.info('GithubExploreScraper tagsPerRepoLength=' + // for debugging
          tagsPerRepo.length + ' headersInfoLength=' + headersInfo.length);
      log.info('GithubExploreScraper typesPerRepoLength=' +
          typesPerRepo.length + ' headersInfoLength=' + headersInfo.length);
      typesPerRepo.forEach((type, i) => headersInfo[i].type = type);
      this.#outputObject = headersInfo;
    } catch (error) {
      console.error('github explore error: ' + error);
    }
  };

  async #extractAmountOfResults(page) {
    const handlerOfTextWithAmount = await page.$('h2.h3.color-fg-muted');
    const TEXT_WITH_AMOUNT_OF_RESULTS =
        await handlerOfTextWithAmount.textContent();
    const AMOUNT_OF_RESULTS = parseFloat(
        TEXT_WITH_AMOUNT_OF_RESULTS.replace(/,/g, '').match(/\d+/g)
      );
    return AMOUNT_OF_RESULTS;
  }

  async #arrayOfHeadersInfo(page) {
    const h3 = page.getByRole('heading').filter({ hasText: '/' });
    return await h3.evaluateAll((h) => {
      const outputArray = [];

      h.forEach((headerDOM) => {
        const childrenElements = headerDOM.children;
        
        const URL_TO_REPOSITORY =
            'github.com' + childrenElements[1].getAttribute('href');
        const toText = (node) => node && node.textContent.trim();
        outputArray.push({
          author_company: toText(childrenElements[0]),
          name: toText(childrenElements[1]),
          url: URL_TO_REPOSITORY,
        });
      });

      return outputArray;
    });
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
      'embedded',
      'ui',
      'framework',
      'build-tool'
    ];
    for (const tag of tags) {
      for (const type of types) {
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
      }
    }
    return null;
  }

  getOutputObject() {
    return this.#outputObject;
  }

  async run() {
    await this.#scraper.run([this.#url]);
    return this.#outputObject;
  }
}
