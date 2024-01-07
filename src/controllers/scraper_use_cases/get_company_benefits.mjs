/**
 * @author Marcos Barrios
 * @since 30_10_2023
 * @desc See if google shows a stock thing for each company.
 *
 * So that I can calculate benefits by how the stocks are
 * increasing or decreasing.
 *
 */

'use strict';

import NamesToURLScraper from '../../routes/scrapers/names-to-urls-scraper.mjs';

/**
 * 
 * @param {string} allCompanyName strings of company optionally including spaces.
 *    Ex: 'microsoft', 'bluehole studio'
 */
export default async function getStocks(allCompanyName) {
  const URL_PREFIX = 'https://www.google.com/search?q=';
  const URL_POSTFIX = '+stock';
  const spacesToPlus = (name) => name.replace(/\s/g, '+');
  const scraperStocks = new NamesToURLScraper(
    {
      names: allCompanyName,
      preUrl: URL_PREFIX,
      postUrl: URL_POSTFIX,
      doNameProcessing: true,
      processingFunction: spacesToPlus
    },
    async ({ page, request, log, outputObject }) => {
      log.info('Google search stocks scraper visited ' + request.url);

      await page.waitForLoadState();

      const deltaContainer = page.locator('span.IsqQVc.fw-price-up');

      let foundOneValidDelta = false;
      const allDeltaContainer = await deltaContainer.all();
      for (const locator of allDeltaContainer) {
        const WHOLE_TEXT = await locator.textContent();
        const WHOLE_TEXT_PROCESSED = WHOLE_TEXT.trim();

        const DELTA_REG_EXP = /[-+](\d+(,?\d+)*)\s/;      
        const execResult = DELTA_REG_EXP.exec(WHOLE_TEXT_PROCESSED);
        if (execResult && !foundOneValidDelta) {
          const DELTA = parseFloat(execResult[1].replace(/,/g, '.'));

          // Because there is name processing in place for the partial url
          const toUnprocessedName = (name) => name.replace(/\+/g, ' ');
          outputObject[toUnprocessedName(request.label)] = DELTA;
          foundOneValidDelta = true;
        }
      }

      if (!foundOneValidDelta) {
        const toUnprocessedName = (name) => name.replace(/\+/g, ' ');
        outputObject[toUnprocessedName(request.label)] = null;
      }
    },
  );
  scraperStocks.create();
  const companyNameToDelta = await scraperStocks.run();
  return companyNameToDelta;
}
