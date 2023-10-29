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
   * @param {object} companyNames array of strings representing project names
   * @param {string} preUrl prefix of the final url on left side of the project
   *    name part.
   * @param {string} postUrl postfix of the final url on left side of the project
   *    name part.
   * @param {function} callback What is going to be called inside the
   *    requestHandler. It has an outputObject parameter available.
   */
  constructor(projectNames, preUrl, postUrl = '', callback) {
    this.#outputObject = {};
    this.#callback = callback;

    const toURL = (projectName) => {
      const PROCESSED_PROJECT_NAME = projectName.replace(/\s/, '-');
      return `${preUrl}${PROCESSED_PROJECT_NAME}${postUrl}`;
    }
    this.#urlsInfo = projectNames.map((name) => {
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
