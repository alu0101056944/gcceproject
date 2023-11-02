/**
 * @author Marcos Barrios
 * @since 28_10_2023
 * @desc Scrapper for NPMJS registry webpage of package.
 * 
 * References used during development:
 *    {@link https://www.npmjs.com/package/http-server}
 *
 */

'use strict';

import { PlaywrightCrawler, log } from 'crawlee';

/**
 * Scrapper for NPMJS registry webpage of package.
 */
export default class NPMJSScrapper {
  /** @private @constant */
  #scrapper = undefined;
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
        blockedStatusCodes: [404]
      },
    });
  }

  async #myHandler({ page, request }) {
    log.info('NPMJSScrapper visited page: ' + request.url);

    const COMMA_SEPARATED_NUMBER_REG_EXP = /\d+(\.?\d+)*/
    const amountOfDownloadsLocator = page
        .locator('div._702d723c')
        .filter({ has: page.locator('h3').filter({ hasText: 'Weekly Downloads' }) })
        .getByText(COMMA_SEPARATED_NUMBER_REG_EXP, { exact: true });
    const AMOUNT_OF_DOWNLOADS_STRING =
        await amountOfDownloadsLocator.textContent();
    const AMOUNT_OF_DOWNLOADS =
        parseInt(AMOUNT_OF_DOWNLOADS_STRING.replace(/\./g, ''));
    this.#outputObject[request.label] = AMOUNT_OF_DOWNLOADS;
  };

  async run() {
    await this.#scrapper.run(this.#urlsInfo);
    return this.#outputObject;
  }
}
