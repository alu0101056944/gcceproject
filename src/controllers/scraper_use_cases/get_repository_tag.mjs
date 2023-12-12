/**
 * @author Marcos Barrios
 * @since 29_10_2023
 * @desc Testing github organization contributor amount scraper.
 */

'use strict';

import { inspect } from 'util';
import NamesToURLScraper from '../../routes/scrapers/names-to-urls-scraper.mjs';

export default async function addTags() {
  const allRepositories = [
    'facebook/react',
    'teidesat/SpaceRad-memory-test',
  ];

  const URL_PREFIX = 'https://github.com/';
  const URL_POSTFIX = '/tags';
  const scraperOrganizations = new NamesToURLScraper(
        {
          names: allRepositories,
          preUrl: URL_PREFIX,
          postUrl: URL_POSTFIX,
        },
        async ({ page, request, log, outputObject }) => {
          log.info('GithubTagScraper visited ' + request.url);

          const link = page.locator('a.Link--primary.Link');
          const allLinks = await link.all();
          if (allLinks.length > 0) {
            const VERSION_STRING = await allLinks[0].textContent();
            outputObject[request.label] = VERSION_STRING;
          }
        },
      );
  scraperOrganizations.create();
  const output = await scraperOrganizations.run();
  console.log(inspect(output));
}

// addTags();
