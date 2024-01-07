/**
 * @author Marcos Barrios
 * @since 30_10_2023
 * @desc Scraper for
 *    {@link https://www.linkedin.com/jobs/search?keywords=software%20engineer}
 *
 */

'use strict';

import { PlaywrightCrawler, log } from 'crawlee';

/**
 * Scraper for {@link https://www.linkedin.com/jobs/search?keywords=software%20engineer}
 */
export default class LinkedinMentionsScraper {
  /** @private @constant  */
  #scraper = undefined;
  #outputObject = undefined;
  #toolNames = undefined;

  constructor(toolNames) {
    this.#outputObject = {};
    this.#toolNames = toolNames;
    for (const toolName of this.#toolNames) {
      this.#outputObject[toolName] = 0;
    }

    const requestHandler = this.#myHandler.bind(this);
    this.#scraper = new PlaywrightCrawler({
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

    let timeoutAttemptAmount = 0;
    for (const publication of allPublications) {
      await publication.click();

      const showMoreButton = page
          .locator('button.show-more-less-html__button.show-more-less-button' +
              '.show-more-less-html__button--more');
      const allShowMoreButtons = await showMoreButton.all();
      if (allShowMoreButtons.length > 0) {
        const attemptClick = async () => {
          await showMoreButton.click({ timeout: 2000 });

          const descriptionLocator =
              page.locator('.show-more-less-html__markup.relative.overflow-hidden');
          const DESCRIPTION_STRING = await descriptionLocator.textContent();
          const DESCRIPTION_STRING_PROCESSED = DESCRIPTION_STRING.trim();

          for (const name of this.#toolNames) {
            const nameRegExp = new RegExp(name, 'gi');
            let execResult;
            while (execResult = nameRegExp.exec(DESCRIPTION_STRING_PROCESSED)) {
              this.#outputObject[name]++;
            }
          }
        }

        try {
          await attemptClick();
        } catch (timeoutError) {
          log.info('Linkedin timeout while waiting for description to load.');

          // try again
          await allPublications[0].click({ timeout: 2000 });
          await attemptClick();
          await new Promise((resolve) => setTimeout(resolve, 500 * timeoutAttemptAmount));
          ++timeoutAttemptAmount;
        }
      } else {
        log.info('Did not find show button');
      }
    }
  }

  getOutputObject() {
    return this.#outputObject;
  }

  async run() {
    const URL = 'https://www.linkedin.com/jobs/search?keywords=software%20engineer';
    await this.#scraper.run([URL]);
    return this.#outputObject;
  }
}
