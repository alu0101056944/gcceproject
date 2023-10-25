/**
 * @author Marcos Barrios
 * @since 23_10_2023
 * @desc Scrapper for a google trends webpage.
 *
 */

'use strict';

import { PlaywrightCrawler, enqueueLinks } from 'crawlee';

import { readFileSync } from 'fs';

export default class GoogleTrendsScrapper {
  /** @private @constant  */
  #scrapper = undefined;
  #outputObject = undefined;
  #accountInfo = undefined;
  #searchTerms = undefined;
  #searchTermsURLs = undefined;
  #hasLoggedIn = undefined;
  #hasAddedURLs = undefined;

  constructor(searchTerms) {
    this.#hasLoggedIn = false;
    this.#hasAddedURLs = false;
    this.#outputObject = {};
    this.#accountInfo = {};
    this.#searchTerms = searchTerms;
    try {
      const FILE_CONTENT =
          readFileSync('./playwright/.auth/account.json', 'utf-8');
      this.#accountInfo = JSON.parse(FILE_CONTENT);
      if (!this.#accountInfo.username || !this.#accountInfo.pass) {
        throw new Error('playwright/.auth/account.json does not contain a' +
          'and or pass key.');
      }
      console.log('Successfuly read account info from ' +
          'playwright/.auth/account.json');
    } catch (err) {
      console.error('Error while reading on GoogleTrendsScrapper: ' + err);
    }
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
      sameDomainDelaySecs: 3,
      maxConcurrency: 1,
      maxRequestRetries: 1,
    });
    const toURL = (queryString) => {
      const PROCESSED = queryString.toLowerCase();
      return 'https://trends.google.es/trends/explore?date=today%205-y&geo=ES&q='
          + PROCESSED + '&hl=es';
    };
    this.#searchTermsURLs = this.#searchTerms.map(term => toURL(term));
  }

  async #myHandler({ page }) {
    if (!this.#hasAddedURLs) {
      await this.#scrapper.addRequests(this.#searchTermsURLs);
      this.#hasAddedURLs = true;
      console.log('GoogleTrendsScrapper added url request for search terms.');
      await new Promise((r) => setTimeout(r, 6000));
    }
  };

  /** It was used in the request handler but getting captcha overtime, so
   *   leaving it unused.
   */
  async #loginIntoAccount(page) {
    const rejectCookiesButton = page.getByRole('button')
      .getByText('Rechazar todo');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await rejectCookiesButton.click();
    const loginButton = page.getByRole('link').getByText(/Iniciar/);
    await loginButton.click();
    await page.waitForURL(/accounts/);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const textfieldForEmail = page.locator('#identifierId');
    await textfieldForEmail.fill(this.#accountInfo.username);
    const buttonNext1 = page.getByRole('button').getByText(/Siguiente/);
    await buttonNext1.click();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const textfieldForPass = page.locator('input[name="Passwd"]');
    await textfieldForPass.fill(this.#accountInfo.pass);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const buttonNext2 = page.getByRole('button').getByText(/Siguiente/);
    await buttonNext2.click();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.#hasLoggedIn = true;
  }

  getOutputObject() {
    return this.#outputObject;
  }

  run() {
    (async () => {
      await this.#scrapper.run([this.#searchTermsURLs.pop()]);
    })();
  }
}
