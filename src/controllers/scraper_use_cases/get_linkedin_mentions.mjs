/**
 * @author Marcos Barrios
 * @since 30_10_2023
 * @desc Get amount of mentions per specific name within job offers
 *    in linkedin.
 *
 */

'use strict';

import { inspect } from 'util';
import LinkedinMentionsScraper from '../../routes/scrapers/linkedin-mentions-scraper.mjs';

export default async function getAmountOfOffers() {
  const allToolNames = [
    'MySQL',
    'postgresql',
    'javascript',
    'sql'
  ];
  const scraperOfLinkedin = new LinkedinMentionsScraper(allToolNames);
  const mentionsObject = await scraperOfLinkedin.run();
  console.log(inspect(mentionsObject));
}

// getAmountOfOffers();
