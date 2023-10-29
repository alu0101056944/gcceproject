/**
 * @author Marcos Barrios
 * @since 28_10_2023
 * @desc Test whether NPMJSScrapper works
 */

'use strict';

import { inspect } from 'util';
import NPMJSScrapper from '../routes/npmjs-scrapper.mjs';
import NamesToURLScrapper from '../routes/names-to-urls-scrapper.mjs';

export default function addDownloads() {
  const packageNames = [
    'react',
    'eslint-plugin-react',
  ];

  // If a package is present on more than one programming language, then
  // get the one with the most downloads
  // for example:
  //  react is in npmjs and pypi, but pypi's is an impersonification.

  // const scrapperNPM = new NPMJSScrapper(packageNames);
  // scrapperNPM.run().then(() => console.log(inspect(scrapperNPM.getOutputObject())));

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
  scrapperPython.run().then((output) => console.log(inspect(output)));
}

addDownloads();
