/**
 * @author Marcos Barrios
 * @since 27_10_2023
 * @desc Scrapper for {@link https://companiesmarketcap.com/largest-companies-by-number-of-employees/}
 *
 */

'use strict';

import { PlaywrightCrawler } from 'crawlee';

/**
 * Scrapper for {@link https://companiesmarketcap.com/largest-companies-by-number-of-employees/}
 */
export default class CompaniesmarketcapScrapper {
  /** @private @constant  */
  #scrapper = undefined;
  #companiesInfo = undefined;

  constructor() {
    this.#companiesInfo = {};
    const requestHandler = this.#myHandler.bind(this);
    this.#scrapper = new PlaywrightCrawler({
      headless: false,
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
        blockedStatusCodes: [429],
      },
      maxRequestRetries: 2,
      sameDomainDelaySecs: 2,
      keepAlive: true, // to temporarily debug the console messages
    });
  }

  async #myHandler({ page, request, response }) {
    const rowsOfCompany = page.getByRole('tr');
    this.#companiesInfo = await rowsOfCompany.evaluateAll((rows) => {
        const companiesInfo = {};
        for (let row of rows) {
          const children = row.children;
          const COMPANY_NAME = children[1].querySelector('.company-name')
              .textContent;
          const EMPLOYEE_AMOUNT = parseInt(children[2].textContent.trim()
              .replace(',', '.'));
          companiesInfo.push({
            company: COMPANY_NAME,
            amount: EMPLOYEE_AMOUNT,
          });
        }
        return companiesInfo;
      });
    console.log();
  };

  getOutputObject() {
    return this.#companiesInfo;
  }

  async run() {
    const URL = 'https://companiesmarketcap.com/largest-companies-by-number-of-employees/';
    await this.#scrapper.run([URL]);
  }
}
