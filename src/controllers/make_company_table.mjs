/**
 * @author Marcos Barrios
 * @since 30_10_2023
 * @description Make company table.
 * 
 */

'use strict';

import { readFile, writeFile } from 'fs/promises'

import makeToolsFromGithubExplore from './scrapper_usages/add_tool_entries_to_table.mjs';

import CompaniesmarketcapScrapper from "../routes/companiesmarketcap-scrapper.mjs";
import CompaniesmarketcapProfileScrapper from '../routes/companiesmarketcap-profile-scrapper.mjs';

import { inspect } from 'util';
import GoogleTrendsScrapper from '../routes/google-trends-scrapper.mjs';

export default async function makeTable() {
  const recordsGithub = await makeToolsFromGithubExplore();
  let companyId = 1;
  recordsGithub.forEach(record => {
        record.company_id = companyId++
        record.name = record.author_company;
        delete record.author_company;
        delete record.type;
        delete record.specialization;
      });

  const scrapperEmployees = new CompaniesmarketcapScrapper();
  scrapperEmployees.setMaxAmountfPageSurfs(4);
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
  recordsGithub.forEach(record => {
    if (typePerCompany[record.name]) {
      record.type = typePerCompany[record.name]; 
    } else {
      record.type = null;
    }
  });

  const scrapperTrends = new GoogleTrendsScrapper(companyNames);
  const interestPerCompany = scrapperTrends.run();

  const nameKeys = Object.getOwnPropertyNames(interestPerCompany);
  for (const companyNameWithSpaces of nameKeys) {
    const COMPANY_NAME_WITHOUT_SPACES =
        companyNameWithSpaces.replace(/\s/g, '');
    recordsGithub[COMPANY_NAME_WITHOUT_SPACES].amount_of_searches =
        interestPerCompany[companyNameWithSpaces];
  }

  recordsGithub.forEach(record => {
    if (!record.amount_of_searches) {
      record.amount_of_searches = null;
    }
  });

  const FILE_CONTENT = await readFile('./src/persistent_ids.json', 'utf8');
  const persistentIds = JSON.parse(FILE_CONTENT);
  persistentIds.tool = recordsGithub.length;
  const TO_JSON = JSON.stringify(persistentIds, null, 2);
  await writeFile('./src/persistent_ids.json', TO_JSON);

  return recordsGithub;
}

makeTable().then((data) => console.log(inspect(data)));
