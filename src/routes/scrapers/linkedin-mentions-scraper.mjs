/**
 * @author Marcos Barrios
 * @since 30_10_2023
 * @desc Scraper for
 *    {@link https://www.linkedin.com/jobs/search?keywords=software%20engineer}
 *
 */

'use strict';

import { PlaywrightCrawler, log } from 'crawlee';
import playwright from 'playwright';

/**
 * Scraper for {@link https://www.linkedin.com/jobs/search?keywords=software%20engineer}
 */
export default class LinkedinMentionsScraper {
  /** @private @constant  */
  #scraper = undefined;
  #outputObject = undefined;
  #allToolName = undefined;

  constructor(allToolName) {
    this.#outputObject = {};
    this.#allToolName = allToolName;
    for (const toolName of this.#allToolName) {
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
    log.info('Linkedin software engineer mention count scraper has visited: ' +
        request.url);

    await page.waitForLoadState();
    
    const publication = page.locator('.base-card');
    let allPublications = await publication.all();
    let previousLength = allPublications.length;
    let timesUnchanged = 0;
    await infiniteScroll({
      stopScrollCallback: async () => {
        allPublications = await publication.all();
        previousLength = allPublications.length;
        if (allPublications.length === previousLength) {
          ++timesUnchanged;
        }
        if (timesUnchanged > 3) {
          return true;
        }
        return allPublications.length > 200;
      }
    });

    log.info('Linkedin start surfing publications.');
    for (const publication of allPublications) {
      log.info('Linkedin next publication.');

      await publication.click();
      const showMoreButton = page
          .locator('button.show-more-less-html__button.show-more-less-button' +
              '.show-more-less-html__button--more');

      const attemptShowMoreButtonClick = async () => {
        log.info('Linkedin button click attempt.');
        await showMoreButton.click({ timeout: 2000 });

        const descriptionLocator = page
            .locator('.show-more-less-html__markup.relative.overflow-hidden');
        const DESCRIPTION_STRING = await descriptionLocator.textContent();
        const DESCRIPTION_STRING_PROCESSED = DESCRIPTION_STRING.trim();

        for (const toolName of this.#allToolName) {
          const nameRegExp = new RegExp(toolName, 'gi');
          let execResult;
          while (execResult = nameRegExp.exec(DESCRIPTION_STRING_PROCESSED)) {
            this.#outputObject[toolName]++;
          }
        }
      }

      const clickLoop = async () => {
        try {
          await attemptShowMoreButtonClick();
        } catch (error) {
          if (error instanceof playwright.errors.TimeoutError) {
            log.info('Linkedin timeout while waiting for a show button to load.');
            
            const RANDOM_DELAY = Math.floor(Math.random() * 2000);
            const RANDOM_INDEX =
                Math.floor(Math.random() * (allPublications.length - 1));

            // click another publication and then retry the original publication
            await new Promise((resolve) => setTimeout(resolve, RANDOM_DELAY));
            await allPublications[RANDOM_INDEX].click({ timeout: 2000 });

            const RANDOM_DELAY2 = Math.floor(Math.random() * 2000);
            await new Promise((resolve) => setTimeout(resolve, RANDOM_DELAY2));
            await publication.click();
            await clickLoop();
          }
        }
      }

      await clickLoop();
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
