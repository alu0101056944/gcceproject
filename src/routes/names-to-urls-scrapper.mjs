/**
 * @author Marcos Barrios
 * @since 28_10_2023
 * @desc Scrapper that inputs an string of names and then makes
 *    urls from those names in certain format.
 *
 */

'use strict';

import { PlaywrightCrawler, log } from 'crawlee';

/**
 * Scrapper for NPMJS registry webpage of package.
 */
export default class NamesToURLScrapper {
  /** @private @constant */
  #scrapper = undefined;
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
        label: name
      };
    });
  }

  create(errorCodes = []) {
    this.#scrapper = new PlaywrightCrawler({
      headless: true,
      navigationTimeoutSecs: 100000,
      requestHandlerTimeoutSecs: 100000,
      browserPoolOptions: {
        closeInactiveBrowserAfterSecs: 100000,
        operationTimeoutSecs: 100000,
      },
      requestHandler: this.#myHandler(),
      retryOnBlocked: true,
      maxConcurrency: 1,
      sessionPoolOptions: {
        blockedStatusCodes: errorCodes,
      },
    });
  }

  #myHandler() {
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
    if (!this.#scrapper) {
      throw new Error('Create the scrapper first. call create().');
    }
    await this.#scrapper.run(this.#urlsInfo);
    return this.#outputObject;
  }
}
