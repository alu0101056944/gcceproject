/**
 * @author Marcos Barrios
 * @since 23_10_2023
 * @desc Scrapper for a google trends webpage.
 *
 */

'use strict';

import { PlaywrightCrawler, purgeDefaultStorages } from 'crawlee';

export default class GithubExploreScrapper {
  /** @private @constant  */
  #scrapper = undefined;
  #url = undefined;
  #outputObject = undefined;

  constructor(url) {
    this.#url = url;
    this.#outputObject = {};
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
    });
  }

  async #myHandler({ page, request, enqueueLinks, infiniteScroll}) {
    await purgeDefaultStorages();
    
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
