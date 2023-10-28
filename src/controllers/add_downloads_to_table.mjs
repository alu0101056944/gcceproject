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
        ({ page, request, log }) => {
          log.info('PythonScrapper visited ' + request.url);
        },
      );
  scrapperPython.run().then(() => console.log('Python scrapper finished'));
}

addDownloads();
