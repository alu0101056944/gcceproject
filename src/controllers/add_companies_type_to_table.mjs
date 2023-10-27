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
  const companiesEmployeeAmount = await scrapperOfCompanies.run();
  const companyNames = Object.getOwnPropertyNames(companiesEmployeeAmount);
  const scrapper = new CompaniesmarketcapProfileScrapper(companyNames);
  const companiesType = await scrapper.run();
  const companyRegisters = [];
  for (let i = 0; i < companyNames.length; i++) {
    companyRegisters.push({
      name: companyNames[i],
      employeeAmount: companiesEmployeeAmount[i],
      type: companiesType[i],
    });
  }
  console.log(inspect(companyRegisters));
}

addCompanies();
