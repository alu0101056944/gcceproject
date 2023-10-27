/**
 * @author Marcos Barrios
 * @since 27_10_2023
 * @desc Scrapper for {@link https://companiesmarketcap.com/largest-companies-by-number-of-employees/}
 *
 */

'use strict';

import { PlaywrightCrawler, log } from 'crawlee';

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

  async #myHandler({ page, request, enqueueLinks }) {
    log.info('Visited page: ' + request.url);

    const rowLocator = page.locator('tbody').locator('tr');
    const rowsOfCompany = await rowLocator.all();
    for (const row of rowsOfCompany) {
      const companyNameLocator = row.locator('.company-name');
      const COMPANY_NAME = await companyNameLocator.textContent();

      const tdRightLocator = row.locator('td');
      const allTdRightLocators = await tdRightLocator.all();
      const AMOUNT_OF_EMPLOYEES_STRING = await allTdRightLocators[2].textContent();
      const IS_COMMA_SEPARATED_NUMBER_REG_EXP = /\d+,?\d+/
      if (IS_COMMA_SEPARATED_NUMBER_REG_EXP.test(AMOUNT_OF_EMPLOYEES_STRING)) {
        this.#companiesInfo[COMPANY_NAME] = parseInt(
          AMOUNT_OF_EMPLOYEES_STRING.replace(',', '').trim()
        );
      } else {
        this.#companiesInfo[COMPANY_NAME] = null;
      }
    }
    await enqueueLinks({
        regexps: [/largest-companies-by-number-of-employees\/page\/\d+\/$/],
        transformRequestFunction(nextRequest) {
          const PAGE_NUMBER_REG_EXP = /(?<page>\/page\/(?<currentpage>\d+)\/?)?/;

          const execResultA = PAGE_NUMBER_REG_EXP.exec(request.url);
          const CURRENT_PAGE_NUMBER = 
              execResultA.groups.page ? parseInt(execResultA.groups.currentpage) : 1;

          const execResultB = PAGE_NUMBER_REG_EXP.exec(nextRequest.url);
          const POTENTIAL_PAGE_NUMBER =
              execResultB.groups.page ? parseInt(execResultB.groups.currentpage) : 1;

          if (POTENTIAL_PAGE_NUMBER < CURRENT_PAGE_NUMBER) {
            return false;
          }
          return nextRequest;
        }
      });
  };

  getOutputObject() {
    return this.#companiesInfo;
  }

  async run() {
    const URL = 'https://companiesmarketcap.com/largest-companies-by-number-of-employees/';
    await this.#scrapper.run([URL]);
  }
}
