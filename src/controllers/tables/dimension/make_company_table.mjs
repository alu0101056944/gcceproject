/**
 * @author Marcos Barrios
 * @since 30_10_2023
 * @description Make company table.
 * 
 */

'use strict';

import { readFile, writeFile } from 'fs/promises'

import makeToolsTableWithoutIdFromGithubExploreScraper from '../../scraper_use_cases/make_tools_from_github_explore.mjs';

import CompaniesmarketcapScraper from "../../../routes/scrapers/companiesmarketcap-scraper.mjs";
import CompaniesmarketcapProfileScraper from '../../../routes/scrapers/companiesmarketcap-profile-scraper.mjs';
import GoogleTrendsScraper from '../../../routes/scrapers/google-trends-scraper.mjs';

export default async function makeCompanyTable() {
  const specializations = [
    'frontend',
    // 'backend',
    // 'embedded',
    // 'devops',
  ];
  const { allRecord } = (await makeToolsTableWithoutIdFromGithubExploreScraper(specializations));
  let companyId = 1;
  console.log('typeof allRecord: ' + typeof allRecord); // for debuging
  console.log('typeof : ' + typeof allRecord.forEach);
  allRecord.forEach(record => {
        record.company_id = companyId++
        record.name = record.author_company;
        delete record.author_company;
        delete record.type;
        delete record.specialization;
      });

  const scraperEmployees = new CompaniesmarketcapScraper();
  scraperEmployees.setMaxAmountfPageSurfs(1);
  await scraperEmployees.run();
  const amountsOfEmployeesPerCompany = scraperEmployees.getOutputObject();
  allRecord.forEach(record => {
    if (amountsOfEmployeesPerCompany[record.name]) {
      record.employee_amount = amountsOfEmployeesPerCompany[record.name]; 
    } else {
      record.employee_amount = null;
    }
  });

  const companyNames = Object.getOwnPropertyNames(amountsOfEmployeesPerCompany);

  const scraperOfProfiles = new CompaniesmarketcapProfileScraper(companyNames);
  await scraperOfProfiles.run();
  const typePerCompany = scraperOfProfiles.getOutputObject();
  Object.getOwnPropertyNames(typePerCompany)
      .forEach(nameWithSpaces => {
        const NAME_WITHOUT_SPACES = nameWithSpaces.replace(/\s/g, '');
        typePerCompany[NAME_WITHOUT_SPACES] = typePerCompany[nameWithSpaces];
      });
  allRecord.forEach(record => {
    if (typePerCompany[record.name]) {
      record.type = typePerCompany[record.name]; 
    } else {
      record.type = null;
    }
  });

  companyNames.unshift('foo'); // first search always fails so add arbitrary
  const scraperTrends = new GoogleTrendsScraper(companyNames);
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

  const FILE_CONTENT = await readFile('./src/persistent_ids.json', 'utf8');
  const persistentIds = JSON.parse(FILE_CONTENT);
  persistentIds.tool += allRecord.length;
  const TO_JSON = JSON.stringify(persistentIds, null, 2);
  await writeFile('./src/persistent_ids.json', TO_JSON);

  return allRecord;
}

// makeCompanyTable().then((data) => console.log('Make company output object: ' + inspect(data)));
