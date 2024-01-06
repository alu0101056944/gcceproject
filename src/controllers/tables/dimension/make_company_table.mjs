/**
 * @author Marcos Barrios
 * @since 30_10_2023
 * @description Make company table.
 * 
 */

'use strict';

import CompaniesmarketcapScraper from "../../../routes/scrapers/companiesmarketcap-scraper.mjs";
import CompaniesmarketcapProfileScraper from '../../../routes/scrapers/companiesmarketcap-profile-scraper.mjs';

export default async function makeCompanyTable(toolTable, latestId) {
  console.log('Calculating companyTable');

  const allRecord = [];

  try {
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

    for (let i = 0; i < toolTable.length; i++) {
      ++latestId;
      const AUTHOR_COMPANY = toolTable[i].author_company;
      const record = {
        company_id: latestId,
        name: AUTHOR_COMPANY,
        employee_amount: authorCompanyToAmount[AUTHOR_COMPANY] ?? null,
        type: authorCompanyToType[AUTHOR_COMPANY] ?? null,
        amount_of_searches: null,
      }
      allRecord.push(record);
    }
  } catch (error) {
    console.error('There was an error while calculating companyTable' + error);
  }

  return allRecord;
}
