/**
 * @author Marcos Barrios
 * @since 12_11_2023
 * @desc Get an array of object with authorCompany and name properties as input,
 *    output an object where keys are repository name and values are numbers
 *    representing the commit amount.
 */

'use strict';

import NamesToURLScrapper from '../../routes/names-to-urls-scrapper.mjs';

/**
 * @param {array} allRepositoryInfo where each entry is an object with
 *    authorCompany and name properties.
 * @return {object} where keys are repo names and values are numbers for
 *    the commit amount.
 */
export default async function getCommitAmount(allRepositoryInfo) {
  const names = allRepositoryInfo
      .map(object => `${object.authorCompany}/${object.name}`);
  const URL_PREFIX = 'https://github.com/';
  const URL_POSTFIX = '';

  const scrapperRepositoryInfo = new NamesToURLScrapper(
      {
        names,
        preUrl: URL_PREFIX,
        postUrl: URL_POSTFIX,
      },
      async ({ page, request, log, outputObject }) => {
        log.info('GithubInfoScrapper visited ' + request.url);
        const commitsLocator = page.locator('span.d-none.d-sm-inline')
            page.locator('strong');
        const allcommitsLocator = await commitsLocator.all();

        const AMOUNT_OF_COMMITS_STRING =
            await allcommitsLocator[1].textContent();
        const AMOUNT_OF_COMMITS_PROCESSED =
            AMOUNT_OF_COMMITS_STRING.trim().replace(/,/g, '');
        const AMOUNT_OF_COMMITS = parseInt(AMOUNT_OF_COMMITS_PROCESSED);

        if (!outputObject[request.label]) {
          outputObject[request.label] = {}
        } 
        outputObject[request.label].commits = AMOUNT_OF_COMMITS;
      },
  );
  scrapperRepositoryInfo.create();
  const commitAmountsObject = await scrapperRepositoryInfo.run();
  return commitAmountsObject;
}
