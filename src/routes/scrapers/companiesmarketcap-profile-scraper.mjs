/**
 * @author Marcos Barrios
 * @since 27_10_2023
 * @desc Scraper for company profiles.
 * 
 * Example: {@link https://companiesmarketcap.com/amazon/marketcap/}
 *
 */

'use strict';

import { PlaywrightCrawler, log } from 'crawlee';

/**
 * Scraper for company profile pages like {@link https://companiesmarketcap.com/amazon/marketcap/}
 */
export default class CompaniesmarketcapProfileScraper {
  /** @private @constant  */
  #scraper = undefined;
  #companiesInfo = undefined;
  #outputObject = undefined;

  /**
   * @param {object} companyNames array of strings with the company names
   */
  constructor(companyNames) {
    this.#outputObject = {};

    const toURL = (url) => {
      const PROCESSED_URL = url.replace(/\s/g, '-').toLowerCase();
      return `https://companiesmarketcap.com/${PROCESSED_URL}/marketcap/`;
    }
    this.#companiesInfo = companyNames.map(name => {
      return {
        url: toURL(name),
        label: name, 
      }
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
    });
  }

  async #myHandler({ page, request }) {
    log.info('CompaniesmarketcapProfileScraper visited page: ' + request.url);

    const categoriesContainerLocator = page.locator('.info-box.categories-box')
        .locator('.badge.badge-light');
    const allCategoryBadges = await categoriesContainerLocator.all();
    const categories = [];
    for (const badge of allCategoryBadges) {
      const CATEGORY = await badge.textContent();
      const NON_EMOJI_REG_EXP = /[\x00-\x7F]+/u;
      const PROCESSED_CATEGORY = NON_EMOJI_REG_EXP.exec(CATEGORY)[0].trim();
      categories.push(PROCESSED_CATEGORY);
    }

    const GITHUB_COMPATIBLE_NAME = request.label.replace(/-/g, '');
    this.#outputObject[GITHUB_COMPATIBLE_NAME] = categories.shift() ?? null;
  };

  getOutputObject() {
    return this.#outputObject;
  }

  async run() {
    await this.#scraper.run(this.#companiesInfo);
  }
}
