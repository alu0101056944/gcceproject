/**
 * @author Marcos Barrios
 * @since 28_10_2023
 * @desc Scraping simple download pages like NPMJS and PYPISTATS.
 */

'use strict';

import { inspect } from 'util';
import NPMJSScraper from '../../routes/scrapers/npmjs-scraper.mjs';
import NamesToURLScraper from '../../routes/scrapers/names-to-urls-scraper.mjs';

export default async function getDownloadsPerPackage(packageNames) {
  // const packageNames = [
  //   'react',
  //   'eslint-plugin-react',
  // ];

  // If a package is present on more than one programming language, then
  // get the one with the most downloads
  // for example:
  //  react is in npmjs and pypi, but pypi's is an impersonification.

  const scraperNPM = new NPMJSScraper(packageNames);
  const allNpmjsPackageDownloads = await scraperNPM.run();

  const URL_PREFIX = 'https://pypistats.org/packages/';
  const URL_POSTFIX = '';
  const scraperPython = new NamesToURLScraper(
    {
      names: packageNames,
      preUrl: URL_PREFIX,
      postUrl: URL_POSTFIX,
    },
    async ({ page, request, log, outputObject }) => {
      log.info('PythonScraper visited ' + request.url);

      try {
        const containsSearchResultsStrings = page.getByText('Search results');
        const paragraphWithDownloads = page.getByText('Downloads last week:');
          
        const eitherTextcontentOrUndefined = await Promise.any([
                containsSearchResultsStrings.waitFor(),
                paragraphWithDownloads.textContent(),
              ]);
        if (eitherTextcontentOrUndefined) {
          const DOWNLOADS_LAST_WEEK_STRING =
              /Downloads\slast\sweek:\s(\d+(,?\d+)*)+/
                .exec(eitherTextcontentOrUndefined)[1];
          const DOWNLOADS_LAST_WEEK =
              parseInt(DOWNLOADS_LAST_WEEK_STRING.replace(/,/g, ''));
          outputObject[request.label] = DOWNLOADS_LAST_WEEK;
        }
      } catch (error) {
        log.error('Python scraper error: ' + error);
      }
    },
  );
  scraperPython.create([500]);
  const allPythonPackageDownloads = await scraperPython.run();

  const allScraperResults = [
    allPythonPackageDownloads,
    allNpmjsPackageDownloads
  ];

  const packageDownloads = {};
  for (const scraperResult of allScraperResults) {
    const packageNames = Object.getOwnPropertyNames(scraperResult);             
    for (const name of packageNames) {
      packageDownloads[name] =
            Math.max(packageDownloads[name] ?? 0, scraperResult[name]);
    }
  }

  return packageDownloads;
}
