/**
 * @author Marcos Barrios
 * @since 30_10_2023
 * @description Make company table.
 * 
 */

'use strict';

import { readFile, writeFile } from 'fs/promises'

import makeToolsTableWithoutId from '../../scraper_use_cases/make_tools_from_github_explore.mjs';

import CompaniesmarketcapScraper from "../../../routes/scrapers/companiesmarketcap-scraper.mjs";
import CompaniesmarketcapProfileScraper from '../../../routes/scrapers/companiesmarketcap-profile-scraper.mjs';
import GoogleTrendsScraper from '../../../routes/scrapers/google-trends-scraper.mjs';

export default async function makeCompanyTable(toolTable) {
  const scraperOfAmountOfEmployees = new CompaniesmarketcapScraper();
  scraperOfAmountOfEmployees.setMaxAmountfPageSurfs(1);
  const authorCompanyToEmployeeAmount = await scraperOfAmountOfEmployees.run();

  const allCompanyName = Object.getOwnPropertyNames(authorCompanyToEmployeeAmount);

  /** WIP */

  const scraperOfProfiles = new CompaniesmarketcapProfileScraper(allCompanyName);
  const authorCompanyToType = await scraperOfProfiles.run();
  Object.getOwnPropertyNames(authorCompanyToType)
      .forEach(nameWithSpaces => {
        const NAME_WITHOUT_SPACES = nameWithSpaces.replace(/\s/g, '');
        authorCompanyToType[NAME_WITHOUT_SPACES] = authorCompanyToType[nameWithSpaces];
      });
  allRecord.forEach(record => {
    if (authorCompanyToType[record.name]) {
      record.type = authorCompanyToType[record.name]; 
    } else {
      record.type = null;
    }
  });

  allCompanyName.unshift('foo'); // first search always fails so add arbitrary
  const scraperTrends = new GoogleTrendsScraper(allCompanyName);
  let interestPerCompany;
  try {
    interestPerCompany = await scraperTrends.run();
  } catch (error) {
    console.log('An error has taken place on the run() of the google trends' +
        'scraper' + error.message);
    interestPerCompany = {};
  }

  // // do not wait for this
  // writeFile('./iterests' + JSON.stringify(interestPerCompany, null, 2));

  const nameKeys = Object.getOwnPropertyNames(interestPerCompany);
  for (const companyNameWithSpaces of nameKeys) {
    const COMPANY_NAME_WITHOUT_SPACES = companyNameWithSpaces.replace(/\s/g, '');
    if (allRecord[COMPANY_NAME_WITHOUT_SPACES]) {
      allRecord[COMPANY_NAME_WITHOUT_SPACES].amount_of_searches =
          interestPerCompany[companyNameWithSpaces];
    }
  }

  allRecord.forEach(record => {
    if (!record.amount_of_searches) {
      record.amount_of_searches = null;
    }

    // temporal solution to always getting 429 on Google trends
    // record.amount_of_searches = 0;
  });

  const allRecord = new Array(toolTable.length)
  for (const [index, toolRecord] of toolTable.entries()) {
    const record = {
      company_id: index + 1,
      name: toolTable[index].author_company,
      employee_amount: authorCompanyToEmployeeAmount[record.name] ?? null,
    }
  }

  const FILE_CONTENT = await readFile('./src/persistent_ids.json', 'utf8');
  const persistentIds = JSON.parse(FILE_CONTENT);
  persistentIds.tool += allRecord.length;
  const TO_JSON = JSON.stringify(persistentIds, null, 2);
  await writeFile('./src/persistent_ids.json', TO_JSON);

  return allRecord;
}

// makeCompanyTable().then((data) => console.log('Make company output object: ' + inspect(data)));
