/**
 * @author Marcos Barrios
 * @since 27_10_2023
 * @desc Scrapper for {@link https://companiesmarketcap.com/largest-companies-by-number-of-employees/}
 *
 */

'use strict';

import { PlaywrightCrawler, enqueueLinks } from 'crawlee';

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
      // keepAlive: true, // to temporarily debug the console messages
    });
  }

  async #myHandler({ page, request, enqueueLinks }) {
    const rowLocator = page.locator('tbody').locator('tr');
    const rowsOfCompany = await rowLocator.all();
    for (const row of rowsOfCompany) {
      const companyNameLocator = row.locator('.company-name');
      const COMPANY_NAME = await companyNameLocator.textContent();
      const tdRightLocator = row.locator('td');
      const allTdRightLocators = await tdRightLocator.all();
      const AMOUNT_OF_EMPLOYEES_STRING = await allTdRightLocators[2].textContent();
      const AMOUNT_OF_EMPLOYEES = parseInt(
          AMOUNT_OF_EMPLOYEES_STRING.replace(',', '').trim()
        );
      this.#companiesInfo[COMPANY_NAME] = AMOUNT_OF_EMPLOYEES;
    }
    await enqueueLinks({
      globs: ['https://companiesmarketcap.com/largest-companies-by-number-of-employees/*'],
      transformRequestFunction(nextRequest) {
        // ignore all links ending with `.pdf`
        const PAGE_NUMBER_REG_EXP =
            /(?<page>\/page\/(?<currentpage>\d+)\/?)?/;
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
