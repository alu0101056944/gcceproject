/**
 * @author Marcos Barrios
 * @since 29_10_2023
 * @desc Extracting discussion frequency from r/programming.
 * 
 * 
 */

'use strict';

import { inspect } from 'util';
import NamesToURLScrapper from '../routes/names-to-urls-scrapper.mjs';

export default async function addTags() {
  const allToolNames = [
    'react',
    'ruby',
    'js'
  ];

  const URL_PREFIX = 'https://www.reddit.com/r/programming/search/?q=';
  const URL_POSTFIX = '&restrict_sr=1&sort=new';
  const scrapperOrganizations = new NamesToURLScrapper(
        {
          names: allToolNames,
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

addTags();
