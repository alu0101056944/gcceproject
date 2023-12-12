/**
 * @author Marcos Barrios
 * @since 30_10_2023
 */

'use strict';

import { inspect } from 'util';
import NamesToURLScraper from '../../routes/scrapers/names-to-urls-scraper.mjs';

export default async function addInfo() {
  const allRepositories = [
    'facebook/react',
    'teidesat/SpaceRad-memory-test',
  ];

  const URL_PREFIX = 'https://github.com/';
  const URL_POSTFIX = '';
  const scraperRepositoryInfo = new NamesToURLScraper(
        {
          names: allRepositories,
          preUrl: URL_PREFIX,
          postUrl: URL_POSTFIX,
        },
        async ({ page, request, log, outputObject }) => {
          log.info('GithubInfoScraper visited ' + request.url);
          const commitsLocator = page.locator('span.d-none.d-sm-inline')
              page.locator('strong');
          const allcommitsLocator = await commitsLocator.all();

          const AMOUNT_OF_COMMITS_STRING =
              await allcommitsLocator[1].textContent();
          const AMOUNT_OF_COMMITS_PROCESSED = AMOUNT_OF_COMMITS_STRING.trim()
              .replace(/,/g, '');
          const AMOUNT_OF_COMMITS = parseInt(AMOUNT_OF_COMMITS_PROCESSED);

          if (!outputObject[request.label]) {
            outputObject[request.label] = {}
          } 
          outputObject[request.label].commits = AMOUNT_OF_COMMITS;
        },
      );
  scraperRepositoryInfo.create();
  const output = await scraperRepositoryInfo.run();
  console.log(inspect(output));
}

// addInfo();
