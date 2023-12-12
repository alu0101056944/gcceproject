/**
 * @author Marcos Barrios
 * @since 28_10_2023
 * @desc Scraper for github repository.
 * 
 * References used during development:
 *    {@link https://github.com/facebook/react}
 *    {@link https://github.com/alu0101056944/gcceproject}
 *
 */

'use strict';

import { PlaywrightCrawler, log } from 'crawlee';

/**
 * Scraper for github repository.
 */
export default class GithubRepositoryScraper {
  /** @private @constant */
  #scraper = undefined;
  #outputObject = undefined;
  #urls = undefined;

  /**
   * @param {object} companyNames array of strings representing the company
   *    names
   */
  constructor(urls) {
    this.#outputObject = [];
    this.#urls = urls;
    
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
    });
  }

  async #myHandler({ page, request }) {
    log.info('GithubRepositoryScraper visited page: ' + request.url);

    const elementWithAmountOfContributors =
        page.getByRole('link').getByText('Contributors').locator('span');
    const allLocators = await elementWithAmountOfContributors.all();
    if (allLocators.length > 0) {
      log.info('GithubRepositoryScraper is able to find contributors section.');

      // I assume that when it matches something, then it is only 1 element
      const AMOUNT_OF_CONTRIBUTORS_STRING = await allLocators[0].textContent();
      const AMOUNT_OF_CONTRIBUTORS =
          AMOUNT_OF_CONTRIBUTORS_STRING.replace(/,/g, '');
      this.#outputObject.push(parseInt(AMOUNT_OF_CONTRIBUTORS));
    } else {
      this.#outputObject.push(null);
    }
  };

  getOutputObject() {
    return this.#outputObject;
  }

  async run() {
    await this.#scraper.run(this.#urls.map((url) => {
      return {
        url,
      }
    }));
    return this.#outputObject;
  }
}
