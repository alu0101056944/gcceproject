/**
 * @author Marcos Barrios
 * @since 29_10_2023
 * @desc Scrapper for {@link https://github.com/facebook/react/network/dependencies?page=1}
 *
 */

'use strict';

import { PlaywrightCrawler, log } from 'crawlee';
import { expect } from 'playwright/test';

/**
 * Scrapper for {@link https://github.com/facebook/react/network/dependencies?page=1}
 */
export default class GithubDependenciesScrapper {
  /** @private @constant  */
  #scrapper = undefined;
  #outputObject = undefined;
  #urlsInfo = undefined;

  /** @private */
  #maxPageSurfs = undefined;
  #currentAmountOfPagesSurfed = undefined;
  

  /**
   * @param {object} repositoryInfo with name of repository and author of the
   *    repository.
   */
  constructor(repositoryInfo) {
    this.#outputObject = {};
    this.#maxPageSurfs = Infinity;
    this.#currentAmountOfPagesSurfed = 0;

    this.#urlsInfo = repositoryInfo.map((info) => {
      return {
        url: `https://github.com/${info.author}/${info.name}`
            + '/network/dependencies',
        label: `${info.author}/${info.name}`,
      };
    });

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
      retryOnBlocked: true,
      maxConcurrency: 1,
      sessionPoolOptions: {
        blockedStatusCodes: [404],
      },
      maxRequestRetries: 2,
    });
  }

  async #myHandler({ page, request }) {
    const iterationAction = async () => {
      const rowLocator = page.locator('div#dependencies').locator('div.Box')
          .locator('ul').locator('li');
      const allRows = await rowLocator.all();
      for (const row of allRows) {
        const linkWithName = row.locator('a.h4');
        const DEPENDENCY_NAME = (await linkWithName.textContent()).trim();
        this.#outputObject[DEPENDENCY_NAME] = true;
      }
    }
    const buttonNextPage = page.locator('a.next_page');
    while (this.#maxPageSurfs > 0 &&
          this.#currentAmountOfPagesSurfed < this.#maxPageSurfs
          || this.#maxPageSurfs === 0) {
      const NEXT_URL = await buttonNextPage.getAttribute('href');
      log.info('GithubDependenciesScrapper visited page: ' + NEXT_URL);

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
  setMaxAmountfPageSurfs(newMaxAmountOfPageSurfs) {
    this.#maxPageSurfs = newMaxAmountOfPageSurfs;
  }

  getOutputObject() {
    return this.#outputObject;
  }

  async run() {
    await this.#scrapper.run(this.#urlsInfo);
    return this.#outputObject;
  }
}
