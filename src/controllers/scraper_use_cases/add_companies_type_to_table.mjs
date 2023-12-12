/**
 * @author Marcos Barrios
 * @since 27_10_2023
 * @desc Output the type of the given companies.
 */

'use strict';

import CompaniesmarketcapProfileScraper from '../../routes/scrapers/companiesmarketcap-profile-scraper.mjs';
import CompaniesmarketcapScraper from '../../routes/scrapers/companiesmarketcap-scraper.mjs';

import { inspect } from 'util';

export default async function addCompanies() {
  const scraperOfCompanies = new CompaniesmarketcapScraper();
  scraperOfCompanies.setMaxAmountfPageSurfs(1);
  await scraperOfCompanies.run();
  const companiesEmployeeAmount = scraperOfCompanies.getOutputObject();

  const companyNames = Object.getOwnPropertyNames(companiesEmployeeAmount);
  const scraperOfProfiles = new CompaniesmarketcapProfileScraper(companyNames);
  await scraperOfProfiles.run();
  const companiesType = scraperOfProfiles.getOutputObject();

  const companyRegisters = [];
  for (let i = 0; i < companyNames.length; i++) {
    companyRegisters.push({
      name: companyNames[i],
      employeeAmount: companiesEmployeeAmount[companyNames[i]],
      type: companiesType[companyNames[i]],
    });
  }
  console.log(inspect(companyRegisters));
}

// addCompanies();
