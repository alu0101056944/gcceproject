/**
 * @author Marcos Barrios
 * @since 29_10_2023
 * @desc Extracting discussion frequency from r/programming.
 * 
 * 
 */

'use strict';

import { inspect } from 'util';
import NamesToURLScraper from '../../routes/scrapers/names-to-urls-scraper.mjs';

/**
 * 
 * @param {array} allToolNames example:
 *   const allToolNames = [
 *   'react',
 *   'ruby',
 *   'js'
 * ];
 */
export default async function countDiscussionAmount(allToolNames) {

  const URL_PREFIX = 'https://www.reddit.com/r/programming/search/?q=';
  const URL_POSTFIX = '&restrict_sr=1&sort=new';
  const scraperDiscussions = new NamesToURLScraper(
    {
      names: allToolNames,
      preUrl: URL_PREFIX,
      postUrl: URL_POSTFIX,
      doNameProcessing: false,
    },
    async ({ page, request, infiniteScroll, log, outputObject }) => {
      log.info('RedditDiscussionsScraper visited ' + request.url);

      const publication = page.locator('post-consume-tracker');
      let allPublications = await publication.all();
      await infiniteScroll({
        stopScrollCallback: async () => {
          allPublications = await publication.all();
          return allPublications.length > 20;
        }
      });

      // weekly discussions
      let count = 0;
      for (const publication of allPublications) {
        const postTimestamp = publication.locator('faceplate-timeago');
        const TIMESTAMP_STRING = await postTimestamp.textContent();
        const TIMESTAMP_STRING_PROCESSED = TIMESTAMP_STRING.trim();

        const REG_EXP = /(\d+)\s(day(s)?|month(s)?|year(s)?|hour(s)?|minute(s)?) ago/;
        const execResult = REG_EXP.exec(TIMESTAMP_STRING_PROCESSED);
        const AMOUNT = parseInt(execResult[1]);
        const TIME_SPECIFIER_STRING = execResult[2];

        if (TIME_SPECIFIER_STRING === 'days' && AMOUNT <= 7) {
          count++;
        }
      }

      outputObject[request.label] = count;
    },
  );
  scraperDiscussions.create();
  const output = await scraperDiscussions.run();
  return output;
}
