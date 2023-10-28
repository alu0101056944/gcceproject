/**
 * @author Marcos Barrios
 * @since 27_10_2023
 * @desc Output the type of the given companies.
 */

'use strict';

import CompaniesmarketcapProfileScrapper from '../routes/companiesmarketcap-profile-scrapper.mjs';
import CompaniesmarketcapScrapper from '../routes/companiesmarketcap-scrapper.mjs';

import { inspect } from 'util';

export default async function addCompanies() {
  const scrapperOfCompanies = new CompaniesmarketcapScrapper();
  scrapperOfCompanies.setMaxAmountfPageSurfs(1);
  await scrapperOfCompanies.run();
  const companiesEmployeeAmount = scrapperOfCompanies.getOutputObject();

  const companyNames = Object.getOwnPropertyNames(companiesEmployeeAmount);
  const scrapperOfProfiles = new CompaniesmarketcapProfileScrapper(companyNames);
  await scrapperOfProfiles.run();
  const companiesType = scrapperOfProfiles.getOutputObject();

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

addCompanies();
