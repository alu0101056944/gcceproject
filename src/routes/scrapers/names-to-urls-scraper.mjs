/**
 * @author Marcos Barrios
 * @since 28_10_2023
 * @desc Scraper that inputs an string of names and then makes
 *    urls from those names in certain format.
 *
 */

'use strict';

import { PlaywrightCrawler, log } from 'crawlee';
import { inspect } from 'util';

/**
 * Scraper for NPMJS registry webpage of package.
 */
export default class NamesToURLScraper {
  /** @private @constant */
  #scraper = undefined;
  #outputObject = undefined;
  #urlsInfo = undefined;
  #callback = undefined;

  /**
   * Example:
   *    https://companiesmarketcap.com/${processedCompanyName}/marketcap/
   *    <preUrl>${processedCompanyName}<postUrl>
   * @param {function} callback What is going to be called inside the
   *    requestHandler. It has an outputObject parameter available.
   */
  constructor(options, callback) {
    this.#outputObject = {};
    this.#callback = callback;

    const toURL = (projectName) => {
      if (options.doNameProcessing) {
        const processingFunction =
            options.processingFunction ?? ((name) => name.replace(/\s/, '-'));
        const PROCESSED_PROJECT_NAME = processingFunction(projectName);
        return `${options.preUrl}${PROCESSED_PROJECT_NAME}${options.postUrl}`;
      } else {
        return `${options.preUrl}${projectName}${options.postUrl}`;
      }
    }
    this.#urlsInfo = options.names.map((name) => {
      return {
        url: toURL(name),
        label: name,
      };
    });
  }

  create(errorCodes = []) {
    this.#scraper = new PlaywrightCrawler({
      headless: true,
      navigationTimeoutSecs: 100000,
      requestHandlerTimeoutSecs: 100000,
      browserPoolOptions: {
        closeInactiveBrowserAfterSecs: 100000,
        operationTimeoutSecs: 100000,
      },
      requestHandler: this.#createMyHandler(),
      retryOnBlocked: true,
      maxConcurrency: 2,
      sessionPoolOptions: {
        blockedStatusCodes: errorCodes,
      },
    });
  }

  #createMyHandler() {
    const callback = this.#callback;
    const outputObject = this.#outputObject;
    return async (requestOptions) => {
      requestOptions.page.setDefaultTimeout(5000);
      await callback({
            ...requestOptions,
            outputObject,
            log,
          });
    }
  };

  async run() {
    if (!this.#scraper) {
      throw new Error('Create the scraper first. call create().');
    }
    await this.#scraper.run(this.#urlsInfo);
    return this.#outputObject;
  }
}
