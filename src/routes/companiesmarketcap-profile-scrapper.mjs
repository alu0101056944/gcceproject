/**
 * @author Marcos Barrios
 * @since 27_10_2023
 * @desc Scrapper for company profiles.
 * 
 * Example: {@link https://companiesmarketcap.com/amazon/marketcap/}
 *
 */

'use strict';

import { PlaywrightCrawler, enqueueLinks, log } from 'crawlee';

/**
 * Scrapper for company profile pages like {@link https://companiesmarketcap.com/amazon/marketcap/}
 */
export default class CompaniesmarketcapProfileScrapper {
  /** @private @constant  */
  #scrapper = undefined;
  #companiesInfo = undefined;
  #outputObject = undefined;

  /**
   * @param {object} companyNames array of strings with the company names
   */
  constructor(companyNames) {
    this.#outputObject = {};

    const toURL = (url) => {
      const PROCESSED_URL = url.replace(' ', '-').toLowerCase();
      return `https://companiesmarketcap.com/${PROCESSED_URL}/marketcap/`;
    }
    this.#companiesInfo = companyNames.map(name => {
      return {
        url: toURL(name),
        label: name, 
      }
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
    });
  }

  async #myHandler({ page, request }) {
    log.info('CompaniesmarketcapProfileScrapper visited page: ' + request.url);

    const categoriesContainerLocator = page.locator('.info-box.categories-box')
        .locator('.badge.badge-light');
    const allCategoryBadges = await categoriesContainerLocator.all();
    const categories = [];
    for (const badge of allCategoryBadges) {
      const CATEGORY = await badge.textContent();
      categories.push(CATEGORY);
    }
    const UNPROCESSED_NAME = request.label.replace('-', ' ');
    this.#outputObject[UNPROCESSED_NAME] = categories.pop() ?? null;
  };

  getOutputObject() {
    return this.#companiesInfo;
  }

  async run() {
    await this.#scrapper.run(this.#companiesInfo);
  }
}
