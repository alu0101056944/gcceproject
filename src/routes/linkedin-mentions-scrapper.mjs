/**
 * @author Marcos Barrios
 * @since 30_10_2023
 * @desc Scrapper for
 *    {@link https://www.linkedin.com/jobs/search?keywords=software%20engineer}
 *
 */

'use strict';

import { PlaywrightCrawler, log } from 'crawlee';

/**
 * Scrapper for {@link https://www.linkedin.com/jobs/search?keywords=software%20engineer}
 */
export default class LinkedinMentionsScrapper {
  /** @private @constant  */
  #scrapper = undefined;
  #outputObject = undefined;
  #toolNames = undefined;

  constructor(toolNames) {
    this.#outputObject = {};
    this.#toolNames = toolNames;

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
        blockedStatusCodes: [],
      },
    });
  }

  async #myHandler({ page, request, infiniteScroll }) {
    log.info('Linkedin software engineer search: ' + request.url);

    const publication = page.locator('.base-card');
    let allPublications = await publication.all();
    await infiniteScroll({
      stopScrollCallback: async () => {
        allPublications = await publication.all();
        return allPublications.length > 20;
      }
    });

    for (const publication of allPublications) {
      await publication.click();
      // await page.waitForTimeout(3000000);
      
      const showMoreButton = page.getByRole('button').getByText(/Show.*more/);
      const amountOfShowButtons = await showMoreButton.all();
      if (amountOfShowButtons.length > 0) {
        await showMoreButton.click();
        await new Promise((resolve) => setTimeout(resolve, 7000));

        const descriptionLocator =
            page.locator('.show-more-less-html__markup.relative.overflow-hidden');
        const DESCRIPTION_STRING = await descriptionLocator.textContent();
        const DESCRIPTION_STRING_PROCESSED = DESCRIPTION_STRING.trim();
        
        for (const name of this.#toolNames) {
          const nameRegExp = new RegExp(name, 'gi');
          let execResult;
          while (execResult = nameRegExp.exec(DESCRIPTION_STRING_PROCESSED)) {
            if (!this.#outputObject[name]) {
              this.#outputObject[name] = 0;
            }
            this.#outputObject[name]++;
          }
        }
      }
    }

  }

  getOutputObject() {
    return this.#outputObject;
  }

  async run() {
    const URL = 'https://www.linkedin.com/jobs/search?keywords=software%20engineer';
    await this.#scrapper.run([URL]);
    return this.#outputObject;
  }
}
