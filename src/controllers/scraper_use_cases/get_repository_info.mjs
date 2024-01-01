/**
 * @author Marcos Barrios
 * @since 30_10_2023
 * 
 */

'use strict';

import NamesToURLScraper from '../../routes/scrapers/names-to-urls-scraper.mjs';

export default async function getInfo(allRepository) {
  const URL_PREFIX = 'https://github.com/';
  const URL_POSTFIX = '';
  const scraperRepositoryInfo = new NamesToURLScraper(
    {
      names: allRepository,
      preUrl: URL_PREFIX,
      postUrl: URL_POSTFIX,
    },
    async ({ page, request, log, outputObject }) => {
      log.info('GithubInfoScraper visited ' + request.url);
      const commitsLocator = page.locator('span.d-none.d-sm-inline')
          page.locator('strong');
      const allcommitsLocator = await commitsLocator.all();

      const AMOUNT_OF_COMMITS_STRING =
          await allcommitsLocator[1].textContent();
      const AMOUNT_OF_COMMITS_PROCESSED = AMOUNT_OF_COMMITS_STRING.trim()
          .replace(/,/g, '');
      const AMOUNT_OF_COMMITS = parseInt(AMOUNT_OF_COMMITS_PROCESSED);

      outputObject[request.label] ??= {};
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
