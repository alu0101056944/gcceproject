/**
 * @author Marcos Barrios
 * @since 23_10_2023
 * @desc Scrapper for a google trends webpage.
 *
 */

'use strict';

import { PlaywrightCrawler, log } from 'crawlee';

import { readFile } from 'fs/promises';

export default class GoogleTrendsScrapper {
  /** @private @constant  */
  #scrapper = undefined;
  #interestsPerTerm = undefined;
  #searchTermsInfo = undefined;

  constructor(searchTerms) {
    this.#interestsPerTerm = {};
    const toURL = (queryString) => {
        const PROCESSED = queryString.toLowerCase();
        return 'https://trends.google.es/trends/explore?date=today%205-y&geo=ES&q='
            + PROCESSED + '&hl=es';
      };

    // url and label keys so that I can later directly pass it to run()
    this.#searchTermsInfo =
        searchTerms.map(label => {
          return { url: toURL(label), label }
        });
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
      maxConcurrency: 2,
      // sessionPoolOptions: { // was put because first request was always 429
      //   blockedStatusCodes: [429],
      // },
      // maxRequestRetries: 2,
      // sameDomainDelaySecs: 2,
    });
  }

  /**
   * @todo Make it faster. For 20000 searches at 3 seconds per search
   *    it takes 111 minutes for completion.
   */
  async #myHandler({ page, request, response, enqueueLinks }) {
    if (response.status() !== 429) {
      const IS_THERE_ANY_ERROR = (await (page.getByText(/error/gi)).all()).length > 0;

      if (IS_THERE_ANY_ERROR) {
        log.error('GoogleTrendsScrapper: graph widget load error');
        enqueueLinks({
          url: request.url,
          label: request.label,
        })
      } else {
        const downloadCSVButton = page.locator('widget')
            .filter({ hasText: 'Interés a lo largo del tiempo' })
            .getByTitle('CSV');
        const downloadPromise = page.waitForEvent('download');
        await downloadCSVButton.click({ timeout: 5000 });
        const downloadObject = await downloadPromise;
        const DOWNLOADED_FILE_PATH = await downloadObject.path();
        const FILE_CONTENT = await readFile(DOWNLOADED_FILE_PATH, 'utf-8');

        const arrayOfInterests = [];
        const MAX_SIZE_OF_INTERESTS_ARRAY = 5; // I just want the latest interests
        const EXTRACT_TODAY_REG_EXP =
            /(?<year>\d\d\d\d)-(?<month>\d\d)-(?<day>\d\d),(?<interest>\d+)/g;
        let execResult;
        while (execResult = EXTRACT_TODAY_REG_EXP.exec(FILE_CONTENT)) {
          const INTEREST = parseInt(execResult.groups.interest);
          if (arrayOfInterests.length < MAX_SIZE_OF_INTERESTS_ARRAY) {
            arrayOfInterests.push(INTEREST);
          } else {
            arrayOfInterests.shift();
            arrayOfInterests.push(INTEREST);
          }
        }
        this.#interestsPerTerm[request.label] =
            arrayOfInterests.reduce((acc, current) => acc + current, 0);
      }
    }
  };

  getOutputObject() {
    return this.#interestsPerTerm;
  }

  async run() {
    await this.#scrapper.run(this.#searchTermsInfo);
    return this.#interestsPerTerm;
  }
}
