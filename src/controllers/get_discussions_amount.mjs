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

export default async function countDiscussionAmount() {
  const allToolNames = [
    'react',
    'ruby',
    'js'
  ];

  const URL_PREFIX = 'https://www.reddit.com/r/programming/search/?q=';
  const URL_POSTFIX = '&restrict_sr=1&sort=new';
  const scrapperDiscussions = new NamesToURLScrapper(
        {
          names: allToolNames,
          preUrl: URL_PREFIX,
          postUrl: URL_POSTFIX,
          doNameProcessing: false,
        },
        async ({ page, request, log, outputObject }) => {
          log.info('RedditDiscussionsScrapper visited ' + request.url);

          const publication = page.locator('._2dkUkgRYbhbpU_2O2Wc5am');
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
            const postTimestamp = publication.getByTestId('post_timestamp');
            const TIMESTAMP_STRING = await postTimestamp.textContent();
            const TIMESTAMP_STRING_PROCESSED = TIMESTAMP_STRING.trim();

            const REG_EXP = /hace\s(\d+)\s(día(s)?|mes(es)?|año(s)?)/;
            const execResult = REG_EXP.exec(TIMESTAMP_STRING_PROCESSED);
            const AMOUNT = parseInt(execResult[1]);
            const TIME_SPECIFIER_STRING = execResult[2];

            if (TIME_SPECIFIER_STRING === 'días' && AMOUNT <= 7) {
              count++;
            }
          }

          outputObject[request.label] = count;
        },
      );
  scrapperDiscussions.create();
  const output = await scrapperDiscussions.run();
  console.log(inspect(output));
}

countDiscussionAmount();
