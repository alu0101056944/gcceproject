/**
 * @author Marcos Barrios
 * @since 28_10_2023
 * @desc Scrapper for github repository.
 * 
 * References used during development:
 *    {@link https://github.com/facebook/react}
 *    {@link https://github.com/alu0101056944/gcceproject}
 *
 */

'use strict';

import { PlaywrightCrawler, log } from 'crawlee';

/**
 * Scrapper for github repository.
 */
export default class GithubRepositoryScrapper {
  /** @private @constant */
  #scrapper = undefined;
  #outputObject = undefined;
  #urls = undefined;

  /**
   * @param {object} companyNames array of strings representing the company names
   */
  constructor(urls) {
    this.#outputObject = [];
    this.#urls = urls;
    
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
    });
  }

  async #myHandler({ page, request }) {
    log.info('GithubRepositoryScrapper visited page: ' + request.url);

    const elementWithAmountOfContributors =
        page.getByRole('link').getByText('Contributors').locator('span');
    const allLocators = await elementWithAmountOfContributors.all();
    if (allLocators.length > 0) {
      log.info('GithubRepositoryScrapper is able to find contributors section.');

      // I assume that when it matches something, then it is only 1 element
      const AMOUNT_OF_CONTRIBUTORS_STRING = await allLocators[0].textContent();
      const AMOUNT_OF_CONTRIBUTORS =
          AMOUNT_OF_CONTRIBUTORS_STRING.replace(/,/g, '');
      this.#outputObject.push(parseInt(AMOUNT_OF_CONTRIBUTORS));
    }
  };

  getOutputObject() {
    return this.#outputObject;
  }

  async run() {
    await this.#scrapper.run(this.#urls.map((url) => {
      return {
        url,
      }
    }));
  }
}
