/**
 * @author Marcos Barrios
 * @since 23_10_2023
 * @desc Scrapper for a google trends webpage.
 *
 */

'use strict';

import { PlaywrightCrawler, purgeDefaultStorages } from 'crawlee';

import { readFileSync } from 'fs';

export default class GoogleTrendsScrapper {
  /** @private @constant  */
  #scrapper = undefined;
  #url = undefined;
  #outputObject = undefined;
  #accountInfo = undefined;

  constructor(url) {
    this.#url = url;
    this.#outputObject = {};
    this.#accountInfo = {};
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
    const rejectCookiesButton = page.getByRole('button')
        .getByText('Rechazar todo');
    await new Promise((resolve) => setTimeout(resolve, 4000));
    await rejectCookiesButton.click();
    const loginButton = page.getByRole('a').getByText(/Iniciar/);
    await loginButton.click();
    await page.waitForURL(/accounts/);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const textfieldForEmail = page.locator('#identifierId');
    await textfieldForEmail.fill(this.#accountInfo.username);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const textfieldForPass = page.locator('input[name="Passwd"]');
    await textfieldForPass.fill(this.#accountInfo.pass);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const buttonNext = page.getByRole('button').getByText(/Siguiente/);
    await buttonNext.click();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  getOutputObject() {
    return this.#outputObject;
  }

  run() {
    (async () => {
      await this.#scrapper.run([this.#url]);
    })();
  }
}
