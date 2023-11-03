/**
 * @author Marcos Barrios
 * @since 28_10_2023
 * @desc Scrapping simple download pages like NPMJS and PYPISTATS.
 */

'use strict';

import { inspect } from 'util';
import NPMJSScrapper from '../../routes/npmjs-scrapper.mjs';
import NamesToURLScrapper from '../../routes/names-to-urls-scrapper.mjs';

export default async function getDownloadsPerPackage(packageNames) {
  // const packageNames = [
  //   'react',
  //   'eslint-plugin-react',
  // ];

  // If a package is present on more than one programming language, then
  // get the one with the most downloads
  // for example:
  //  react is in npmjs and pypi, but pypi's is an impersonification.

  const scrapperNPM = new NPMJSScrapper(packageNames);
  const allNpmjsPackageDownloads = await scrapperNPM.run();

  const URL_PREFIX = 'https://pypistats.org/packages/';
  const URL_POSTFIX = '';
  const scrapperPython = new NamesToURLScrapper(
        {
          names: packageNames,
          preUrl: URL_PREFIX,
          postUrl: URL_POSTFIX,
        },
        async ({ page, request, log, outputObject }) => {
          log.info('PythonScrapper visited ' + request.url);

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
            log.error('Python scrapper error: ' + error);
          }
        },
      );
  scrapperPython.create([500]);
  const allPythonPackageDownloads = await scrapperPython.run();

  const allScrapperResults = [
    allPythonPackageDownloads,
    allNpmjsPackageDownloads
  ];

  const packageDownloads = {};
  for (const scrapperResult of allScrapperResults) {
    const packageNames = Object.getOwnPropertyNames(scrapperResult);             
    for (const name of packageNames) {
      packageDownloads[name] =
            Math.max(packageDownloads[name] ?? 0, scrapperResult[name]);
    }
  }

  return packageDownloads;
}

getDownloadsPerPackage(['react', 'ant-design-vue']);
