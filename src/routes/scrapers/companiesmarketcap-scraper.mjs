/**
 * @author Marcos Barrios
 * @since 27_10_2023
 * @desc Scraper for {@link https://companiesmarketcap.com/largest-companies-by-number-of-employees/}
 *
 */

'use strict';

import { PlaywrightCrawler, log } from 'crawlee';

/**
 * Scraper for {@link https://companiesmarketcap.com/largest-companies-by-number-of-employees/}
 */
export default class CompaniesmarketcapScraper {
  /** @private @constant  */
  #scraper = undefined;
  #outputObject = undefined;

  /** @private */
  #maxPageSurfs = undefined;
  #currentAmountOfPagesSurfed = undefined;

  constructor() {
    this.#outputObject = {};
    // this.#maxPageSurfs = Infinity;
    this.#currentAmountOfPagesSurfed = 0;

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
      sessionPoolOptions: {
        blockedStatusCodes: [404],
      },
      maxRequestRetries: 2,
    });
  }

  async #myHandler({ page, request, enqueueLinks }) {
    log.info('CompaniesmarketcapScraper visited page: ' + request.url);
    this.#currentAmountOfPagesSurfed++;

    await page.waitForLoadState();

    const privacyButtonLocator = await page.getByRole('button')
        .filter({ hasText: 'Agree'});
    await privacyButtonLocator.click();

    const rowLocator = page.locator('tbody').locator('tr')
        .filter({ has: page.locator('td.name-td') });
    const rowsOfCompany = await rowLocator.all();
    for (const row of rowsOfCompany) {
      const companyNameLocator = row.locator('.company-name');
      const COMPANY_NAME = await companyNameLocator.textContent();
      const PROCESSED_COMPANY_NAME =
          COMPANY_NAME.replace(/\(.*\)/g, '').trim().toLowerCase();

      log.info('CompaniesmarketcapScraper process ' + PROCESSED_COMPANY_NAME);

      const tdRightLocator = row.locator('td');
      const allTdRightLocators = await tdRightLocator.all();
      const AMOUNT_OF_EMPLOYEES_STRING = await allTdRightLocators[2].textContent();
      const IS_COMMA_SEPARATED_NUMBER_REG_EXP = /\d+,?\d+/;
      if (IS_COMMA_SEPARATED_NUMBER_REG_EXP.test(AMOUNT_OF_EMPLOYEES_STRING)) {
        this.#outputObject[PROCESSED_COMPANY_NAME] = parseInt(
          AMOUNT_OF_EMPLOYEES_STRING.replace(/,/g, '').trim()
        );
      } else {
        this.#outputObject[PROCESSED_COMPANY_NAME] = null;
      }
    }
    if (this.#currentAmountOfPagesSurfed < this.#maxPageSurfs) {
      log.info('CompaniesmarketcapScraper enqueue more links');
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
            log.info('CompaniesmarketcapScraper to pass to next page');
            return false;
          }
          return nextRequest;
        }
      });
    }
  };

  /**
   * @param {number} newMaxAmountOfPageSurfs 
   */
  setMaxAmountfPageSurfs(newMaxAmountOfPageSurfs) {
    this.#maxPageSurfs = newMaxAmountOfPageSurfs;
  }

  async run() {
    const URL = 'https://companiesmarketcap.com/largest-companies-by-number-of-employees/';
    await this.#scraper.run([URL]);
    return this.#outputObject;
  }
}
