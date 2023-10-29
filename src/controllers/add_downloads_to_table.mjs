/**
 * @author Marcos Barrios
 * @since 28_10_2023
 * @desc Scrapping simple download pages like NPMJS and PYPISTATS.
 */

'use strict';

import { inspect } from 'util';
import NPMJSScrapper from '../routes/npmjs-scrapper.mjs';
import NamesToURLScrapper from '../routes/names-to-urls-scrapper.mjs';

export default async function addDownloads() {
  const packageNames = [
    'react',
    'eslint-plugin-react',
  ];

  // If a package is present on more than one programming language, then
  // get the one with the most downloads
  // for example:
  //  react is in npmjs and pypi, but pypi's is an impersonification.

  const scrapperNPM = new NPMJSScrapper(packageNames);
  const allNpmjsPackageDownloads = await scrapperNPM.run();

  const URL_PREFIX = 'https://pypistats.org/packages/';
  const URL_POSTFIX = '';
  const scrapperPython = new NamesToURLScrapper(
        packageNames,
        URL_PREFIX,
        URL_POSTFIX,
        async ({ page, request, log, outputObject }) => {
          log.info('PythonScrapper visited ' + request.url);
          const paragraphWithDownloads = page.getByText('Downloads last week:');
          const WHOLE_PARAGRAPH = await paragraphWithDownloads.textContent();
          const DOWNLOADS_LAST_WEEK_STRING =
              /Downloads\slast\sweek:\s(\d+,?\d+)+/.exec(WHOLE_PARAGRAPH)[1];
          const DOWNLOADS_LAST_WEEK =
              parseInt(DOWNLOADS_LAST_WEEK_STRING.replace(/,/g, ''));
          outputObject[request.label] = DOWNLOADS_LAST_WEEK;
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

  console.log(inspect(packageDownloads));
}

addDownloads();
