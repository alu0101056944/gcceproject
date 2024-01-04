/**
 * @author Marcos Barrios
 * @since 02_01_2024
 * @desc Get the general sentiment about a tool by processing comments and posts.
 *
 */

'use strict';

import RedditPostsScrapper from '../../routes/scrapers/reddit-posts-scraper.mjs';

export default async function getAllToolSentiment(toolTable) {
  const allTotalSentiment = [];
  for (const toolRecord of toolTable) {
    const toURL = (toolName) => `https://www.reddit.com/r/programming/search/?q=${toolName}&restrict_sr=1&sort=new`;
    const scraper = new RedditPostsScrapper(toURL(toolRecord.name));
    const allSentiment = await scraper.run();
    allTotalSentiment.push(allSentiment.reduce((acc, sent) => acc + sent, 0));
  }
  return allTotalSentiment;
}
