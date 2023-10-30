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

import { inspect } from 'util';
import NamesToURLScrapper from '../../routes/names-to-urls-scrapper.mjs';

export default async function getStocks() {
  const allCompanyNames = [
    'microsoft',
    'facebook',
    'random stuff'
  ];

  const URL_PREFIX = 'https://www.google.com/search?q=';
  const URL_POSTFIX = '+stock';
  const spacesToPlus = (name) => name.replace(/\s/g, '+');
  const scrapperStocks = new NamesToURLScrapper(
        {
          names: allCompanyNames,
          preUrl: URL_PREFIX,
          postUrl: URL_POSTFIX,
          doNameProcessing: true,
          processingFunction: spacesToPlus
        },
        async ({ page, request, log, outputObject }) => {
          log.info('Google search stocks scrapper visited ' + request.url);

          const deltaContainer = page.locator('.WlRRw.IsqQVc.fw-price-up');

          // I use all() so that it just executes if at least one is found
          const allDeltaContainer = await deltaContainer.all();
          if (allDeltaContainer.length > 0) {
            // await page.waitForNavigation();
            // const fiveDaysFilterButton =
            //     page.locator('div.QiGJYb.luQogd.fw-ch-sel');
            // await fiveDaysFilterButton.click({
            //   timeout: 2000,
            //   force: true,
            // });

            const ALL_TEXT = await deltaContainer.textContent();
            const ALL_TEXT_PROCESSED = ALL_TEXT.trim();
            const DELTA_REG_EXP = /[+-](\d+(,?\d+)*)\s/;
            const execResult = DELTA_REG_EXP.exec(ALL_TEXT_PROCESSED);
            const DELTA = parseInt(execResult[1]);

            const unprocessName = (name) => name.replace(/\+/g, ' ');
            outputObject[unprocessName(request.label)] = DELTA;
          }
        },
      );
  scrapperStocks.create();
  const output = await scrapperStocks.run();
  console.log(inspect(output));
}

// getStocks();
