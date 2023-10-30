/**
 * @author Marcos Barrios
 * @since 29_10_2023
 * @desc Testing github organization contributor amount scrapper.
 */

'use strict';

import { inspect } from 'util';
import NamesToURLScrapper from '../../routes/names-to-urls-scrapper.mjs';

export default async function addTags() {
  const allRepositories = [
    'facebook/react',
    'teidesat/SpaceRad-memory-test',
  ];

  const URL_PREFIX = 'https://github.com/';
  const URL_POSTFIX = '/tags';
  const scrapperOrganizations = new NamesToURLScrapper(
        {
          names: allRepositories,
          preUrl: URL_PREFIX,
          postUrl: URL_POSTFIX,
        },
        async ({ page, request, log, outputObject }) => {
          log.info('GithubTagScrapper visited ' + request.url);

          const link = page.locator('a.Link--primary.Link');
          const allLinks = await link.all();
          if (allLinks.length > 0) {
            const VERSION_STRING = await allLinks[0].textContent();
            outputObject[request.label] = VERSION_STRING;
          }
        },
      );
  scrapperOrganizations.create();
  const output = await scrapperOrganizations.run();
  console.log(inspect(output));
}

// addTags();
