/**
 * @author Marcos Barrios
 * @since 12_11_2023
 * @desc Get an array of object with authorCompany and name properties as input,
 *    output an object where keys are repository name and values are numbers
 *    representing the commit amount.
 */

'use strict';

import NamesToURLScraper from '../../routes/scrapers/names-to-urls-scraper.mjs';

/**
 * @param {array} allRepository where each entry is an object with
 *    authorCompany and name properties.
 */
export default async function fetchAllCommitAmount(allPartialURL) {
  const URL_PREFIX = 'https://github.com/';
  const URL_POSTFIX = '';

  const scraperRepositoryInfo = new NamesToURLScraper(
    {
      names: allPartialURL,
      preUrl: URL_PREFIX,
      postUrl: URL_POSTFIX,
    },
    async ({ page, request, log, outputObject }) => {
      log.info('GithubInfoScraper visited ' + request.url);
      const commitTextRegExp = /(\d+?\,?\d+?)\s*Commits/i;
      const commitAmountLocator = page.getByRole('link')
          .getByText(commitTextRegExp);

      const AMOUNT_OF_COMMITS_STRING =
          (await commitAmountLocator.textContent())
          .match(commitTextRegExp)[1]
          .trim()
          .replace(/,/g, '');
      const AMOUNT_OF_COMMITS = parseInt(AMOUNT_OF_COMMITS_STRING);

      outputObject[request.label] = AMOUNT_OF_COMMITS;
    },
  );
  scraperRepositoryInfo.create([]);
  const partialURLToCommitAmount = await scraperRepositoryInfo.run();
  return partialURLToCommitAmount;
}
