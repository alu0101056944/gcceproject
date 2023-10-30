/**
 * @author Marcos Barrios
 * @since 29_10_2023
 * @desc Testing github organization contributor amount scrapper.
 */

'use strict';

import { inspect } from 'util';
import NamesToURLScrapper from '../routes/names-to-urls-scrapper.mjs';
import { expect } from 'playwright/test'

export default async function addOrganizationMembers() {
  const allOrganizationNames = [
    'apify',
    'facebook',
  ];

  const URL_PREFIX = 'https://github.com/orgs/';
  const URL_POSTFIX = '/people';
  const scrapperOrganizations = new NamesToURLScrapper(
        {
          names: allOrganizationNames,
          preUrl: URL_PREFIX,
          postUrl: URL_POSTFIX,
        },
        async ({ page, request, log, outputObject }) => {
          const countMembers = async () => {
            const row = page.locator('div#org-members-table')
                .locator('li.member-list-item');
            const allRows = await row.all();
            outputObject[request.label] = allRows.length;
          }

          const buttonNextPage = page.locator('a.next_page');

          let keepIterating = true;
          while (keepIterating) {
            await countMembers();

            try {
              await expect(buttonNextPage).toBeEnabled({ timeout: 1000 });

              const NEXT_URL = await buttonNextPage.getAttribute('href');
              log.info('GithubOrganizationContributorsScrapper visited page: '
                  + NEXT_URL);

              await buttonNextPage.click({ timeout: 1000 });
              await page.waitForNavigation();
            } catch (error) {
              keepIterating = false;
              console.log('Cannot find click next button.');
            }
          }
        },
      );
  scrapperOrganizations.create();
  const output = await scrapperOrganizations.run();
  console.log(inspect(output));
}

addOrganizationMembers();
