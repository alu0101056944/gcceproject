/**
 * @author Marcos Barrios
 * @since 30_10_2023
 * @description Make company table.
 * 
 */

'use strict';

import { readFile, writeFile } from 'fs/promises';

import CompaniesmarketcapScraper from "../../../routes/scrapers/companiesmarketcap-scraper.mjs";
import CompaniesmarketcapProfileScraper from '../../../routes/scrapers/companiesmarketcap-profile-scraper.mjs';

export default async function makeCompanyTable(toolTable) {
  const scraperOfAmountOfEmployees = new CompaniesmarketcapScraper();
  scraperOfAmountOfEmployees.setMaxAmountfPageSurfs(1);
  const authorCompanyToAmount = await scraperOfAmountOfEmployees.run();

  const allCompanyName = Object.getOwnPropertyNames(authorCompanyToAmount);

  const toSpacelessKeys = (object) => (
    Object.fromEntries(
      Object.entries(object)
      .map(([key, value]) => [key.replace(/\s/g, ''), value])
    )
  );

  const scraperOfProfiles = new CompaniesmarketcapProfileScraper(allCompanyName);
  const authorCompanyToType = toSpacelessKeys(await scraperOfProfiles.run());

  const allRecord = new Array(toolTable.length)
  for (let i = 0; i < toolTable.length; i++) {
    const AUTHOR_COMPANY = toolTable[i].author_company;
    const record = {
      company_id: i + 1,
      name: AUTHOR_COMPANY,
      employee_amount: authorCompanyToAmount[AUTHOR_COMPANY] ?? null,
      type: authorCompanyToType[AUTHOR_COMPANY] ?? null,
      amount_of_searches: null,
    }
    allRecord.push(record);
  }

  const FILE_CONTENT = await readFile('./src/persistent_ids.json', 'utf8');
  const persistentIds = JSON.parse(FILE_CONTENT);
  persistentIds.tool += allRecord.length;
  const TO_JSON = JSON.stringify(persistentIds, null, 2);
  await writeFile('./src/persistent_ids.json', TO_JSON);

  return allRecord;
}
