/**
 * @author Marcos Barrios
 * @since 02_01_2024
 * @description Get the total amount of issues of a github repository.
 * 
 */

'use strict';

import NamesToURLScraper from "../../routes/scrapers/names-to-urls-scraper.mjs";

/**
 * @param {array} allPartialURL each element is expected to be a string in
 *    <organization>/<repoName> format, for example: facebook/react for
 *    github.com/facebook/react
 */
export default async function getAllIssueAmountsObject(allPartialURL) {
  const URL_PREFIX = 'https://github.com/';
  const URL_POSTFIX = '/issues';
  const scraper = new NamesToURLScraper(
    {
      names: allPartialURL,
      preUrl: URL_PREFIX,
      postUrl: URL_POSTFIX,
    },
    async ({ page, request, log, outputObject }) => {
      log.info('Scraper for github issues on community-tool table visited ' +
          request.url);

      outputObject[request.label] = {
        open: 0,
        closed: 0,
        total: 0,
      };
      
      const parseIssueAmount = async (state) => {
        const summaryOpenLinkLocator = page.getByRole('link')
            .filter({ hasText: new RegExp(`((\\d+?),?)+\\s+${state}`, 'i') });
        const ISSUES_STRING = await summaryOpenLinkLocator.textContent();
        const AMOUNT = parseInt(ISSUES_STRING.trim().replace(/,/g, ''));
        return AMOUNT;
      }

      const AMOUNT_OF_OPEN_ISSUES = await parseIssueAmount('Open') ?? 0;
      const AMOUNT_OF_CLOSED_ISSUES = await parseIssueAmount('Closed') ?? 0;
      const TOTAL_ISSUES = AMOUNT_OF_CLOSED_ISSUES + AMOUNT_OF_OPEN_ISSUES;
      outputObject[request.label].open = AMOUNT_OF_OPEN_ISSUES;
      outputObject[request.label].closed = AMOUNT_OF_CLOSED_ISSUES;
      outputObject[request.label].total = TOTAL_ISSUES;
    },
  );
  scraper.create([]);
  const partialURLToAmountsObject = await scraper.run();
  return partialURLToAmountsObject;
}