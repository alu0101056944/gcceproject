/**
 * @author Marcos Barrios
 * @since 30_10_2023
 * @desc Get all total amount of market offers from linkedin
 *
 */

'use strict';

import { inspect } from 'util';
import NamesToURLScraper from '../../routes/scrapers/names-to-urls-scraper.mjs';

export default async function getAmountOfOffers() {
  const allCompanyNames = [
    'Software Engineer'
  ];

  const URL_PREFIX = 'https://www.linkedin.com/jobs/search?keywords=';
  const URL_POSTFIX = '';
  const scraperOffers = new NamesToURLScraper(
        {
          names: allCompanyNames,
          preUrl: URL_PREFIX,
          postUrl: URL_POSTFIX,
          doNameProcessing: false,
        },
        async ({ page, request, log, outputObject }) => {
          log.info('Linkedin amount of offers scraper visited ' + request.url);
          const jobCountLocator =
              page.locator('.results-context-header__job-count');
          const JOB_COUNT_STRING = await jobCountLocator.textContent();
          const JOB_COUNT_STRING_PROCESSED = JOB_COUNT_STRING
              .trim().replace(/\,/g, '').replace(/\+/g, '');
          const JOB_COUNT = parseInt(JOB_COUNT_STRING_PROCESSED);
          outputObject.count = JOB_COUNT;
        },
      );
  scraperOffers.create();
  const output = await scraperOffers.run();
  console.log(inspect(output));
}

// getAmountOfOffers();
