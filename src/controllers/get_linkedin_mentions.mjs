/**
 * @author Marcos Barrios
 * @since 30_10_2023
 * @desc Get amount of mentions per specific name within job offers
 *    in linkedin.
 *
 */

'use strict';

import { inspect } from 'util';
import LinkedinMentionsScrapper from '../routes/linkedin-mentions-scrapper.mjs';

export default async function getAmountOfOffers() {
  const allToolNames = [
    'MySQL',
    'postgresql',
    'javascript',
    'sql'
  ];
  const scrapperOfLinkedin = new LinkedinMentionsScrapper(allToolNames);
  const mentionsObject = await scrapperOfLinkedin.run();
  console.log(inspect(mentionsObject));
}

getAmountOfOffers();
