/**
 * @author Marcos Barrios
 * @since 28_10_2023
 * @desc Scraper for NPMJS registry webpage of package.
 * 
 * References used during development:
 *    {@link https://www.npmjs.com/package/http-server}
 *
 */

'use strict';

import { PlaywrightCrawler, log } from 'crawlee';
import playwright from 'playwright';

/**
 * Scraper for NPMJS registry webpage of package.
 */
export default class NPMJSScraper {
  /** @private @constant */
  #scraper = undefined;
  #outputObject = undefined;
  #urlsInfo = undefined;

  /**
   * @param {object} companyNames array of strings representing project names
   */
  constructor(projectNames) {
    this.#outputObject = {};

    const toURL = (projectName) => {
      const PROCESSED_PROJECT_NAME = projectName.replace(/\s/, '-');
      return `https://www.npmjs.com/package/${PROCESSED_PROJECT_NAME}`;
    }
    this.#urlsInfo = projectNames.map((name) => {
      return {
        url: toURL(name),
        label: name
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
      maxConcurrency: 3,
    });
  }

  async #myHandler({ page, request, response }) {
    page.setDefaultTimeout(5000);
    log.info('NPMJSScraper visited page: ' + request.url);

    if (response.status() !== 404) {
      try {
        const amountOfDownloadsLocator = page.locator('._9ba9a726');
        const AMOUNT_OF_DOWNLOADS_STRING = await amountOfDownloadsLocator.textContent();
        const AMOUNT_OF_DOWNLOADS = parseInt(AMOUNT_OF_DOWNLOADS_STRING.replace(/\./g, ''));
        this.#outputObject[request.label] = AMOUNT_OF_DOWNLOADS;
      } catch (error) {
        if (error instanceof playwright.errors.TimeoutError) {
          log.error('NPMJSScraper timeout error.');
        } else {
          log.error('NPMJSScraper error: ' + 'on page ' + request.url + ':' +
              error);
        }
      }
    }
  };

  async run() {
    await this.#scraper.run(this.#urlsInfo);
    return this.#outputObject;
  }
}
