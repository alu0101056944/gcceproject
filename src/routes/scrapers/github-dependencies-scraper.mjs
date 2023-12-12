/**
 * @author Marcos Barrios
 * @since 29_10_2023
 * @desc Scraper for {@link https://github.com/facebook/react/network/dependencies?page=1}
 *
 */

'use strict';

import { PlaywrightCrawler, log } from 'crawlee';
import { expect } from 'playwright/test';

/**
 * Scraper for {@link https://github.com/facebook/react/network/dependencies?page=1}
 */
export default class GithubDependenciesScraper {
  /** @private @constant  */
  #scraper = undefined;
  #outputObject = undefined;
  #urlsInfo = undefined;

  /** @private */
  #maxPageSurfs = undefined;
  #currentAmountOfPagesSurfed = undefined;
  #outputLength = undefined;

  /**
   * @param {object} repositoryInfo with name of repository and author of the
   *    repository.
   */
  constructor(repositoryInfo) {
    this.#outputObject = {};
    this.#maxPageSurfs = Infinity;
    this.#currentAmountOfPagesSurfed = 0;
    this.#outputLength = 0;

    this.#urlsInfo = repositoryInfo.map((info) => {
      this.#outputObject[info.name] = new Map();

      return {
        url: `https://github.com/${info.author_company}/${info.name}`
            + '/network/dependencies',
        label: `${info.author_company}/${info.name}`,
      };
    });

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
      retryOnBlocked: true,
      maxConcurrency: 1,
      sessionPoolOptions: {
        blockedStatusCodes: [404],
      },
      maxRequestRetries: 0,
    });
  }

  async #myHandler({ page, request }) {
    const REPO_NAME = /^.+?\/(.+?)$/m.exec(request.label)[1];

    const iterationAction = async () => {
      const rowLocator = page.locator('div#dependencies').locator('div.Box')
          .locator('ul').locator('li');
      const allRows = await rowLocator.all();
      for (const row of allRows) {
        const linkWithName = row.locator('a.h4');
        const DEPENDENCY_NAME = (await linkWithName.textContent()).trim();
        this.#outputObject[REPO_NAME].set(DEPENDENCY_NAME, true);
      }
    }

    const buttonNextPage = page.locator('a.next_page');
    while (this.#maxPageSurfs > 0 &&
          this.#currentAmountOfPagesSurfed < this.#maxPageSurfs
          || this.#maxPageSurfs === 0) {
      const NEXT_URL = await buttonNextPage.getAttribute('href');
      log.info('GithubDependenciesScraper visited page: ' + NEXT_URL);

      await iterationAction();
      await expect(buttonNextPage).toBeEnabled({ timeout: 5000 });

      await buttonNextPage.click();
      await page.waitForNavigation();
      this.#currentAmountOfPagesSurfed++;
    }
  };

  /**
   * @param {number} newMaxAmountOfPageSurfs 
   */
  setMaxAmountOfPageSurfs(newMaxAmountOfPageSurfs) {
    this.#maxPageSurfs = newMaxAmountOfPageSurfs;
  }

  setOutputLength(newOutputLength) {
    this.#outputLength = newOutputLength;
  }

  async run() {
    if (this.#outputLength !== 0) {
      await this.#scraper.run(this.#urlsInfo.slice(0, this.#outputLength));

      const newOutput = {};
      const repositoryNames = Object.getOwnPropertyNames(this.#outputObject);
      const NON_INDEX_OUT_OF_BOUNDS_SIZE =
          Math.min(repositoryNames.length, this.#outputLength);
      for (let i = 0; i < NON_INDEX_OUT_OF_BOUNDS_SIZE; i++) {
        newOutput[repositoryNames[i]] = this.#outputObject[repositoryNames[i]];
      }
      return newOutput;
    }

    await this.#scraper.run(this.#urlsInfo);
    return this.#outputObject;
  }
}
