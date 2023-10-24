/**
 * @author Marcos Barrios
 * @since 23_10_2023
 * @desc Scrapper for a google trends webpage.
 *
 */

'use strict';

import { PlaywrightCrawler } from 'crawlee';

import { readFileSync } from 'fs';

export default class GoogleTrendsScrapper {
  /** @private @constant  */
  #scrapper = undefined;
  #outputObject = undefined;
  #accountInfo = undefined;
  #searchTermsArray = undefined;

  constructor(searchTermsArray) {
    this.#outputObject = {};
    this.#accountInfo = {};
    this.#searchTermsArray = searchTermsArray;
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
    });
  }

  async #myHandler({ page }) {
    await this.#loginIntoAccount(page);
    // await page.goto('https://trends.google.es/');
    // const searchBar = page.getByRole('input').locator('#i9');
    // await searchBar.fill(this.#searchTermsArray.pop());
    // const buttonExplore = page.getByRole('button').getByText(/Explorar/);
    // await buttonExplore.click();
    const toURL = (queryString) => {
      const PROCESSED = queryString.toLowerCase();
      return 'https://trends.google.es/trends/explore?date=today%205-y&geo=ES&q='
          + PROCESSED + '&hl=es';
    };
    while (this.#searchTermsArray.length > 0) {
      await page.goto(toURL(this.#searchTermsArray.pop()));
      await page.waitForURL(/explore?/);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  };

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
  }

  getOutputObject() {
    return this.#outputObject;
  }

  run() {
    (async () => {
      await this.#scrapper.run(['https://google.com']);
    })();
  }
}
