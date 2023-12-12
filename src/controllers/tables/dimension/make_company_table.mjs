/**
 * @author Marcos Barrios
 * @since 30_10_2023
 * @description Make company table.
 * 
 */

'use strict';

import { readFile, writeFile } from 'fs/promises'

import makeToolsTableWithoutIdFromGithubExploreScrapper from '../../scrapper_usages/make_tools_from_github_explore.mjs';

import CompaniesmarketcapScrapper from "../../../routes/companiesmarketcap-scrapper.mjs";
import CompaniesmarketcapProfileScrapper from '../../../routes/companiesmarketcap-profile-scrapper.mjs';
import GoogleTrendsScrapper from '../../../routes/google-trends-scrapper.mjs';

import { inspect } from 'util';

export default async function makeCompanyTable() {
  const specializations = [
    'frontend',
    // 'backend',
    // 'embedded',
    // 'devops',
  ];
  const recordsGithub = (await makeToolsTableWithoutIdFromGithubExploreScrapper(specializations));
  let companyId = 1;
  recordsGithub.forEach(record => {
        record.company_id = companyId++
        record.name = record.author_company;
        delete record.author_company;
        delete record.type;
        delete record.specialization;
      });

  const scrapperEmployees = new CompaniesmarketcapScrapper();
  scrapperEmployees.setMaxAmountfPageSurfs(1);
  await scrapperEmployees.run();
  const amountsOfEmployeesPerCompany = scrapperEmployees.getOutputObject();
  recordsGithub.forEach(record => {
    if (amountsOfEmployeesPerCompany[record.name]) {
      record.employee_amount = amountsOfEmployeesPerCompany[record.name]; 
    } else {
      record.employee_amount = null;
    }
  });

  const companyNames = Object.getOwnPropertyNames(amountsOfEmployeesPerCompany);

  const scrapperOfProfiles = new CompaniesmarketcapProfileScrapper(companyNames);
  await scrapperOfProfiles.run();
  const typePerCompany = scrapperOfProfiles.getOutputObject();
  Object.getOwnPropertyNames(typePerCompany)
      .forEach(nameWithSpaces => {
        const NAME_WITHOUT_SPACES = nameWithSpaces.replace(/\s/g, '');
        typePerCompany[NAME_WITHOUT_SPACES] = typePerCompany[nameWithSpaces];
      });
  recordsGithub.forEach(record => {
    if (typePerCompany[record.name]) {
      record.type = typePerCompany[record.name]; 
    } else {
      record.type = null;
    }
  });

  companyNames.unshift('foo'); // first search always fails so add arbitrary
  const scrapperTrends = new GoogleTrendsScrapper(companyNames);
  let interestPerCompany;
  try {
    interestPerCompany = await scrapperTrends.run();
  } catch (error) {
    console.log('An error has taken place on the run() of the google trends' +
        'scrapper' + error.message);
    interestPerCompany = {};
  }

  // do not wait for this
  writeFile('./iterests' + JSON.stringify(interestPerCompany, null, 2));

  const nameKeys = Object.getOwnPropertyNames(interestPerCompany);
  for (const companyNameWithSpaces of nameKeys) {
    const COMPANY_NAME_WITHOUT_SPACES = companyNameWithSpaces.replace(/\s/g, '');
    if (recordsGithub[COMPANY_NAME_WITHOUT_SPACES]) {
      recordsGithub[COMPANY_NAME_WITHOUT_SPACES].amount_of_searches =
          interestPerCompany[companyNameWithSpaces];
    }
  }

  recordsGithub.forEach(record => {
    if (!record.amount_of_searches) {
      record.amount_of_searches = null;
    }

    // temporal solution to always getting 429 on Google trends
    // record.amount_of_searches = 0;
  });

  const FILE_CONTENT = await readFile('./src/persistent_ids.json', 'utf8');
  const persistentIds = JSON.parse(FILE_CONTENT);
  persistentIds.tool = recordsGithub.length;
  const TO_JSON = JSON.stringify(persistentIds, null, 2);
  await writeFile('./src/persistent_ids.json', TO_JSON);

  return recordsGithub;
}

// makeCompanyTable().then((data) => console.log('Make company output object: ' + inspect(data)));
