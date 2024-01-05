/**
 * @author Marcos Barrios
 * @since 30_10_2023
 * 
 */

'use strict';

import NamesToURLScraper from '../../routes/scrapers/names-to-urls-scraper.mjs';

export default async function getInfo(allPartialURL) {
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
      page.setDefaultTimeout(3000);

      outputObject[request.label] ??= { commits: null, version: null };

      const commitTextRegExp = /(\d+?\,?\d+?)\s*Commits/i;
      const commitAmountLocator = page.getByRole('link')
          .getByText(commitTextRegExp);

      const AMOUNT_OF_COMMITS_STRING =
          (await commitAmountLocator.textContent())
          .match(commitTextRegExp)[1]
          .trim()
          .replace(/,/g, '');
      const AMOUNT_OF_COMMITS = parseInt(AMOUNT_OF_COMMITS_STRING);
      outputObject[request.label].commits = AMOUNT_OF_COMMITS;

      const authorCompanyAndName = request.label.split('/');

      const releasesTitleLocator = page.getByRole('heading')
          .filter({ hasText: 'Releases'})
      const releasesTitleContainerLocator =
          releasesTitleLocator.locator('..');
      const linkLocator =
          releasesTitleContainerLocator.getByRole('link');
      const allLinkLocator = await linkLocator.all();
      for (let i = 0; i < allLinkLocator.length; i++) {
        const HREF_STRING = await ((allLinkLocator[i]).getAttribute('href'));
        const releaseLinkRegExp = /\/(\w+?)\/(\w+?)\/releases\/tag/;
        const regExpResult = HREF_STRING.match(releaseLinkRegExp);
        if (regExpResult &&
            regExpResult[1] === authorCompanyAndName[0] &&
            regExpResult[2] === authorCompanyAndName[1]) {
          const RELEASE_VERSION =
              (await ((allLinkLocator[i]).textContent())).trim();
          outputObject[request.label].version = RELEASE_VERSION;
        }
      }
    },
  );
  scraperRepositoryInfo.create();
  const output = await scraperRepositoryInfo.run();
  return output;
}
