/**
 * @author Marcos Barrios
 * @since 02_01_2023
 * @desc Scraper for {@link https://www.reddit.com/r/programming/search/?q=react&restrict_sr=1&sort=new}
 *
 */

'use strict';

import { PlaywrightCrawler, log } from 'crawlee';

/**
 * Scraper for {@link https://www.reddit.com/r/programming/search/?q=react&restrict_sr=1&sort=new}
 */
export default class RedditPostsScrapper {
  /** @private @constant  */
  #scraper = undefined;
  #companiesInfo = undefined;
  #outputObject = undefined;
  #urlsInfo = undefined;

  constructor() {
    this.#companiesInfo = {};

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
    log.info('RedditPostsScrapper visited page: ' + request.url);

    await page.waitForLoadState();

    /** SEPARATE INTO TWO SCRAPPERS DUE TO ALL PAGES HAVING /r/.../comments/ */

    // const publication = page.locator('post-consume-tracker');
    // let allPublications = await publication.all();
    // await infiniteScroll({
    //   stopScrollCallback: async () => {
    //     allPublications = await publication.all();
    //     return allPublications.length > 20;
    //   }
    // });

    await enqueueLinks({ regexps: [/\/r\/\w+?\/comments\//] });
  };

  getOutputObject() {
    return this.#outputObject;
  }

  async run() {
    await this.#scraper.run(this.#urlsInfo);
    return this.#outputObject;
  }
}
